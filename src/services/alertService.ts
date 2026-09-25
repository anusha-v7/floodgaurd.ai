import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { FloodAlert, AlertSeverity } from '../types';
import { INITIAL_ALERTS } from '../data/floodGuardData';

const ALERTS_COLLECTION = 'alerts';
const ALERTS_STORAGE_KEY = 'floodguard_alerts_db';

type AlertListener = (alerts: FloodAlert[]) => void;
const memoryListeners = new Set<AlertListener>();

let memoryAlerts: FloodAlert[] = [...INITIAL_ALERTS];
let isFirestoreInitialized = false;

// Seed initial default demo alerts into Firestore if collection is empty
async function seedInitialAlertsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, ALERTS_COLLECTION));
    if (snap.empty) {
      console.log('Seeding initial alerts to Firestore...');
      for (const alert of INITIAL_ALERTS) {
        await setDoc(doc(db, ALERTS_COLLECTION, alert.id), alert);
      }
    }
  } catch (err) {
    console.warn('Firestore seeding notice:', err instanceof Error ? err.message : String(err));
  }
}

// Attach real-time Firestore listener
function initFirestoreListener() {
  if (isFirestoreInitialized) return;
  isFirestoreInitialized = true;

  seedInitialAlertsIfEmpty();

  try {
    const alertsQuery = query(collection(db, ALERTS_COLLECTION));
    onSnapshot(
      alertsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: FloodAlert[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as FloodAlert);
          });
          // Sort active first, then newest
          loaded.sort((a, b) => (a.status === 'active' ? -1 : 1));
          memoryAlerts = loaded;
          try {
            localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(memoryAlerts));
          } catch (e) {}
          notifyListeners();
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot listener error (using memory cache):', error.message);
        try {
          handleFirestoreError(error, OperationType.GET, ALERTS_COLLECTION);
        } catch (e) {
          // Fallback gracefully without breaking UI
        }
      }
    );
  } catch (e) {
    console.warn('Could not attach Firestore onSnapshot listener:', e);
  }
}

// Start listener
initFirestoreListener();

const notifyListeners = () => {
  memoryListeners.forEach((listener) => {
    try {
      listener([...memoryAlerts]);
    } catch (e) {
      console.error('Error in alert listener callback', e);
    }
  });
};

export const alertService = {
  getAlerts: (): FloodAlert[] => {
    return [...memoryAlerts];
  },

  getActiveAlerts: (): FloodAlert[] => {
    return memoryAlerts.filter((a) => a.status === 'active');
  },

  createAlert: async (data: {
    area: string;
    areaId?: string;
    severity: AlertSeverity;
    message: string;
    expectedTime: string;
    issuedBy?: string;
    floodProbability?: number;
    warningLeadTime?: string;
  }): Promise<FloodAlert> => {
    const alertId = `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newAlert: FloodAlert = {
      id: alertId,
      area: data.area,
      areaId: data.areaId || data.area.toLowerCase().replace(/\s+/g, '-'),
      severity: data.severity,
      message: data.message,
      expectedTime: data.expectedTime,
      createdAt: 'Just now',
      status: 'active',
      issuedBy: data.issuedBy || 'Emergency Command Center (Authority)',
      floodProbability: data.floodProbability || 85,
      warningLeadTime: data.warningLeadTime || '2–3 hours',
      source: 'Authority Command',
    };

    // Update local memory immediately for instant UI feedback
    memoryAlerts = [newAlert, ...memoryAlerts];
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(memoryAlerts));
    } catch (e) {}
    notifyListeners();

    // Persist to Cloud Firestore
    try {
      await setDoc(doc(db, ALERTS_COLLECTION, alertId), newAlert);
      console.log('Alert written to Firestore:', alertId);
    } catch (error) {
      console.error('Failed writing alert to Firestore:', error);
      try {
        handleFirestoreError(error, OperationType.WRITE, `${ALERTS_COLLECTION}/${alertId}`);
      } catch (e) {
        // Continue with local storage copy so operation doesn't crash
      }
    }

    return newAlert;
  },

  resolveAlert: async (id: string): Promise<boolean> => {
    memoryAlerts = memoryAlerts.map((a) =>
      a.id === id ? { ...a, status: 'resolved' as const } : a
    );
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(memoryAlerts));
    } catch (e) {}
    notifyListeners();

    try {
      await updateDoc(doc(db, ALERTS_COLLECTION, id), { status: 'resolved' });
    } catch (error) {
      console.warn('Firestore updateDoc warning:', error);
      try {
        handleFirestoreError(error, OperationType.UPDATE, `${ALERTS_COLLECTION}/${id}`);
      } catch (e) {}
    }
    return true;
  },

  resetDemoAlerts: async () => {
    memoryAlerts = [...INITIAL_ALERTS];
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
    notifyListeners();

    try {
      for (const alert of INITIAL_ALERTS) {
        await setDoc(doc(db, ALERTS_COLLECTION, alert.id), alert);
      }
    } catch (e) {
      console.warn('Could not reset Firestore alerts:', e);
    }
  },

  subscribe: (callback: AlertListener): (() => void) => {
    memoryListeners.add(callback);
    callback([...memoryAlerts]);
    return () => {
      memoryListeners.delete(callback);
    };
  },
};

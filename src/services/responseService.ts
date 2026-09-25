import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { EmergencyActionItem } from '../types';
import { INITIAL_ACTION_ITEMS } from '../data/floodGuardData';

const ACTIONS_COLLECTION = 'emergency_actions';
const ACTIONS_STORAGE_KEY = 'floodguard_response_actions';

let actionsState: EmergencyActionItem[] = [...INITIAL_ACTION_ITEMS];
type ActionChangeListener = (actions: EmergencyActionItem[]) => void;
const listeners = new Set<ActionChangeListener>();
let isFirestoreInitialized = false;

async function seedActionsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, ACTIONS_COLLECTION));
    if (snap.empty) {
      for (const act of INITIAL_ACTION_ITEMS) {
        await setDoc(doc(db, ACTIONS_COLLECTION, act.id), act);
      }
    }
  } catch (err) {
    console.warn('Firestore actions seed notice:', err instanceof Error ? err.message : String(err));
  }
}

function initFirestoreListener() {
  if (isFirestoreInitialized) return;
  isFirestoreInitialized = true;

  seedActionsIfEmpty();

  try {
    onSnapshot(
      collection(db, ACTIONS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: EmergencyActionItem[] = [];
          snapshot.forEach((d) => {
            loaded.push(d.data() as EmergencyActionItem);
          });
          actionsState = loaded;
          try {
            localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actionsState));
          } catch (e) {}
          notify();
        }
      },
      (error) => {
        console.warn('Firestore actions listener notice:', error.message);
        try {
          handleFirestoreError(error, OperationType.GET, ACTIONS_COLLECTION);
        } catch (e) {}
      }
    );
  } catch (e) {}
}

initFirestoreListener();

const notify = () => {
  listeners.forEach((l) => l([...actionsState]));
};

export const responseService = {
  getActions: () => [...actionsState],

  toggleAction: async (id: string) => {
    let targetAct: EmergencyActionItem | undefined;
    actionsState = actionsState.map((act) => {
      if (act.id === id) {
        targetAct = { ...act, completed: !act.completed };
        return targetAct;
      }
      return act;
    });
    try {
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actionsState));
    } catch (e) {}
    notify();

    if (targetAct) {
      try {
        await updateDoc(doc(db, ACTIONS_COLLECTION, id), { completed: targetAct.completed });
      } catch (err) {
        console.warn('Firestore updateDoc action error:', err);
      }
    }
  },

  markAllResponseStarted: async (zoneId?: string) => {
    actionsState = actionsState.map((act) => {
      if (!zoneId || act.zoneId === zoneId) {
        return { ...act, completed: true };
      }
      return act;
    });
    try {
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actionsState));
    } catch (e) {}
    notify();

    for (const act of actionsState) {
      if (!zoneId || act.zoneId === zoneId) {
        try {
          await setDoc(doc(db, ACTIONS_COLLECTION, act.id), act);
        } catch (e) {}
      }
    }
  },

  resetActions: async () => {
    actionsState = [...INITIAL_ACTION_ITEMS];
    localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_ACTION_ITEMS));
    notify();

    for (const act of INITIAL_ACTION_ITEMS) {
      try {
        await setDoc(doc(db, ACTIONS_COLLECTION, act.id), act);
      } catch (e) {}
    }
  },

  subscribe: (listener: ActionChangeListener) => {
    listeners.add(listener);
    listener([...actionsState]);
    return () => {
      listeners.delete(listener);
    };
  },
};

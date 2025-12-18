'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let firebaseApp;
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  // Auth is no longer used, but we keep the structure to avoid breaking imports.
  // We can return null for auth.
  let auth: Auth | null = null;
  try {
    // This might fail if auth is not configured in the project, which is fine now.
    auth = getAuth(firebaseApp);
  } catch (e) {
    console.warn("Firebase Auth could not be initialized. This is expected if it's not enabled in your project.");
  }
  
  return getSdks(firebaseApp, auth);
}

export function getSdks(firebaseApp: FirebaseApp, auth: Auth | null) {
  return {
    firebaseApp,
    auth, // This can be null
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';

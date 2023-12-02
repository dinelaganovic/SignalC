
import { initializeApp} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { getStorage,ref, uploadString } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDWDbECO_OVVjqtcXMqcyGzip0h1lP5zWo",
  authDomain: "signalclone23.firebaseapp.com",
  projectId: "signalclone23",
  storageBucket: "signalclone23.appspot.com",
  messagingSenderId: "924754990500",
  appId: "1:924754990500:web:70c27d7d587651d6a55d31"
};

export const fb_app = initializeApp(firebaseConfig) 
export const fb_auth=getAuth(fb_app);
export const fb_db=getFirestore(fb_app);
export const fb_storage = getStorage(fb_app);
export {  ref, uploadString };
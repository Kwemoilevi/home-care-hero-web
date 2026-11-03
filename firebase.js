import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Key-Here",
  authDomain: "globalcare-xxxxx.firebaseapp.com",
  projectId: "globalcare-xxxxx",
  storageBucket: "globalcare-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function trackView(page, pharmacyId){
  await addDoc(collection(db, "ad_views"), { page, pharmacyId, value: 100, timestamp: serverTimestamp() });
}
export async function trackClick(type, pharmacyId, product){
  await addDoc(collection(db, "ad_clicks"), { type, pharmacyId, product, value: 500, timestamp: serverTimestamp() });
}
export async function getRevenue(){
  const v = await getDocs(collection(db, "ad_views"));
  const c = await getDocs(collection(db, "ad_clicks"));
  return { views: v.size, clicks: c.size, total: (v.size*100)+(c.size*500) };
}

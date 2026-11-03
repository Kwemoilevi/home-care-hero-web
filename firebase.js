import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PUT YOUR REAL apiKey HERE",
  authDomain: "PUT YOUR REAL authDomain HERE",
  projectId: "PUT YOUR REAL projectId HERE",
  storageBucket: "PUT YOUR REAL storageBucket HERE",
  messagingSenderId: "PUT YOUR REAL messagingSenderId HERE",
  appId: "PUT YOUR REAL appId HERE"
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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REPLACE",
  authDomain: "home-care-hero.firebaseapp.com",
  projectId: "home-care-hero",
  storageBucket: "home-care-hero.appspot.com",
  messagingSenderId: "REPLACE",
  appId: "REPLACE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function trackView(page, pharmacyId="global-pharma"){
  await addDoc(collection(db, "ad_views"), { page, pharmacyId, value: 100, timestamp: serverTimestamp(), country: "UG" });
}
export async function trackClick(type, pharmacyId="global-pharma", product="general"){
  await addDoc(collection(db, "ad_clicks"), { type, pharmacyId, product, value: 500, timestamp: serverTimestamp(), country: "UG" });
}
export async function getRevenue(){
  const v = await getDocs(collection(db, "ad_views"));
  const c = await getDocs(collection(db, "ad_clicks"));
  return { views: v.size, clicks: c.size, total: (v.size*100)+(c.size*500), allViews: v, allClicks: c };
}

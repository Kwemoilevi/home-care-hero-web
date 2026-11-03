// firebase.js - REAL DATABASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE YOUR API KEY",
  authDomain: "PASTE",
  projectId: "PASTE",
  storageBucket: "PASTE",
  messagingSenderId: "PASTE",
  appId: "PASTE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// REAL TRACKING FUNCTIONS
export async function trackView(page, pharmacyId = null){
  await addDoc(collection(db, "ad_views"), {
    page: page,
    pharmacyId: pharmacyId,
    ip: "client", // you can add real IP via cloud function later
    timestamp: serverTimestamp(),
    value: 100 // UGX 100 per view
  });
}

export async function trackClick(type, pharmacyId, productName){
  await addDoc(collection(db, "ad_clicks"), {
    type: type, // 'banner' or 'product'
    pharmacyId: pharmacyId,
    productName: productName,
    timestamp: serverTimestamp(),
    value: 500 // UGX 500 per click
  });
}

export async function getRevenue(){
  const viewsSnap = await getDocs(collection(db, "ad_views"));
  const clicksSnap = await getDocs(collection(db, "ad_clicks"));
  let totalViews = viewsSnap.size;
  let totalClicks = clicksSnap.size;
  let totalRevenue = (totalViews * 100) + (totalClicks * 500);
  return {totalViews, totalClicks, totalRevenue, viewsSnap, clicksSnap};
}

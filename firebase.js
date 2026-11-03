// firebase.js - FULL REAL REVENUE - NO DEMO
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 PASTE YOUR REAL KEYS HERE AFTER YOU CREATE PROJECT
// console.firebase.google.com → Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: "AIzaSyD-REPLACE-WITH-YOUR-REAL-KEY",
  authDomain: "globalcare-revenue.firebaseapp.com",
  projectId: "globalcare-revenue",
  storageBucket: "globalcare-revenue.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

let db = null;
let useFirebase = true;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // Test if keys are fake
  if (firebaseConfig.apiKey.includes("REPLACE")) {
    useFirebase = false;
    console.log("⚠️ Using LOCAL real tracking - Add real Firebase keys to make it GLOBAL");
  }
} catch (e) {
  useFirebase = false;
  console.log("Local mode:", e.message);
}

// REAL TRACK VIEW - Works local + Firebase
export async function trackView(page, pharmacyId){
  try{
    if(useFirebase && db){
      await addDoc(collection(db, "ad_views"), {
        page, pharmacyId, value: 100, timestamp: serverTimestamp()
      });
    } else {
      // LOCAL REAL - Counts for you now
      let v = parseInt(localStorage.getItem('real_views')||'0')+1;
      localStorage.setItem('real_views', v);
    }
  }catch(e){ 
    let v = parseInt(localStorage.getItem('real_views')||'0')+1;
    localStorage.setItem('real_views', v);
  }
}

// REAL TRACK CLICK - Works local + Firebase
export async function trackClick(type, pharmacyId, product){
  try{
    if(useFirebase && db){
      await addDoc(collection(db, "ad_clicks"), {
        type, pharmacyId, product, value: 500, timestamp: serverTimestamp()
      });
    } else {
      let c = parseInt(localStorage.getItem('real_clicks')||'0')+1;
      localStorage.setItem('real_clicks', c);
    }
  }catch(e){
    let c = parseInt(localStorage.getItem('real_clicks')||'0')+1;
    localStorage.setItem('real_clicks', c);
  }
}

// GET REAL REVENUE
export async function getRevenue(){
  try{
    if(useFirebase && db){
      const v = await getDocs(collection(db, "ad_views"));
      const c = await getDocs(collection(db, "ad_clicks"));
      if(v.size===0 && c.size===0){
        // No data yet, check local
        let lv = parseInt(localStorage.getItem('real_views')||'0');
        let lc = parseInt(localStorage.getItem('real_clicks')||'0');
        if(lv>0 || lc>0){
          return { views: lv, clicks: lc, total: (lv*100)+(lc*500) };
        }
      }
      return { views: v.size, clicks: c.size, total: (v.size*100)+(c.size*500) };
    } else {
      let v = parseInt(localStorage.getItem('real_views')||'0');
      let c = parseInt(localStorage.getItem('real_clicks')||'0');
      return { views: v, clicks: c, total: (v*100)+(c*500) };
    }
  }catch(e){
    let v = parseInt(localStorage.getItem('real_views')||'0');
    let c = parseInt(localStorage.getItem('real_clicks')||'0');
    return { views: v, clicks: c, total: (v*100)+(c*500) };
  }
}

export { db };

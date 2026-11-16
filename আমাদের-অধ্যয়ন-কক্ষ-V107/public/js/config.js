/* ===== Firebase কনফিগারেশন ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDWH0huSIIWqYyProg30jatgd7fCXIDdl8",
  authDomain: "my-study-room-0710.firebaseapp.com",
  databaseURL: "https://my-study-room-0710-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-study-room-0710",
  storageBucket: "my-study-room-0710.firebasestorage.app",
  messagingSenderId: "501590476232",
  appId: "1:501590476232:web:3b8349e223b5ac13552cfd",
  measurementId: "G-NE17F08VCP"
};

// গ্লোবাল ভ্যারিয়েবল যেন পুরনো ও নতুন সব কোড পায়
var FB_CONFIG = firebaseConfig;

// ফায়ারবেস ইনিশিয়ালাইজ
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ডাটাবেস ও অথ রেফারেন্স
const db = firebase.database();
window.db = db;

// ফায়ারবেস অথ সেশন নিশ্চিতকরণ (যাতে সিকিউরিটি রুলসে PERMISSION_DENIED না হয়)
if (firebase.auth) {
  try {
    const auth = firebase.auth();
    window.auth = auth;
    auth.onAuthStateChanged(function(user) {
      if (!user) {
        var token = localStorage.getItem("firebase_auth_token") || localStorage.getItem("admin_auth_token");
        if (token) {
          auth.signInWithCustomToken(token).catch(function() {
            auth.signInAnonymously().catch(function(){});
          });
        } else {
          auth.signInAnonymously().catch(function(){});
        }
      }
    });
  } catch (authErr) {
    console.warn("Auth initialization notice:", authErr);
  }
}

// প্রমিজ ভিত্তিক অথ নিশ্চয়তা ফাংশন (সেভ/রাইটের পূর্বে PERMISSION_DENIED প্রতিরোধে)
window.ensureAuth = function() {
  return new Promise(function(resolve) {
    if (!window.firebase || !firebase.auth) { resolve(null); return; }
    try {
      var auth = firebase.auth();
      if (auth.currentUser) {
        resolve(auth.currentUser);
        return;
      }
      var token = localStorage.getItem("firebase_auth_token") || localStorage.getItem("admin_auth_token");
      if (token) {
        auth.signInWithCustomToken(token).then(function(res){
          resolve(res.user);
        }).catch(function(){
          auth.signInAnonymously().then(function(res){
            resolve(res.user);
          }).catch(function(){ resolve(null); });
        });
      } else {
        auth.signInAnonymously().then(function(res){
          resolve(res.user);
        }).catch(function(){ resolve(null); });
      }
    } catch(e) {
      resolve(null);
    }
  });
};
/* ================================= */
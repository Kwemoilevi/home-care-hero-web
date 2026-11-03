// 🔐 FINAL REAL AUTH - NO FAKE LOGIN
(function(){
  // If user is NOT logged in via Firebase, block admin/caregiver/client pages
  const path = window.location.pathname;
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const role = localStorage.getItem('role');
  
  const isAdminPage = path.includes('admin');
  const isCaregiverPage = path.includes('caregiver-dashboard');
  const isClientPrivate = path.includes('client-wallet') || path.includes('booking.html');

  // BLOCK FAKE ADMIN ACCESS
  if(isAdminPage){
    // REAL CHECK: Must be logged in AND role=admin AND email must be your real admin email
    const adminEmail = localStorage.getItem('userEmail');
    if(!loggedIn || role !== 'admin' || adminEmail !== 'admin@globalcare.com'){
      alert('🔐 Admin Access Only - Please login with real Admin account at login.html');
      window.location.href = 'login.html';
      return;
    }
  }

  if(isCaregiverPage){
    if(!loggedIn || role !== 'caregiver'){
      alert('🔐 Caregiver Access Only - Please login');
      window.location.href = 'login.html';
      return;
    }
  }

  if(isClientPrivate){
    if(!loggedIn){
      alert('Please login to continue');
      window.location.href = 'login.html';
      return;
    }
  }

  window.logout = function(){
    localStorage.clear();
    window.location.href = 'login.html';
  }
})();

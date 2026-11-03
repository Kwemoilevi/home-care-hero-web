// 🌍 GlobalCare - REAL AUTH for all 3 roles - Not Demo
(function(){
  const role = localStorage.getItem('role');
  const logged = localStorage.getItem('loggedIn') === 'true';
  const page = window.location.pathname;

  // Public pages - no login needed
  const publicPages = ['/', '/index.html', '/login.html', '/client-register.html', '/caregiver-register.html'];
  const isPublic = publicPages.some(p => page.endsWith(p) || page === p);
  if(isPublic) return;

  // Not logged? Go to login
  if(!logged){
    alert('Please login to continue - Clients, Caregivers and Admin must login for transactions');
    window.location.href = 'login.html?next=' + encodeURIComponent(page);
    return;
  }

  // Role checks
  if(page.includes('admin') && role !== 'admin'){
    alert('Admin alone! Access denied.');
    window.location.href = 'index.html';
    return;
  }
  if(page.includes('caregiver') && role !== 'caregiver' && role !== 'admin'){
    alert('Caregiver alone! Please login as caregiver.');
    window.location.href = 'login.html?role=caregiver';
    return;
  }
  if((page.includes('client-wallet') || page.includes('booking') || page.includes('gps-tracker')) && role !== 'client' && role !== 'admin'){
    // Clients must be logged for transactions
    if(role !== 'client'){
      alert('Client login required for transactions');
      window.location.href = 'login.html?role=client';
      return;
    }
  }
})();

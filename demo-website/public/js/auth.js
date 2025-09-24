(function () {
  const initNav = () => {
    const loginLink = document.getElementById('nav-login');
    const userMenu = document.getElementById('nav-user-menu');
    const usernameLabel = document.getElementById('nav-username');
    const logoutBtn = document.getElementById('nav-logout');
    const profileLink = document.getElementById('nav-profile');

    if (!loginLink || !userMenu || !usernameLabel || !logoutBtn || !profileLink) {
      return;
    }

    const token = window.localStorage.getItem('token');

    if (!token) {
      loginLink.classList.remove('hidden');
      loginLink.style.display = 'inline-flex';
      userMenu.classList.add('hidden');
      userMenu.classList.remove('flex');
      userMenu.style.display = 'none';
      profileLink.href = '/profile';
      return;
    }

    const parseToken = (jwtToken) => {
      try {
        const payloadPart = jwtToken.split('.')[1];
        if (!payloadPart) return null;
        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4 || 4)) % 4, '=');
        const decoded = atob(padded);
        return JSON.parse(decoded);
      } catch (err) {
        console.warn('Invalid token payload:', err);
        return null;
      }
    };

    const payload = parseToken(token);
    if (!payload || !payload.name) {
      window.localStorage.removeItem('token');
      loginLink.classList.remove('hidden');
      loginLink.style.display = 'inline-flex';
      userMenu.classList.add('hidden');
      userMenu.classList.remove('flex');
      userMenu.style.display = 'none';
      profileLink.href = '/profile';
      return;
    }

    usernameLabel.textContent = payload.name;
    loginLink.classList.add('hidden');
    loginLink.style.display = 'none';
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    userMenu.style.display = 'flex';

    if (payload.userId) {
      profileLink.href = `/profile/${payload.userId}`;
    }

    logoutBtn.addEventListener('click', () => {
      window.localStorage.removeItem('token');
      window.location.href = '/login';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

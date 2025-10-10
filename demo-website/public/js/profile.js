document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('profile-loading');
  const content = document.getElementById('profile-content');
  const nameEl = document.getElementById('profile-name');
  const phoneEl = document.getElementById('profile-phone');
  const roleEl = document.getElementById('profile-role');

  const token = window.localStorage.getItem('token');
  if (!token) {
    if (loading) loading.textContent = 'กรุณาเข้าสู่ระบบ';
    setTimeout(() => window.location.href = '/login', 1000);
    return;
  }

  try {
    const res = await fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ');

    const user = data.user || {};
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    if (nameEl) nameEl.textContent = user.name || '-';
    if (phoneEl) phoneEl.textContent = user.phone || '-';
    if (roleEl) roleEl.textContent = user.role || '-';

    window.localStorage.setItem('user', JSON.stringify(user));
  } catch (err) {
    if (loading) loading.textContent = err.message;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart');
  if (!buttons.length) return;

  const getToken = () => window.localStorage.getItem('token');

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const token = getToken();
      if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');
        window.location.href = '/login';
        return;
      }

      const menuId = btn.getAttribute('data-menu-id');
      if (!menuId) return;

      btn.disabled = true;
      btn.classList.add('opacity-70');

      try {
        const res = await fetch('/api/cart/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ menuId, qty: 1 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'เพิ่มลงตะกร้าไม่สำเร็จ');

        alert('เพิ่มลงตะกร้าเรียบร้อย!');
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-70');
      }
    });
  });
});

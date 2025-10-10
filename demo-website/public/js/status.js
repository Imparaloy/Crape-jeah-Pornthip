document.addEventListener('DOMContentLoaded', async () => {
  const alertBox = document.getElementById('status-alert');
  const loading = document.getElementById('cart-loading');
  const table = document.getElementById('cart-table');
  const rows = document.getElementById('cart-rows');
  const emptyState = document.getElementById('cart-empty');

  const showAlert = (message, type = 'info') => {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
    if (type === 'error') {
      alertBox.classList.add('bg-red-100', 'text-red-900');
      alertBox.classList.remove('bg-yellow-100', 'text-yellow-900');
    } else {
      alertBox.classList.add('bg-yellow-100', 'text-yellow-900');
      alertBox.classList.remove('bg-red-100', 'text-red-900');
    }
  };

  const token = window.localStorage.getItem('token');
  if (!token) {
    showAlert('กรุณาเข้าสู่ระบบเพื่อดูสถานะคำสั่งซื้อ', 'error');
    loading.textContent = '';
    setTimeout(() => window.location.href = '/login', 1200);
    return;
  }

  try {
    const res = await fetch('/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'ไม่สามารถโหลดตะกร้าได้');

    const cart = data;
    const items = Array.isArray(cart.items) ? cart.items : [];

    loading.classList.add('hidden');

    if (!items.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    table.classList.remove('hidden');
    rows.innerHTML = '';

    items.forEach((item) => {
      const menu = item.menuId || {};
      const custom = item.custom || {};
      const optionTexts = Array.isArray(custom.options)
        ? custom.options.map(op => `${op.group}: ${op.name}${op.price ? ` (+${op.price}฿)` : ''}`)
        : [];
      const detailText = optionTexts.length ? optionTexts.join(', ') : (item.note || '-');
      const displayName = menu.name || custom.name || 'ไม่ทราบชื่อเมนู';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${displayName}</td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${item.qty}</td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${detailText}</td>
      `;
      rows.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    loading.textContent = '';
    table.classList.add('hidden');
    emptyState.classList.remove('hidden');
    showAlert(err.message, 'error');
  }
});

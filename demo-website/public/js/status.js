document.addEventListener('DOMContentLoaded', async () => {
  const alertBox = document.getElementById('status-alert');
  const loading = document.getElementById('cart-loading');
  const table = document.getElementById('cart-table');
  const rows = document.getElementById('cart-rows');
  const emptyState = document.getElementById('cart-empty');
  const infoBox = document.getElementById('order-info');
  const codeEl = document.getElementById('order-code');
  const statusEl = document.getElementById('order-status');
  const timeEl = document.getElementById('order-time');

  const showAlert = (message, type = 'info') => {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
    alertBox.classList.remove('bg-red-100','text-red-900','bg-yellow-100','text-yellow-900');
    if (type === 'error') {
      alertBox.classList.add('bg-red-100', 'text-red-900');
    } else {
      alertBox.classList.add('bg-yellow-100', 'text-yellow-900');
    }
  };

  const token = window.localStorage.getItem('token');
  if (!token) {
    showAlert('กรุณาเข้าสู่ระบบเพื่อดูสถานะคำสั่งซื้อ', 'error');
    if (loading) loading.textContent = '';
    setTimeout(() => window.location.href = '/login', 1200);
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const url = orderId ? `/api/orders/${orderId}` : '/api/orders/latest';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const order = await res.json();
    if (!res.ok) throw new Error(order.message || 'ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้');

    const items = Array.isArray(order.items) ? order.items : [];
    if (loading) loading.classList.add('hidden');

    if (!items.length) {
      if (emptyState) {
        emptyState.textContent = 'ยังไม่มีคำสั่งซื้อ';
        emptyState.classList.remove('hidden');
      }
      if (infoBox) infoBox.classList.add('hidden');
      return;
    }

    // Header info
    if (infoBox) {
      infoBox.classList.remove('hidden');
      if (codeEl) {
        const code = (order.orderNumber != null) ? String(order.orderNumber) : (order._id ? String(order._id).slice(-6) : '-');
        codeEl.textContent = `คำสั่งซื้อ #${code}`;
      }
      if (statusEl) {
        const map = {
          pending: { text: 'รอดำเนินการ', cls: ['bg-yellow-100','text-yellow-800'] },
          preparing: { text: 'กำลังทำ', cls: ['bg-blue-100','text-blue-800'] },
          completed: { text: 'เสร็จแล้ว', cls: ['bg-green-100','text-green-800'] },
        };
        const m = map[order.status] || map.pending;
        statusEl.textContent = `สถานะ: ${m.text}`;
        statusEl.className = 'rounded-full px-3 py-1 ' + m.cls.join(' ');
      }
      if (timeEl) {
        const ts = new Date(order.updatedAt || order.createdAt).toLocaleString('th-TH', { hour12: false });
        timeEl.textContent = `อัปเดตล่าสุด: ${ts}`;
      }
    }

    if (table) table.classList.remove('hidden');
    if (rows) rows.innerHTML = '';

    items.forEach((item) => {
      const displayName = item.nameSnap || 'เมนู';
      const qty = item.quantity || 1;
      const detailText = item.detailsSnap || '-';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-5 py-4 border-b border-gray-100 bg-white text-sm text-gray-800">${displayName}</td>
        <td class="px-5 py-4 border-b border-gray-100 bg-white text-sm text-gray-800">${qty}</td>
        <td class="px-5 py-4 border-b border-gray-100 bg-white text-sm text-gray-700">${detailText}</td>
      `;
      rows.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    if (loading) loading.textContent = '';
    if (table) table.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    showAlert(err.message, 'error');
  }
});

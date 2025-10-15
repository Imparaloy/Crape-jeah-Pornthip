document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.js-update-status');
  if (!btn) return;

  const card = btn.closest('[data-order-card]');
  const id = btn.dataset.orderId;
  const currentUiStatus = btn.dataset.currentUi;

  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = 'Updating...';

  try {
    const res = await fetch(`/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUiStatus })
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || `HTTP ${res.status}`);

    const newUi = currentUiStatus === 'In Process' ? 'Served' : 'In Process';
    btn.dataset.currentUi = newUi;

    if (newUi === 'In Process') {
      btn.textContent = 'Mark as Served';
      btn.classList.remove('bg-amber-100','hover:bg-amber-200');
      btn.classList.add('bg-green-100','hover:bg-green-200');
    } else {
      btn.textContent = 'Mark as In Process';
      btn.classList.remove('bg-green-100','hover:bg-green-200');
      btn.classList.add('bg-amber-100','hover:bg-amber-200');
    }

    if (card) {
      const badge = card.querySelector('[data-status-badge]');
      if (badge) {
        if (newUi === 'Served') {
          badge.textContent = 'Served';
          badge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600 text-white text-sm';
        } else {
          badge.textContent = 'In Process';
          badge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-sm';
        }
      }
    }
  } catch (err) {
    alert('เปลี่ยนสถานะไม่สำเร็จ: ' + err.message);
    btn.textContent = prevText;
  } finally {
    btn.disabled = false;
  }
});

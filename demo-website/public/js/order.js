const state = {
  token: null,
  items: [],
};

document.addEventListener('DOMContentLoaded', async () => {
  const alertBox = document.getElementById('cart-alert');
  const loadingBox = document.getElementById('cart-loading');
  const emptyBox = document.getElementById('cart-empty');
  const itemsContainer = document.getElementById('cart-items');
  const summaryBox = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('summary-subtotal');
  const taxEl = document.getElementById('summary-tax');
  const totalEl = document.getElementById('summary-total');
  const orderButton = document.getElementById('order-now');
  const helperText = document.getElementById('checkout-helper');

  const TAX_RATE = 0; // Reserved for future use.

  const showAlert = (message, type = 'error') => {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
    alertBox.classList.remove('border-red-100', 'bg-red-50', 'text-red-700');
    alertBox.classList.remove('border-green-100', 'bg-green-50', 'text-green-700');
    if (type === 'success') {
      alertBox.classList.add('border-green-100', 'bg-green-50', 'text-green-700');
    } else {
      alertBox.classList.add('border-red-100', 'bg-red-50', 'text-red-700');
    }
  };

  const hideAlert = () => {
    if (alertBox) alertBox.classList.add('hidden');
  };

  const formatBath = (value) => {
    if (value === null || Number.isNaN(value)) return '-';
    const rounded = Math.max(0, Number(value));
    return `${rounded.toLocaleString('th-TH')} bath`;
  };

  const resolveItemId = (item) => {
    if (!item) return null;
    if (item._id) return item._id;
    if (item.menuId && typeof item.menuId === 'object') {
      return item.menuId._id || item.menuId.id;
    }
    return item.menuId || null;
  };

  const resolveUnitPrice = (item) => {
    if (!item) return 0;
    if (item.custom && item.custom.totalPrice) return Number(item.custom.totalPrice) || 0;
    const menu = item.menuId || {};
    if (menu.price) return Number(menu.price) || 0;
    return 0;
  };

  const resolveImage = (item) => {
    const menu = item && item.menuId ? item.menuId : {};
    // Prefer menu.image (schema field), fallback to legacy imageUrl, then default placeholder
    return menu.image || menu.imageUrl || '/img/crepe.png';
  };

  const buildItemDescription = (item) => {
    const menu = item.menuId || {};
    const custom = item.custom || {};
    const parts = [];

    if (Array.isArray(custom.options) && custom.options.length) {
      parts.push(custom.options.map((opt) => `${opt.group}: ${opt.name}${opt.price ? ` (+${opt.price} bath)` : ''}`).join(' • '));
    }

    if (menu.description) parts.push(menu.description);
    if (item.note) parts.push(`หมายเหตุ: ${item.note}`);

    if (!parts.length && custom && custom.name) {
      parts.push('รายการที่คุณสร้างเอง');
    }

    return parts.join(' | ');
  };

  const renderSummary = () => {
    const subtotal = state.items.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      return sum + resolveUnitPrice(item) * qty;
    }, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    subtotalEl.textContent = formatBath(subtotal);
    taxEl.textContent = TAX_RATE ? formatBath(tax) : '-';
    totalEl.textContent = formatBath(total);

    if (state.items.length && state.token) {
      orderButton.disabled = false;
      helperText.classList.add('hidden');
    } else {
      orderButton.disabled = true;
      helperText.classList.remove('hidden');
      helperText.textContent = state.token
        ? 'ยังไม่มีรายการในตะกร้า'
        : 'กรุณาเข้าสู่ระบบเพื่อสั่งซื้อ';
    }
  };

  const renderItems = () => {
    itemsContainer.innerHTML = '';

    if (!state.items.length) {
      itemsContainer.classList.add('hidden');
      emptyBox.classList.remove('hidden');
      summaryBox.classList.remove('hidden');
      renderSummary();
      return;
    }

    emptyBox.classList.add('hidden');
    summaryBox.classList.remove('hidden');
    itemsContainer.classList.remove('hidden');

    state.items.forEach((item) => {
      const itemId = resolveItemId(item);
      const qty = Number(item.qty) || 1;
      const title = (item.menuId && item.menuId.name) || (item.custom && item.custom.name) || 'เมนูพิเศษ';
      const description = buildItemDescription(item);
      const unitPrice = resolveUnitPrice(item);
      const totalPrice = unitPrice * qty;

      const article = document.createElement('article');
      article.className = 'flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-md transition hover:shadow-lg md:flex-row md:items-center';

      const figure = document.createElement('div');
      figure.className = 'h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-red-50 shadow-inner';
      const image = document.createElement('img');
      image.src = resolveImage(item);
      image.alt = title;
  image.className = 'h-full w-full object-cover object-top';
      image.onerror = () => { image.src = '/img/crepe.png'; };
      figure.appendChild(image);

      const content = document.createElement('div');
      content.className = 'flex-1 space-y-2';
      const heading = document.createElement('h3');
      heading.className = 'text-lg font-semibold text-gray-900';
      heading.textContent = title;
      content.appendChild(heading);

      if (description) {
        const descEl = document.createElement('p');
        descEl.className = 'text-sm text-gray-500';
        descEl.textContent = description;
        content.appendChild(descEl);
      }

      const priceRow = document.createElement('div');
      priceRow.className = 'flex flex-wrap items-center gap-3 text-sm text-gray-600';
      priceRow.innerHTML = `ราคาต่อชิ้น <span class="font-semibold text-gray-900">${unitPrice.toLocaleString('th-TH')} bath</span>`;
      content.appendChild(priceRow);

      const actions = document.createElement('div');
      actions.className = 'flex flex-col items-end gap-4 md:flex-row md:items-center';

      const qtyBox = document.createElement('div');
      qtyBox.className = 'flex items-center rounded-full bg-[#f7e6db] px-3 py-2 text-sm font-medium text-gray-700';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-gray-600 shadow';
      minusBtn.textContent = '-';

      const qtyText = document.createElement('span');
      qtyText.className = 'mx-3 min-w-[2rem] text-center text-base text-gray-800';
      qtyText.textContent = qty;

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-gray-600 shadow';
      plusBtn.textContent = '+';

      qtyBox.appendChild(minusBtn);
      qtyBox.appendChild(qtyText);
      qtyBox.appendChild(plusBtn);

      const totalLabel = document.createElement('div');
      totalLabel.className = 'text-right text-base font-semibold text-gray-900 md:text-left';
      totalLabel.textContent = `${totalPrice.toLocaleString('th-TH')} bath`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'text-gray-400 transition hover:text-red-600';
      removeBtn.setAttribute('aria-label', 'ลบรายการนี้');
      removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12m-9 0V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a1 1 0 01-1 1H7a1 1 0 01-1-1V7h12z" /></svg>';

      const toggleButtons = (flag) => {
        minusBtn.disabled = flag;
        plusBtn.disabled = flag;
        removeBtn.disabled = flag;
        if (flag) {
          article.classList.add('opacity-70');
        } else {
          article.classList.remove('opacity-70');
        }
      };

      const updateQty = async (nextQty) => {
        if (!itemId) return;
        toggleButtons(true);
        try {
          if (nextQty < 1) {
            await deleteItem();
            return;
          }
          const res = await fetch(`/api/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify({ qty: nextQty }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'ไม่สามารถอัปเดตจำนวนได้');
          state.items = Array.isArray(data.items) ? data.items : [];
          hideAlert();
          renderItems();
          renderSummary();
        } catch (err) {
          console.error(err);
          showAlert(err.message || 'เกิดข้อผิดพลาดในการอัปเดตจำนวน');
          toggleButtons(false);
        }
      };

      const deleteItem = async () => {
        if (!itemId) return;
        toggleButtons(true);
        try {
          const res = await fetch(`/api/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'ไม่สามารถลบรายการได้');
          state.items = Array.isArray(data.items) ? data.items : [];
          hideAlert();
          renderItems();
          renderSummary();
        } catch (err) {
          console.error(err);
          showAlert(err.message || 'เกิดข้อผิดพลาดในการลบรายการ');
          toggleButtons(false);
        }
      };

      minusBtn.addEventListener('click', () => updateQty(qty - 1));
      plusBtn.addEventListener('click', () => updateQty(qty + 1));
      removeBtn.addEventListener('click', deleteItem);

      actions.appendChild(qtyBox);
      actions.appendChild(totalLabel);
      actions.appendChild(removeBtn);

      article.appendChild(figure);
      article.appendChild(content);
      article.appendChild(actions);

      itemsContainer.appendChild(article);
    });

    renderSummary();
  };

  orderButton.addEventListener('click', async () => {
    if (orderButton.disabled) return;
    try {
      orderButton.disabled = true;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ note: '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถสร้างออเดอร์ได้');
      const id = data._id || data.id;
      if (id) {
        window.location.href = `/status?orderId=${id}`;
      } else {
        window.location.href = '/status';
      }
    } catch (err) {
      showAlert(err.message || 'เกิดข้อผิดพลาดในการสร้างออเดอร์');
    } finally {
      orderButton.disabled = false;
    }
  });

  const loadCart = async () => {
    state.token = window.localStorage.getItem('token');
    if (!state.token) {
      loadingBox.classList.add('hidden');
      emptyBox.classList.remove('hidden');
      summaryBox.classList.remove('hidden');
      renderSummary();
      showAlert('กรุณาเข้าสู่ระบบเพื่อดูตะกร้าของคุณ');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.localStorage.removeItem('token');
          showAlert('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง');
          setTimeout(() => window.location.href = '/login', 1200);
          return;
        }
        throw new Error(data.message || 'ไม่สามารถโหลดตะกร้าได้');
      }

      state.items = Array.isArray(data.items) ? data.items : [];
      hideAlert();
      renderItems();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'เกิดข้อผิดพลาดในการโหลดตะกร้า');
      emptyBox.classList.remove('hidden');
    } finally {
      loadingBox.classList.add('hidden');
      summaryBox.classList.remove('hidden');
      renderSummary();
    }
  };

  await loadCart();
});

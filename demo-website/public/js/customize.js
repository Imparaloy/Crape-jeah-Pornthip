const CUSTOM_CONFIG = {
  basePrice: 45,
  productName: 'เครปปรับแต่งเอง',
  groups: [
    {
      id: 'base',
      title: 'แป้ง',
      description: 'สามารถเลือกแป้งชนิดเดียวหรือผสมกับชนิดอื่นได้',
      type: 'single',
      required: true,
      options: [
        { id: 'vanilla', name: 'แป้งนมสดวานิลา', price: 0 },
        { id: 'cocoa', name: 'แป้งโกโก้', price: 5 },
        { id: 'charcoal', name: 'แป้งชาโคล', price: 5 },
        { id: 'matcha', name: 'แป้งชาเขียว', price: 5 },
      ],
    },
    {
      id: 'icecream',
      title: 'ไส้ครีม',
      description: 'สามารถเลือกไส้ครีมได้ตามที่ต้องการ',
      type: 'single',
      required: false,
      options: [
        { id: 'vanilla', name: 'วานิลลา', price: 10 },
        { id: 'chocolate', name: 'ช็อกโกแลต', price: 10 },
        { id: 'strawberry', name: 'สตรอว์เบอร์รี่', price: 10 },
        { id: 'matcha', name: 'มัทฉะ', price: 15 },
      ],
    },
    {
      id: 'topping-sweet',
      title: 'ท็อปปิ้ง (หวาน)',
      description: 'จำกัดเลือกท็อปปิ้งอย่างน้อย 2 ชนิดต่อชิ้น ผสมหวานหรือคาวได้',
      type: 'multi',
      limit: 4,
      required: false,
      options: [
        { id: 'raisin', name: 'ลูกเกด', price: 10 },
        { id: 'almond', name: 'เม็ดมะม่วง', price: 10 },
        { id: 'coco-crunch', name: 'โกโก้ครันช์', price: 15 },
        { id: 'cornflake', name: 'คอร์นเฟล็ก', price: 5 },
        { id: 'pipo', name: 'ปีโป้', price: 25 },
        { id: 'namachoc', name: 'นามะช็อกโกแลต', price: 15 },
        { id: 'oreo', name: 'โอรีโอ้', price: 10 },
        { id: 'golden-thread', name: 'ฝอยทอง', price: 20 },
      ],
    },
    {
      id: 'topping-savory',
      title: 'ท็อปปิ้ง (คาว)',
      description: 'จำกัดเลือกท็อปปิ้งอย่างน้อย 2 ชนิดต่อชิ้น ผสมหวานหรือคาวได้',
      type: 'multi',
      limit: 4,
      required: false,
      options: [
        { id: 'ham', name: 'แฮม', price: 20 },
        { id: 'cheese', name: 'ชีส', price: 25 },
        { id: 'sausage', name: 'ไส้กรอกไก่', price: 15 },
        { id: 'tuna', name: 'ทูน่า', price: 10 },
        { id: 'crab', name: 'ปูอัด', price: 10 },
        { id: 'porkfloss', name: 'หมูหยอง', price: 20 },
        { id: 'corn', name: 'ข้าวโพด', price: 10 },
        { id: 'egg', name: 'ไข่', price: 10 },
      ],
    },
    {
      id: 'sauce',
      title: 'ซอสราด',
      description: 'สามารถเลือกได้ 2 ซอส ถ้าไม่ต้องการโปรดเว้นว่าง',
      type: 'multi',
      limit: 2,
      required: false,
      options: [
        { id: 'condensed-milk', name: 'นมข้นหวาน', price: 0 },
        { id: 'chocolate', name: 'ช็อกโกแลต', price: 0 },
        { id: 'strawberry', name: 'ซอสสตรอว์เบอร์รี่', price: 0 },
        { id: 'spicy', name: 'ซอสพริก', price: 0 },
        { id: 'mayo', name: 'มายองเนส', price: 0 },
      ],
    },
  ],
};

const state = {
  selections: {},
  qty: 1,
};

const formatPrice = (price) => `฿${price.toFixed(0)}`;

const initializeSelections = () => {
  CUSTOM_CONFIG.groups.forEach((group) => {
    if (group.type === 'multi') {
      state.selections[group.id] = [];
    } else {
      state.selections[group.id] = group.required && group.options.length
        ? group.options[0].id
        : null;
    }
  });
};

const renderGroups = () => {
  const container = document.getElementById('customize-groups');
  container.innerHTML = '';

  CUSTOM_CONFIG.groups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'space-y-4';

    const header = document.createElement('div');
    header.innerHTML = `
      <h2 class="text-xl font-semibold text-gray-900">${group.title}</h2>
      <p class="text-sm text-gray-500">${group.description || ''}</p>
    `;
    section.appendChild(header);

    const optionsWrapper = document.createElement('div');
    optionsWrapper.className = 'grid sm:grid-cols-2 gap-3';

    group.options.forEach((option) => {
      const optionId = `${group.id}-${option.id}`;
      const label = document.createElement('label');
      label.className = 'flex items-center justify-between border border-gray-200 bg-white rounded-2xl px-4 py-3 cursor-pointer hover:border-red-400 transition-colors';
      label.setAttribute('data-group', group.id);
      label.setAttribute('data-option-id', option.id);

      label.innerHTML = `
        <div>
          <p class="font-medium text-gray-800">${option.name}</p>
          <p class="text-xs text-gray-500">${option.price ? `+ ${option.price} ฿` : 'รวมในราคาแล้ว'}</p>
        </div>
        <div class="w-4 h-4 rounded-full border border-gray-400 bg-white"></div>
      `;

      label.addEventListener('click', (event) => {
        event.preventDefault();
        handleSelection(group, option);
      });

      optionsWrapper.appendChild(label);
    });

    section.appendChild(optionsWrapper);
    container.appendChild(section);
  });
};

const updateActiveStyles = () => {
  document.querySelectorAll('#customize-groups label[data-group]').forEach((label) => {
    const groupId = label.getAttribute('data-group');
    const optionId = label.getAttribute('data-option-id');
    const selection = state.selections[groupId];
    const isSelected = Array.isArray(selection)
      ? selection.includes(optionId)
      : selection === optionId;

    if (isSelected) {
      label.classList.add('border-red-400', 'bg-red-50');
      label.querySelector('div:last-child').classList.add('bg-red-600', 'border-red-600');
    } else {
      label.classList.remove('border-red-400', 'bg-red-50');
      label.querySelector('div:last-child').classList.remove('bg-red-600', 'border-red-600');
    }
  });
};

const calculateUnitPrice = () => {
  let price = CUSTOM_CONFIG.basePrice;
  CUSTOM_CONFIG.groups.forEach((group) => {
    const selection = state.selections[group.id];
    if (!selection) return;

    if (Array.isArray(selection)) {
      selection.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId);
        if (option) price += option.price || 0;
      });
    } else {
      const option = group.options.find((opt) => opt.id === selection);
      if (option) price += option.price || 0;
    }
  });
  return price;
};

const updatePriceDisplay = () => {
  const unitPrice = calculateUnitPrice();
  const qty = state.qty;
  const total = unitPrice * qty;

  const priceEl = document.getElementById('custom-price');
  const button = document.getElementById('add-custom-to-cart');
  if (priceEl) priceEl.textContent = formatPrice(unitPrice);
  if (button) button.textContent = `Add to basket  ${formatPrice(total)}`;
};

const handleSelection = (group, option) => {
  const current = state.selections[group.id];

  if (group.type === 'single') {
    state.selections[group.id] = option.id;
  } else {
    const selected = Array.isArray(current) ? [...current] : [];
    const exists = selected.includes(option.id);

    if (exists) {
      state.selections[group.id] = selected.filter((id) => id !== option.id);
    } else {
      if (group.limit && selected.length >= group.limit) {
        alert(`เลือกได้สูงสุด ${group.limit} ตัวเลือกในหมวด ${group.title}`);
        return;
      }
      selected.push(option.id);
      state.selections[group.id] = selected;
    }
  }

  updateActiveStyles();
  updatePriceDisplay();
};

const bindQuantityControls = () => {
  const decreaseBtn = document.getElementById('qty-decrease');
  const increaseBtn = document.getElementById('qty-increase');
  const display = document.getElementById('qty-display');

  const updateDisplay = () => {
    if (display) display.textContent = state.qty;
    updatePriceDisplay();
  };

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (state.qty > 1) {
        state.qty -= 1;
        updateDisplay();
      }
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      state.qty += 1;
      updateDisplay();
    });
  }

  updateDisplay();
};

const collectSelectedOptions = () => {
  const options = [];
  CUSTOM_CONFIG.groups.forEach((group) => {
    const selection = state.selections[group.id];
    if (!selection || (Array.isArray(selection) && !selection.length)) return;

    if (Array.isArray(selection)) {
      selection.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId);
        if (option) {
          options.push({
            group: group.title,
            name: option.name,
            price: option.price || 0,
          });
        }
      });
    } else {
      const option = group.options.find((opt) => opt.id === selection);
      if (option) {
        options.push({
          group: group.title,
          name: option.name,
          price: option.price || 0,
        });
      }
    }
  });
  return options;
};

const validateSelections = () => {
  const missingRequired = CUSTOM_CONFIG.groups
    .filter((group) => group.required)
    .some((group) => {
      const selection = state.selections[group.id];
      return !selection || (Array.isArray(selection) && !selection.length);
    });
  return !missingRequired;
};

const bindSubmit = () => {
  const button = document.getElementById('add-custom-to-cart');
  if (!button) return;

  button.addEventListener('click', async () => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนทำรายการ');
      window.location.href = '/login';
      return;
    }

    if (!validateSelections()) {
      alert('กรุณาเลือกหมวดที่จำเป็นให้ครบ');
      return;
    }

    const options = collectSelectedOptions();
    const unitPrice = calculateUnitPrice();
    const qty = state.qty;
    const note = document.getElementById('custom-note')?.value?.trim();

    button.disabled = true;
    button.classList.add('opacity-60');

    try {
      const res = await fetch('/api/cart/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: CUSTOM_CONFIG.productName,
          basePrice: CUSTOM_CONFIG.basePrice,
          options,
          totalPrice: unitPrice,
          qty,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถเพิ่มตะกร้าได้');

      alert('เพิ่มลงตะกร้าสำเร็จ!');
    } catch (err) {
      alert(err.message);
    } finally {
      button.disabled = false;
      button.classList.remove('opacity-60');
    }
  });
};

const init = () => {
  initializeSelections();
  renderGroups();
  updateActiveStyles();
  updatePriceDisplay();
  bindQuantityControls();
  bindSubmit();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

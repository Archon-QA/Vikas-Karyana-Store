// Product data (hardcoded for MVP)
const products = [
  { id: 1, name: "Aashirvaad Atta", price: 245, weight: "5 kg" },
  { id: 2, name: "Fortune Oil", price: 138, weight: "1L" },
  { id: 3, name: "Toor Dal", price: 115, weight: "1 kg" },
  { id: 4, name: "Kurkure", price: 20, weight: "90g" },
  { id: 5, name: "Tata Tea", price: 248, weight: "500g" },
  { id: 6, name: "MDH Masala", price: 65, weight: "100g" }
];

let cart = []; // Format: [{ id, name, price, weight, qty }, ...]

function getProduct(id) {
  return products.find(p => p.id === id);
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      qty: 1
    });
  }
  
  updateCartDisplay();
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  let deliveryFee = 0;
  if (subtotal < 100) {
    deliveryFee = 40;
  } else if (subtotal < 300) {
    deliveryFee = 30;
  }
  
  const total = subtotal + deliveryFee;
  
  return { subtotal, deliveryFee, total };
}

function formatCartItems() {
  // Returns: "1x Aashirvaad Atta (5kg, ₹245), 2x Fortune Oil (1L, ₹276)"
  return cart
    .map(item => `${item.qty}x ${item.name} (${item.weight}, ₹${(item.price * item.qty).toLocaleString('en-IN')})`)
    .join(', ');
}

function updateCartDisplay() {
  const cartBar = document.getElementById('cart-bar');
  const cartText = document.getElementById('cart-text');
  const cartPrice = document.getElementById('cart-price');
  const itemsField = document.getElementById('items-field');
  
  if (cart.length === 0) {
    cartBar.style.display = 'none';
    itemsField.value = '';
    return;
  }
  
  cartBar.style.display = 'flex';
  
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const { subtotal, deliveryFee, total } = calculateTotals();
  
  // Update cart display text
  const cartSummary = cart.length === 1
    ? `${itemCount} item in cart`
    : `${itemCount} items in cart`;
  cartText.textContent = cartSummary;
  
  // Update total price display
  const feeText = deliveryFee === 0 ? 'Free delivery' : `+ ₹${deliveryFee} delivery`;
  cartPrice.textContent = `Total: ₹${total.toLocaleString('en-IN')} (${feeText})`;
  
  // Auto-fill items field with detailed format
  itemsField.value = formatCartItems();
  
  // Clear previous errors for items field
  document.getElementById('itemsError').textContent = '';
  itemsField.classList.remove('error-field');
}

function validateForm(formData) {
  const errors = {};
  
  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }
  
  // Phone validation
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = "Phone must be 10 digits starting with 6-9";
    }
  }
  
  // Address validation
  if (!formData.address || !formData.address.trim()) {
    errors.address = "Address is required";
  } else if (formData.address.trim().length < 10) {
    errors.address = "Address must be at least 10 characters";
  }
  
  // Items validation
  if (!formData.items || !formData.items.trim()) {
    errors.items = "Please add items to your order";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

function displayErrors(errors) {
  // Clear all inline error texts
  document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
  
  // Clear error field classes
  document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
  
  const errorSummary = document.getElementById('formErrorSummary');
  const errorList = document.getElementById('errorList');
  
  if (Object.keys(errors).length > 0) {
    // Show error summary
    errorList.innerHTML = Object.entries(errors)
      .map(([_, msg]) => `<li>${msg}</li>`)
      .join('');
    errorSummary.style.display = 'block';
    
    // Show inline errors and add error-field class
    Object.entries(errors).forEach(([field, msg]) => {
      const errorEl = document.getElementById(`${field}Error`);
      if (errorEl) {
        errorEl.textContent = msg;
        // Find the input element before the error span
        const inputEl = errorEl.previousElementSibling;
        if (inputEl && inputEl.tagName !== 'LABEL') {
          inputEl.classList.add('error-field');
        } else if (inputEl) {
          // If previous is label, find input after the span
          const formDiv = errorEl.closest('div') || errorEl.parentElement;
          const inputs = formDiv.querySelectorAll('input, textarea, select');
          if (inputs.length > 0) {
            inputs[inputs.length - 1].classList.add('error-field');
          }
        }
      }
    });
    
    // Scroll to form
    errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    errorSummary.style.display = 'none';
  }
}

function submitOrder(e) {
  e.preventDefault();
  
  const form = e.target;
  
  // Get form input elements
  const inputs = form.querySelectorAll('input');
  const textareas = form.querySelectorAll('textarea');
  
  const formData = {
    name: inputs[0].value,
    phone: inputs[1].value,
    email: inputs[3]?.value || '', // Email if present in form
    address: inputs[2].value,
    items: textareas[0].value
  };
  
  const { isValid, errors } = validateForm(formData);
  
  if (!isValid) {
    displayErrors(errors);
    return;
  }
  
  // Clear errors if valid
  document.getElementById('formErrorSummary').style.display = 'none';
  
  // Calculate order totals
  const { subtotal, deliveryFee, total } = calculateTotals();
  
  // Prepare order data for API
  const orderData = {
    customer_name: formData.name,
    phone: formData.phone,
    email: formData.email,
    delivery_address: formData.address,
    order_items: JSON.stringify(cart), // Send cart items as JSON
    subtotal: subtotal,
    delivery_fee: deliveryFee,
    total: total,
    payment_method: 'cod' // Cash on delivery for now
  };
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  // Send order to backend API
  fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Failed to submit order');
      });
    }
    return response.json();
  })
  .then(data => {
    // Order submitted successfully
    console.log('Order created:', data);
    
    // Store order details for confirmation page
    const orderId = data.data?.id || data.data?.order_id;
    const orderRef = data.data?.order_ref;
    
    // Store in sessionStorage to pass to confirmation page
    sessionStorage.setItem('lastOrder', JSON.stringify({
      id: orderId,
      ref: orderRef,
      customer_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      items: cart,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      timestamp: new Date().toLocaleString('en-IN')
    }));
    
    // Clear form and cart
    form.reset();
    cart = [];
    document.getElementById('cart-bar').style.display = 'none';
    
    // Show success message or redirect
    const successMsg = document.getElementById('success-msg');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h3>✅ Order Placed Successfully!</h3>
          <p>Your order ID: <strong>#${orderRef || orderId}</strong></p>
          <p>We'll deliver your items within 2 hours.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Place Another Order
          </button>
        </div>
      `;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  })
  .catch(error => {
    console.error('Error submitting order:', error);
    
    // Show error message
    displayErrors({
      form: error.message || 'Failed to submit order. Please try again.'
    });
    
    // Add form error display
    const errorSummary = document.getElementById('formErrorSummary');
    if (errorSummary) {
      const errorList = document.getElementById('errorList');
      errorList.innerHTML = `<li>${error.message || 'Failed to submit order'}</li>`;
      errorSummary.style.display = 'block';
      errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  });
}


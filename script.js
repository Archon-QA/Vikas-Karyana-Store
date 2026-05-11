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
    const cleaned = formData.phone.replace(/\s+/g, '').replace(/^\+91/, '');
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(cleaned)) {
      errors.phone = "Phone must be 10 digits";
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
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  const textareas = form.querySelectorAll('textarea');
  const paymentMethodRadio = form.querySelector('input[name="payment_method"]:checked');
  
  const formData = {
    name: inputs[0].value,
    phone: inputs[1].value,
    email: inputs[2]?.value || '', // Email if present
    address: inputs[3].value,
    items: textareas[0].value,
    payment_method: paymentMethodRadio?.value || 'cod'
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
  
  // Build order items array with id and qty (as backend expects)
  const orderItems = cart.map(item => ({
    id: item.id,
    qty: item.qty
  }));
  
  // Prepare order data for API - must match backend field names
  const orderData = {
    customer_name: formData.name,
    customer_phone: formData.phone,
    customer_email: formData.email,
    delivery_address: formData.address,
    order_items: orderItems, // Send as array of {id, qty}
    subtotal: subtotal,
    delivery_fee: deliveryFee,
    total: total,
    payment_method: formData.payment_method
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
    
    const orderId = data.data?.id || data.data?.order_id;
    const orderRef = data.data?.order_ref;
    
    // Store order details in session
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
      payment_method: formData.payment_method,
      timestamp: new Date().toLocaleString('en-IN')
    }));
    
    // Process payment based on method selected
    if (formData.payment_method === 'razorpay') {
      // Initialize Razorpay payment
      initiateRazorpayPayment(orderId, orderRef, formData, total, submitBtn, originalBtnText);
    } else {
      // COD - Order is complete
      showOrderSuccess(orderRef, submitBtn, originalBtnText, form);
    }
  })
  .catch(error => {
    console.error('Error submitting order:', error);
    
    // Show error message
    displayErrors({
      form: error.message || 'Failed to submit order. Please try again.'
    });
    
    const errorSummary = document.getElementById('formErrorSummary');
    if (errorSummary) {
      const errorList = document.getElementById('errorList');
      errorList.innerHTML = `<li>${error.message || 'Failed to submit order'}</li>`;
      errorSummary.style.display = 'block';
      errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  });
}

// Razorpay Payment Handler
function initiateRazorpayPayment(orderId, orderRef, formData, total, submitBtn, originalBtnText) {
  // First, create a Razorpay order on backend
  fetch('http://localhost:3000/api/payments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: orderId,
      total_amount: total
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Failed to create payment');
      });
    }
    return response.json();
  })
  .then(paymentData => {
    const razorpayOrderId = paymentData.data.razorpay_order_id;
    const razorpayKeyId = paymentData.data.razorpay_key_id;
    
    // Initialize Razorpay checkout
    const options = {
      key: razorpayKeyId,
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      name: 'Vikas Karyana Store',
      description: `Order #${orderRef}`,
      order_id: razorpayOrderId,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      handler: function(response) {
        // Payment successful - verify signature on backend
        verifyPaymentSignature({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: orderId
        }, orderRef, submitBtn, originalBtnText);
      },
      modal: {
        ondismiss: function() {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          displayErrors({ form: 'Payment cancelled' });
        }
      }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
  })
  .catch(error => {
    console.error('Razorpay error:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    displayErrors({ form: error.message || 'Failed to initiate payment' });
  });
}

// Verify Payment Signature
function verifyPaymentSignature(paymentDetails, orderRef, submitBtn, originalBtnText) {
  fetch('http://localhost:3000/api/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentDetails)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Payment verification failed');
      });
    }
    return response.json();
  })
  .then(data => {
    showOrderSuccess(orderRef, submitBtn, originalBtnText);
  })
  .catch(error => {
    console.error('Payment verification error:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    displayErrors({ form: 'Payment verification failed. Please contact support.' });
  });
}

// Show Order Success Message
function showOrderSuccess(orderRef, submitBtn, originalBtnText, form) {
  const successMsg = document.getElementById('success-msg');
  if (successMsg) {
    successMsg.style.display = 'block';
    successMsg.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h3>✅ Order Placed Successfully!</h3>
        <p>Your order ID: <strong>#${orderRef}</strong></p>
        <p>We'll deliver your items within 2 hours.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          Place Another Order
        </button>
      </div>
    `;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Clear form and cart
  if (form) form.reset();
  cart = [];
  document.getElementById('cart-bar').style.display = 'none';
  
  // Reset button
  submitBtn.disabled = false;
  submitBtn.textContent = originalBtnText;
}


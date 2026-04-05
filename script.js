let cart = [];
function addToCart(item) {
  cart.push(item);
  var bar = document.getElementById('cart-bar');
  bar.style.display = 'flex';
  document.getElementById('cart-text').textContent = cart.length + ' item(s) added: ' + [...new Set(cart)].join(', ');
  var field = document.getElementById('items-field');
  if (field.value === '') field.value = cart.join(', ');
  else if (!field.value.includes(item)) field.value += ', ' + item;
}
function submitOrder(e) {
  e.preventDefault();
  document.getElementById('success-msg').style.display = 'block';
  e.target.querySelectorAll('input,textarea,select').forEach(el => el.value = '');
  cart = [];
}

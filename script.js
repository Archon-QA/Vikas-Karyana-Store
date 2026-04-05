const products = [
  { name: 'Fresh Tomatoes', category: 'produce', description: 'Juicy tomatoes sourced daily from local farms.' },
  { name: 'Green Spinach', category: 'produce', description: 'Crisp leafy greens for your daily meals.' },
  { name: 'Whole Wheat Flour', category: 'staples', description: 'Perfect for chapati, paratha, and baking needs.' },
  { name: 'Rice Basmati', category: 'staples', description: 'Premium long-grain rice for daily cooking.' },
  { name: 'Turmeric Powder', category: 'spices', description: 'Freshly stocked turmeric for authentic flavor.' },
  { name: 'Ground Coriander', category: 'spices', description: 'A pantry essential for curries and seasoning.' },
  { name: 'Milk Pack', category: 'dairy', description: 'Pure milk from trusted dairy suppliers.' },
  { name: 'Paneer Block', category: 'dairy', description: 'Fresh cottage cheese for home cooking.' },
  { name: 'Yogurt Cup', category: 'dairy', description: 'Creamy yogurt made for daily meals.' },
];

const productGrid = document.getElementById('productGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

function renderProducts(filter = 'all') {
  const filtered = filter === 'all' ? products : products.filter(item => item.category === filter);
  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
    </article>
  `).join('');
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderProducts(category);
  });
});

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  alert('Thank you! Your message has been noted. We will be in touch soon.');
  contactForm.reset();
});

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

renderProducts();

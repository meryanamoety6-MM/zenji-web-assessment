const KEY = 'zenji_cart';

const money = (value) => `A$${Number(value).toFixed(2)}`;

const cart = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (error) {
    console.error('Cart data is corrupted:', error);
    return [];
  }
};

const save = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  count();
};

function count() {
  const element = document.getElementById('bag-count');

  if (element) {
    element.textContent = cart().reduce(
      (total, item) => total + Number(item.qty || 0),
      0
    );
  }
}

function header() {
  const element = document.getElementById('site-header');

  if (!element) return;

  element.innerHTML = `
    <header class="site-header">
      <a class="logo" href="index.html">
        ZENJI<sup>®</sup>
      </a>

      <nav>
        <a href="shop.html">Shop</a>
        <a href="story.html">Our Story</a>
        <a href="lookbook.html">Lookbook</a>
        <a href="faq.html">FAQ</a>
      </nav>

      <a class="bag" href="cart.html">
        Bag <b id="bag-count">0</b>
      </a>

      <button class="menu" aria-label="Menu" type="button">
        <i></i>
        <i></i>
      </button>
    </header>

    <div class="mobile-nav">
      <a href="shop.html">Shop</a>
      <a href="story.html">Our Story</a>
      <a href="lookbook.html">Lookbook</a>
      <a href="faq.html">FAQ</a>
    </div>
  `;

  const menuButton = element.querySelector('.menu');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.onclick = () => {
      mobileNav.classList.toggle('open');
    };
  }
}

function footer() {
  const element = document.getElementById('site-footer');

  if (!element) return;

  element.innerHTML = `
    <footer>
      <div class="footer-top">

        <div>
          <a class="logo" href="index.html">
            ZENJI<sup>®</sup>
          </a>

          <p>
            ANIME STREETWEAR<br>
            FOR THE EVERYDAY WARRIOR.
          </p>
        </div>

        <div class="footer-links">
          <a href="shop.html">Shop</a>
          <a href="story.html">Our Story</a>
          <a href="lookbook.html">Lookbook</a>
          <a href="faq.html">FAQ</a>
        </div>

        <div>
          <p class="eyebrow">FOLLOW THE JOURNEY</p>

          <a
            href="https://www.instagram.com/zenji.shop/"
            target="_blank"
            rel="noopener noreferrer"
          >
            INSTAGRAM ↗
          </a>
        </div>

      </div>

      <div class="footer-bottom">
        © 2026 ZENJI. ALL RIGHTS RESERVED.
        <span>MELBOURNE / AUSTRALIA</span>
      </div>
    </footer>
  `;
}

function card(product) {
  return `
    <article class="card reveal">

      <a
        class="pic"
        href="product.html?id=${product.id}"
      >
        <span>${product.tag}</span>

        <img
          src="${product.images[0]}"
          alt="${product.name}"
          loading="lazy"
        >

        <b>VIEW PRODUCT ↗</b>
      </a>

      <div class="info">

        <a href="product.html?id=${product.id}">
          <strong>${product.name}</strong>
          <small>
            ${product.category.toUpperCase()} / ZENJI
          </small>
        </a>

        <strong>
          ${money(product.price)}
        </strong>

      </div>

    </article>
  `;
}

function featured() {
  const element = document.getElementById('featured-products');

  if (!element || typeof PRODUCTS === 'undefined') return;

  element.innerHTML = PRODUCTS
    .slice(0, 4)
    .map(card)
    .join('');
}

function shop() {
  const element = document.getElementById('shop-products');

  if (!element || typeof PRODUCTS === 'undefined') return;

  let filter =
    new URLSearchParams(location.search).get('category') || 'all';

  const searchInput = document.getElementById('search-input');
  const emptyResults = document.getElementById('empty-results');

  const paint = () => {
    const query = (searchInput?.value || '').toLowerCase().trim();

    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        filter === 'all' || product.category === filter;

      const matchesSearch =
        product.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    element.innerHTML = list
      .map(card)
      .join('');

    if (emptyResults) {
      emptyResults.hidden = list.length > 0;
    }

    reveal();
  };

  document.querySelectorAll('.filter').forEach((button) => {
    button.onclick = () => {
      filter = button.dataset.filter || 'all';

      document
        .querySelectorAll('.filter')
        .forEach((item) => item.classList.remove('active'));

      button.classList.add('active');

      paint();
    };
  });

  if (searchInput) {
    searchInput.oninput = paint;
  }

  document.querySelectorAll('.filter').forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.filter === filter
    );
  });

  paint();
}

function add(id, size, quantity) {
  const items = cart();

  const existing = items.find(
    (item) => item.id === id && item.size === size
  );

  if (existing) {
    existing.qty += quantity;
  } else {
    items.push({
      id,
      size,
      qty: quantity
    });
  }

  save(items);

  toast('ADDED TO BAG ↗');
}

function toast(message) {
  let element = document.querySelector('.toast');

  if (!element) {
    element = document.createElement('div');
    element.className = 'toast';
    document.body.appendChild(element);
  }

  element.textContent = message;

  element.classList.add('show');

  setTimeout(() => {
    element.classList.remove('show');
  }, 1600);
}

function product() {
  const element = document.getElementById('product-page');

  if (!element || typeof PRODUCTS === 'undefined') return;

  const id =
    new URLSearchParams(location.search).get('id');

  const product =
    PRODUCTS.find((item) => item.id === id) || PRODUCTS[0];

  element.innerHTML = `
    <section class="product-layout">

      <div class="gallery">

        <div class="thumbs">
          ${product.images
            .map(
              (image, index) => `
                <button
                  class="thumb ${index === 0 ? 'active' : ''}"
                  data-src="${image}"
                  type="button"
                >
                  <img src="${image}" alt="">
                </button>
              `
            )
            .join('')}
        </div>

        <div class="main-img">
          <img
            id="main-img"
            src="${product.images[0]}"
            alt="${product.name}"
          >
        </div>

      </div>

      <div class="details">

        <p class="eyebrow">
          ${product.category.toUpperCase()}
          /
          ${product.drop.toUpperCase()}
        </p>

        <h1>${product.name}</h1>

        <div class="price">
          ${money(product.price)}
        </div>

        <p class="desc">
          ${product.desc}
        </p>

        <label>SELECT SIZE</label>

        <div class="sizes">
          ${['XS', 'S', 'M', 'L', 'XL', 'XXL']
            .map(
              (size) => `
                <button
                  class="size ${size === 'L' ? 'active' : ''}"
                  data-size="${size}"
                  type="button"
                >
                  ${size}
                </button>
              `
            )
            .join('')}
        </div>

        <div class="buy">

          <div class="qty">
            <button id="minus" type="button">−</button>
            <span id="qty">1</span>
            <button id="plus" type="button">+</button>
          </div>

          <button
            class="btn dark"
            id="add"
            type="button"
          >
            ADD TO BAG ↗
          </button>

        </div>

        <div class="spec">

          <p>
            <b>FIT</b>
            <span>${product.fit}</span>
          </p>

          <p>
            <b>FABRIC</b>
            <span>${product.fabric}</span>
          </p>

          <p>
            <b>DROP</b>
            <span>${product.drop}</span>
          </p>

        </div>

      </div>

    </section>

    <section class="section related">

      <h2>
        YOU MAY ALSO <em>LIKE.</em>
      </h2>

      <div class="product-grid">
        ${PRODUCTS
          .filter((item) => item.id !== product.id)
          .slice(0, 4)
          .map(card)
          .join('')}
      </div>

    </section>
  `;

  let quantity = 1;
  let selectedSize = 'L';

  document.querySelectorAll('.size').forEach((button) => {
    button.onclick = () => {
      document
        .querySelectorAll('.size')
        .forEach((item) => item.classList.remove('active'));

      button.classList.add('active');

      selectedSize = button.dataset.size;
    };
  });

  const minus = document.getElementById('minus');
  const plus = document.getElementById('plus');
  const quantityElement = document.getElementById('qty');
  const addButton = document.getElementById('add');

  if (minus) {
    minus.onclick = () => {
      quantity = Math.max(1, quantity - 1);
      quantityElement.textContent = quantity;
    };
  }

  if (plus) {
    plus.onclick = () => {
      quantity++;
      quantityElement.textContent = quantity;
    };
  }

  if (addButton) {
    addButton.onclick = () => {
      add(product.id, selectedSize, quantity);
    };
  }

  document.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.onclick = () => {
      document
        .querySelectorAll('.thumb')
        .forEach((item) => item.classList.remove('active'));

      thumb.classList.add('active');

      const mainImage = document.getElementById('main-img');

      if (mainImage) {
        mainImage.src = thumb.dataset.src;
      }
    };
  });
}

function cartPage() {
  const element = document.getElementById('cart-content');

  if (!element || typeof PRODUCTS === 'undefined') return;

  const items = cart();

  if (!items.length) {
    element.innerHTML = `
      <div class="empty-cart">

        <h2>
          YOUR BAG IS EMPTY.
        </h2>

        <a
          class="btn dark"
          href="shop.html"
        >
          CONTINUE SHOPPING ↗
        </a>

      </div>
    `;

    return;
  }

  let total = 0;

  element.innerHTML = `
    <div class="cart-wrap">

      ${items
        .map((item, index) => {

          const product =
            PRODUCTS.find((p) => p.id === item.id);

          if (!product) return '';

          const itemTotal =
            product.price * item.qty;

          total += itemTotal;

          return `
            <div class="cart-item">

              <img
                src="${product.images[0]}"
                alt="${product.name}"
              >

              <div>
                <h3>${product.name}</h3>
                <small>SIZE ${item.size}</small>
              </div>

              <div class="cart-actions">

                <button
                  data-a="dec"
                  data-i="${index}"
                  type="button"
                >
                  −
                </button>

                ${item.qty}

                <button
                  data-a="inc"
                  data-i="${index}"
                  type="button"
                >
                  +
                </button>

                <button
                  data-a="remove"
                  data-i="${index}"
                  type="button"
                >
                  ×
                </button>

              </div>

              <strong>
                ${money(itemTotal)}
              </strong>

            </div>
          `;
        })
        .join('')}

      <div class="cart-total">

        <span>SUBTOTAL</span>

        <strong>
          ${money(total)}
        </strong>

        <button
          class="btn dark"
          id="checkout"
          type="button"
        >
          CHECKOUT ↗
        </button>

        <small>
          Demo checkout — no payment is processed.
        </small>

      </div>

    </div>
  `;

  element.querySelectorAll('[data-a]').forEach((button) => {

    button.onclick = () => {

      const index = Number(button.dataset.i);
      const items = cart();

      if (!items[index]) return;

      if (button.dataset.a === 'inc') {
        items[index].qty++;
      }

      if (button.dataset.a === 'dec') {
        items[index].qty =
          Math.max(1, items[index].qty - 1);
      }

      if (button.dataset.a === 'remove') {
        items.splice(index, 1);
      }

      save(items);
      cartPage();
    };

  });

  const checkout = document.getElementById('checkout');

  if (checkout) {
    checkout.onclick = () => {
      toast('DEMO CHECKOUT — NO PAYMENT');
    };
  }
}

function reveal() {
  document
    .querySelectorAll('.reveal')
    .forEach((element) => {

      if (
        element.getBoundingClientRect().top <
        window.innerHeight * 0.9
      ) {
        element.classList.add('visible');
      }

    });
}

header();
footer();
count();
featured();
shop();
product();
cartPage();

window.addEventListener('scroll', reveal);

reveal();

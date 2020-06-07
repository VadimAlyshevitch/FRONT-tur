const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const closer = document.querySelector('.close');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating'),
      price = document.querySelector('.price'),
      category = document.querySelector('.category'),
      modalBody = document.querySelector('.modal-body'),
      modalPricetag = document.querySelector('.modal-pricetag'),
      buttonMinus = document.querySelector('.button-minus'),
      buttonPlus = document.querySelector('.button-plus');



// let user = {
//   login : loginInput.value,
//   password : passwordInput.value
// }

let login = localStorage.getItem('delivery');



const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }

  return await response.json();
};

const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;

  return nameReg.test(str);
};

function toggleModal() {
  modal.classList.toggle('is-open');
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  loginInput.placeholder = '';
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    // cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = ` Welcome, ${login}`;
  // cartButton.style.display = 'flex';
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    if (valid(loginInput.value.trim())) {
      login = loginInput.value;

      localStorage.setItem('delivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();

      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.placeholder = 'Введите логин';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  
}) {
  const card = `
      <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ description, image, name, price, id }) {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML(
    'beforeend',
    `
        <img
          src="${image}"
          alt="image"
          class="card-image"
        />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">
              ${description}
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart" id="${id}">
              <span class="button-card-text">Сохранить</span>
              
            </button>
            <strong class="card-price-bold">Итого: ${price} ₽</strong>
          </div>
        </div>
  `
  );
  cardsMenu.insertAdjacentElement('beforeend', card);
}


// меню категории
function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant'); //метод closet ишет родительский селектор у выбранного селектора вверху по цепочке. если найдет - вернет этот элемент, а если нет то null

    if (restaurant) {
      getData('/db/partners.json').then((data) => {
        let matched = data.find(
          (rest) => rest.products === restaurant.dataset.products
        );

        const headerSection = menu.querySelector('.section-heading');
        headerSection.innerHTML = `
          <h2 class="section-title restaurant-title">${matched.name}</h2>
          <div class="card-info">
            <div class="rating">
              ${matched.stars}
            </div>
            <div class="price">От ${matched.price} ₽</div>
            <div class="category">${matched.kitchen}</div>
        `;
      });
      restaurantTitle.textContent = '' ;
      rating.textContent = '' ;
      price.textContent = '' ;
      category.textContent = '' ;
      cardsMenu.textContent = '';
      //containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');



      getData(`/db/${restaurant.dataset.products}`).then((data) => {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}




function init() {
  getData('/db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
  });


  closer.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);
  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 4000,
    },
  });
}

init();

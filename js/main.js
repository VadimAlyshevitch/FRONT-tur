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

// корзина
const bag = []

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
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
      <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
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
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
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

// function addToBag(event) {
//   const target = event.target;
//   const buttonAddToBag = target.closest('.button-add-cart');

//   if(buttonAddToBag) {
//     const card = target.closest('.card');
//     const title = card.querySelector('.card-title-reg').textContent;
//     const price = card.querySelector('.card-price-bold').textContent;
//     const id = buttonAddToBag.id;
// // поиск на совпадения
//     const food = bag.find(function(item) {
//       return item.id === id;
//     })

//     if(food) {
//       food.count += 1;
//     } else {
//       bag.push({
//         id : id,
//         title : title,
//         price : price,
//         count : 1
//       });
//     }
// // конец поиск на совпадения 
//    // console.log(title,  price, id)
//   }
// };

// function renderCart( ) {
//   modalBody.textContent = '';
//   bag.forEach((item) => {
//     const itemBag = `          
//       <div class="food-row">
//         <span class="food-name">${item.title}</span>
//         <strong class="food-price">${item.price}</strong>
//         <div class="food-counter">
//           <button class="counter-button button-minus" data-id=${item.id}>-</button>
//           <span class="counter">${item.count}</span>
//           <button class="counter-button button-plus" data-id=${item.id}>+</button>
//         </div>
//       </div>`;

//       modalBody.insertAdjacentHTML('beforebegin', itemBag);

//       const totalPrice = bag.reduce((result, item)=> {
//           return result + (parseFloat(item.price) * item.count); // преобразование строки в число с помощью parseFloat
//       }, 0);

//       modalPricetag.textContent = totalPrice + ' ₽';
//   })
// }

// function changeCount(event) {
//   const target = event.target;

//   if(target.classList.contains('counter-button')){
//     const food = bag.find(function(item) {
//       return item.id === target.dataset.id
//     });

//     if(target.classList.contains('button-minus')) {
//       food.count--; 
//       console.log('click minus')
//    };
//    if(target.classList.contains('button-plus')) {
//      food.count++;
//    };
//     renderCart();
//   }
// }

// buttonMinus.addEventListener('click' , event => {
//   const target = event.target;

//   console.log('push minus')
// })



function init() {
  getData('/db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
  });

  // cartButton.addEventListener('click',() => {
  //   // renderCart()
  //   toggleModal();
  // } );

  // modalBody.addEventListener('click' , changeCount);

  // cardsMenu.addEventListener('click', addToBag);

  closer.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  // logo.addEventListener('click', () => {
  //   //containerPromo.classList.remove('hide');
  //   restaurants.classList.remove('hide');
  //   menu.classList.add('hide');
  // });

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 4000,
    },
  });
}

init();

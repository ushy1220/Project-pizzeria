export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',    //selektor szablonu produktu 
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget', // szablon nowej podstrony (moduł 9)
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',              //2 nowe selektory do nowych kontenerów (moduł 9)
    booking: '.booking-wrapper',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },

    //Na podstronie rezerwacji pojawią się dwa specjalne widgety. Do wyboru godziny i drugi daty. Selektory dla nich: (moduł 9)
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
  },

  // selektory do nawigacji i podstawowych elementów podstrony rezerwacji (moduł 9)
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
  },
  nav: {
    links: '.main-nav a, #home .links a',
  },

  // CODE ADDED START
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  // CODE ADDED END
};
  
export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END

  // nowe nazwy klas (moduł 9)
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  } 
};
  
export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  db: {
    /* wartością url jest domena, pod którą oglądamy projekt. Tylko jeśli tą domeną będzie localhost, dodamy do adresu informację o porcie :3131.
    Po tej zmianie aplikacja powinna dalej poprawnie działać na komputerze, ale teraz będzie też mogła być uruchomiona na Heroku. */
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',

    // (moduł 9)
    booking: 'bookings',
    event: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },

  // ustawienia nowej podstrony rezerwacji (moduł 9)
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
};
  
export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  // CODE ADDED START
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  // CODE ADDED END

  // (szablon podstrony rezerwacji) Moduł 9
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
};
  
// "export" pozwala na używanie treści exportowanej przez inne pliki projektu, ale nie automatycznie. dokończenie jest w app.js
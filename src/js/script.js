/* eslint-disable no-undef */
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars


'use strict';

const select = {
  templateOf: {
    menuProduct: '#template-menu-product',    //selektor szablonu produktu wykorzystany niżej
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
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
      input: 'input[name="amount"]',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
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

const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END
};

const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  db: {
    url: '//localhost:3131',
    products: 'products',
    orders: 'orders',
  },
};

const templates = {   //tu wykorzystany jest selektor szablonu z pocątku pliku
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
};      //w obiekcie templates (szablony), Metoda menuProduct tworzona jest za pomocą biblioteki Handlebars

class Product{
  constructor(id, data){
    const thisProduct = this;
      
    thisProduct.id = id;            
    thisProduct.data = data;
    
    thisProduct.renderInMenu(); 
    thisProduct.getElements();  
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    /* klasa Product za pomocą metody renderInMenu bierze dane źródłowe produktu, "wrzuca je" do szablonu, i tak powstaje kod HTML pojedynczego produktu. Ponieważ metoda renderInMenu jest uruchamiana w konstruktorze klasy, to przy tworzeniu każdej nowej instancji dla danego produktu, od razu renderuje się on na stronie. */

    //console.log('new Product:', thisProduct);
  }

  renderInMenu(){       // RENDEROWANIE (TWORZENIE) PRODUKTÓW W MENU 
    const thisProduct = this;
      
    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data); 
    // (wywołanie metody templates.menuProduct i przekazanie jej danych produktu)

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    //(Użycie metody utils.createDOMFromHTML. Przyjęła ona kod HTML w formie tekstu jako argument i zwraca element DOM na nim oparty)

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    // (użyta została metoda querySelector by znaleźć kontener produktów, którego selektor zapisany jest w select.containerOf.menu na górze pliku)

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
    // za pomocą metody appendChil, dodajemy stworzony element do menu 

  }

  getElements(){
    const thisProduct = this;
    
    thisProduct.dom = {};
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    // eslint-disable-next-line no-unused-vars
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;                                                         //DLACZEGO JUŻ NIE DZIAŁA????
      
    /* find the clickable trigger (the element that should react to clicking) */
    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);  //DLACZEGO JUŻ NIE DZIAŁA????

    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function(event) {                     //DLACZEGO JUŻ NIE DZIAŁA????

      event.preventDefault();
      /* prevent default action for event */

      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if(activeProduct != thisProduct.element && activeProduct != null){
        activeProduct.classList.remove('active');
      }  

      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle('active');
    });

  }

  initOrderForm(){
    const thisProduct = this;
    //console.log(this.initOrderForm);

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();     //Przeliczanie ceny
    });
      
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();     //Przeliczanie ceny
      });
    }
      
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.addToCart();
      thisProduct.processOrder();   //Przeliczanie ceny
    });
  }

  processOrder(){                   //Przeliczanie ceny
    const thisProduct = this;   //Przygotowanie dostępu do formularza w postaci JSowego obiektu 
      
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);
      
    // set price to default price
    let price = thisProduct.data.price;   // Zmienna w której będziemy trzymać naszą cenę
      
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      //console.log(paramId, param);
      
      // for every option in this category
      for(let optionId in param.options) {
        
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        //console.log(optionId, option);

        // check if there is param with a name of paramId in formData and if it includes optionId
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        // (Czy w formData istnieje właściwość o nazwie zgodnej z nazwą kategorii?)

        if(optionSelected){           // Jeśli wybrana opcja
          if(!option.default){        // Nie jest opcją domyślną
            price+=option.price;      // Zwiększ cenę o cenę opcji
          }
        } else if(option.default) {   // Natomiast jeśli wybrana opcja jest opcją domyślną
          price-=option.price;        // Zmniejsz cenę o cenę wybranej opcji
        }
        // wyszukanie obrazka produktu
        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

        //sprawdzanie czy istnieje
        if(optionImage){
          if(optionSelected){
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
     
    /* multiply price by amount */
    price *= thisProduct.amountWidget.value;
    /*przed wyświetleniem ceny obliczonej z uwzględnieniem opcji, pomnożymy ją przez ilość sztuk wybraną w widgecie*/

    /* add new property "priceSingle" to thisProduct */
    thisProduct.priceSingle = price / thisProduct.amountWidget.value;
    thisProduct.price = price;
    /*  każdorazowe uruchomienie "processOrder" będzie równało się z aktualizacją "thisProduct.priceSingle", które będzie zawsze zwracała aktualną cenę jednostkową. "processOrder" uruchamia się automatycznie za każdym razem kiedy coś zmieniamy */

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;      //wpisujemy przeliczoną cenę do elementu w HTML-u
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    app.cart.add(thisProduct.prepareCartProduct);
    /*przekazuje ona całą instancję jako argument metody "app.cart.add". W ten sposób odwołujemy się do metody "add" klasy Cart
    Metoda "add" otrzymuje referencję do tej instancji, co pozwoli jej odczytywać jej właściwości i wykonywać jej metody*/


  }

  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.price, // Dlaczego??? skoro miałą zostać pomnożona?!
      params: thisProduct.prepareCartProductParams(),
    };

    return productSummary;
  }

  prepareCartProductParams(){
    const thisProduct = this;   //Przygotowanie dostępu do formularza w postaci JSowego obiektu 
      
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);
    
    const params = {};

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      console.log(paramId, param);

      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        label: param.label,
        options: {}
      };

      // for every option in this category
      for(let optionId in param.options) {
        
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        console.log(optionId, option);

        // check if there is param with a name of paramId in formData and if it includes optionId
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        // (Czy w formData istnieje właściwość o nazwie zgodnej z nazwą kategorii?)

        //przejście po wszystkich opcjach produktów i sprawdzanie czy są wybrane
        if(optionSelected){
          params[paramId].options[optionId] = option.label;
        } 
      }
    }

    return params;
  }
}

class AmountWidget{
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);
    thisWidget.initActions();
    
    //console.log('amountWidget:', thisWidget);
    //console.log('constructor arguments:', element);  
  }

  getElements(element){
    const thisWidget = this;
  
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: Add validation */

    if(thisWidget.value !== newValue && !isNaN(newValue) && 
    newValue >= settings.amountWidget.defaultMin &&  // wartości są sprawdzane wg określonego zakresu. Nie większe niż maksymalna 
    newValue <= settings.amountWidget.defaultMax){   // wartość domyślna i nie mniejsze niż minimalna. 
      thisWidget.value = newValue;
    }

    thisWidget.value = newValue;
    thisWidget.input.value = thisWidget.value;

    thisWidget.announce();
  }

  initActions(){
    const thisWidget = this;

    /* dla "thisWidget.input" dodany został nasłuchiwacz eventu "change", dla którego handler użyje metody "setValue" z takim samym argumentem, jak w konstruktorze (wartość inputa) */
    thisWidget.input.addEventListener('change', function(){ 
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true                                                   //MENTOR!! ????????????????????????????????????????????
      /* używamy innego rodz. eventu, którego właściwość "Bubbles" możemy kontrolować. dzięki niej event będzie działał emitowany na tym elemencie oraz na jego rodzicu, dziadku itd aż do <body>, document, window. 
      W PRZYPADKU CUSTOM EVENTU BĄBELKOWANIE MUSIMY WŁĄCZYĆ SAMI */

    });
    thisWidget.element.dispatchEvent(event);
  }

}

class Cart{  //KOSZYK
  constructor(element){
    const thisCart = this;

    thisCart.products = []; // Tablica przechowująca dane dodane do koszyka

    thisCart.getElements(element);

    //console.log('new Cart', thisCart);

    thisCart.initActions();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};  // Obiekt ułatwiający nawigację po klasie. Schowane są w nim referencje elementów DOM

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.templateOf.menuProduct);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);

  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    // const thisCart = this;

    // console.log('adding product', menuProduct);

    const thisCart = this;
      
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct); 
    // (utworzenie kodu HTML i zapisanie go w stałej. Obiektem z danymi dla szablonu są podstawowe dane o produkcie otrzymany w argumencie)

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //  zamiana powyższego kodu na element DOM i zapisanie w stałej "generatedDOM"

    thisCart.dom.productList.appendChild(generatedDOM);
    // za pomocą metody appendChil, dodajemy stworzony element DOM do menu

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); 
    /* jednocześnie tworzymy nową instancję klasy "new CartProduct" oraz dodamy ją do tablicy "thisCart.products". 
    Dzięki temu będziemy mieli stały dostęp do instancji wszystkich produktów. Właśnie poprzez tę tablicę */
    
    // console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;
    const totalNumber = 0;
    const subtotalPrice = 0;

    for(let cartProduct of thisCart.products){
      thisCart.totalNumber += cartProduct.amount;
      // pętla zwiększa "totalNumber" o liczbę sztuk danego produktu

      thisCart.subtotalPrice += cartProduct.price;
      // pętla zwiększa "subtotalPrice" o cenę całkowitą produktu (właściwość price)
    }

    if(thisCart.totalNumber !== 0){
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      // właściwość koszyka, której wartością ma być cena całkowita (kwota za produkty i koszt dostawy)

    } else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
      // jeśli w koszyku nie ma ani jednego produktu, to nie ma sensu w cenie końcowej wliczać "deliveryFee". Wtedy cena końcowa powinna wynieść 0
    }

    console.log('totalPrice:', totalPrice, 'deliveryFee:', deliveryFee, 'totalNumber:', totalNumber, 'subtotalPrice:', subtotalPrice);

    //Metoda ma odpowiednio aktualizować HTML koszyka, aby użytkownik widział poprawne dane (cena, koszt dostawy itp)
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

    for(let totalPriceHolder of thisCart.dom.totalPrice){
      totalPriceHolder.innerHTML = thisCart.totalPrice;
    }
  }

  remove(){
    const thisCart = this;

    cartProduct.dom.wrapper.remove();
    //Usunięcie reprezentacji produktu z HTML'a

    const indexOfProduct = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfProduct, 1);
    //Usunięcie informacji o danym produkcie z tablicy thisCart.product

    thisCart.update();
    //Wywołać metodę update w celu ponownego przeliczenia sum po usunięciu produktu
  }
}

class CartProduct{  //POJEDYNCZE ELEMENTY W KOSZYKU
  constructor(element, menuProduct){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.params = menuProduct.params;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();

    // console.log('thisCartProduct:', thisCartProduct);
  }

  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    // Utworzenie nowej właściwości obiektu "thisCartProtuct.dom.wrapper" i przypisanie mu elementów znalezionych we wrapperze. ich selektory są w "select.cartProduct"

  }

  initAmountWidget(){
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);

    thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function(){
      
      //zawartość handlera:

      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      //ustawienie nowej wartości dla właściwości amount

      thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
      //wyświetlanie na stronie nowej przeliczonej ceny tego produktu z uwzględnieniem liczby sztuk
    });
  }

  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {  //Wykorzystujemy custom event z właściwością "bubbles"
      bubbles: true,
      detail: {           
        cartProduct: thisCartProduct,   //Szczegóły przekazywane wraz z eventem
      },
    });

    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions(){
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}

const app = {
  initData: function(){  
    const thisApp = this;   //Przypisanie referencji pod właściwość Data
                                        
    thisApp.data = dataSource;    
  },

  initMenu: function(){
    const thisApp = this;           /*na początku metody app.initMenu */

    //console.log('thisApp.data:', thisApp.data); 

    for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData]);
    }
  },

  init: function(){
    const thisApp = this;
    /*
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    */
    thisApp.initData();         

    thisApp.initMenu();

    thisApp.initCart();
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
  }
};

app.init();
            

/* app.initData ma zadanie przygotować nam łatwy dostęp do danych. Przypisuje więc do app.data (właściwości całego obiektu app) referencję do dataSource, czyli po prostu danych, z których będziemy korzystać z aplikacji. Znajduje się tam m.in. obiekt products ze strukturą naszych produktów. 

app.initMenu jest wywoływana po pierwszej, gdyż korzysta z przygotowanej wcześniej referencji do danych (thisApp.data). Jej zadaniem jest przejście po wszystkich obiektach produktów z thisApp.data.products (cake, breakfast itd.) i utworzenie dla każdego z nich instancji klasy Product. Przy tworzeniu każdej instancji uruchamia się funkcja konstruktora, która uruchamia dla danego obiektu metodę renderInMenu. Ta tworzy element DOM wygenerowany na podstawie szablonu HTML reprezentujący właśnie dany produkt i "dokleja" go do strony. Czyli najprościej mówiąc, metoda app.initMenu przejdzie po każdym produkcie z osobna i stworzy dla niego instancję Product, czego wynikiem będzie również utworzenie na stronie reprezentacji HTML każdego z produktów w thisApp.data.products.*/


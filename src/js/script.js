/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
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
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
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

      /* klasa Product za pomocą metody renderInMenu bierze dane źródłowe produktu, "wrzuca je" do szablonu, i tak powstaje kod HTML pojedynczego produktu. Ponieważ metoda renderInMenu jest uruchamiana w konstruktorze klasy, to przy tworzeniu każdej nowej instancji dla danego produktu, od razu renderuje się on na stronie. */

      console.log('new Product:', thisProduct);
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
  }

  const app = {
    initData: function(){   /* To miało być nad deklaracją app.init, ale nie wiem czy umięsliłem to w dobrym miejscu*/
      const thisApp = this;   //Przypisanie referencji pod właściwość Data
                                        
      thisApp.data = dataSource;    
    },

    initMenu: function(){
      const thisApp = this;           /*na początku metody app.initMenu */

      console.log('thisApp.data:', thisApp.data); 

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      
      thisApp.initData();         

      thisApp.initMenu();
    },
  };

  app.init();
}


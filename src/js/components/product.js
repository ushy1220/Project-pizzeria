import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './amountWidget.js';

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
  
    // app.cart.add(thisProduct.prepareCartProduct());
    /*przekazuje ona całą instancję jako argument metody "app.cart.add". W ten sposób odwołujemy się do metody "add" klasy Cart
      Metoda "add" otrzymuje referencję do tej instancji, co pozwoli jej odczytywać jej właściwości i wykonywać jej metody*/
  
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
    //Stworzony został nowy event i wywołany został na elemencie tego produktu. Aby działął musimy go nasłuchiwać w obiekcie app
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

export default Product;
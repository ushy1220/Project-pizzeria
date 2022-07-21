import {select} from './settings.js';
import AmountWidget from './amountwidget.js';

class CartProduct{  //POJEDYNCZE ELEMENTY W KOSZYKU
  constructor(menuProduct, element){
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
    console.log(element);
    console.log(select.cartProduct.amountWidget);
  
    thisCartProduct.dom = {};
  
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
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
    const thisCartProduct = this;
  
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });
  
    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
  
  getData(){
    /* Metoda, która ma zwracać nowy obiekt, z właściwościami instancji "thisCartProduct", które są potrzebne w momencie zapisywania zamówienia (id, amount, price, priceSingle, name, params) */
    const thisCartProduct = this;
  
    const prod = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      name: thisCartProduct.name,
      params: thisCartProduct.params,
    };
    return prod;
  }
}

export default CartProduct;
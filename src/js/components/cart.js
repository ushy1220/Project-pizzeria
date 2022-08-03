import {select} from '../settings.js';
import {classNames} from '../settings.js';
import {templates} from '../settings.js';
import {settings} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './cartProduct.js';

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
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
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
      event.preventDefault(); // zablokowanie domyślnego zachowania aby wysyłka nie przeładowywała strony
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
  
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
  
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
  
    // console.log('totalPrice:', totalPrice, 'deliveryFee:', deliveryFee, 'totalNumber:', totalNumber, 'subtotalPrice:', subtotalPrice);
  
    //Metoda ma odpowiednio aktualizować HTML koszyka, aby użytkownik widział poprawne dane (cena, koszt dostawy itp)
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
  
    for(let totalPriceHolder of thisCart.dom.totalPrice){
      totalPriceHolder.innerHTML = thisCart.totalPrice;
    }
  }
  
  remove(cartProduct){
    const thisCart = this;
  
    cartProduct.dom.wrapper.remove();
    //Usunięcie reprezentacji produktu z HTML'a
  
    const indexOfProduct = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfProduct, 1);
    //Usunięcie informacji o danym produkcie z tablicy thisCart.product
  
    thisCart.update();
    //Wywołać metodę update w celu ponownego przeliczenia sum po usunięciu produktu
  }
  
  sendOrder(){ //obiekt, którego oczekuje serwer w przypadku złożenia zamówienia
    const thisCart = this;
  
    const url = settings.db.url + '/' + settings.db.orders; 
    /* Stała url, w której umieszczamy adres endpointu zamówienia (orders) */
  
    const payload = {
      /* stała zawierająca dane, które będą wysyłane do serwera */
  
      // address: adres klienta wpisany w koszyku,
      adress: thisCart.dom.address.value,
  
      // phone: numer telefonu wpisany w koszyku,
      phone: thisCart.dom.phone.value,
  
      //totalPrice: całkowita cena za zamówienie,
      totalPrice: thisCart.totalPrice,
  
      //subtotalPrice: cena całkowita - koszt dostawy,
      subtotalPrice: thisCart.subtotalPrice,
  
      //totalNumber: całkowita liczba sztuk,
      totalNumber: thisCart.totalNumber,
  
      //deliveryFee: koszt dostawy,
      deliveryFee: thisCart.deliveryFee,
  
      //products: tablica obecnych w koszyku produktów
      products: [],
    };
    console.log('payload: ', payload);
  
    // Dodajemy do "payload.products" obiekty podsumowania 
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    console.log(payload);
  
    /* Stała zawierająca opcje, które skonfigurują zapytanie (request) */
    const options = {
      method: 'POST', //zmiana domyślnej metody GET na POST, służąca do wysyłania danych do serwera API
      headers: { // ustawienie nagłówka, aby serwer wiedział, że wysyłamy dane w postaci JSON
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),  // treść, którą wysyłamy. Metoda "JSON.strigify" konwertuje obiekt "payload" do JSON 
    };
  
    fetch(url, options);
  }
}

export default Cart;
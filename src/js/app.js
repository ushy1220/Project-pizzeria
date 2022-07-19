// improtuj obiekt "settings" z pliku "settings.js"
import {settings} from './settings.js';
import {select} from './settings.js';
// nawiasy klamrowe używamy kiedy improtujemy więcej niż 1 obiekt i żaden nie jest domyślny
import Product from './components/product.js';
import Cart from './components/cart.js';

export const app = {
  initData: function(){  
    const thisApp = this;   //Przypisanie referencji pod właściwość Data

    thisApp.data = {};    
    /*  -Połącz się z adresem url przy użyciu metody fetch.
        -Jeśli połączenie się zakończy, to wtedy (pierwsze .then) skonwertuj dane do obiektu JS-owego.
        -Kiedy i ta operacja się zakończy, to wtedy (drugie .then) pokaż w konsoli te skonwertowane dane. */
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url) //za pomocą "fetch" wysyłamy zapytanie (request) pod podany adres endpointu (domyślnie korzysta z metody GET)
      .then(function(rawResponse){  // konwertujemy odpowiedź na obiekt JSowy
        return rawResponse.json(); // otrzyma odpowiedź, która jest w formacie JSON
      })
      .then(function(parsedResponse){ // kiedy konwersja się zakończy...
        console.log('parsedResponse', parsedResponse); // ...Wyświetlamy odpowiedź w konsoli

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initMenu: function(){
    const thisApp = this;           /*na początku metody app.initMenu */

    //console.log('thisApp.data:', thisApp.data); 

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
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

    thisApp.initCart();
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventlistener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  }
};

app.init();
            

/* app.initData ma zadanie przygotować nam łatwy dostęp do danych. Przypisuje więc do app.data (właściwości całego obiektu app) referencję do dataSource, czyli po prostu danych, z których będziemy korzystać z aplikacji. Znajduje się tam m.in. obiekt products ze strukturą naszych produktów. 

app.initMenu jest wywoływana po pierwszej, gdyż korzysta z przygotowanej wcześniej referencji do danych (thisApp.data). Jej zadaniem jest przejście po wszystkich obiektach produktów z thisApp.data.products (cake, breakfast itd.) i utworzenie dla każdego z nich instancji klasy Product. Przy tworzeniu każdej instancji uruchamia się funkcja konstruktora, która uruchamia dla danego obiektu metodę renderInMenu. Ta tworzy element DOM wygenerowany na podstawie szablonu HTML reprezentujący właśnie dany produkt i "dokleja" go do strony. Czyli najprościej mówiąc, metoda app.initMenu przejdzie po każdym produkcie z osobna i stworzy dla niego instancję Product, czego wynikiem będzie również utworzenie na stronie reprezentacji HTML każdego z produktów w thisApp.data.products.*/


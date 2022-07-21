// improtuj obiekt "settings" z pliku "settings.js"
import {classNames, select, settings} from './settings.js';
// nawiasy klamrowe używamy kiedy improtujemy więcej niż 1 obiekt i żaden nie jest domyślny
import Product from './components/product.js';
import Cart from './components/cart.js';
import Booking from './components/booking.js';

export const app = {

  initPages: function(){ //Stowrzona została metoda uruchamiana w momencie odświeżania strony
    const thisApp = this;

    /* W tej metodzie znajdujemy wszystkie kontenery podstron... */
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    // dzieki "children" w własciwosci pages znajda sie wszystkie dzieci kontenera stron (sekcje o id other i booking)

    /* ...oraz wszystkie linki prowadzące do tych podstron */
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    /* Następnie z Hasha url'a tej strony pozyskujemy id podstrony, która ma zostać otwarta jako domyślna */
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    /* spr czy któraś z podstron pasuje do tego id, które uzyskaliśmy z adresu strony. Jeżeli nie, zostanie otwarta pierwsza podstrona (let pageMatchingHash = thisApp.pages[0].id;), a jeżeli tak, otwarta zostanie ta podstrona, która pasowała do id uzyskanego z adresu strony*/
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break; //jeśli pierwsza ze stron ma id pasujące do idFromHash, to id zostanie przypisane do zmiennej, a petla zostanie przerwana i pozostale strony nie zostana sprawdzone
      }
    } 

    /* Następnie aktywujemy odpowiednią podstronę */
    thisApp.activatePage(pageMatchingHash);
    //w ten sposób znaleźliśmy pierwszą podstronę z thisApp.pages

    /* Następnie dodajemy nasłuchiwacze do wszystkich linków, które odsyłają do podstron. Na kliknięcie w taki link uzyskujemy id z atrybutu href tego linka, po czym aktywujemy odpowiednia podstrone */
    for(let link of thisApp.navLinks){
      link.addEventlistener('click', function(event){
        
        //pierwszą rzeczą jaką zapisujemy wewnątrz handlera eventu jest definicja stałej w której zapiszemy obiekt this
        const clickedElement = this;

        event.preventDefault();

        //w stałej id zapisujemy atrybut href kliknietego elementu w którym zamienimy znak # na pusty ciąg znaków
        const id = clickedElement.getAttribute('href').replace('#', '');

        // wywołać metodę activatePage z tym id
        thisApp.activatePage(id);

        /* Przy aktywowaniu podstrony zmieniamy "window.location.hash" na ciąg znaków #/id aktywowanej podstrony */ 
        window.location.hash = '#/' + id;
        // "/" zapobiega przewijaniu strony do początku


      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    // nadanie/odbieranie odpoweidniemu wrapperowi strony (order / booking) klasę active
    /*     
      for(let page of thisApp.pages){
      if(page.id == pageId){
        page.classList.add(classNames.pages.active);
      } else {
        page.classList.remove(classNames.pages.active);
      } 
      */

    //to samo co zakomentowany if powyżej
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    // to samo dla linków 
    for(let link of thisApp.navLinks){ //dla każdego linku w thisApp.navLinks...
      link.classList.toggle( // ...dodaj/usuń klasę..
        classNames.nav.active,  // ...zdefiniowaną w classNames.nav.activ...
        link.getAttribute('href') == '#' + pageId // ...w zależności od tego, czy atrybut href tego linka jest równy # oraz id podstrony, podanej jako argument metodzie activatePage
      );
    }
    /* Załóżmy że metoda activatePage zostałą wykonana i jako argument otrzymałą tekst "order"(pageId). W takim razie dla każdej ze stron zapisanych w thissApp.pages zostanie dodana lub usunieta klasa zapisana w classNAmes.pages.active. To czy klasa zostanie dodana lub usunieta zalezy od tego czy ID tej strony jest równe order(pageId). Dla podstrony "order" zostanie dodana klasa active, a dla każdej innej (np. booking) ten warunek bedzie falszywy wiec ta klasa zostanie odebrana. Nastepnie dla każdego linku zapisanego w thissApp.navLinks zostanie rowniez dodana/odebrana klasa zapisana w classNames.page.active. To czy zostanie zapisana czy nie zależy od tego czy atrybut href jest równy #order */
  },
  

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

    thisApp.initPages();

    thisApp.initData();         

    thisApp.initCart();

    thisApp.initBooking();
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventlistener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function(){
    const thisApp = this;
    
    // Znajdowanie widgetu do rezerwacji stron
    const bookWidget = document.querySelector(select.containerOf.booking);

    // Tworzenie nowej instancji klasy Booking, i przekazywanie do konstruktora kontener, który przed chwilą znaleźliśmy
    thisApp.widget = new Booking(bookWidget);
  }
};

app.init();
            

/* app.initData ma zadanie przygotować nam łatwy dostęp do danych. Przypisuje więc do app.data (właściwości całego obiektu app) referencję do dataSource, czyli po prostu danych, z których będziemy korzystać z aplikacji. Znajduje się tam m.in. obiekt products ze strukturą naszych produktów. 

app.initMenu jest wywoływana po pierwszej, gdyż korzysta z przygotowanej wcześniej referencji do danych (thisApp.data). Jej zadaniem jest przejście po wszystkich obiektach produktów z thisApp.data.products (cake, breakfast itd.) i utworzenie dla każdego z nich instancji klasy Product. Przy tworzeniu każdej instancji uruchamia się funkcja konstruktora, która uruchamia dla danego obiektu metodę renderInMenu. Ta tworzy element DOM wygenerowany na podstawie szablonu HTML reprezentujący właśnie dany produkt i "dokleja" go do strony. Czyli najprościej mówiąc, metoda app.initMenu przejdzie po każdym produkcie z osobna i stworzy dla niego instancję Product, czego wynikiem będzie również utworzenie na stronie reprezentacji HTML każdego z produktów w thisApp.data.products.*/


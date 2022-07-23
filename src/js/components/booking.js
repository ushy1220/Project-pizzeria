import {classNames, select, settings, templates} from '../settings';
import AmountWidget from './amountwidget';
import HourPicker from './HourPicker';
import DatePicker from './DatePicker';
import utils from '../utils';

class Booking {
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element); // ????? element ?????
    thisBooking.initWidget();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);

    const endDateParam= settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params= {
      booking: [
        startDateParam,
        endDateParam,
      ],

      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'), 
      // zawiera adres endpointu API ktory zwroci liste rezerwacji

      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'), 
      // zwroci liste wydarzen jednorazowych

      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'), 
      // zwroci liste wydarzen cyklicznych
    };

    /* Promise.all wykona pewną operację (fetch), a kiedy zostanie ona zakończona, wtedy zostanie wykonana funkcja zdefiniowana w metodzie ".then" */
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponses = allResponses[0];
        const eventsCurrentResponses = allResponses[1];
        const eventsRepeatResponses = allResponses[2];
        return Promise.all([
          bookingsResponses.json(),
          eventsCurrentResponses.json(),
          eventsRepeatResponses.json(),
        ]);
      })
      .then(function([bookings, eventsRepeat, eventsCurrent]){
        // console.log(bookings);
        // console.log(eventsRepeat);
        // console.log(eventsCurrent);
        //Potraktuj pierwszy argument jako tablicę ([]), i pierwszy element z tej tablicy zapisz w zmiennej bookings
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;

    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    thisBooking.updateDom();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    // konwersja godziny
    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = 0; hourBlock < startHour + duration; hourBlock += 0.5){ 

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      } 

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDom(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    
    // utworzenie pustego obiektu 
    thisBooking.dom = {};

    // dodanie do tego obiektu właściwości wrapper i przypisanie do niej referencji do kontenera (jest dostępna w argumencie metody)
    thisBooking.dom.wrapper = element;

    // zmiana zawartości wrappera (innerHTML) na kod HTML wygenerowany z szablonu.
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    // dodanie 2 nowych właściwości. Powinny być one referencjami odpowiednio do inputów "People amount" i "Hours amount"
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    //2 nowe referencje do datePicker i hourPicker
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

    thisBooking.dom.hoursPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets(){
    const thisBooking = this;

    /* Nowa instancja AmountWidget do peopleAmount i hoursAmount + dodanie nasłuchiwacza. Funkcje callback nasłuchiwaczy są puste */
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function(){});

    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function(){});

    /* uruchomienie na obu elementach odpowiednie widgety. (datePicker, hourPicker*/
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.hourPicker.addEventListener('input', function(){});

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.dom.datePicker.addEventListener('click', function(){});

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDom();
    });
  }

  choosenTables(){
    
  }
}

export default Booking;
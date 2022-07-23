import {select, templates} from '../settings';
import AmountWidget from './amountwidget';
import HourPicker from './HourPicker';
import DatePicker from './DatePicker';

class Booking {
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element); // ????? element ?????
    thisBooking.initWidget();
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
  }
}

export default Booking;
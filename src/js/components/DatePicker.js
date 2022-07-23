import BaseWidget from '../components/BaseWidget.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date();
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    /*  */
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, { 
      // 1.arg = referencja do inputu, na którym plugin ma się uruchomić. 
      // 2. arg = ustawienia

      defaultDate: thisWidget.minDate,  //data domyślna = data obecna
      minDate: thisWidget.minDate, //data minimalna = data obecna (rezerwacja w przeszłość?)
      maxDate: thisWidget.maxDate, //data obecna + dni wybrane przez użytkownika
      locale: {

        /* Ustala, aby pierwszym dniem tygodnia zawsze był poniedziałek */
        firstDayOfWeek: 1
      },

      /* Nasza restauracja jest nieczynna w poniedziałki */
      disable: [
        function(date) {
          return (date.getDay() === 1);
        }
      ],
      /* funkcja callback (onChange). Uruchamiana, gdy plugin wykryje zmianę terminu */
      onChange: function(selectedDates, dateStr) {

        /* wynikiem jej działania będzie po prostu zaktualizowanie thisWidget.value */
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){

  }
}

export default DatePicker;

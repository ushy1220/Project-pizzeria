import {select} from '../settings.js';
import {settings} from '../settings.js';
import BaseWidget from './baseWidget.js';

class AmountWidget extends BaseWidget{ 
  /* informacja ze klasa AmountWidget jest rozszerzeniem klasy BaseWidget */

  constructor(element){
    super(element, settings.amountWidget.defaultValue); 
    /* 
    odwołanie do konstruktora klasy nadrzędnej (obowiązkowe). 
    1(element) - wrapperElement (z konstruktora klasy BaseWidget)
    2- adres do initialValue (początkowa wartość z kostruktora BaseWidget)
    */

    const thisWidget = this;
  
    thisWidget.getElements(element);
    thisWidget.initActions();
      
    //console.log('amountWidget:', thisWidget);
    //console.log('constructor arguments:', element);  
  }
  
  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrese = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  
  isValid(value){
    /* Będzie zwracać prawdę/fałsz w zależności od tego, czy wartość, którą chcemy ustawić dla tego widgetu jest prawidłowa wg kryterium, jakie ustawimy dla tego widgetu */

    return !isNaN(value) //sprawdza, czy value NIE jest NIELICZBĄ
    && value >= settings.amountWidget.defaultMin   // wartości są sprawdzane wg określonego zakresu. Nie większe niż maksymalna 
    && value <= settings.amountWidget.defaultMax;   // wartość domyślna i nie mniejsze niż minimalna. 
  }

  renderValue(){
    /* Ta metoda służy temu, aby bieżąca wartość widgetu zostałą wyświetlona na stronie (wyrenderowana) */
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;

  }

  initActions(){
    const thisWidget = this;
  
    /* dla "thisWidget.dom.input" dodany został nasłuchiwacz eventu "change", dla którego handler użyje metody "setValue" z takim samym argumentem, jak w konstruktorze (wartość inputa) */
    thisWidget.dom.input.addEventListener('change', function(){ 
      thisWidget.setValue(thisWidget.dom.input.value);
    });
  
    thisWidget.dom.linkDecrese.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value - 1);
    });
  
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;
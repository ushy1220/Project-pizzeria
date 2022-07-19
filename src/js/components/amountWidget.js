import {select} from './settings.js';
import {settings} from './settings.js';

class AmountWidget{
  constructor(element){
    const thisWidget = this;
  
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);
    thisWidget.initActions();
      
    //console.log('amountWidget:', thisWidget);
    //console.log('constructor arguments:', element);  
  }
  
  getElements(element){
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  
  setValue(value){
    const thisWidget = this;
  
    const newValue = parseInt(value);
  
    /* TODO: Add validation */
  
    if(thisWidget.value !== newValue && !isNaN(newValue) && 
      newValue >= settings.amountWidget.defaultMin &&  // wartości są sprawdzane wg określonego zakresu. Nie większe niż maksymalna 
      newValue <= settings.amountWidget.defaultMax){   // wartość domyślna i nie mniejsze niż minimalna. 
      thisWidget.value = newValue;
    }
  
    thisWidget.value = newValue;
    thisWidget.input.value = thisWidget.value;
  
    thisWidget.announce();
  }
  
  initActions(){
    const thisWidget = this;
  
    /* dla "thisWidget.input" dodany został nasłuchiwacz eventu "change", dla którego handler użyje metody "setValue" z takim samym argumentem, jak w konstruktorze (wartość inputa) */
    thisWidget.input.addEventListener('change', function(){ 
      thisWidget.setValue(thisWidget.input.value);
    });
  
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value - 1);
    });
  
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault;
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  
  announce(){
    const thisWidget = this;
  
    const event = new CustomEvent('updated', {
      bubbles: true                                                   //MENTOR!! ????????????????????????????????????????????
      /* używamy innego rodz. eventu, którego właściwość "Bubbles" możemy kontrolować. dzięki niej event będzie działał emitowany na tym elemencie oraz na jego rodzicu, dziadku itd aż do <body>, document, window. 
        W PRZYPADKU CUSTOM EVENTU BĄBELKOWANIE MUSIMY WŁĄCZYĆ SAMI */
  
    });
    thisWidget.element.dispatchEvent(event);
  }
  
}

export default AmountWidget;
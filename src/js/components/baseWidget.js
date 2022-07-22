class BaseWidget{
  constructor(wrapperElement, initialValue){
    /* 
    wrapperElement- element DOM w którym znajduje się ten widget
    initialValue- początkowa wartość widgetu
    */
    const thisWidget = this;

    thisWidget.dom = {};
    /* W tym elemencie dom będą znajdować się wszystkie elementy DOM, z których będziemy korzystać w naszej aplikacji */

    thisWidget.dom.wrapper = wrapperElement;
    /* zapisany w ... wrapper przekazany konstruktorowi w momencie tworzenia instancji */

    thisWidget.value = initialValue;
    /* początkowa wartość widgetu w jego właściwości Value */
  }

  // METODY SKOPIOWANE Z INNYCH MODUŁÓW KTÓRE BĘDĄ DOTYCZYĆ WSZYSTKICH WIDGETÓW

  setValue(value){
    /* SŁUŻY DO USTAWIANIA NOWYCH WARTOŚCI WIDGETU, ALE TYLKO POD WARUNKIEM, ŻE JEST TO PRAWIDŁOWA WARTOŚĆ (LICZBA Z ZAKRESU ZDEFINIOWANEGO W NASZEJ APLIKACJI) */

    const thisWidget = this;
  
    const newValue = thisWidget.parseValue(value);
  
    /* TODO: Add validation */
  
    if(thisWidget.value !== newValue && thisWidget.isValid(newValue)){
      thisWidget.value = newValue;
    }
  
    thisWidget.value = newValue;

    thisWidget.announce();
    thisWidget.renderValue();
  }
}

export default BaseWidget;
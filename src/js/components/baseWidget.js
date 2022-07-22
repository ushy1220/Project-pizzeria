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

  
}

export default BaseWidget;
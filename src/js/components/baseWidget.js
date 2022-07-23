class BaseWidget{
  /* klasa nadrzędna dla innych modułów opierających się na tej klasie ale dopisujących do niej cos tylko dla sibeie */
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

    thisWidget.correctValue = initialValue;
    /* początkowa wartość widgetu w jego właściwości Value */
  }

  // METODY, KTÓRE BĘDĄ DOTYCZYĆ WSZYSTKICH WIDGETÓW

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set Value(value){
    /* SŁUŻY DO USTAWIANIA NOWYCH WARTOŚCI WIDGETU, ALE TYLKO POD WARUNKIEM, ŻE JEST TO PRAWIDŁOWA WARTOŚĆ (LICZBA Z ZAKRESU ZDEFINIOWANEGO W NASZEJ APLIKACJI) */

    const thisWidget = this;
  
    const newValue = thisWidget.parseValue(value);
  
    /* TODO: Add validation */
  
    if(thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
    }
  
    thisWidget.correctValue = newValue;

    thisWidget.announce();
    thisWidget.renderValue();
  }

  setValue(){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    /* Zajmie się przekształcaniem wartości, którą chcemy ustawić na odpowiedni typ lub formę. W przypadku widgetu daty musi to być liczba, ale to co użytkownik wpisuje na stronie jest tekstem, dlatego użyjemy funkcji parseInt  */
    return parseInt(value);
    
  }
  
  isValid(value){
    /* Będzie zwracać prawdę/fałsz w zależności od tego, czy wartość, którą chcemy ustawić dla tego widgetu jest prawidłowa wg kryterium, jakie ustawimy dla tego widgetu */

    return !isNaN(value); //sprawdza, czy value NIE jest NIELICZBĄ
  }

  renderValue(){
    /* Ta metoda służy temu, aby bieżąca wartość widgetu zostałą wyświetlona na stronie (wyrenderowana) */
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){
    const thisWidget = this;
  
    const event = new CustomEvent('updated', {
      bubbles: true                                                   //MENTOR!! ????????????????????????????????????????????
      /* używamy innego rodz. eventu, którego właściwość "Bubbles" możemy kontrolować. dzięki niej event będzie działał emitowany na tym elemencie oraz na jego rodzicu, dziadku itd aż do <body>, document, window. 
        W PRZYPADKU CUSTOM EVENTU BĄBELKOWANIE MUSIMY WŁĄCZYĆ SAMI */
  
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;


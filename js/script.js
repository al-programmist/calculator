'use strict';

(function calculator() {
 var widget = document.querySelector('.js-widget');
 var output = null;
 var keyboard = null;
 var off = null;
 var reset = null;
 var plus = null;
 var minus = null;
 var divide = null;
 var multiply = null;
 var sqrt = null;
 var equal = null;
 var buffer = 0;
 var comparator = [];

 function selectFromVirtualKeyboard(value) {
   if (Number(value) >= 0 || value === '.') {
     var virtualKeyboardSelector = document.querySelector('[data-number="' + value + '"]');

     if (virtualKeyboardSelector) {
        virtualKeyboardSelector.classList.add('on-keyboard--selected');
         setTimeout(function () {
           virtualKeyboardSelector.classList.remove('on-keyboard--selected');
         }, 300);
     }
   }
 }

 function setKeyboardValue(symbol) {
   var currentSymbol = String(symbol).trim();

   if (Number(currentSymbol) >= 0 || currentSymbol ==='.') {
     output.value = getValue(currentSymbol);
     selectFromVirtualKeyboard(symbol);
   }
 }

  function setControlValue(symbol) {
    var currentSymbol = String(symbol).trim().toLowerCase();
    var virtualControlSelector = document.querySelector('[data-action="' + currentSymbol + '"]');

    if (virtualControlSelector) {
      virtualControlSelector.classList.add('on-keyboard--selected');

      setTimeout(function () {
        virtualControlSelector.classList.remove('on-keyboard--selected');
      }, 300);
    }

    if (currentSymbol === 'delete') {
      output.value = '0';
      buffer = 0;
    }

    if (currentSymbol === 'backspace') {
      output.value = '0';
      buffer = 0;
    }

  }

 function setKeyboardOutput(event) {
   // Разрешаем: backspace, delete, tab и escape
   if ( event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 ||
           // Разрешаем: Ctrl+A
           (event.keyCode == 65 && event.ctrlKey === true) ||
           // Разрешаем: home, end, влево, вправо
           (event.keyCode >= 35 && event.keyCode <= 39) ||
           // Разрешаем десятичную точку
           (event.keyCode === 110)) {
     if(event.keyCode === 110) setKeyboardValue(event.key);
     if(event.keyCode === 46 || event.keyCode === 8) setControlValue(event.key);
     return;
   } else {
     setKeyboardValue(event.key);
     // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
     if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ) && (event.keyCode < 110 || event.keyCode > 110 )) {
       event.preventDefault();
     }
   }
 }

 function getValue(value) {
   buffer += value;

   var current = buffer.split('.');
   current = current.shift() + (current.length ? '.' + current.join('') : '');
   var split = current.split('.');

   if (split.length === 2) {
     var whole = String(Number(split[0]));
     var decimal = String(Number(split[1]));
     current = (split[1].length === 0) ? whole : whole + '.' + decimal;
   } else {
     current = String(Number(split[0]));
   }

   return current;
 }

 function resetHandler(event) {
   event.preventDefault();
   output.value = '0';
   buffer = 0;
 }


 function clickKeyboardNumberHandler(event) {
   event.preventDefault();
   var currentButton = event.target.closest('button');

   if (currentButton) {
     var currentButtonValue = String(currentButton.dataset.number);
     output.value = getValue(currentButtonValue);
   }
 }

 function disableCalculator() {
   output.value = '0';
   buffer = 0;
   comparator = [];
   output.toggleAttribute('disabled');
   reset.toggleAttribute('disabled');
   plus.toggleAttribute('disabled');
   minus.toggleAttribute('disabled');
   divide.toggleAttribute('disabled');
   multiply.toggleAttribute('disabled');
   sqrt.toggleAttribute('disabled');
   equal.toggleAttribute('disabled');

   keyboard.forEach(function (button){
     button.toggleAttribute('disabled');
   })
 }

 function triggerOnOff(event) {
   event.preventDefault();
   disableCalculator();
 }

 function setComparator() {
   var currentValue = Number(buffer);
   // output.value = '0';
   comparator.push(currentValue);
   buffer = 0;
 }

 function makeSum() {
   var result = 0;
   setComparator();
   comparator.forEach(function (value){
     result += value;
   });

  return result;
 };

 function plusHandler(event) {
   event.preventDefault();
   output.value = makeSum();
 }

 function init() {
   if(!widget) return false;

   output = widget.querySelector('.js-screen-input');
   keyboard = widget.querySelectorAll('.js-widget-number');
   off = widget.querySelector('.js-widget-off');
   reset = widget.querySelector('.js-widget-reset');
   plus = widget.querySelector('.js-widget-plus');
   minus = widget.querySelector('.js-widget-minus');
   divide = widget.querySelector('.js-widget-divide');
   multiply = widget.querySelector('.js-widget-multiply');
   sqrt = widget.querySelector('.js-widget-sqrt');
   equal = widget.querySelector('.js-widget-equal');


   widget.addEventListener('reset', resetHandler);
   off.addEventListener('click', triggerOnOff);
   plus.addEventListener('click', plusHandler);
   // minus.addEventListener('click', minusHandler);
   // divide.addEventListener('click', divideHandler);
   // multiply.addEventListener('click', multiplyHandler);
   // sqrt.addEventListener('click', sqrtHandler);
   // equal.addEventListener('click', equalHandler);

   keyboard.forEach(function (value){
     value.addEventListener('click', clickKeyboardNumberHandler);
   });

   document.addEventListener('keydown', setKeyboardOutput);
 }

  var onLoadHandler = function () {
    init();
  };

  window.addEventListener('load', onLoadHandler);
})();



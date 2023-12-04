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
  var comparator = {
    numbers: [],
    action: '',
    result: 0,
    complete: false
  };

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

    if (Number(currentSymbol) >= 0 || currentSymbol === '.') {
      output.value = getValue(currentSymbol);
      selectFromVirtualKeyboard(symbol);
    }
  }

  function clear() {
    output.value = '0';
    buffer = 0;
    comparator = {
      numbers: [],
      action: '',
      result: 0,
      complete: false
    };
  }

  function setControlValue(symbol) {

    var currentSymbol = String(symbol).trim().toLowerCase();
    var virtualControlSelector = document.querySelector('[data-action="' + currentSymbol + '"]');

    if (currentSymbol === 'delete') clear();
    if (currentSymbol === 'backspace') toggleCalculator();
    if (currentSymbol === '+') doActionSum();
    if (currentSymbol === '-') doActionDiff();
    if (currentSymbol === '*') doActionMultiply();
    if (currentSymbol === '/') doActionDivide();
    if (currentSymbol === 'enter') {
      virtualControlSelector = document.querySelector('[data-action="equal"]');
      doActionEqual();
    }

    if (virtualControlSelector) {
      virtualControlSelector.classList.add('on-keyboard--selected');

      setTimeout(function () {
        virtualControlSelector.classList.remove('on-keyboard--selected');
      }, 300);
    }
  }

  function setKeyboardRoutes(event) {
    // Разрешаем: backspace, delete, tab и escape
    if (event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 ||
            // Разрешаем: Ctrl+A
            (event.keyCode === 65 && event.ctrlKey === true) ||
            // Разрешаем: home, end, влево, вправо
            (event.keyCode >= 35 && event.keyCode <= 39) ||
            // Разрешаем десятичную точку
            (event.keyCode === 111 ||event.keyCode === 109 || event.keyCode === 110 || event.keyCode === 107 || event.keyCode === 106)) {
      if (event.keyCode === 110) setKeyboardValue(event.key);
      if (event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 106 || event.keyCode === 111) setControlValue(event.key);
      return false;
    } else {
      setKeyboardValue(event.key);
      // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
      if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && (event.keyCode < 110 || event.keyCode > 110)) {
        event.preventDefault();
      }
    }
  }

  function getValue(value) {
    var currentValue;
    currentValue = (value !== '+/-') ? String(getNumericValue(value)) : String((-1) * Number(output.value));
    return currentValue;
  }

  function getNumericValue(value) {
    var current = '';
    if (value !== '+/-') {
      buffer += value;
      current = buffer.split('.');
      current = current.shift() + (current.length ? '.' + current.join('') : '');
      var split = current.split('.');

      if (split.length === 2) {
        var whole = String(Number(split[0]));
        var decimal = String(Number(split[1]));
        current = (split[1].length === 0) ? whole : whole + '.' + decimal;
        current = Number(current);
      } else {
        current = Number(split[0]);
      }
      return Number(current);
    }
  }

  function doActionEqual() {
    var currentValue = Number(output.value);
    var result = 0;

    if (!comparator.complete) {
      if (comparator.action === 'plus') {
        result = Number(comparator.result) + currentValue;
      }

      if (comparator.action === 'minus') {
        result = Number(comparator.result) - currentValue;
      }

      if (comparator.action === 'multiply') {
        result = Number(comparator.result) * currentValue;
      }

      if (comparator.action === 'divide') {
        result = Number(comparator.result) / currentValue;

        if (currentValue === 0) result = 'error';
      }

      if (comparator.action === 'sqrt') {
        result = comparator.result;
      }

      comparator.result = (result !== 'error') ? Number(result) : 'error';
      comparator.complete = true;
      comparator.numbers = [];
      output.value = result;
    }

    return true;
  }

  function resetHandler(event) {
    event.preventDefault();
    clear();
  }

  function equalHandler(event) {
    event.preventDefault();
    doActionEqual();
  }


  function clickKeyboardNumberHandler(event) {
    event.preventDefault();
    var currentButton = event.target.closest('button');

    if (currentButton) {
      var currentButtonValue = String(currentButton.dataset.number).trim();
      output.value = getValue(currentButtonValue);
    }
  }

  function toggleCalculator() {
    clear();
    output.toggleAttribute('disabled');
    reset.toggleAttribute('disabled');
    plus.toggleAttribute('disabled');
    minus.toggleAttribute('disabled');
    divide.toggleAttribute('disabled');
    multiply.toggleAttribute('disabled');
    sqrt.toggleAttribute('disabled');
    equal.toggleAttribute('disabled');

    keyboard.forEach(function (button) {
      button.toggleAttribute('disabled');
    })
  }

  function triggerOnOff(event) {
    event.preventDefault();
    toggleCalculator();
  }

  function setComparator(action) {
    var currentValue = Number(output.value);
    buffer = 0;
    comparator.action = action;

    if (!comparator.complete) {
      comparator.numbers.push(currentValue);
      comparator.complete = false;
    }

    if (comparator.complete) {
      comparator.numbers[0] = comparator.result;
      comparator.complete = false;
    }
  }

  function doActionSum() {
    var result = 0;
    setComparator('plus');

    comparator.numbers.forEach(function (value) {
      result += value;
    });
    comparator.result = result;
    return result;
  }

  function doActionMultiply() {
    var result = 1;
    setComparator('multiply');

    comparator.numbers.forEach(function (value) {
      result *= value;
    });
    comparator.result = result;
    return result;
  }

  function doActionDiff() {
    setComparator('minus');
    var result = Number(comparator.numbers[0]);
    for (var i = 1; i < comparator.numbers.length; i++) {
      result -= comparator.numbers[i];
    }

    comparator.result = result;
    return result;
  }

  function setError(_result) {
    if (_result === 'error') {
      clear();
      comparator.result = 'error';
      return 'error';
    }
  }

  function doActionDivide() {
    setComparator('divide');
    var result = Number(comparator.numbers[0]);
    var value = 0;

    for (var i = 1; i < comparator.numbers.length; i++) {
      value = comparator.numbers[i];

      result = (value === 0) ? 'error' : (result / value);
      if (result === 'error') break;
    }

    setError(result);

    comparator.result = result;
    return result;
  }

  function doActionSqrt() {
    setComparator('sqrt');
    var result = Number(comparator.numbers[0]);
    var value = 0;

    for (var i = 0; i < comparator.numbers.length; i++) {
      value = comparator.numbers[i];
      result = (value >= 0) ? Math.sqrt(value) : 'error';
    }

    setError(result);
    comparator.result = result;

    return result;
  }


  function minusHandler(event) {
    event.preventDefault();
    output.value = doActionDiff();
  }

  function plusHandler(event) {
    event.preventDefault();
    output.value = doActionSum();
  }

  function multiplyHandler(event) {
    event.preventDefault();
    output.value = doActionMultiply();
  }

  function divideHandler(event) {
    event.preventDefault();
    output.value = doActionDivide();
  }

  function sqrtHandler(event) {
    event.preventDefault();
    output.value = doActionSqrt();
  }

  function init() {
    if (!widget) return false;

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
    minus.addEventListener('click', minusHandler);
    equal.addEventListener('click', equalHandler);
    multiply.addEventListener('click', multiplyHandler);
    divide.addEventListener('click', divideHandler);
    sqrt.addEventListener('click', sqrtHandler);

    keyboard.forEach(function (value) {
      value.addEventListener('click', clickKeyboardNumberHandler);
    });

    document.addEventListener('keydown', setKeyboardRoutes);
  }

  var onLoadHandler = function () {
    init();
  };

  window.addEventListener('load', onLoadHandler);
})();



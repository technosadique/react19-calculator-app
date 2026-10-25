
import { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');

  // Enter a number
  function inputDigit(digit) {
    if (display === 'Error') {
      setDisplay(digit);
      setExpression('');
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }

  // Enter a decimal point
  function inputDecimal() {
    if (display === 'Error' || waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }

  // Perform a calculation
  function calculate(a, b, op) {
    switch (op) {
      case '+':
        return a + b;
      case '−':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? null : a / b;
      default:
        return b;
    }
  }

  // Select an operator
  function chooseOperator(nextOperator) {
    if (display === 'Error') return;

    const inputValue = Number(display);

    if (operator && !waitingForOperand) {
      const result = calculate(firstValue, inputValue, operator);

      if (result === null || !Number.isFinite(result)) {
        setDisplay('Error');
        setFirstValue(null);
        setOperator(null);
        setExpression('');
        setWaitingForOperand(true);
        return;
      }

      const formatted = formatResult(result);
      setDisplay(formatted);
      setFirstValue(Number(formatted));
    } else {
      setFirstValue(inputValue);
    }

    setOperator(nextOperator);
    setExpression(`${display} ${nextOperator}`);
    setWaitingForOperand(true);
  }

  // Calculate final result
  function handleEquals() {
    if (!operator || firstValue === null || display === 'Error') {
      return;
    }

    const secondValue = Number(display);
    const result = calculate(firstValue, secondValue, operator);

    if (result === null || !Number.isFinite(result)) {
      setDisplay('Error');
      setExpression(`${firstValue} ${operator} ${display} =`);
    } else {
      setExpression(`${firstValue} ${operator} ${display} =`);
      setDisplay(formatResult(result));
    }

    setFirstValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  // Avoid displaying long floating-point decimals
  function formatResult(number) {
    return String(Number(number.toPrecision(12)));
  }

  // Clear everything
  function resetCalculator() {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }

  // Remove the last digit
  function backspace() {
    if (display === 'Error') {
      resetCalculator();
      return;
    }

    if (waitingForOperand) return;

    setDisplay((current) =>
      current.length > 1 ? current.slice(0, -1) : '0'
    );
  }

  // Convert the displayed number to a percentage
  function inputPercentage() {
    if (display === 'Error') return;

    setDisplay(formatResult(Number(display) / 100));
    setWaitingForOperand(true);
  }

  // Change the sign
  function toggleSign() {
    if (display === 'Error' || Number(display) === 0) return;

    setDisplay((current) =>
      current.startsWith('-') ? current.slice(1) : '-' + current
    );
  }

  const buttons = [
    { label: 'AC', action: resetCalculator, type: 'utility' },
    { label: '⌫', action: backspace, type: 'utility' },
    { label: '%', action: inputPercentage, type: 'utility' },
    { label: '÷', action: () => chooseOperator('÷'), type: 'operator' },

    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '×', action: () => chooseOperator('×'), type: 'operator' },

    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '−', action: () => chooseOperator('−'), type: 'operator' },

    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', action: () => chooseOperator('+'), type: 'operator' },

    { label: '±', action: toggleSign, type: 'utility' },
    { label: '0', action: () => inputDigit('0') },
    { label: '.', action: inputDecimal },
    { label: '=', action: handleEquals, type: 'equals' }
  ];

  return (
    <main className="calculator-page">
      <div className="calculator">
        <h1>Calculator</h1>

        <div className="calculator-display">
          <div className="expression">
            {expression || '\u00A0'}
          </div>

          <div className="display-value" aria-live="polite">
            {display}
          </div>
        </div>

        <div className="calculator-buttons">
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              className={`calc-button ${button.type || ''}`}
              onClick={button.action}
              aria-label={
                button.label === '⌫'
                  ? 'Backspace'
                  : button.label
              }
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;

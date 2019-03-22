// jQuery
const $ = require('./js/jquery-3.3.1.min');

// the calculator itself
const calculate = require('./js/calculatorCore').calc;

// start when the document is ready
$(document).ready(function () {
    // prepare expression for the calculation
    let expression = '2+(-log(1.8))*(8+sin(9+1-log(3+4*ln(8-6)-4))+4!/2+0.5+(1)-tan(4*5-4)+7)-cos(8)';

    // calculate it
    let result = null;
    try {
        result = calculate(expression);
    } catch (e) {
        console.log('Chyba');
    }

    // log the result of the calculation
    if (result)
        console.log(result);
});
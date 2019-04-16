// jQuery
const $ = require('./js/jquery-3.3.1.min');

// the calculator itself
const calculate = require('./js/calculatorCore').calc;

// start when the document is ready
$(document).ready(function () {
    let expressionLine = $('#expressionLine');
    let resultLine = $('#resultLine');

    let expression = '';
    let error = false;
    let result = '0';
    let ANS = '0';
    let resultDisplayed = true;

    $('.button').click(function () {
        let lineValue = $(this).data('line-value') || $(this).text();
        let exprValue = $(this).data('expr-value') || lineValue;
        let btnType = $(this).data('type') || false;

        if (btnType === 'special')
            return;
        
        if (resultDisplayed) {
            resultDisplayed = false;
            resultLine.text('');

            if (!error && btnType === 'operator') {
                resultLine.text(ANS);
                expression += ANS;
            }
        }        
        
        if (exprValue !== '=') {
            expression += exprValue;
            resultLine.text(resultLine.text() + lineValue);
            error = false;
        }
        else {
            expressionLine.text(resultLine.text() + '=');

            try {
                result = calculate(expression);
            } catch (e) {
                result = 'Někde ti chybí operand ty idiote.';
                error = true;
            }
            
            if (result === null || result.toString().includes(NaN)) {
                error = true;
                result = 'Nedefinováno';
            }
            else {
                result = result.toString();
            }
            
            if (['Máš blbě závorky ty idiote.'].includes(result))
                error = true;

            if (result.includes('e') && !error)
                result = result.replace('e', '*10^(') + ')';
            
            ANS = result;
            expression = '';

            // replace * by ×
            result = result.replace('*', '×');

            // replace . by , if this is the real result
            if (!error) 
                result = result.replace('.', ',');

            resultLine.text(result);
            resultDisplayed = true;
        }        
    });

    $('.button#btnBackspace').click(function () {
        if (resultDisplayed) {
            expression = '';
            expressionLine.text('');
            resultLine.text('');
        }

        expression = expression.substr(0, expression.length - 1);

        let rl = resultLine.text();
        resultLine.text(rl.substr(0, rl.length - 1));
    });
});
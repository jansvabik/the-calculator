/**
 * @file renderer.js
 * @brief User interactions (buttons and calculating request)
 * @author Jan Svabik (xsvabi00)
 * @author Vojtech Dvorak (xdvora3a)
 * @author Lukas Gurecky (xgurec00)
 */

// libs
const $ = require('./js/jquery-3.3.1.min');
const calculate = require('./js/calculatorCore').calc;

// define error messages
let errors = {
    'ERR:ERROR': 'Chyba.',
    'ERR:BRACKETS': 'Nesprávné uzávorkování.',
    'ERR:UNDEFINED': 'Nedefinováno.',
    'ERR:MISSINGOPERAND': 'Chybějící operand.',
    'ERR:INFINITYLOOP': 'Toto bohužel neumím spočítat.',
};

// get line content
const getLine = (line) => {
    return line.text();
};

// set line content to data
const setLine = (line, data) => {
    line.text(data);
    line.parent().scrollLeft(line.width());
};

// add data to line
const addToLine = (line, data) => {
    line.text(line.text() + data);
    line.parent().scrollLeft(line.width());
};

// transfer string into processable expression
const strToExpr = (data) => {
    return data.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'PI').replace(/e/g, 'E');
};

// transfer processable expression into pretty string
const exprToStr = (data) => {
    return data.replace('.', ',').replace('e', '×10^').replace('-', '−');
};

// no error object
const noError = () => {
    return {is: false, type: 'ERR:ERROR'};
};

// calculating and displaying variables, data and statuses
let result = '';
let resultDisplayed = false;
let errorDisplayed = false;
let M = '';

// start when the document is ready
$(document).ready(function () {
    // lines
    let expressionLine = $('#expressionLine');
    let resultLine = $('#resultLine');

    // focus the result line when the page is ready
    resultLine.focus();

    // predefine an error
    let error = noError();

    const startAgain = () => {
        result = '';
        setLine(resultLine, '');
        setLine(expressionLine, '');
        resultDisplayed = false;
        errorDisplayed = false;
        error = noError();
    };

    // keydown listener at resultLine (preventing enter from adding new line)
    resultLine.on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#btnEqual').trigger('click');
            resultLine.blur();
            return false;
        }
    });

    // keyup listener at resultLine
    resultLine.on('keyup', function (e) {
        if (e.keyCode !== 13) {        
            resultDisplayed = false;   
        }
    });

    // when any button is clicked...
    $('.button').click(function () {
        let lineValue = $(this).data('line-value') || $(this).children('span.content').text();
        let exprValue = $(this).data('expr-value') || lineValue;
        let btnType = $(this).data('type') || false;

        // if the clicked button is special type (=, common root, backspace)
        if (btnType === 'special')
            return;

        if (resultDisplayed && !errorDisplayed && btnType === 'operator') {
            //expression = result;
        }
        else if (resultDisplayed || errorDisplayed) {
            startAgain();
        }
        
        // if there was an error, restore lines
        if (error.is) {
            startAgain();
        }

        addToLine(resultLine, lineValue);
        resultDisplayed = false;
    });

    $('#btnEqual').click(function () {
        error = noError();

        if (resultLine.text() === '') {
            resultLine.text(0);
        }
        
        // put expression to expressionline (with symbol "=")
        if (!resultDisplayed)
            setLine(expressionLine, resultLine.text() + '=');
        
        // try to calculate the value
        try {
            result = String(calculate(strToExpr(getLine(resultLine))));
        } catch (e) {
            error.is = true;
            error.type = 'ERR:MISSINGOPERAND';
        }

        // if error returned, handle it
        if (String(result).includes('ERR:')) {
            error.is = true;
            error.type = result;
        }

        if (!error.is) {
            setLine(resultLine, exprToStr(result));
            resultDisplayed = true;
        }
        else {
            errorDisplayed = true;
            resultDisplayed = false;
            setLine(resultLine, errors[error.type]);
        }
    });

    $('#btnBackspace').click(function () {
        if (errorDisplayed || resultDisplayed) {
            startAgain();
            resultLine.focus();
        }
        else {
            let lineNow = getLine(resultLine);
            let lineNew = lineNow.substr(0, lineNow.length-1);
            setLine(resultLine, lineNew);

            if (lineNew.length === 0)
                resultLine.focus();
        }
    });

    $('#btnMemoryReset').click(function () {
        M = '';
    });

    $('#btnMemorySet').click(function () {
        if (!errorDisplayed && resultDisplayed)
            M = result;
    });

    $('#btnMemoryRead').click(function () {
        if (!resultDisplayed && !errorDisplayed) {
            addToLine(resultLine, exprToStr(M));
        }
    });

    $('#btnCommonRoot').click(function () {
        window.open('root.html', 'modal');
    });

    function commonRoot(n, x) {
        resultDisplayed = false;
        addToLine(resultLine, '(' + n + ')root(' + x + ')')
    }

    window.commonRoot = commonRoot;
});
/** file end */
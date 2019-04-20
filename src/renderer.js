/**
 * User interactions (buttons and sending the calculation request)
 * @module renderer
 * @author Jan Svabik (xsvabi00)
 * @author Vojtech Dvorak (xdvora3a)
 * @author Lukas Gurecky (xgurec00)
 * @version 2.0
 */

/**
 * jQuery namespace/library providing the functions for manipulating with the DOM structure and for easy access to the DOM elements.
 * @namespace
 * @license MIT
 * @see https://api.jquery.com/
 * @version 3.3.1
 * @author JS Foundation 
 * @author other contributors
 */
const $ = require('./js/jquery-3.3.1.min');

/**
 * Load the function for the expression calculating from the calculator's core
 * @const {function}
 */
const calculate = require('./js/calculatorCore').calc;

/**
 * Define error messages
 * @const {Object.String}
 * @property {String} ERR:ERROR Common error – it should not occur ever
 * @property {String} ERR:BRACKETS Bracketed incorrectly
 * @property {String} ERR:UNDEFINED Undefined result
 * @property {String} ERR:MISSINGOPERAND Missing operand in expression
 * @property {String} ERR:INFINITYLOOP Could not calculate this expression
 */
let errors = {
    'ERR:ERROR': 'Chyba.',
    'ERR:BRACKETS': 'Nesprávné uzávorkování.',
    'ERR:UNDEFINED': 'Nedefinováno.',
    'ERR:MISSINGOPERAND': 'Chybějící operand.',
    'ERR:INFINITYLOOP': 'Toto bohužel neumím spočítat.',
};

/**
 * Get content of the element (line)
 * @param {DOMElement} line Line to getting the content from
 * @return The text content (HTML structure is ignored) of the element (line)
 * @author Lukas Gurecky (xgurec00)
 * @since 2.0
 */
const getLine = (line) => {
    return line.text();
};

/**
 * Set content of the element (line)
 * @param {DOMElement} line Line to set the content in
 * @param {*} data The content to set
 * @author Lukas Gurecky (xgurec00)
 * @since 2.0
 */
const setLine = (line, data) => {
    line.text(data);
    line.parent().scrollLeft(line.width());
};

/**
 * Append content to the element (line)
 * @param {DOMElement} line Line to append the data in
 * @param {*} data The content to append
 * @author Lukas Gurecky (xgurec00)
 * @since 2.0
 */
const addToLine = (line, data) => {
    line.text(line.text() + data);
    line.parent().scrollLeft(line.width());
};

// * the properties below are set only for display pretty table in docs
/**
 * Transfer string into processable expression. Some symbols will be replaced by another symbols or strings.
 * @param {String} data String to process
 * @return String after the replacement.
 * @property {Replacement} , .
 * @property {Replacement} × *
 * @property {Replacement} ÷ /
 * @property {Replacement} − -
 * @property {Replacement} π PI
 * @property {Replacement} e E
 * @author Jan Svabik (xsvabi00)
 * @since 2.0
 */
const strToExpr = (data) => {
    return data.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'PI').replace(/e/g, 'E');
};

// * the properties below are set only for display pretty table in docs
/**
 * Transfer processable expression into the pretty string
 * @param {String} data String to process
 * @return String after the replacement.
 * @property {Replacement} . ,
 * @property {Replacement} e ×10^
 * @property {Replacement} ÷ /
 * @property {Replacement} - −
 * @author Jan Svabik (xsvabi00)
 * @since 2.0
 */
const exprToStr = (data) => {
    return data.replace('.', ',').replace('e', '×10^').replace('-', '−');
};

/**
 * Function for getting no false object.
 * @author Jan Svabik (xsvabi00)
 * @since 2.0
 * @return Object determining that there is no error. It should be assigned to the error variable in $(document).ready();
 */
const noError = () => {
    return {is: false, type: 'ERR:ERROR'};
};

/**
 * Variable for storing the result.
 */
let result = '';

/**
 * Variable for storing the information that result is displayed right now.
 */
let resultDisplayed = false;

/**
 * Variable for storing the information that error is displayed right now.
 */
let errorDisplayed = false;

/**
 * Variable for storing user's memory data.
 */
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

    /**
     * Function for reseting the whole states and data to start again.
     * @author Jan Svabik (xsvabi00)
     * @since 2.0
     */
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

        // add the data to the end of line
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

        // if there is no error, display the result
        if (!error.is) {
            setLine(resultLine, exprToStr(result));
            resultDisplayed = true;
        }

        // or display the error and save the flags
        else {
            errorDisplayed = true;
            resultDisplayed = false;
            setLine(resultLine, errors[error.type]);
        }
    });

    // backspace button clicked
    $('#btnBackspace').click(function () {
        // if error or result displayed, remove all
        if (errorDisplayed || resultDisplayed) {
            startAgain();
            resultLine.focus();
        }

        // or remove only the last character from the resultLine
        else {
            let lineNow = getLine(resultLine);
            let lineNew = lineNow.substr(0, lineNow.length-1);
            setLine(resultLine, lineNew);

            // if the length of the line is 0, focus the contenteditable line
            if (lineNew.length === 0)
                resultLine.focus();
        }
    });

    // button for reseting the memory clicked
    $('#btnMemoryReset').click(function () {
        M = '';
    });

    // button for setting the memory clicked
    $('#btnMemorySet').click(function () {
        if (!errorDisplayed && resultDisplayed)
            M = result;
    });

    // button for memory reading clicked
    $('#btnMemoryRead').click(function () {
        if (!resultDisplayed && !errorDisplayed) {
            addToLine(resultLine, exprToStr(M));
        }
    });

    // button to enter common root clicked
    $('#btnCommonRoot').click(function () {
        window.open('root.html', 'modal');
    });

    /**
     * Function that is fired by modal window for entering common root data by user.
     * @param {Number} n The level of root
     * @param {Number} x The number to calculate root from
     * @author Jan Svabik (xsvabi00)
     * @since 2.0
     */
    function commonRoot(n, x) {
        resultDisplayed = false;
        addToLine(resultLine, '(' + n + ')root(' + x + ')');
    }

    // assign the common root to window to make it accessible from child windows
    window.commonRoot = commonRoot;
});

/** file end */
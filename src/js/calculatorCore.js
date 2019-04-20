/** 
 * Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @summary Core functions of the calculator. Processing expressions and getting result.
 * @namespace core
 * @version 1.2
 * @author Jan Svabik (xsvabi00)
 * @author Vojtech Dvorak (xdvora3a)
 * @todo Move replacing functions into new module and simplify them.
 */
let core = {};

/** 
 * Mathematical library (load the unit functions, e.g. adding, subtracting, multiplying, dividing, factorizing, logarithm calculating, root calculating, power calculating, goniometric functinos, hyperbolic functions)
 * @const {Module}
 * @ignore
 */
const math = require('./math.lib');

/**
 * Library for processing big numbers (used for transforming scientific notations into long string)
 * @const {Module}
 * @ignore
 * @todo Write new mathematical library to prevent the requirement to transforming the numbers.
 */
const Big = require('./big');

/**
 * Load regular expressions for extracting parts of the mathematical expression. Allow e.g. extracting the root arguments – (n)root(x), factorial argument in brackets – (6)!, checking simple expressions etc.
 * @const {Object}
 * @namespace
 */
const regex = require('./calculatorRegex');

/**
 * Defining the maximum decimal places in results. This is used when the whole expression is calculated and it is above returning back from this module.
 * @const {Number}
 */
core.maxDecimalPrecision = 10; /** < maximum decimal places in final results */

/**
 * The main function - do the calculation of the whole expression
 * @summary Doing the whole calculation of the given expression.
 * @param {String} expr Expression to calculate
 * @return {Number} Result of the calculation (number), or null if there was some error or mistake in expression
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @version 1.1
 * @example
 * // returns 39916808,27
 * calculate('3+11!-3(sin(4)-1)');
 * @example
 * // returns 11,79689967
 * calculate('4log(8-sin(11.4543))+4!/3');
 */
core.calculate = (expr) => {
    // check the number of left and right brackets
    if (core.bracketsError(expr)) {
        return 'ERR:BRACKETS';
    }

    // replace constants, RANDs, multiplying as a default operator
    expr = core.startReplacement(expr);

    // if the only expression is the number, this number is the result
    if (!isNaN(expr)) {
        return Number(expr);
    }

    // the calculating loop
    let steps = 0;
    let previousIterationExpression = '';
    while (true) {
        expr = core.replaceFunctionExpression(expr); // handle functions
        expr = core.replaceRootExpression(expr); // handle roots
        expr = core.replaceBracketFactorial(expr); // handle factorized brackets
        expr = core.replaceBracketPower(expr); // handle powered brackets
        expr = core.replaceSimpleExpression(expr); // handle simple expressions
        expr = core.handleConstants(expr); // handle constants
        expr = core.plusMinusAxiom(expr); // handle +- operator mix

        // if the expr is a number, end the loop
        if (!isNaN(expr) || core.isSimpleExpression(expr) || expr.includes('NaN')) {
            break;
        }
        
        // this cannot be calculated
        if (steps % 100 === 0 && expr == previousIterationExpression) {
            return 'ERR:INFINITYLOOP';
        }

        // save this iteration result
        previousIterationExpression = expr;
        steps++;
    }

    // calculate the last simple expression if expr is simple expression
    if (!expr.includes('NaN') && isNaN(expr)) {
        expr = core.calculateSimpleExpression(core.splitSimpleExpression(expr));
    }

    // if there was NaN in the expression, some calculation had an undefined result
    if (expr.includes('NaN')) {
        return 'ERR:UNDEFINED';
    }
    
    // return the number with predefined maximal decimal precision
    expr = core.removeEType(expr);
    return Number(Number(expr).toPrecision(core.maxDecimalPrecision));
};

/**
 * Function for checking if there is the same number of left brackets as of right brackets and checking that there is no moment when more brackets are closed than opened.
 * @summary Checking correctness of brackets in expression.
 * @param {String} expr Expression to check
 * @return {Boolean} true, if there is error with brackets, or false if not
 * @author Vojtech Dvorak (xdvora3a)
 * @since 1.1
 * @example
 * // returns true
 * bracketsError('3+(14-sin(3)');
 * @example
 * // returns false
 * bracketsError('3+(14-sin(3))');
 */
core.bracketsError = (expr) => {
    let leftBrackets = (expr.match(/\(/g) || []).length;
    let rightBrackets = (expr.match(/\)/g) || []).length;

    // the starting depth (0 = no brackets)
    let depth = 0;

    // count the brackets
    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (char === '(')
            depth++;
        else if (char === ')')
            depth--;

        // if there were more closing brackets than the opening, return true (error)
        if (depth < 0)
            return true;
    }

    // return true (error) if the number of opening and closing brackets is not the same
    if (leftBrackets !== rightBrackets)
        return true;

    // no error
    return false;
};

/**
 * Function for doing the first replacements (constants are replaced by its value, RANDs are replaced by generated number, multiplying is set up as the default operator)
 * @summary Do the basic replacements (constants, RANDs, set * symbol as default operator).
 * @param {String} expr Expression to do the basic replacement in
 * @return {String} Expression after the replacement
 * @author Jan Svabik (xsvabi00)
 * @since 1.0
 * @example
 * // returns 2.718281828-2*(33-2*3.141592654)
 * startReplacement('E-2(33-2PI)');
 * @example
 * // returns 3*3.141592654*0.9040858876-2.718281828*3.141592654
 * startReplacement('3RANDPI-EPI');
 */
core.startReplacement = (expr) => {
    // replace mathematical constants
    expr = expr.replace(regex.constants.E, '(' + math.E + ')');
    expr = expr.replace(regex.constants.PI, '(' + math.PI + ')');

    // remove white space
    expr = expr.replace(/\s/g, '');
    
    // replace all RANDs by random integers from <0;1) interval
    while (expr.includes('RAND')) {
        expr = core.setRANDs(expr);
    }
    
    // set multiplying as a default operator
    expr = core.setMultiplyingAsDefaultOperator(expr);

    // remove scientific notation
    expr = core.removeEType(expr);

    return expr;
};

/**
 * Function that add the multiplication symbol (*) as a default operator between brackets, constants and functions to do the default operation – multiplying.
 * @summary Function for adding multiplication * symbol as a default operator
 * @param {String} expr Expression to add multiplication symbol in
 * @return {String} The expression with added * symbol e.g. between brackets or before functions
 * @author Jan Svabik (xsvabi00)
 * @since 1.1
 * @example
 * // returns 3*log(2)
 * setMultiplyingAsDefaultOperator('3log(2)');
 * @example
 * // returns (4)*3*log(10)
 * setMultiplyingAsDefaultOperator('(4)3log(10)');
 */
core.setMultiplyingAsDefaultOperator = (expr) => {
    const me = regex.multiplyingReplacementNumberStart.exec(expr) || regex.multiplyingReplacementNumberEnd.exec(expr);
    if (me === null)
        return expr;

    let frontpart = expr.substr(0, me.index);
    let backpart = expr.substr(me.index).replace(me[0], me[1] + '*' + me[2]);

    return core.setMultiplyingAsDefaultOperator(frontpart + backpart);
};

/**
 * Function for replacing all scientific notations (recursively) from the expression string.
 * @summary Function for adding multiplication * symbol as a default operator
 * @param {String} expr Expression to replace scientific notations in
 * @return {String} The expression with scientific notations replaced by the *10^ notation
 * @author Jan Svabik (xsvabi00)
 * @since 1.0
 * @example
 * // returns 2.345*10^-4
 * removeEType('2.345e-4');
 */
core.removeEType = (expr) => {
    let eType = regex.eType.exec(expr);
    if (eType == null)
        return expr;

    let frontpart = expr.substr(0, eType.index);
    let backpart = expr.substr(eType.index).replace(eType[0], '*10^' + eType[1]);

    expr = frontpart + backpart;

    return core.removeEType(expr);
};

/**
 * Function replaces all the 'RAND' keywords in expression by random numbers from the <0;1) interval. The generated numbers are putted into brackets.
 * @summary Replace RAND keywords by random numbers.
 * @generator
 * @param {String} expr Expression to replace 'RAND' in
 * @return {String} Expression with 'RAND's replaced by random numbers
 * @author Vojtech Dvorak (xdvora3a)
 * @since 1.0
 * @example
 * // returns e.g. (0.3201196502)(0.7593763115)
 * setRANDs('RANDRAND');
 * @example
 * // returns e.g. (0.3201196502)-2(0.7593763115)
 * setRANDs('RAND-2RAND');
 */
core.setRANDs = (expr) => {
    expr = expr.replace('RAND', '(' + Math.random() + ')');
    return expr;
};

/**
 * Function calculates and replaces simple expressions in brackets in expression 'expr' by the calculated result. Simple expressions are these expressions that contains only numbers with operators +, -, *, /, ^, !.
 * @summary Replace simple expression by its value which is calculated.
 * @param {String} expr Expression to check and replace simple expressions in
 * @return {String} Expression with simple expressions replaced
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns (3+2*(5)-sin(3))
 * replaceSimpleExpression('(3+2*(6-1)-sin(3))');
 * @example
 * // returns (12.5)
 * replaceSimpleExpression('(3+2*(6-1)-0.5)');
 */
core.replaceSimpleExpression = (expr) => {
    expr = core.removeEType(expr);

    // if there is no simple expression, return the expression
    let simpleExprArray = regex.simpleExpression.exec(expr);
    if (simpleExprArray === null)
        return expr;
        
    const simpleExpr = simpleExprArray[0].substr(1, simpleExprArray[0].length-2);

    // if the expression is constant, continue
    if (!isNaN(simpleExpr))
        return expr;

    const calculatedSimpleExpr = core.calculateSimpleExpression(core.splitSimpleExpression(simpleExpr));
    expr = expr.replace('(' + simpleExpr + ')', '(' + calculatedSimpleExpr + ')');

    return core.replaceSimpleExpression(expr);
};

/**
 * Function calculates and replaces function expressions in expression 'expr' by the calculated result.
 * @summary Function replaces function expressions in expression 'expr'
 * @param {String} expr Expression to check and replace function expressions in
 * @return {String} Expression with function expressions replaced
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 */
core.replaceFunctionExpression = (expr) => {
    expr = core.removeEType(expr);

    // if there is no root, return the expression
    let functionArray = regex.function.exec(expr);
    if (functionArray === null)
        return expr;

    const functionExpr = functionArray[0]; // first match
    const parsedFunctionExpr = core.parseFunctionExpression(functionExpr);
    const calculated = core.calculateFunction(parsedFunctionExpr);
    expr = expr.replace(functionExpr, '(' + calculated + ')');

    return core.replaceFunctionExpression(expr);
};

/**
 * Function extracts function name and function value from the expression of 'sin(12345)' type and returns array with splitted data. It must be guaranteed that the expression is in the expected format.
 * @summary Function extracts and return functio name and function value separately.
 * @param {String} expr Function expression to parse
 * @return {Array.<String, Number>} Array with function name and value: [functionName, functionValue]
 * @author Vojtech Dvorak (xdvora3a)
 * @since 0.1
 * @example
 * // returns ['cos', '3.14']
 * parseFunctionExpression('cos(3.14)');
 */
core.parseFunctionExpression = (expr) => {
    const splitExpr = expr.split('(');
    const functionName = splitExpr[0];
    const value = splitExpr[1].substr(0, splitExpr[1].length-1);

    return [functionName, Number(value)];
};

/**
 * Function calculate the value of parsed function (info array).
 * @summary Calculate the result value of function with its value.
 * @param {Array<String,Number>} parsedExpression Parsed function expression to calculate
 * @return {Number} Calculated value of the function specified.
 * @author Vojtech Dvorak (xdvora3a)
 * @since 0.1
 * @todo Change argument into two (functionName, value) and make corresponding changes of the parseFunctionExpression() function.
 * @example
 * // returns 1
 * parseFunctionExpression(['log', 10]);
 */
core.calculateFunction = (parsedExpression) => {
    const functionName = parsedExpression[0];
    const value = parsedExpression[1];

    // call matching function
    if (functionName === 'log')
        return math.log(value);
    if (functionName === 'ln')
        return math.ln(value);
    if (functionName === 'sin')
        return math.sin(value);
    if (functionName === 'cos')
        return math.cos(value);
    if (functionName === 'tan')
        return math.tan(value);
    if (functionName === 'sinh')
        return math.sinh(value);
    if (functionName === 'cosh')
        return math.cosh(value);
    if (functionName === 'tanh')
        return math.tanh(value);
    if (functionName === 'cotan')
        return math.cotan(value);
};

/**
 * Function calculates and replaces root expressions in expression 'expr' by the calculated result.
 * @summary Function replaces root expressions in expression 'expr'.
 * @param {String} expr Expression to check and replace root expressions in
 * @return {String} Expression with root expressions replaced
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns 5
 * replaceRootExpression('(3)root(125)');
 */
core.replaceRootExpression = (expr) => {
    expr = core.removeEType(expr);

    // if there is no root, return the expression
    let roots = regex.root.exec(expr);
    if (roots === null)
        return expr;

    let frontpart = expr.substr(0, roots.index);
    let backpart = expr.substr(roots.index).replace(roots[0], math.root(Number(roots[2]), Number(roots[1])));

    return core.replaceRootExpression(frontpart + backpart);
};

/**
 * Function calculates and replaces factorial of bracket with constant in expression 'expr' by the calculated result.
 * @summary Function replaces (n)! expression in expression 'expr' by the value.
 * @param {String} expr Expression to check and replace (n)! expressions in
 * @return {String} Expression with factorized brackets content replaced
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns 3+6
 * replaceBracketFactorial('3+(3)!');
 * @example
 * // returns 2*(3+4)!-NaN
 * replaceBracketFactorial('2*(3+4)!-(3.1)!');
 */
core.replaceBracketFactorial = (expr) => {
    expr = core.removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let bracketedFactorials = regex.bracketFactorial.exec(expr);
    if (bracketedFactorials === null)
        return expr;

    let frontpart = expr.substr(0, bracketedFactorials.index);
    let backpart = expr.substr(bracketedFactorials.index).replace(bracketedFactorials[0], math.factorize(Number(bracketedFactorials[1])));

    return core.replaceBracketFactorial(frontpart + backpart);
};

/**
 * Function calculates and replaces power of bracket with the value in expression 'expr' by the calculated result.
 * @summary Function replaces (x)^n expression in expression 'expr' by the value.
 * @param {String} expr Expression to check and replace (x)^n expressions in
 * @return {String} Expression with powered brackets content replaced
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns 2*9
 * replaceBracketPower('2*(3)^3');
 */
core.replaceBracketPower = (expr) => {
    expr = core.removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let bracketPowerArray = regex.bracketPower.exec(expr);
    if (bracketPowerArray === null)
        return expr;

    let frontpart = expr.substr(0, bracketPowerArray.index);
    let backpart = expr.substr(bracketPowerArray.index).replace(bracketPowerArray[0], math.power(Number(bracketPowerArray[1]), Number(bracketPowerArray[3])));

    return core.replaceBracketFactorial(frontpart + backpart);
};

/**
 * Function replaces constants in brackets with the value in the brackets (with the constant itself) so the brackets are removed after calling this function.
 * @summary Remove brackets around constants in expression.
 * @param {String} expr Expression to check and remove brackets around constants.
 * @return {String} Expression without brackets around constants
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns 8+16.333*11-2
 * handleConstants('8+(16.333)*11-(2)');
 */
core.handleConstants = (expr) => {
    expr = core.removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let constants = regex.constant.exec(expr);
    if (constants === null)
        return expr;

    let frontpart = expr.substr(0, constants.index);
    let backpart = expr.substr(constants.index).replace(constants[0], constants[1]);

    return core.handleConstants(frontpart + backpart);
};

/**
 * Function for determining that some expression is simple expression from its start to its end. Simple expressions are expressions that contains only numbers with these operators only: +, -, *, /, ^, !.
 * @summary Check that the whole expression is simple expression.
 * @param {String} expr Expression to check for being the simple expression
 * @return {Boolean} true, if the expression 'expr' is simple expression, or false 
 * @author Jan Svabik (xsvabi00)
 * @since 1.1
 * @example
 * // returns true
 * isSimpleExpression('8+16.333*-0.11-8^16.2');
 * @example
 * // returns false
 * isSimpleExpression('8+(16.333)*11-(2)');
 * isSimpleExpression('8+sin(16.333)');
 */
core.isSimpleExpression = (expr) => {
    return regex.fullSimpleExpression.test(expr);
};

/**
 * Function for splitting simple expression into calculable array by our mathematical library.
 * @summary Parse simple mathematic expression into array to calculate (+, -, *, /, ^, !)
 * @param {String} expr Expression to split
 * @return {Array} splitted expression into processable array
 * @author Vojtech Dvorak (xdvora3a)
 * @since 0.1
 */
core.splitSimpleExpression = (expr) => {
    expr = core.plusMinusAxiom(expr);

    // do the replacement
    expr = expr.replace('*+', '*');
    expr = expr.replace('/+', '/');
    expr = expr.replace('^+', '^');
    expr = expr.replace('*-', '*N');
    expr = expr.replace('/-', '/N');
    expr = expr.replace('^-', '^N');

    return core.splitArrayOfExpressions([expr])[0];
};

/**
 * Function for removing sequences of + and - symbols by its final value (e.g. -- => +, ++-- => +, +--- => -)
 * @summary Applying plus-minus axiom.
 * @param {String} expr Expression to check and modify
 * @return {String} Modified expression 'expr'.
 * @author Vojtech Dvorak (xdvora3a)
 * @since 0.1
 * @example
 * // returns 8+2-11-sin(2)
 * plusMinusAxiom('8--2++-11----+-sin(2)');
 */
core.plusMinusAxiom = (expr) => {
    expr = expr.replace('++', '+');
    expr = expr.replace('+-', '-');
    expr = expr.replace('-+', '-');
    expr = expr.replace('--', '+');
    
    if (expr.includes('++') || expr.includes('+-') || expr.includes('-+') || expr.includes('--'))
        return core.plusMinusAxiom(expr);
    return expr;
};

/**
 * This function do the splitting of every simple expression that has to be calculated. It should get prepared expression array (array with only element – the whole simple expression). Than this will be splitted recursively until all operators will be used. The returned array is calculable by calculateSimpleExpression() function then.
 * @summary The final preparation before any simple expression is really calculated.
 * @param {Array<(String|Number)>} exprArray The array with expressions to be prepared for the calculation
 * @param {Boolean|String} operatorBefore If this is recursive call, the operator of the previous splitting, or false
 * @param {Boolean|String} exprBefore If this is recursive call, the previously splitted expression, or false
 * @return {Array} Processable array for the calculateSimpleExpression() function
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // 1st iteration ['+', '8*3-22', 3, '3/1', '5/N2']
 * // 2nd iteration ['+', ['-', '8*3', 22], 3, '3/1', '5/N2']
 * // 3rd iteration ['+', ['-', ['*', 8, 3], 22], 3, '3/1', '5/N2']
 * // 4rd iteration ['+', ['-', ['*', 8, 3], 22], 3, ['/', 3, 1], ['/', 5, -2]]
 * // returns       ['+', ['-', ['*', 8, 3], 22], 3, ['/', 3, 1], ['/', 5, -2]]
 * splitArrayOfExpressions('8*3-22+3+3/1+5/N2');
 * // repl. before calling this func. -----^
 */
core.splitArrayOfExpressions = (exprArray, operatorBefore = false, exprBefore = false) => {
    // handle situation when the previous usage of this function splitted the expression by '-' and the '-' symbol was at the beginning of the expression
    if (operatorBefore === '-' && exprBefore[0] === '-')
        exprArray[1] = 'N' + exprArray[1];

    // check each exprArray element
    for (let i = 0; i < exprArray.length; i++) {
        const expr = exprArray[i];
        const operator = core.operatorContainmentCheck(expr);

        // there is no operator and the element is number, check the negation
        if (!operator && expr.length > 0)
            exprArray[i] = expr[0] !== 'N' ? Number(expr) : -Number(expr.substr(1));

        // this element is another expression, split it into another calculable array
        else if (expr.length > 1)
            exprArray[i] = core.splitArrayOfExpressions([operator, ...expr.split(operator)], operator, expr);

        // junk element
        else if (expr.length === 0)
            delete(exprArray[i]);
    }

    // return filtered array (null, false, undefined will be removed, 0 will stay inside)
    return exprArray.filter(i => i || i === 0);
};

/**
 * Check if expression contains one of the operators defined and get this operator or false.
 * @summary Function checks, if some expression contains one of the operators defined
 * @param {String} expr The expression to find operator in.
 * @return {String|Boolean} First operator found in expression 'expr', or false.
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns '-'
 * operatorContainmentCheck('3*4-5');
 * @example
 * // returns false
 * operatorContainmentCheck('345');
 */
core.operatorContainmentCheck = (expr) => {
    const operators = ['+', '-', '*', '/', '^', '!'];
    for (let i = 0; i < operators.length; i++)
        if (expr.includes(operators[i]))
            return operators[i];

    return false;
};

/**
 * Do the calculation of parsed simple expression into array calculable by this function. Go recursively through the array until some object (array) does not include any other object (array). Calculate the result of the operation represented by the array and replace the calculated array in the parent by the calculated value until there will be no object (array) to calculate.
 * @summary Calculate simple expression parsed into the array calculable by this function.
 * @param {Array.<(Number|String)>} parsedSimpleExpression Array made of the parsed expressions to calculate.
 * @return {String} The result of the calculation in string.
 * @author Jan Svabik (xsvabi00)
 * @since 0.1
 * @example
 * // returns 5.5
 * calculateSimpleExpression(['+', ['-', ['*', 8, 3], 22], 3, ['/', 3, 1], ['/', 5, -2]]);
 */
core.calculateSimpleExpression = (parsedSimpleExpression) => {
    const operation = parsedSimpleExpression[0];
    parsedSimpleExpression.shift();

    for (let i = 0; i < parsedSimpleExpression.length; i++) {
        const item = parsedSimpleExpression[i];
        if (typeof item === 'object')
            parsedSimpleExpression[i] = core.calculateSimpleExpression(item);
    }

    if (operation === '+')
        return core.numberToString(math.add(parsedSimpleExpression));
    if (operation === '-')
        return core.numberToString(math.subtract(parsedSimpleExpression));
    if (operation === '*')
        return core.numberToString(math.multiply(parsedSimpleExpression));
    if (operation === '/')
        return core.numberToString(math.divide(parsedSimpleExpression));
    if (operation === '^')
        return core.numberToString(math.power(parsedSimpleExpression[0], parsedSimpleExpression[1]));
    if (operation === '!')
        return core.numberToString(math.factorize(parsedSimpleExpression[0]));
};

/**
 * Function for removing the scientific notation from the number using the Big.js module (library)
 * @summary Removing the scientific notation
 * @param {Number|String} num The number with scientific notation
 * @return {String} The original number if not in scientific notation or the original number without the scientific notation.
 * @author Jan Svabik (xsvabi00)
 * @since 1.2
 */
core.numberToString = (num) => {
    // convert to string
    num = String(num);

    // if the number is in scientific notation, convert into the long string
    if (num.includes('e'))
        return (new Big(num)).toFixed(200);

    return num;
};

module.exports = {
    calc: core.calculate,
    unit: {
        splitSimpleExpression: core.splitSimpleExpression,
        splitArrayOfExpressions: core.splitArrayOfExpressions,
        operatorContainmentCheck: core.operatorContainmentCheck,
        calculateSimpleExpression: core.calculateSimpleExpression,
        calculateFunction: core.calculateFunction,
        parseFunctionExpression: core.parseFunctionExpression,
        plusMinusAxiom: core.plusMinusAxiom,
    },
};

/** file end */
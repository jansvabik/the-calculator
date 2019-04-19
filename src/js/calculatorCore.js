/**
 * Core of the calculator
 * @file calculatorCore.js
 * @description Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @version 1.0
 * @author Jan Svabik (xsvabi00)
 * @author Vojtech Dvorak (xdvora3a)
 */

// include our mathematical library
const math = require('./math.lib'); /** < mathematical library */
const regex = require('./calculatorRegex'); /** < regular expressions for calculations */

// max decimal precision to export
const maxDecimalPrecision = 10; /** < maximum decimal places in final results */

/**
 * @brief The main function - do the calculation of the whole expression
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to calculate
 * @return Result of the calculation (number), or null if there was some error or mistake in expression
 */
const calculate = (expr) => {
    // check the number of left and right brackets
    if (bracketsError(expr)) {
        return 'ERR:BRACKETS';
    }

    // replace constants, RANDs, multiplying as a default operator
    expr = startReplacement(expr);

    // if the only expression is the number, this number is the result
    if (!isNaN(expr)) {
        return Number(expr);
    }

    // the calculating loop
    let steps = 0;
    let previousIterationExpression = '';
    while (true) {
        expr = replaceFunctionExpression(expr); // handle functions
        expr = replaceRootExpression(expr); // handle roots
        expr = replaceBracketFactorial(expr); // handle factorized brackets
        expr = replaceBracketPower(expr); // handle powered brackets
        expr = replaceSimpleExpression(expr); // handle simple expressions
        expr = handleConstants(expr); // handle constants
        expr = plusMinusAxiom(expr); // handle +- operator mix

        // if the expr is a number, end the loop
        if (!isNaN(expr) || isSimpleExpression(expr) || expr.includes('NaN')) {
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
        expr = calculateSimpleExpression(splitSimpleExpression(expr));
    }

    // if there was NaN in the expression, some calculation had an undefined result
    if (expr.includes('NaN')) {
        return 'ERR:UNDEFINED';
    }
    
    // return the number with predefined maximal decimal precision
    expr = removeEType(expr);
    return Number(Number(expr).toPrecision(maxDecimalPrecision));
};

/**
 * @brief Function checks if there is the same number of left brackets as of right brackets
 * @author Vojtech Dvorak (xdvora3a)
 * @param expr Expression to check
 * @return true, if there is error with brackets, or false if not
 */
const bracketsError = (expr) => {
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
 * @brief Function for doing the first replacements (constants, RANDs, multiplying as a def. operator)
 * @param expr Expression to do the basic replacement in 
 * @author Jan Svabik (xsvabi00)
 * @return Expression after the replacement
 */
const startReplacement = (expr) => {
    // replace mathematical constants
    expr = expr.replace(regex.constants.E, '(' + math.E + ')');
    expr = expr.replace(regex.constants.PI, '(' + math.PI + ')');
    
    // replace all RANDs by random integers from <0;1) interval
    while (expr.includes('RAND')) {
        expr = setRANDs(expr);
    }
    
    // set multiplying as a default operator
    expr = setMultiplyingAsDefaultOperator(expr);

    // remove scientific notation
    expr = removeEType(expr);

    return expr;
};

/**
 * @brief Function for adding multiplication * symbol as a default operator
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to add multiplication symbol in
 * @return The expression with added * symbol e.g. between brackets )( or before functions 3log(2)
 */
const setMultiplyingAsDefaultOperator = (expr) => {
    const me = regex.multiplyingReplacementNumberStart.exec(expr) || regex.multiplyingReplacementNumberEnd.exec(expr);
    if (me === null)
        return expr;

    let frontpart = expr.substr(0, me.index);
    let backpart = expr.substr(me.index).replace(me[0], me[1] + '*' + me[2]);

    return setMultiplyingAsDefaultOperator(frontpart + backpart);
};

/**
 * @brief Function replaces all scientific notations (recurently) from the expression string (eg. 8e-10 -> 8*10^-10)
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace scientific notations in
 * @return Expression with replaced scientific notations
 */
const removeEType = (expr) => {
    let eType = regex.eType.exec(expr);
    if (eType == null)
        return expr;

    let frontpart = expr.substr(0, eType.index);
    let backpart = expr.substr(eType.index).replace(eType[0], '*10^' + eType[1]);

    expr = frontpart + backpart;

    return removeEType(expr);
};

/**
 * @brief Function replaces string of random number 'RAND' in expression string for random number
 * @author Vojtech Dvorak (xdvora3a)
 * @param expr Expression to replace 'RAND' in
 * @return Expression with 'RAND' replaced for random number
 */
const setRANDs = (expr) => {
    expr = expr.replace('RAND', '(' + Math.random() + ')');
    return expr;
};

/**
 * @brief Function calculates and replaces simple expressions in expression 'expr' for calculated numbers
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to check and replace simple expressions in
 * @return Expression with replaced simple expressions
 */
const replaceSimpleExpression = (expr) => {
    expr = removeEType(expr);

    // if there is no simple expression, return the expression
    let simpleExprArray = regex.simpleExpression.exec(expr);
    if (simpleExprArray === null)
        return expr;
        
    const simpleExpr = simpleExprArray[0].substr(1, simpleExprArray[0].length-2);

    // if the expression is constant, continue
    if (!isNaN(simpleExpr))
        return expr;

    const calculatedSimpleExpr = calculateSimpleExpression(splitSimpleExpression(simpleExpr));
    expr = expr.replace('(' + simpleExpr + ')', '(' + calculatedSimpleExpr + ')');

    return replaceSimpleExpression(expr);
};

/**
 * @brief Function replaces function expressions in expression 'expr'
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace function expressions in
 * @return Expression with function expressions replaced
 */
const replaceFunctionExpression = (expr) => {
    expr = removeEType(expr);

    // if there is no root, return the expression
    let functionArray = regex.function.exec(expr);
    if (functionArray === null)
        return expr;

    const functionExpr = functionArray[0]; // first match
    const parsedFunctionExpr = parseFunctionExpression(functionExpr);
    const calculated = calculateFunction(parsedFunctionExpr);
    expr = expr.replace(functionExpr, '(' + calculated + ')');

    return replaceFunctionExpression(expr);
};

/**
 * @brief Function parses function expression
 * @author Vojtech Dvorak (xdvora3a)
 * @param expr Function expression to parse
 * @return Parsed function expression as array (function name, value)
 */
const parseFunctionExpression = (expr) => {
    const splitExpr = expr.split('(');
    const functionName = splitExpr[0];
    const value = splitExpr[1].substr(0, splitExpr[1].length-1);

    return [functionName, Number(value)];
};

/**
 * @brief Function calculates parsed function expressions
 * @author Vojtech Dvorak (xdvora3a)
 * @param parsedExpression Parsed function expression to calculate
 * @return Calculated parsedExpression (number)
 */
const calculateFunction = (parsedExpression) => {
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
 * @brief Function replaces root expressions in expression 'expr' to calculate
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace root expressions in
 * @return Expression with replaced root expressions
 */
const replaceRootExpression = (expr) => {
    expr = removeEType(expr);

    // if there is no root, return the expression
    let roots = regex.root.exec(expr);
    if (roots === null)
        return expr;

    let frontpart = expr.substr(0, roots.index);
    let backpart = expr.substr(roots.index).replace(roots[0], math.root(Number(roots[2]), Number(roots[1])));

    return replaceRootExpression(frontpart + backpart);
};

/**
 * @brief Function replaces bracket factiorials in expression 'expr'
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace bracket factiorials in
 * @return Expression with bracket factiorials replaced to calculate
 */
const replaceBracketFactorial = (expr) => {
    expr = removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let bracketedFactorials = regex.bracketFactorial.exec(expr);
    if (bracketedFactorials === null)
        return expr;

    let frontpart = expr.substr(0, bracketedFactorials.index);
    let backpart = expr.substr(bracketedFactorials.index).replace(bracketedFactorials[0], math.factorize(Number(bracketedFactorials[1])));

    return replaceBracketFactorial(frontpart + backpart);
};

/**
 * @brief Function replaces bracket powers in expression 'expr' to calculate
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace bracket powers in
 * @return Expression with bracket powers replaced
 */
const replaceBracketPower = (expr) => {
    expr = removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let bracketPowerArray = regex.bracketPower.exec(expr);
    if (bracketPowerArray === null)
        return expr;

    let frontpart = expr.substr(0, bracketPowerArray.index);
    let backpart = expr.substr(bracketPowerArray.index).replace(bracketPowerArray[0], math.power(Number(bracketPowerArray[1]), Number(bracketPowerArray[3])));

    return replaceBracketFactorial(frontpart + backpart);
};

/**
 * @brief Function replaces constants in brackets by the constants only (brackets removal)
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to replace constants in brackets by constants only in
 * @return Expression with constants without brackets
 */
const handleConstants = (expr) => {
    expr = removeEType(expr);

    // if there is no brackets to factorize, return the expression
    let constants = regex.constant.exec(expr);
    if (constants === null)
        return expr;

    let frontpart = expr.substr(0, constants.index);
    let backpart = expr.substr(constants.index).replace(constants[0], constants[1]);

    return handleConstants(frontpart + backpart);
};

/**
 * @brief Function checks if the expression 'expr' is simple expression
 * @author Jan Svabik (xsvabi00)
 * @param expr Expression to check
 * @return True, if the expression 'expr' is simple, or false 
 */
const isSimpleExpression = (expr) => {
    return regex.fullSimpleExpression.test(expr);
};

/**
 * @brief Function parses simple mathematic expression into array to calculate (+, -, *, /, !)
 * @author Vojtech Dvorak (xdvora3a)
 * @param expr Expression to split
 * @return Returns array 'splitted' to calculate
 */
const splitSimpleExpression = (expr) => {
    expr = plusMinusAxiom(expr);

    // do the replacement
    expr = expr.replace('*+', '*');
    expr = expr.replace('/+', '/');
    expr = expr.replace('^+', '^');
    expr = expr.replace('*-', '*N');
    expr = expr.replace('/-', '/N');
    expr = expr.replace('^-', '^N');

    return splitArrayOfExpressions([expr])[0];
};

/**
 * @brief Function for removing chain of plus or minus symbols
 * @author Vojtech Dvorak (xdvora3a)
 * @param expr Expression to check and modify
 * @return Returns modified expression 'expr'
 */
const plusMinusAxiom = (expr) => {
    expr = expr.replace('++', '+');
    expr = expr.replace('+-', '-');
    expr = expr.replace('-+', '-');
    expr = expr.replace('--', '+');
    
    if (expr.includes('++') || expr.includes('+-') || expr.includes('-+') || expr.includes('--'))
        return plusMinusAxiom(expr);
    return expr;
};

/**
 * @brief Function parses array of simple mathematic expressions into array to even more simple array
 * @author Jan Svabik (xsvabi00) 
 * @param exprArray Array of expressions to split into more simple array
 * @return Returns splitted array 'exprArray' without nulls, 0, ...
 */
const splitArrayOfExpressions = (exprArray, operatorBefore = false, exprBefore = false) => {
    if (operatorBefore === '-' && exprBefore[0] === '-')
        exprArray[1] = 'N' + exprArray[1];

    for (let i = 0; i < exprArray.length; i++) {
        const expr = exprArray[i];
        const operator = operatorContainmentCheck(expr);


        if (!operator && expr.length > 0)
            exprArray[i] = expr[0] !== 'N' ? Number(expr) : -Number(expr.substr(1));
        else if (expr.length > 1) {
            let splitted = expr.split(operator);
            exprArray[i] = splitArrayOfExpressions([operator, ...splitted], operator, expr);
        }
        else if (expr.length === 0)
            delete(exprArray[i]);
    }

    return exprArray.filter(i => i || i === 0);
};

/**
 * @brief Function checks, if some expression contains one of the operators defined
 * @author Jan Svabik (xsvabi00) 
 * @param expr Expression to check
 * @return Returns first operator found in expression 'expr', or false
 */
const operatorContainmentCheck = (expr) => {
    const operators = ['+', '-', '*', '/', '^', '!'];
    for (let i = 0; i < operators.length; i++)
        if (expr.includes(operators[i]))
            return operators[i];

    return false;
};

/**
 * @brief Function calculates simple expressions parsed to array
 * @author Jan Svabik (xsvabi00) 
 * @param parsedSimpleExpression Array made of parsed expression to calculate
 * @return Returns result of calculation
 */
const calculateSimpleExpression = (parsedSimpleExpression) => {
    const operation = parsedSimpleExpression[0];
    parsedSimpleExpression.shift();

    for (let i = 0; i < parsedSimpleExpression.length; i++) {
        const item = parsedSimpleExpression[i];
        if (typeof item === 'object')
            parsedSimpleExpression[i] = calculateSimpleExpression(item);
    }

    if (operation === '+')
        return numberToString(math.add(parsedSimpleExpression));
    if (operation === '-')
        return numberToString(math.subtract(parsedSimpleExpression));
    if (operation === '*')
        return numberToString(math.multiply(parsedSimpleExpression));
    if (operation === '/')
        return numberToString(math.divide(parsedSimpleExpression));
    if (operation === '^')
        return numberToString(math.power(parsedSimpleExpression[0], parsedSimpleExpression[1]));
    if (operation === '!')
        return numberToString(math.factorize(parsedSimpleExpression[0]));
};

/**
 * Function for removing the scientific notation from the number
 * @brief Removing the scientific notation
 * @param num The number with scientific notation
 * @bug Breaking the number precision
 * @todo Use BigInt library for calculations and remove this function
 * @author Jenny O'Reilly
 * @see https://stackoverflow.com/a/46545519
 * @see https://stackoverflow.com/revisions/46545519/1
 * @license CC-BY-SA
 */
function numberToString(num)
{
    let numStr = String(num);

    if (Math.abs(num) < 1.0)
    {
        let e = parseInt(num.toString().split('e-')[1]);
        if (e)
        {
            let negative = num < 0;
            if (negative) num *= -1;
            num *= Math.pow(10, e - 1);
            numStr = '0.' + (new Array(e)).join('0') + num.toString().substring(2);
            if (negative) numStr = "-" + numStr;
        }
    }
    else
    {
        let e = parseInt(num.toString().split('+')[1]);
        if (e > 20)
        {
            e -= 20;
            num /= Math.pow(10, e);
            numStr = num.toString() + (new Array(e + 1)).join('0');
        }
    }

    return numStr;
}

module.exports = {
    calc: calculate,
    testing: {
        splitSimpleExpression: splitSimpleExpression,
        splitArrayOfExpressions: splitArrayOfExpressions,
        operatorContainmentCheck: operatorContainmentCheck,
        calculateSimpleExpression: calculateSimpleExpression,
        calculateFunction: calculateFunction,
        parseFunctionExpression: parseFunctionExpression,
        plusMinusAxiom: plusMinusAxiom,
    },
};
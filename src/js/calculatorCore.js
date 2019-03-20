/**
 * Core of the calculator
 * 
 * @description Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @version 0.1
 */

// include our mathematical library
const math = require('./math.lib');

// parse simple mathematic expression into array to calculate (+, -, *, /, !)
const splitSimpleExpression = (expr) => {
    expr = plusMinusAxiom(expr);

    expr = expr.replace('*+', '*');
    expr = expr.replace('/+', '/');
    expr = expr.replace('*-', '*N');
    expr = expr.replace('/-', '/N');

    return splitArrayOfExpressions([expr])[0];
};

// function for removing chain of plus or minus symbols
const plusMinusAxiom = (expr) => {
    expr = expr.replace('++', '+');
    expr = expr.replace('+-', '-');
    expr = expr.replace('-+', '-');
    expr = expr.replace('--', '+');
    
    if (expr.includes('++') || expr.includes('+-') || expr.includes('-+') || expr.includes('--'))
        return plusMinusAxiom(expr);
    else
        return expr;
};

// parse array of simple mathematic expressions into array to even more simple array
const splitArrayOfExpressions = (exprArray) => {
    for (let i = 0; i < exprArray.length; i++) {
        const expr = exprArray[i];
        const operator = operatorContainmentCheck(expr);

        if (!operator && expr.length > 0)
            exprArray[i] = expr[0] !== 'N' ? Number(expr) : -Number(expr.substr(1));
        else if (expr.length > 1)
            exprArray[i] = splitArrayOfExpressions([operator, ...expr.split(operator)]);
        else if (expr.length === 0)
            delete(exprArray[i]);
    }

    return exprArray.filter(i => i);
};

// check that some expression contains one of the operators defined
const operatorContainmentCheck = (expr) => {
    const operators = ['+', '-', '*', '/'];
    for (let i = 0; i < operators.length; i++)
        if (expr.includes(operators[i]))
            return operators[i];

    return false;
};

const parseMathematicalExpression = (expr) => {
    
};

const calculateSimpleExpression = (parsedSimpleExpression) => {
    const operation = parsedSimpleExpression[0];
    parsedSimpleExpression.shift();

    for (let i = 0; i < parsedSimpleExpression.length; i++) {
        const item = parsedSimpleExpression[i];
        if (typeof item === 'object')
            parsedSimpleExpression[i] = calculateSimpleExpression(item);
    }

    if (operation === '+')
        return math.add(parsedSimpleExpression);
    if (operation === '-')
        return math.subtract(parsedSimpleExpression);
    if (operation === '*')
        return math.multiply(parsedSimpleExpression);
    if (operation === '/')
        return math.divide(parsedSimpleExpression);
};

const calculateParsedExpression = (parsedExpression) => {

};

module.exports = {
    calc: (expressionToCalculate) => {
        let expr = splitSimpleExpression(expressionToCalculate);
        return calculateSimpleExpression(expr);
    },
    testing: {
        splitSimpleExpression: splitSimpleExpression,
        splitArrayOfExpressions: splitArrayOfExpressions,
        operatorContainmentCheck: operatorContainmentCheck,
        plusMinusAxiom: plusMinusAxiom,
    },
};
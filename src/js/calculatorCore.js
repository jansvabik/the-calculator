/**
 * Core of the calculator
 * 
 * @description Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @version 0.2
 */

// include our mathematical library
const math = require('./math.lib');

const simpleExpressionRegex = /\(([0-9\.\+\-\*\/\!]*)\)/g;
const constantRegex = /(?<!log|ln|sin|cos|tan)\(([0-9\.\-]*)\)/g;
const functionRegex = /(log|ln|sin|cos|tan)\([0-9\.\-]*\)/g;

const calculate = (expr) => {
    // if the only expression is the number, this number is the result
    if (!isNaN(expr))
        return Number(expr);

    // prvni faze – vypocet zavorek, ktere neobsahuji dalsi zavorky (a tedy ani funkce)
    let simpleExprArray = expr.match(simpleExpressionRegex);
    let functionArray = expr.match(functionRegex);

    while (simpleExprArray != null || functionArray != null) {
        // calculate simple expressions
        if (simpleExprArray != null) {
            for (let i = 0; i < simpleExprArray.length; i++) {
                const simpleExpr = simpleExprArray[i].substr(1, simpleExprArray[i].length-2);

                if (!isNaN(simpleExpr))
                    continue;

                const splittedSimpleExpr = splitSimpleExpression(simpleExpr);
                const calculatedSimpleExpr = calculateSimpleExpression(splittedSimpleExpr);
                expr = expr.replace('(' + simpleExpr + ')', '(' + calculatedSimpleExpr + ')');
            }
        }

        // calculate functions
        functionArray = expr.match(functionRegex);
        if (functionArray != null) {
            for (let i = 0; i < functionArray.length; i++) {
                const functionExpr = functionArray[i];
                const parsedFunctionExpr = parseFunctionExpression(functionExpr);
                expr = expr.replace(functionExpr, calculateFunction(parsedFunctionExpr));
            }
        }

        // handle constants
        while ((constants = constantRegex.exec(expr)) != null) {
            let frontpart = expr.substr(0, constants.index);
            let backpart = expr.substr(constants.index).replace(constants[0], constants[1]);

            expr = frontpart + backpart;
        }

        // get the new array of simple expressions and functions
        simpleExprArray = expr.match(simpleExpressionRegex);
        functionArray = expr.match(functionRegex);
    }

    const splittedSimpleExpr = splitSimpleExpression(expr);
    expr = calculateSimpleExpression(splittedSimpleExpr);

    return expr;
};

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

    return exprArray.filter(i => i || i === 0);
};

// check that some expression contains one of the operators defined
const operatorContainmentCheck = (expr) => {
    const operators = ['+', '-', '*', '/', '!'];
    for (let i = 0; i < operators.length; i++)
        if (expr.includes(operators[i]))
            return operators[i];

    return false;
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
    if (operation === '!')
        return math.factorize(parsedSimpleExpression[0]);
};

const calculateFunction = (parsedExpression) => {
    const functionName = parsedExpression[0];
    const value = parsedExpression[1];

    // console.log(functionName + '(' + value + ')')

    if (functionName === 'log')
        return math.decimalLogarithm(value);
    if (functionName === 'ln')
        return math.naturalLogarithm(value);
    if (functionName === 'sin')
        return Math.sin(value);
    if (functionName === 'cos')
        return Math.cos(value);
    if (functionName === 'tan')
        return Math.tan(value);
};

const parseFunctionExpression = (expr) => {
    const splitExpr = expr.split('(');
    const functionName = splitExpr[0];
    const value = splitExpr[1].substr(0, splitExpr[1].length-1);

    return [functionName, Number(value)];
};

const calculateParsedExpression = (parsedExpression) => {

};

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
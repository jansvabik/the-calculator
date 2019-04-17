/**
 * Core of the calculator
 * 
 * @description Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @version 0.3
 * @author Jan Svabik (xsvabi00)
 * @author Vojtech Dvorak (xdvora3a)
 */

// include our mathematical library
const math = require('./math.lib');
const util = require('util');

const maxDecimalPrecision = 10;

const simpleExpressionRegex = /\((([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)\)/g;
const constantRegex = /(?<!cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)(?![!^])/g;
const functionRegex = /(cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)/g;
const bracketFactorialRegex = /\(((\-?[0-9\.]*)|\-?Infinity)\)!/g;
const bracketPowerRegex = /\(((\-?[0-9\.]*)|\-?Infinity)\)\^((\-?[0-9\.]+)|\-?Infinity)/g;
const rootRegex = /\(([0-9\.\-]*)\)root\(([\-?0-9\.]*)\)/g;
const eTypeRegex = /e((\+|\-)([0-9]+))/g;

const removeEType = (expr) => {
    let eType = eTypeRegex.exec(expr);
    if (eType == null)
        return expr;

    let frontpart = expr.substr(0, eType.index);
    let backpart = expr.substr(eType.index).replace(eType[0], '*10^' + eType[1]);

    expr = frontpart + backpart;
    console.log('\nRemoved E-types');
    console.log(expr);

    return removeEType(expr);
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
            if (negative) num *= -1
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

const nahradRAND = (expr) => {
    expr = expr.replace('RAND', Math.random());
    return expr;
};

const calculate = (expr) => {
    let leftBrackets = (expr.match(/\(/g) || []).length;
    let rightBrackets = (expr.match(/\)/g) || []).length;
    if (leftBrackets !== rightBrackets)
        return 'ERR:BRACKETS';

    // replace mathematical constants
    expr = expr.replace(/E/g, math.E);
    expr = expr.replace(/PI/g, math.PI);
    expr = removeEType(expr);

    // replace all RANDs by random integers from <0;1> interval
    while (expr.includes("RAND"))
        expr = nahradRAND(expr);

    console.log('Toto jde na kontrolu');

    console.log('\nConstants replaced');
    console.log(expr);

    // if the only expression is the number, this number is the result
    if (!isNaN(expr))
        return Number(expr);

    // prvni faze – vypocet zavorek, ktere neobsahuji dalsi zavorky (a tedy ani funkce)
    let simpleExprArray = expr.match(simpleExpressionRegex);
    let functionArray = expr.match(functionRegex);
    let rootArray = expr.match(rootRegex);
    let bracketFactorialArray = expr.match(bracketFactorialRegex);
    let bracketPowerArray = expr.match(bracketPowerRegex);

    while (simpleExprArray != null || functionArray != null || rootArray != null || bracketFactorialArray != null) {
        // calculate simple expressions
        if (simpleExprArray != null) {
            expr = removeEType(expr);
            for (let i = 0; i < simpleExprArray.length; i++) {
                const simpleExpr = simpleExprArray[i].substr(1, simpleExprArray[i].length-2);

                if (!isNaN(simpleExpr))
                    continue;

                const splittedSimpleExpr = splitSimpleExpression(simpleExpr);
                const calculatedSimpleExpr = calculateSimpleExpression(splittedSimpleExpr);
                expr = expr.replace('(' + simpleExpr + ')', '(' + calculatedSimpleExpr + ')');
            }
            console.log('\nSimple expressions calculated');
            console.log(expr);
        }
console.log('JO?');
        // calculate functions
        console.log('testuje se ' + expr);
        functionArray = expr.match(functionRegex);
        console.log(functionArray);
        if (functionArray != null) {
            expr = removeEType(expr);
            for (let i = 0; i < functionArray.length; i++) {
                const functionExpr = functionArray[i];
                const parsedFunctionExpr = parseFunctionExpression(functionExpr);
                expr = expr.replace(functionExpr, '(' + calculateFunction(parsedFunctionExpr) + ')');
            }
            console.log('\nFunctions calculated');
            console.log(expr);
            console.log('NIC1');
        }
        console.log('NIC2');

        // rooting
        while ((roots = rootRegex.exec(expr)) != null) {
            expr = removeEType(expr);
            let frontpart = expr.substr(0, roots.index);
            let backpart = expr.substr(roots.index).replace(roots[0], math.root(Number(roots[2]), Number(roots[1])));

            expr = frontpart + backpart;

            console.log('\nRoots calculated');
            console.log(expr);
        }

        console.log("tu taky, co");

        // factorize numbers in brackets
        while ((bracketedFactorials = bracketFactorialRegex.exec(expr)) != null) {
            expr = removeEType(expr);
            let frontpart = expr.substr(0, bracketedFactorials.index);
            let backpart = expr.substr(bracketedFactorials.index).replace(bracketedFactorials[0], math.factorize(Number(bracketedFactorials[1])));

            expr = frontpart + backpart;
            console.log('\nFactorized numbers in brackets');
            console.log(expr);
        }

        // power numbers in brackets (there can be negative numbers)
        while ((bracketPowerArray = bracketPowerRegex.exec(expr)) != null) {
            expr = removeEType(expr);
            let frontpart = expr.substr(0, bracketPowerArray.index);
            console.log(bracketPowerArray);
            console.log("Snazim se umocnit " + Number(bracketPowerArray[1]) + ' na ' + Number(bracketPowerArray[3]) + 'tou');
            let backpart = expr.substr(bracketPowerArray.index).replace(bracketPowerArray[0], math.power(Number(bracketPowerArray[1]), Number(bracketPowerArray[3])));

            expr = frontpart + backpart;
            console.log('\nPowered numbers in brackets');
            console.log(expr);
        }

        // handle constants
        while ((constants = constantRegex.exec(expr)) != null) {
            expr = removeEType(expr);
            let frontpart = expr.substr(0, constants.index);
            let backpart = expr.substr(constants.index).replace(constants[0], constants[1]);
        
            expr = frontpart + backpart;
            console.log('\nConstants unbracketed');
            console.log(expr);
        }

        // if the calculated expression is a number, end the loop immediatelz
        if (!isNaN(expr))
            break;

        // get the new array of simple expressions and functions
        simpleExprArray = expr.match(simpleExpressionRegex);
        functionArray = expr.match(functionRegex);
        rootArray = expr.match(rootRegex);
        bracketPowerArray = expr.match(bracketPowerRegex);
    }

    console.log('Tento EXPR uz pry neobsahuje funkci ani nic: ');
    console.log(expr);

    if (expr.includes('NaN'))
        return null;

    // if the expr is already number, do not split it
    expr = removeEType(expr);
    if (isNaN(expr)) {
        const splittedSimpleExpr = splitSimpleExpression(expr);
        expr = calculateSimpleExpression(splittedSimpleExpr);
    }
    
    expr = removeEType(expr);
    console.log('\nThe last simple expression calculated');
    console.log(expr);

    return Number(Number(expr).toPrecision(maxDecimalPrecision));
};

// parse simple mathematic expression into array to calculate (+, -, *, /, !)
const splitSimpleExpression = (expr) => {
    expr = plusMinusAxiom(expr);

    expr = expr.replace('*+', '*');
    expr = expr.replace('/+', '/');
    expr = expr.replace('^+', '^');
    expr = expr.replace('*-', '*N');
    expr = expr.replace('/-', '/N');
    expr = expr.replace('^-', '^N');

    console.log('Tesne pred rozdelenim: ' + expr);

    let splitted = splitArrayOfExpressions([expr])[0];
    return splitted;
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
    const operators = ['+', '-', '*', '/', '^', '!'];
    for (let i = 0; i < operators.length; i++)
        if (expr.includes(operators[i]))
            return operators[i];

    return false;
};

const calculateSimpleExpression = (parsedSimpleExpression) => {
    console.log('Hm: ');
    console.log(util.inspect(parsedSimpleExpression, {
        depth: Infinity,
        colors: true,
    }));
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

const calculateFunction = (parsedExpression) => {
    const functionName = parsedExpression[0];
    const value = parsedExpression[1];

    // console.log(functionName + '(' + value + ')')

    // TODO: zmenit asi na switch nebo proste na math[functionName](value);

    if (functionName === 'log')
        return math.decimalLogarithm(value);
    if (functionName === 'ln')
        return math.naturalLogarithm(value);
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

const parseFunctionExpression = (expr) => {
    const splitExpr = expr.split('(');
    const functionName = splitExpr[0];
    const value = splitExpr[1].substr(0, splitExpr[1].length-1);

    return [functionName, Number(value)];
};

let expr = '-(4.662466*sin(tan(99.355^-14*E^5)-log(2222)))';
try {
    console.log('Calculating: ' + expr);
    let c = calculate(expr);
    console.log('\nResult:');
    console.log(c);
} catch (e) {
    console.log(e);
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
/**
 * Core of the calculator
 * 
 * @description Functions that allow calculator to work (splitting the operations, checking them, choosing preferred operations etc.) 
 * @version 0.1
 */

const math = require('./math.lib');

const parseMathematicalExpression = (expr) => {
    
};

const calculateParsedExpression = (parsedExpression) => {

};

module.exports = (expressionToCalculate) => {
    let expr = parseMathematicalExpression(expressionToCalculate);
    return calculateParsedExpression(expr);
};
/**
 * @file calculatorRegEx.js
 * @author Jan Svabik (xsvabi00)
 */

// regular expression for calculating
const simpleExpression = /\((([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)\)/g;
const constant = /(?<!cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)(?![!^])/g;
const func = /(cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)/g;
const bracketFactorial = /\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)!/g;
const bracketPower = /\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)\^((\-?[0-9\.]+)|\-?Infinity)/g;
const root = /\(([\-|\+]?[0-9\.]*)\)root\(([\-?0-9\.]*)\)/g;
const eType = /e((\-|\+)([0-9]+))/g;
const multiplyingReplacementNumberStart = /(\!|\)|[0-9])(s|c|t|l|\()/g;
const multiplyingReplacementNumberEnd = /(\!|\))(s|c|t|l|\(|[0-9])/g;
const fullSimpleExpression = /^(([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)$/;

// constants
const constants = {
    E: /E/g,
    PI: /PI/g,
};

// exports the regular expressions
module.exports = {
    simpleExpression: simpleExpression,
    constant: constant,
    function: func,
    bracketFactorial: bracketFactorial,
    bracketPower: bracketPower,
    root: root,
    eType: eType,
    multiplyingReplacementNumberStart: multiplyingReplacementNumberStart,
    multiplyingReplacementNumberEnd: multiplyingReplacementNumberEnd,
    fullSimpleExpression: fullSimpleExpression,
    constants: constants,
};
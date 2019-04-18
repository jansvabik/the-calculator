/**
 * @file calculatorRegEx.js
 */

const simpleExpression = /\((([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)\)/g;
const constant = /(?<!cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)(?![!^])/g;
const func = /(cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)/g;
const bracketFactorial = /\(((\-?[0-9\.]*)|\-?Infinity)\)!/g;
const bracketPower = /\(((\-?[0-9\.]*)|\-?Infinity)\)\^((\-?[0-9\.]+)|\-?Infinity)/g;
const root = /\(([0-9\.\-]*)\)root\(([\-?0-9\.]*)\)/g;
const eType = /e((\+|\-)([0-9]+))/g;

module.exports = {
    // exports constants
    simpleExpression: simpleExpression,
    constant: constant,
    function: func,
    bracketFactorial: bracketFactorial,
    bracketPower: bracketPower,
    root: root,
    eType: eType,

    // ? export functions
};
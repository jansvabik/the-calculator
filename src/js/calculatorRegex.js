/** 
 * Module with regular expression to extracting data from mathematic expresssions.
 * @namespace regex 
 * @author Jan Svabik (xsvabi00)
 */
let regex = {};

/**
 * Simple expressions in brackets
 * @constant
 */
regex.simpleExpression = /\((([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)\)/g;

/**
 * Constants in brackets
 * @constant
 */
regex.constant = /(?<!cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\(((\-?[0-9\.]*)|\-?Infinity)\)(?![!^])/g;

/**
 * Function expressions
 * @constant
 */
regex.func = /(cotan|cosh|sinh|tanh|log|ln|sin|cos|tan)\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)/g;

/**
 * Brackets with factorial symbol after
 * @constant
 */
regex.bracketFactorial = /\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)!/g;

/**
 * Brackets with powering symbol after
 * @constant
 */
regex.bracketPower = /\((([\-|\+]?[0-9\.]*)|\-?Infinity)\)\^((\-?[0-9\.]+)|\-?Infinity)/g;

/**
 * Root expression
 * @constant
 */
regex.root = /\(([\-|\+]?[0-9\.]*)\)root\(([\-?0-9\.]*)\)/g;

/**
 * Number in scientific notation
 * @constant
 */
regex.eType = /e((\-|\+)([0-9]+))/g;

/**
 * Regular expression for replacing parts of expression where has to be the multiplycation symbol. Matches only parts of string that have the number, closing bracket, or the factorial symbol before the function name or opening bracket.
 * @constant
 */
regex.multiplyingReplacementNumberStart = /(\!|\)|[0-9])(s|c|t|l|\()/g;

/**
 * Regular expression for replacing parts of expression where has to be the multiplycation symbol. Matches only parts of string that have the factorial symbol, or closing bracket before the function name, number, or opening bracket.
 * @constant
 */
regex.multiplyingReplacementNumberEnd = /(\!|\))(s|c|t|l|\(|[0-9])/g;

/**
 * Regular expression for checking that some expression is a simple expression from its start to its end.
 * @constant
 */
regex.fullSimpleExpression = /^(([0-9\.\+\-\*\/\!\^]*)|\-?Infinity)$/;

/** 
 * Object with regular expressions of constants (PI and E)
 * @const {Object}
 * @property {RegEx} E /E/g
 * @property {RegEx} PI /PI/g
 */
regex.constants = {
    E: /E/g,
    PI: /PI/g,
};

// exports the regular expressions
module.exports = regex;
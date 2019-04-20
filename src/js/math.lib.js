/** 
 * Module with mathematical functions to calculate the most basic expressions at the lowest level.
 * @summary This mathematical library was developed especially for The Calculator.
 * @module math
 * @author Vojtech Dvorak (xdvora3a)
 * @version 1.0
 */

/**
 * PI (3.141592653589793)
 * @constant {Number}
 */
const PI = module.exports.PI = Math.PI;

/**
 * PI/2 (1.5707963267948966)
 * @constant {Number}
 */
const PId2 = module.exports.PId2 = Math.PI/2;

/**
 * E (2.718281828459045)
 * @constant {Number}
 */
const E = module.exports.E = Math.E;

/**
 * Function for checking the arguments coming into the other functions. Each function determines how many operands it needs at least. This functions checks data type of each operand in @p values array. It throw an error if some of the values is unsupported or if the number of operands doesn't match with the @p minOperands.
 * @summary Cheking values and the number of operands.
 * @param {Array.<(String|Number)>} values Array of values to check
 * @param {Number} [values=0] The minimal number of array @p values items.
 * @author Vojtech Dvorak (xdvora3a)
 * @author Jan Svabik (xsvabi00)
 * @throws Error if some of the value are not correct or supported or if there are less operands than @p minOperands.
 * @since 0.1
 */
const checkValues = (values, minOperands = 0) => {
    if (values.length < minOperands)
        throw new Error('Missing operands');

    for (let i = 0; i < values.length; i++) {
        values[i] = Number(values[i]);
        if (typeof values[i] !== 'number' || isNaN(values[i]))
            throw new Error('Wrong operands');
    }
};

/**
 * Function for summarizing values in the array @p values.
 * @summary Summarize values.
 * @param {Array.<(Number|String)>} values Array of values to summarize
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Sum of all values in array 'values'
 * @since 0.1
 * @example
 * // returns 10
 * add([1, 2, 3, 4, 5, -5]);
 */
module.exports.add = (values) => {
    // check data-type of each value
    checkValues(values, 1);

    // summarize the values
    let sum = 0;
    for (let i = 0; i < values.length; i++)
        sum += values[i];
    return sum;
};

/**
 * Function for subtracting values in the array @p values. All array items are subtracted from the first element.
 * @summary Subtract values.
 * @param {Array.<(Number|String)>} values Array of values to summarize
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Differention of values in array 'values'
 * @since 0.1
 * @example
 * // returns 10
 * subtract([12, 2]);
 * @example
 * // returns 10
 * subtract([3, -7]);
 * @example
 * // returns 5
 * subtract([6, 4, -8, 5]);
 */
module.exports.subtract = (values) => {
    // check data-type of each value
    checkValues(values, 1);

    // if there is only one value in 'values', change the sign
    if (values.length === 1)
        return -values[0];

    // subtact the values
    let diff = values[0];
    for (let i = 1; i < values.length; i++)
        diff -= values[i];
    return diff;
};

/**
 * Function for multiplying values in the array @p values.
 * @summary Multiply values.
 * @param {Array.<(Number|String)>} values Array of values to multiply
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Product of values in array 'values'
 * @since 0.1
 * @example
 * // returns 10
 * multiply([5, 2]);
 * @example
 * // returns 12
 * multiply([-8, 1, 1, 3, -2, 0.25]);
 * @example
 * // returns 0
 * multiply([-6, 11, 3.33, 0, -1.11]);
 */
module.exports.multiply = (values) => {
    // check data-type of each value
    checkValues(values, 2);
    
    //if there si 0 in array 'values', the product is always 0
    if (values.includes(0)) 
        return 0;

    // multiply the values
    let product = 1;
    for (let i = 0; i < values.length; i++)
        product *= values[i];

    return product;
};

/**
 * Function for dividing values in the array @p values. The first element is taken as base and it is divided by the next element. The result is divided by the next element and so on.
 * @summary Divide values.
 * @param {Array.<(Number|String)>} values Array of values to divide
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Quotient of values in array 'values'
 * @since 0.1
 * @example
 * // returns 2.5
 * divide([5, 2]);
 * @example
 * // returns 4
 * divide([-6, 1, 1, 3, -2, 0.25]);
 * @example
 * // returns 0
 * divide([0, 11, 3.33, 4, -1.11]);
 * @example
 * // returns Infinity
 * divide([4, 0]);
 */
module.exports.divide = (values) => {
    // check data-type of each value
    checkValues(values, 2);

    // if the first value is zero and there is no other zero, return 0
    if (values[0] === 0 && !values.slice(1).includes(0))
        return 0;

    // divide the values
    let quotient = values[0];
    for (let i = 1; i < values.length; i++)
        quotient /= values[i];

    return quotient;
};

/**
 * Function for factorizing the given value.
 * @summary Factorize value.
 * @param {(Number|String)} value Value to factorize
 * @author Vojtech Dvorak (xdvora3a)
 * @returns The result of factorization 'x' or NaN if undefined (e.g. factorization of floating point number or negative number)
 * @since 0.1
 * @example
 * // returns 1
 * factorize(0);
 * @example
 * // returns 120
 * factorize(5);
 * @example
 * // returns NaN
 * factorize(-2);
 * factorize(3.456);
 */
module.exports.factorize = (x) => {
    checkValues([x]);

    // Factorization of Infinity is Infinity
    if (x === Infinity)
        return Infinity;
    
    // if x is not an integer, if x is -Infinity and if x < 0, the result is NaN
    if (x % 1 !== 0 || x === -Infinity || x < 0)
        return NaN;

    // Factorize the x
    let result = 1;
    for (let i = x; i > 1; i--)
        result *= i;

    return result;
};

/**
 * Function for powering the given value.
 * @summary Power the value.
 * @param {(Number|String)} x The number to powering
 * @param {(Number|String)} n The exponent
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Power of 'x' to the 'n'.
 * @since 0.1
 * @example
 * // returns 1
 * power(4, 0);
 * @example
 * // returns 32
 * power(2, 5);
 * @example
 * // returns NaN (complex numbers not supported)
 * power(-2, 3.456);
 */
module.exports.power = (x, n) => {
    checkValues([x, n]);

    // Power x to the n
    return Math.pow(x, n);
};

/**
 * Function for calculating the nth root of x.
 * @summary Calculate root.
 * @param {(Number|String)} x Value to calculate root from
 * @param {(Number|String)} n The level of the root
 * @author Vojtech Dvorak (xdvora3a)
 * @returns nth root of 'x'
 * @since 0.1
 * @example
 * // returns 4
 * root(2, 16);
 * @example
 * // returns -3
 * root(3, -27);
 */
module.exports.root = (x, n) => {
    checkValues([x, n]);

    let result;
    if (n % 2 === 1 && x < 0)
        result = -Math.pow(-x, 1/n);
    else
        result =  Math.pow(x, 1/n);

    // round and check for the tolerance
    let rounded = Math.round(result);
    if (Math.abs(rounded - result) < 1e-12) 
        result = rounded;

    return result;    
};

/**
 * Function for calculating the natural logarithm of the given number.
 * @summary Natural logarithm (ln) of number.
 * @param {(Number|String)} x Value to calculate natural logarithm of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Natural logarithm of 'x'.
 * @since 0.1
 * @example
 * // returns 1.3862943611198906
 * ln(4);
 * @example
 * // returns NaN
 * ln(-27);
 */
module.exports.ln = (x) => {
    checkValues([x]);

    // Calculate the natural logarithm
    return Math.log(x);
};

/**
 * Function for calculating the decimal logarithm of the given number.
 * @summary Decimal logarithm (log) of number.
 * @param {(Number|String)} x Value to calculate decimal logarithm of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Decimal logarithm of 'x'.
 * @since 0.1
 * @example
 * // returns 1
 * log(10);
 * @example
 * // returns 0.3701428470511021
 * log(2.345);
 * @example
 * // returns NaN
 * log(-1.3);
 */
module.exports.log = (x) => {
    checkValues([x]);

    // Calculate the decimal logarithm
    return Math.log10(x);
};

/**
 * Function for calculating the sinus of the given number.
 * @summary Sinus of number.
 * @param {(Number|String)} x Value to calculate sinus of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Sinus of 'x'.
 * @since 0.1
 * @example
 * // returns 0
 * sin(0);
 * @example
 * // returns 0.7149780101364926
 * sin(2.345);
 */
module.exports.sin = (x) => {
    checkValues([x]);

    // Calculate the sinus
    return Number(Number(Math.sin(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the cosinus of the given number.
 * @summary Cosinus of number.
 * @param {(Number|String)} x Value to calculate cosinus of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Cosinus of 'x'.
 * @since 0.1
 * @example
 * // returns 1
 * cos(0);
 * @example
 * // returns -0.699146940936783
 * cos(2.345);
 */
module.exports.cos = (x) => {
    checkValues([x]);

    // Calculate the cosinus
    return Number(Number(Math.cos(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the tangens of the given number.
 * @summary Tangens of number.
 * @param {(Number|String)} x Value to calculate tangens of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Tangens of 'x'.
 * @since 0.1
 * @example
 * // returns 0
 * tan(0);
 * @example
 * // returns -1.0226434076626263
 * tan(2.345);
 */
module.exports.tan = (x) => {
    checkValues([x]);

    // handle undefined points
    if (Number((x % PId2).toPrecision(13)) === 0 && Number((x % PI).toPrecision(13)) !== 0)
        return NaN;

    // Calculate the tangens
    return Number(Number(Math.tan(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the cotangens of the given number.
 * @summary Cotangens of number.
 * @param {(Number|String)} x Value to calculate cotangens of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Cotangens of 'x'.
 * @since 1.0
 * @example
 * // returns -Infinity
 * cotan(0);
 * @example
 * // returns -0.9778579634964053
 * cotan(2.345);
 */
module.exports.cotan = (x) => {
    checkValues([x]);

    // handle undefined points
    if (Number((x % PI).toPrecision(13)) === 0)
        return NaN;

    // Calculate the cotangens
    return 1 / Number(Number(Math.tan(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the hyperbolic sinus of the given number.
 * @summary Hyperbolic sinus of number.
 * @param {(Number|String)} x Value to calculate hyperbolic sinus of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Hyperbolic sinus of 'x'.
 * @since 1.0
 * @example
 * // returns 0
 * sinh(0);
 * @example
 * // returns 5.16871276270921
 * sinh(2.345);
 */
module.exports.sinh = (x) => {
    checkValues([x]);

    // Calculate the hyperbolic sinus
    return Number(Number(Math.sinh(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the hyperbolic cosinus of the given number.
 * @summary Hyperbolic cosinus of number.
 * @param {(Number|String)} x Value to calculate hyperbolic cosinus of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Hyperbolic cosinus of 'x'.
 * @since 1.0
 * @example
 * // returns 1
 * cosh(0);
 * @example
 * // returns 5.264559964839708
 * cosh(2.345);
 */
module.exports.cosh = (x) => {
    checkValues([x]);

    // Calculate the hyperbolic cosinus
    return Number(Number(Math.cosh(x).toFixed(13)).toPrecision(13));
};

/**
 * Function for calculating the hyperbolic tangens of the given number.
 * @summary Hyperbolic tangens of number.
 * @param {(Number|String)} x Value to calculate hyperbolic tangens of
 * @author Vojtech Dvorak (xdvora3a)
 * @returns Hyperbolic tangens of 'x'.
 * @since 1.0
 * @example
 * // returns 0
 * cosh(0);
 * @example
 * // returns 0.9817938815835262
 * cosh(2.345);
 */
module.exports.tanh = (x) => {
    checkValues([x]);

    // Calculate the hyperbolic tangens
    return Number(Number(Math.tanh(x).toFixed(13)).toPrecision(13));
};
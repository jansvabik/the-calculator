/**
 * @file math.lib.js
 * @brief The mathematical library
 * @description This mathematical library was developed especially for The Calculator
 * @version 1.0
 */

// constants
module.exports.PI = Math.PI;
module.exports.E = Math.E;

/**
 * @brief Cheking values and the number of operands
 * @description Function for checking the data-type of the array elements. It throw an error if some of the values is unsupported or if the number of operands doesn't match with the @p minOperands.
 * @param[in] values Array of values to check
 */
const checkValues = (values, minOperands = 0) => {
    if (values.length < minOperands)
        throw new Error('Missing operands');

    for (let i = 0; i < values.length; i++)
        if (typeof values[i] !== 'number' || isNaN(values[i]))
            throw new Error('Wrong operands');
};

/**
 * @brief Summarize values
 * @description Function summarizes all values in array 'values'
 * @param[in] values Arrayof values to summarize
 * @returns Sum of values in array 'values' 
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
 * @brief Subtract values
 * @description Function subtracts values[1 - n] from values[0]
 * @param[in] values Array of values to substract
 * @returns Differention of values in array 'values' 
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
 * @brief Multiply values
 * @description Function multiplies all values in array 'values'
 * @param[in] values Array of values to multiply
 * @returns Product of values in array 'values' 
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
 * @brief Divide values
 * @description Function divides values[0] with all other values in array 'values'
 * @param[in] values Array of values to divide
 * @returns Qutient of values in array 'values' 
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
 * @brief Factorize value
 * @description Function factorizes 'x'
 * @param[in] x Value to factorize
 * @returns result of factorizing x
 */
module.exports.factorize = (x) => {
    checkValues([x]);

    // Factorization of Infinity is Infinity
    if (x === Infinity)
        return Infinity;
    
    // if x is not an integer, if x is -Infinity and if x < 0,
    // the result is NaN
    if (x % 1 !== 0 || x === -Infinity || x < 0)
        return NaN;

    // Factorize the x
    let result = 1;
    for (let i = x; i > 1; i--)
        result *= i;

    return result;
};

/**
 * @brief Power x to n
 * @description Function powers x to n
 * @param[in] x Value of the base
 * @param[in] n Value of the exponent
 * @returns Power of x to the n
 */
module.exports.power = (x, n) => {
    checkValues([x, n]);

    // Power x to the n
    return Math.pow(x, n);
};

/**
 * @brief Nth root of x 
 * @description Function calculates nth root of x
 * @param[in] x Value of the base
 * @param[in] n Value of the root
 * @returns Result of nth root of x
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
 * @brief Natural logarithm of x
 * @description Function calculates natural logarithm of x
 * @param[in] x Value to calculate natural logarithm of
 * @returns Natural logarithm of x
 */
module.exports.naturalLogarithm = (x) => {
    checkValues([x]);

    // Calculate the natural logarithm
    return Math.log(x);
};

/**
 * @brief Decimal logarithm of x
 * @description Function calculates decimal logarithm of x
 * @param[in] x Value to calculate decimal logarithm of
 * @returns Decimal logarithm of x
 */
module.exports.decimalLogarithm = (x) => {
    checkValues([x]);

    // Calculate the decimal logarithm
    return Math.log10(x);
};
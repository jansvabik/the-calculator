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

module.exports.add = (values) => {
    // check data-type of each value
    checkValues(values, 1);

    // summarize the values
    let sum = 0;
    for (let i = 0; i < values.length; i++)
        sum += values[i];
    return sum;
};

module.exports.subtract = (values) => {
    // check data-type of each value
    checkValues(values, 1);

    if (values.length === 1)
        return -values[0];

    // subtract the values
    let diff = values[0];
    for (let i = 1; i < values.length; i++)
        diff -= values[i];
    return diff;
};

module.exports.multiply = (values) => {
    // check data-type of each value
    checkValues(values, 2);
    
    if (values.includes(0)) 
        return 0;

    // summarize the values
    let product = 1;
    for (let i = 0; i < values.length; i++)
        product *= values[i];

    return product;
};

module.exports.divide = (values) => {
    // check data-type of each value
    checkValues(values, 2);

    // if the first value is zero and there is no other zero, return 0
    if (values[0] === 0 && !values.slice(1).includes(0))
        return 0;

    // summarize the values
    let quotient = values[0];
    for (let i = 1; i < values.length; i++)
        quotient /= values[i];

    return quotient;
};

module.exports.factorize = (x) => {
    checkValues([x]);

    // special situations
    if (x === Infinity)
        return Infinity;
    
    if (x % 1 !== 0 || x === -Infinity || x < 0)
        return NaN;

    // make the factorial
    let result = 1;
    for (let i = x; i > 1; i--)
        result *= i;

    return result;
};

module.exports.power = (x, n) => {
    checkValues([x, n]);

    return Math.pow(x, n);
};

module.exports.root = (x, n) => {
    checkValues([x, n]);

    let result;
    if (n % 2 === 1 && x < 0)
        result = -Math.pow(-x, 1/n)
    else
        result =  Math.pow(x, 1/n);

    // round and check for the tolerance
    let rounded = Math.round(result);
    if (Math.abs(rounded - result) < 1e-12) 
        result = rounded;

    return result;    
};

module.exports.naturalLogarithm = (x) => {
    checkValues([x]);

    return Math.log(x);
};

module.exports.decimalLogarithm = (x) => {
    checkValues([x]);

    return Math.log10(x);
};
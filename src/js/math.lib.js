/**
 * @file math.lib.js
 * @brief The mathematical library
 * @description This mathematical library was developed especially for The Calculator
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

module.exports.subtract = (values) => {};

module.exports.multiply = (values) => {};

module.exports.divide = (values) => {};

module.exports.factorize = (x) => {};

module.exports.power = (x, n) => {};

module.exports.root = (x, n) => {}

module.exports.naturalLogarithm = (x) => {};

module.exports.decimalLogarithm = (x) => {};
'use strict';

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
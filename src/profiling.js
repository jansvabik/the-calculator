/**
 * @file profiling.js
 * @brief Standard deviation calculator – for profiling
 * @author Vojtech Dvorak (xdvora3a)
 * @version 1.0
 */

// library for reading lines from stdin and out math library
const readline = require('readline');
const math = require('./js/math.lib');

// create readline interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// number list
var numbers = [];

// save each line to the array of values
rl.on('line', (line) => {
    // parse the number
    let n = parseFloat(line);

    // check value validity
    if (isNaN(n)) {
        console.error('Chyba: Hodnota ' + line + ' není platná.');
        return process.exit(1);
    }

    // add number to the array
    numbers.push(n);
});

/**
 * @brief Function for calculating the arithmetical average
 * @param {Array} numbers Array of numbers to calculate the arithmetical average
 * @author Vojtech Dvorak (xdvora3a)
 * @return The arithmetical average of the values in @p numbers array
 */
const average = (numbers) => {
    let sum = math.add(numbers);
    return math.multiply([math.divide([1, numbers.length]), sum]);
};

// when reading from stdin ends, calculate the standard deviation
rl.on('close', () => {
    // if there was some not-number value, return error
    if (numbers.includes(NaN)) {
        return console.error('Error: Some of the values is not a number.');
    }

    // calculate the average and prepare the sum var
    let avg = average(numbers);
    let sum = math.multiply([-numbers.length, math.power(avg, 2)]);

    // calculate the sum of the powers of each number
    for (let i = 0; i < numbers.length; i++) {
        sum = math.add([sum, math.power(numbers[i], 2)]);
    }

    // finish the standard deviation calculation
    let s = math.root(math.multiply([math.divide([1, math.subtract([numbers.length, 1])]), sum]), 2);

    // print the result to the stdout
    console.log(s);
});
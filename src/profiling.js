/**
 * @file profiling.js
 * @ignore
 * @brief Standard deviation calculator – for profiling
 * @author Vojtech Dvorak (xdvora3a)
 * @author Jan Svabik (xsvabi00)
 * @version 1.1
 */

// determine that profiling was enabled in arguments
let p = (process.argv[2] === '--profile');

// library for reading lines from stdin and out math library
const readline = require('readline');
const math = require('./js/math.lib');
if (p) require('easy-profiler');

// profiling
let profiling = {};

// profiler keys
if (p) {
    EP.keys.add({
        LINE_READ: 'Line reading',
        LINE_PROCESSING: 'Line processing',
        AVERAGE_CALCULATION: 'Average calculation',
        MULTIPLICATING_LENGTH_AVERAGE: 'Mult. average power and the number count',
        POWER_SUM_LOOP: 'Power summarize loop',
        CALC_FINISH: 'Calc. finishing (root, dividing, subtr.)',
    });
}

// create readline interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// number list
var numbers = [];

// line reading started
if (p) profiling.lineReading = EP.begin(EP.keys.LINE_READ);

// save each line to the array of values
rl.on('line', (line) => {
    // new line processing started
    if (p) profiling.lineProcessing = EP.begin(EP.keys.LINE_PROCESSING);

    // parse the number
    let n = parseFloat(line);

    // check value validity
    if (isNaN(n)) {
        console.error('Chyba: Hodnota ' + line + ' není platná.');
        return process.exit(1);
    }

    // add number to the array
    numbers.push(n);

    // line read ends
    if (p) profiling.lineProcessing.end(false);
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
    // line reading ended
    if (p) profiling.lineReading.end(false);

    // if there was some not-number value, return error
    if (numbers.includes(NaN)) {
        return console.error('Error: Some of the values is not a number.');
    }

    // calculate the average and prepare the sum var
    if (p) profiling.averageCalculation = EP.begin(EP.keys.AVERAGE_CALCULATION);
    let avg = average(numbers);
    if (p) profiling.averageCalculation.end(false);

    // multiply the count of numbers and average power
    if (p) profiling.averageCalculation = EP.begin(EP.keys.MULTIPLICATING_LENGTH_AVERAGE);
    let sum = math.multiply([-numbers.length, math.power(avg, 2)]);
    if (p) profiling.averageCalculation.end(false);

    // calculate the sum of the powers of each number
    if (p) profiling.powerSumLoop = EP.begin(EP.keys.POWER_SUM_LOOP);
    for (let i = 0; i < numbers.length; i++) {
        sum = math.add([sum, math.power(numbers[i], 2)]);
    }
    if (p) profiling.powerSumLoop.end(false);

    // finish the standard deviation calculation
    if (p) profiling.calcFinish = EP.begin(EP.keys.CALC_FINISH);
    let s = math.root(math.multiply([math.divide([1, math.subtract([numbers.length, 1])]), sum]), 2);
    if (p) profiling.calcFinish.end(false);
    
    // print the result to the stdout
    console.log(s);

    // print profiling report
    if (p) EP.report(true);
});
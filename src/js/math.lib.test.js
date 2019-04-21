/**
 * MATHEMATIC LIBRARY TESTS
 * 
 * @description The library will be developed using this tests (test-driven development).
 * @author Jan Svabik (xsvabi00)
 * @version 1.0
 */

const math = require('./math.lib');

test('Adding', () => {
    expect(math.add([1, 0, 9, -5, 2])).toBe(7);
    expect(math.add([1.123, 0.0004, 9, -5.4321, 2])).toBeCloseTo(6.6913);
    expect(math.add([+44, -0.11, -2, 2, -0])).toBeCloseTo(43.89);
    
    expect(math.add([57195.7135, 0, -Infinity, 2])).toBe(-Infinity);
    expect(math.add([Infinity, 2, 0, 3566.33333567])).toBe(Infinity);
    expect(math.add([-616, Infinity, 0, Infinity])).toBe(Infinity);
    expect(math.add([Infinity, 5.4554, -0.11, -Infinity, 2])).toBe(NaN);
    
    expect(() => math.add([56, 11, NaN, -355.3])).toThrowError();
    expect(() => math.add([])).toThrowError();
});

test('Subtracting', () => {
    expect(math.subtract([1, 0, 9, -5, 2])).toBe(-5);
    expect(math.subtract([1.123, 0.0004, 9, -5.4321, 2])).toBeCloseTo(-4.4453);
    expect(math.subtract([+44, -0.11, -2, 2, -0])).toBeCloseTo(44.11);

    expect(math.subtract([Infinity, 0, -456.20045, 977747])).toBe(Infinity);
    expect(math.subtract([Infinity, -Infinity])).toBe(Infinity);
    expect(math.subtract([-Infinity, Infinity])).toBe(-Infinity);
    expect(math.subtract([Infinity, Infinity])).toBe(NaN);
    expect(math.subtract([-Infinity, -Infinity])).toBe(NaN);

    expect(math.subtract([8.3085])).toBeCloseTo(-8.3085);
    expect(math.subtract([-8])).toBe(8);
    expect(math.subtract([-Infinity])).toBe(Infinity);
    
    expect(() => math.subtract([NaN, 90, 1.111])).toThrowError();
    expect(() => math.subtract([0.567, 1000, NaN])).toThrowError();
    expect(() => math.subtract([])).toThrowError();
});

test('Multiplying', () => {
    expect(math.multiply([0, 6.616, -9.9999, 1600, 5])).toBe(0);
    expect(math.multiply([666.666, 2115, 82.01, 0, -345])).toBe(0);
    expect(math.multiply([999.999, 1])).toBeCloseTo(999.999);
    expect(math.multiply([-2, -3, -4, 2, 2])).toBe(-96);
    expect(math.multiply([-0.001, 1, 5678])).toBeCloseTo(-5.678);
    expect(math.multiply([-0, 1])).toBe(0);

    expect(math.multiply([5.3, Infinity, 0])).toBe(0);
    expect(math.multiply([11.987654321, -Infinity, 100])).toBe(-Infinity);
    expect(math.multiply([Infinity, Infinity])).toBe(Infinity);
    expect(math.multiply([-Infinity, -Infinity])).toBe(Infinity);
    expect(math.multiply([Infinity, -Infinity, 5])).toBe(-Infinity);
    expect(math.multiply([-Infinity, Infinity, -Infinity, -Infinity, Infinity])).toBe(-Infinity);

    expect(() => math.multiply([0, -7, NaN, 3.14])).toThrowError();
    expect(() => math.multiply([4])).toThrowError();
    expect(() => math.multiply([NaN])).toThrowError();
    expect(() => math.multiply([])).toThrowError();
});

test('Dividing', () => {
    expect(math.divide([0, 12, 5.555, -2])).toBe(0);
    expect(math.divide([12, 6, 3])).toBeCloseTo(0.666666666);
    expect(math.divide([60, -5, 2, 2])).toBe(-3);
    expect(math.divide([17, 3, 13])).toBeCloseTo(0.435897436);
    expect(math.divide([-20, 0.001, 5])).toBeCloseTo(-4000);

    expect(math.divide([5, 0, -0.999])).toBe(-Infinity);
    expect(math.divide([90, -1, -0])).toBe(Infinity);
    expect(math.divide([90, -1, 0])).toBe(-Infinity);
    expect(math.divide([9, Infinity, 999])).toBe(0);
    expect(math.divide([42, -Infinity, -0.1, -3.1415926535])).toBe(-0);

    expect(() => math.divide([0, NaN, 566])).toThrowError();
    expect(() => math.divide([-345, NaN, 566])).toThrowError();
    expect(() => math.divide([NaN, 11, -5])).toThrowError();
    expect(() => math.divide([NaN, 0])).toThrowError();
    expect(() => math.divide([5])).toThrowError();
    expect(() => math.divide([])).toThrowError();
});

test('Calculating the power', () => {
    expect(math.power(0, 0)).toBe(1);
    expect(math.power(0, -0)).toBe(1);
    expect(math.power(0, 5)).toBe(0);
    expect(math.power(-0, 4)).toBe(0);
    expect(math.power(-0, 5)).toBe(-0);
    expect(math.power(1, 5)).toBe(1);
    expect(math.power(-1, 5)).toBe(-1);
    expect(math.power(1, -3)).toBe(1);

    expect(math.power(2, 5)).toBe(32);
    expect(math.power(-4, 7)).toBe(-16384);
    expect(math.power(4, -7)).toBeCloseTo(0.00006103515);
    expect(math.power(-4, -7)).toBeCloseTo(-0.00006103515);

    expect(math.power(3.5, -7)).toBeCloseTo(0.000155426);
    expect(math.power(-3.5, 7)).toBeCloseTo(-6433.9296875);
    expect(math.power(-3.5, -7)).toBeCloseTo(-0.000155426);

    expect(math.power(4, -7.33)).toBeCloseTo(0.00003862782);
    expect(math.power(-4, 7.33)).toBe(NaN); // complex number
    expect(math.power(-4, -7.33)).toBe(NaN); // complex number

    expect(math.power(7.1234, 3.13)).toBeCloseTo(466.564132508);
    expect(math.power(7.1234, -3.13)).toBeCloseTo(0.00214332806);
    expect(math.power(-7.1234, 3.13)).toBe(NaN); // complex number
    expect(math.power(-7.1234, -3.13)).toBe(NaN); // complex number

    expect(math.power(Infinity, 0)).toBe(1);
    expect(math.power(Infinity, -3)).toBe(0);
    expect(math.power(Infinity, -4)).toBe(0);
    expect(math.power(Infinity, 4)).toBe(Infinity);
    expect(math.power(Infinity, 4.89904)).toBe(Infinity);
    expect(math.power(Infinity, -4.89904)).toBe(0);
    expect(math.power(Infinity, Infinity)).toBe(Infinity);
    expect(math.power(Infinity, -Infinity)).toBe(0);
    expect(math.power(-Infinity, Infinity)).toBe(Infinity);
    expect(math.power(-Infinity, -Infinity)).toBe(0);
    expect(math.power(-Infinity, -4)).toBe(0);
    expect(math.power(-Infinity, -5)).toBe(-0);
    expect(math.power(-Infinity, 4)).toBe(Infinity);
    expect(math.power(-Infinity, 4.111)).toBe(Infinity);
    expect(math.power(-Infinity, 5)).toBe(-Infinity);

    expect(() => math.power(NaN, 4)).toThrowError();
    expect(() => math.power(3.14, NaN)).toThrowError();
    expect(() => math.power(3.14, undefined)).toThrowError();
});

test('Calculating the root', () => {
    expect(math.root(125, 3)).toBe(5);
    expect(math.root(2187, 7)).toBe(3);
    expect(math.root(678223072849, 14)).toBe(7);
    expect(math.root(2187, -7)).toBeCloseTo(0.3333333333);
    expect(math.root(5764801, 8)).toBe(7);
    expect(math.root(1.73466526e-7, -8)).toBeCloseTo(7);
    expect(math.root(62742241, 4)).toBe(89);
    
    expect(math.root(63.456, -3)).toBeCloseTo(0.2507123739);
    expect(math.root(125, 3.0001)).toBeCloseTo(4.99973177648);
    expect(math.root(0.078333, 6)).toBeCloseTo(0.65412004795);
    expect(math.root(93.616, -9.3455003)).toBeCloseTo(0.61526031498);
    expect(math.root(0.5, 0.045)).toBeCloseTo(2.04382892e-7);
    expect(math.root(34, -0.0944)).toBeCloseTo(5.980071646e-17);
    expect(math.root(0.25, -0.198)).toBeCloseTo(1098.2647050803);

    expect(math.root(-8, 3)).toBe(-2);
    expect(math.root(-0.34, 11)).toBeCloseTo(-0.9065821717);

    expect(math.root(-12.344, 4)).toBe(NaN); // complex number
    expect(math.root(-12.344, 4.34)).toBe(NaN); // complex number
    expect(math.root(-12.344, 0.4)).toBe(NaN); // complex number
    expect(math.root(-12.344, -0.4)).toBe(NaN); // complex number
    expect(math.root(-12.344, -0.4)).toBe(NaN); // complex number
    expect(math.root(-12.344, -0.4)).toBe(NaN); // complex number

    expect(() => math.root(4, NaN)).toThrowError();
    expect(() => math.root(NaN, 4)).toThrowError();
});


test('Calculating the factorial', () => {
    expect(math.factorize(0)).toBe(1);
    expect(math.factorize(-0)).toBe(1);
    expect(math.factorize(5)).toBe(120);
    expect(math.factorize(2.5)).toBe(NaN); // only with gamma function
    expect(math.factorize(11)).toBe(39916800);
    expect(math.factorize(5.6)).toBe(NaN); // only with gamma function
    expect(math.factorize(0.3399)).toBe(NaN); // only with gamma function

    expect(math.factorize(math.PI)).toBe(NaN); // only with gamma function
    expect(math.factorize(math.E)).toBe(NaN); // only with gamma function
    
    expect(math.factorize(Infinity)).toBe(Infinity);
    expect(math.factorize(-Infinity)).toBe(NaN);
    
    expect(math.factorize(-9)).toBe(NaN);
    expect(math.factorize(-9.876)).toBe(NaN); // only with gamma function
    expect(() => math.factorize(NaN)).toThrowError();
    expect(() => math.factorize(undefined)).toThrowError();
});

test('Calculating the natural logarithm', () => {
    expect(math.ln(0)).toBe(-Infinity);
    expect(math.ln(-0)).toBe(-Infinity);
    expect(math.ln(1)).toBe(0);
    expect(math.ln(math.E)).toBe(1);
    expect(math.ln(1.5)).toBeCloseTo(0.4054651081);
    expect(math.ln(45)).toBeCloseTo(3.80666248977);
    expect(math.ln(-1)).toBe(NaN);
    expect(math.ln(-65.3525)).toBe(NaN);
    
    expect(math.ln(Infinity)).toBe(Infinity);
    expect(math.ln(-Infinity)).toBe(NaN);
    
    expect(() => math.ln(NaN)).toThrowError();
    expect(() => math.ln(undefined)).toThrowError();
});

test('Calculating the decimal logarithm', () => {
    expect(math.log(0)).toBe(-Infinity);
    expect(math.log(-0)).toBe(-Infinity);
    expect(math.log(1)).toBe(0);
    expect(math.log(10)).toBe(1);
    expect(math.log(1.5)).toBeCloseTo(0.17609125905);
    expect(math.log(45)).toBeCloseTo(1.65321251378);
    expect(math.log(-1)).toBe(NaN);
    expect(math.log(-65.3525)).toBe(NaN);
    
    expect(math.log(Infinity)).toBe(Infinity);
    expect(math.log(-Infinity)).toBe(NaN);
    
    expect(() => math.log(NaN)).toThrowError();
    expect(() => math.log(undefined)).toThrowError();
});

// added functions
test('Sinus', () => {
    expect(math.sin(0)).toBe(0);
    expect(math.sin(math.PI)).toBe(0);
    expect(math.sin(9*math.PI)).toBe(0);
    expect(math.sin(-4*math.PI)).toBe(0);
    expect(math.sin(9.8795)).toBeCloseTo(-0.4392126155);
    expect(math.sin(-3344)).toBeCloseTo(-0.97470931296);
    expect(math.sin(Infinity)).toBe(NaN);
    expect(math.sin(-Infinity)).toBe(NaN);
});

test('Cosinus', () => {
    expect(math.cos(0)).toBe(1);
    expect(math.cos(math.PI)).toBe(-1);
    expect(math.cos(9*math.PI)).toBe(-1);
    expect(math.cos(-4*math.PI)).toBe(1);
    expect(math.cos(9.8795)).toBeCloseTo(-0.89838314675);
    expect(math.cos(-3344)).toBeCloseTo(0.22347652052);
    expect(math.cos(Infinity)).toBe(NaN);
    expect(math.cos(-Infinity)).toBe(NaN);
});

test('Tangens', () => {
    expect(math.tan(0)).toBe(0);
    expect(math.tan(1)).toBeCloseTo(1.55740772465);
    expect(math.tan(math.PI)).toBe(0);
    expect(math.tan(9*math.PI)).toBe(0);
    expect(math.tan(-4*math.PI)).toBe(0);
    expect(math.tan(9.8795)).toBeCloseTo(0.48889231403);
    expect(math.tan(-3344)).toBeCloseTo(-4.36157369315);
    expect(math.tan(math.PI/4)).toBe(1);

    expect(math.tan(math.PI/2)).toBe(NaN);

    expect(math.tan(Infinity)).toBe(NaN);
    expect(math.tan(-Infinity)).toBe(NaN);
});

test('Cotangens', () => {
    expect(math.cotan(0)).toBe(NaN);
    expect(math.cotan(1)).toBeCloseTo(0.6420926159);
    expect(math.cotan(math.PI)).toBe(NaN);
    expect(math.cotan(9*math.PI)).toBe(NaN);
    expect(math.cotan(-4*math.PI)).toBe(NaN);
    expect(math.cotan(9.8795)).toBeCloseTo(2.0454402152);
    expect(math.cotan(-3344)).toBeCloseTo(-0.2292750439);
    expect(math.cotan(math.PI/4)).toBe(1);

    expect(math.cotan(math.PI/2)).toBeCloseTo(6.123234e-17);

    expect(math.cotan(Infinity)).toBe(NaN);
    expect(math.cotan(-Infinity)).toBe(NaN);
});

test('Hyperbolic sinus', () => {
    expect(math.sinh(0)).toBe(0);
    expect(math.sinh(1)).toBeCloseTo(1.17520119);
    expect(math.sinh(math.PI)).toBeCloseTo(11.5487394);
    expect(math.sinh(9*math.PI)).toBeCloseTo(9.513869476461e11);
    expect(math.sinh(-4*math.PI)).toBeCloseTo(-143375.657);
    expect(math.sinh(9.8795)).toBeCloseTo(9762.9786);
    expect(math.sinh(-3344)).toBe(-Infinity);
    expect(math.sinh(math.PI/4)).toBeCloseTo(0.868670961);

    expect(math.sinh(math.PI/2)).toBeCloseTo(2.3012989);

    expect(math.sinh(Infinity)).toBe(Infinity);
    expect(math.sinh(-Infinity)).toBe(-Infinity);
});

test('Hyperbolic cosinus', () => {
    expect(math.cosh(0)).toBe(1);
    expect(math.cosh(1)).toBeCloseTo(1.54308063);
    expect(math.cosh(math.PI)).toBeCloseTo(11.5919533);
    expect(math.cosh(9*math.PI)).toBeCloseTo(9.513869476461e11);
    expect(math.cosh(-4*math.PI)).toBeCloseTo(143375.657);
    expect(math.cosh(9.8795)).toBeCloseTo(9762.97865);
    expect(math.cosh(-3344)).toBe(Infinity);
    expect(math.cosh(math.PI/4)).toBeCloseTo(1.32460908925);

    expect(math.cosh(math.PI/2)).toBeCloseTo(2.50917847866);

    expect(math.cosh(Infinity)).toBe(Infinity);
    expect(math.cosh(-Infinity)).toBe(Infinity);
});

test('Hyperbolic tangens', () => {
    expect(math.tanh(0)).toBe(0);
    expect(math.tanh(1)).toBeCloseTo(0.76159415595);
    expect(math.tanh(math.PI)).toBeCloseTo(0.99627207622);
    expect(math.tanh(9*math.PI)).toBe(1);
    expect(math.tanh(-4*math.PI)).toBeCloseTo(-0.99999999997);
    expect(math.tanh(9.8795)).toBeCloseTo(0.99999999475);
    expect(math.tanh(-3344)).toBe(-1);
    expect(math.tanh(math.PI/4)).toBeCloseTo(0.65579420263);

    expect(math.tanh(math.PI/2)).toBeCloseTo(0.91715233566);

    expect(math.tanh(Infinity)).toBe(1);
    expect(math.tanh(-Infinity)).toBe(-1);
});
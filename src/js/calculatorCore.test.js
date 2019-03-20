/**
 * MATHEMATIC LIBRARY TESTS
 * 
 * @description The library will be developed using this tests (test-driven development).
 * @author Jan Svabik (xsvabi00)
 * @version 1.0
 */

const units = require('./calculatorCore').testing;
const calc = require('./calculatorCore').calc;

test('Splitting simple expressions', () => {
    expect(units.splitSimpleExpression('3')).toEqual(3);
    expect(units.splitSimpleExpression('3.138565')).toEqual(3.138565);
    expect(units.splitSimpleExpression('3+3')).toEqual(['+', 3, 3]);
    expect(units.splitSimpleExpression('3/5.01393/6')).toEqual(['/', 3, 5.01393, 6]);
    expect(units.splitSimpleExpression('1+8*4')).toEqual(['+', 1, ['*', 8, 4]]);
    expect(units.splitSimpleExpression('1/6+11-7+8!*4')).toEqual(['+', ['/', 1, 6], ['-', 11, 7], ['*', ['!', 8], 4]]);
    expect(units.splitSimpleExpression('1/N6+11-7+8!*4')).toEqual(['+', ['/', 1, -6], ['-', 11, 7], ['*', ['!', 8], 4]]);
});

test('Plusminus axiom', () => {
    expect(units.plusMinusAxiom('0--5')).toBe('0+5');
    expect(units.plusMinusAxiom('3+-6')).toBe('3-6');
    expect(units.plusMinusAxiom('3+---+--+++-+--+--+-+++-6')).toBe('3+6');
    expect(units.plusMinusAxiom('1+--2---+--3++4-5+-++---6+--++-7+8---------------9')).toBe('1+2-3+4-5+6-7+8-9');
    expect(units.plusMinusAxiom('9--8*24-+----6')).toBe('9+8*24-6');
});

/*test('Simple adding', () => {
    expect(calc('0+0')).toBe(0);
    expect(calc('3+2')).toBe(5);
    expect(calc('2115+1521')).toBe(3636);
    expect(calc('0+54')).toBe(54);
    expect(calc('54+0')).toBe(54);
});*/

test('Complex calculation', () => {
    // expect(calc('3')).toBe(3);
    // expect(calc('3.138565')).toBe(3.138565);
    expect(calc('3+3')).toBe(6);
    expect(calc('3/5.01393/6')).toBeCloseTo(0.099722174);
    expect(calc('1+8*4')).toBe(33);
    expect(calc('1/3+8*-14-1+7!/5')).toBeCloseTo(895.333333333);
    expect(calc('2*(8+log(9+1-log(3+4*(8-6)-4))!/2+0.5-log(4*5-4)+7)-8')).toBeCloseTo(21.5761489657);
    // > "2*(8+log(9+1-log(3+4*(8-6)-4))!/2+0.5-log(4*5-4)+7)-8".match(/(log|ln|sin|cos|tan)\(([0-9\+\-\*\/\!])*\)/g);
});
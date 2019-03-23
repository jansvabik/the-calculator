/**
 * MATHEMATIC LIBRARY TESTS
 * 
 * @description The library will be developed using this tests (test-driven development).
 * @author Jan Svabik (xsvabi00)
 * @version 1.1
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

test('Brackets axiom', () => {
    expect(calc('6+3*2')).toBe(12);
    expect(calc('(6+3)*2')).toBe(18);
    expect(calc('6+3*2+1')).toBe(13);
    expect(calc('6+3*(2+1)')).toBe(15);
});

test('Simple operations (+, -, *, /, !, ^)', () => {
    expect(calc('0+0')).toBe(0);
    expect(calc('3-8')).toBe(-5);
    expect(calc('2115+1521')).toBe(3636);
    expect(calc('0-54')).toBe(-54);
    expect(calc('54*(9^-3)')).toBeCloseTo(0.0740740741);
});

test('Pure functions', () => {
    expect(calc('ln(E)')).toBe(1);
    expect(calc('log(10)')).toBe(1);
    expect(calc('ln(8)')).toBeCloseTo(2.07944154);
    expect(calc('log(8)')).toBeCloseTo(0.903089987);
    expect(calc('sin(1)')).toBeCloseTo(0.8414709848);
    expect(calc('cos(2.4)')).toBeCloseTo(-0.73739371554);
    expect(calc('tan(-9.1)')).toBeCloseTo(0.336700526);
});

test('Combined functions', () => {
    expect(calc('log(cos(0)*10)')).toBe(1);
    expect(calc('log(-sin(14-tan(-4.333)))')).toBeCloseTo(-0.1441975);
    expect(calc('tan(-ln(14+cos(0.5)))')).toBeCloseTo(0.47290436676);
    expect(calc('cos(cos(cos(cos(cos(123.456)))))')).toBeCloseTo(0.71091014229);
    expect(calc('sin(cos(tan(ln(log(987.654321)))))')).toBeCloseTo(-0.36123226071);
});

test('Complex calculations', () => {
    expect(calc('3')).toBe(3);
    expect(calc('3.138565')).toBe(3.138565);
    expect(calc('3+3')).toBe(6);
    expect(calc('3/5.01393/6')).toBeCloseTo(0.099722174);
    expect(calc('1+8*4')).toBe(33);
    expect(calc('1/3+8*-14-1+7!/5')).toBeCloseTo(895.333333333);
    expect(calc('7*4+log(8+13*sin(18.3-4/2)+22)/3!-ln(14+3!)')).toBeCloseTo(25.230416403);
    expect(calc('2+(-log(1.8))*(8+sin(9+1-log(3+4*ln(8-6)-4))+4!/2+0.5+(1)-tan(4*5-4)+7)-cos(8)')).toBeCloseTo(-4.97112211349);
    expect(calc('4*(2+6^-(1+1))/sin([3]root[27])*3^-2')).toBeCloseTo(6.386299010973019);
    expect(calc('log(-sin((14-tan(-4.333)+5)*2))+((5-[3]root[27]))!/log(PI^3)')).toBeCloseTo(1.256190271546842);

    expect(() => calc('2*(8+log(9+1-log(3+4*(8-6)-4))!/2+0.5-log(4*5-4)+7)-8')).toThrow();
});
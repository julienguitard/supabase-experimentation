import { assertEquals } from '@std/assert'
import { cleanNullUndefined, cleanBoolean, cleanNumber, cleanString, cleanArray, cleanObject, cleanRecursively } from './meaningful-text-extractions.ts'

Deno.test('cleanNullUndefined', () => {
  assertEquals(cleanNullUndefined(null), '')
  assertEquals(cleanNullUndefined(undefined), '')
})

Deno.test('cleanBoolean', () => {
  assertEquals(cleanBoolean(true), 'true')
  assertEquals(cleanBoolean(false), 'false')
})

Deno.test('cleanNumber', () => {
  assertEquals(cleanNumber(42), '42')
  assertEquals(cleanNumber(0), '0')
  assertEquals(cleanNumber(-10), '-10')
})

Deno.test('cleanString', () => {
  assertEquals(cleanString('hello'), 'hello')
  assertEquals(cleanString(''), '')
})

Deno.test('cleanArray', () => {
  const result = cleanArray([1, 2, 3], (n) => n.toString())
  assertEquals(result, '1\n2\n3')
})

Deno.test('cleanObject', () => {
  const obj = { name: 'John', age: 30, city: 'NYC' }
  const result = cleanObject(obj, ['name', 'city'], (v) => v.toString())
  assertEquals(result, 'John\nNYC')
})

Deno.test('cleanRecursively - boolean', () => {
  assertEquals(cleanRecursively(true, []), 'true')
  assertEquals(cleanRecursively(false, []), 'false')
})

Deno.test('cleanRecursively - null/undefined', () => {
  assertEquals(cleanRecursively(null, []), '')
  assertEquals(cleanRecursively(undefined, []), '')
})

Deno.test('cleanRecursively - number', () => {
  assertEquals(cleanRecursively(42, []), '42')
})

Deno.test('cleanRecursively - string', () => {
  assertEquals(cleanRecursively('test', []), 'test')
})

Deno.test('cleanRecursively - array', () => {
  const result = cleanRecursively([1, 'hello', true], [])
  assertEquals(result, '1\nhello\ntrue')
})

Deno.test('cleanRecursively - object', () => {
  const obj = { 
    text: 'Hello', 
    data: 'World',
    ignored: 'Should not appear'
  }
  const result = cleanRecursively(obj, ['text', 'data'])
  assertEquals(result, 'Hello\nWorld')
})

Deno.test('cleanRecursively - nested object', () => {
  const obj = {
    data: {
      text: 'Nested content',
      results: [1, 2, 3]
    }
  }
  const result = cleanRecursively(obj, ['data', 'text', 'results'])
  assertEquals(typeof result, 'string')
})


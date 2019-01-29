const dpp = require('.')

describe('Test get method', () => {
  test('Get property and test simple values', () => {
    const g1 = { foo: { bar: 1 } }
    expect(dpp.get(g1)).toBe(null)
    g1[''] = 'foo'
    expect(dpp.get(g1, '')).toBe('foo')
    expect(dpp.get({ foo: 1 }, 'foo')).toBe(1)
    expect(dpp.get({ foo: null }, 'foo')).toBe(null)
    expect(dpp.get({ foo: undefined }, 'foo')).toBe(undefined)
    expect(dpp.get({ foo: { bar: true } }, 'foo.bar')).toBe(true)
    expect(dpp.get({ foo: { bar: { baz: true } } }, 'foo.bar.baz')).toBe(true)
    expect(dpp.get({ foo: { bar: { baz: null } } }, 'foo.bar.baz')).toBe(null)
    expect(dpp.get({ foo: { bar: 'a' } }, 'foo.fake')).toBe(null)
    expect(dpp.get({ foo: { bar: 'a' } }, 'foo.fake.fake2')).toBe(null)
    expect(dpp.get({ foo: { bar: 'a' } }, 'foo.fake.fake2', 'some value')).toBe('some value')
    expect(dpp.get({ foo: 1 }, 'foo.bar')).toBe(null)
  })

  test('Get property and test extended values', () => {
    const g2 = {}
    Object.defineProperty(g2, 'foo', {
      value: 'bar'
    })
    expect(dpp.get(g2, 'foo')).toBe('bar')
    expect(dpp.get({}, 'hasOwnProperty')).toBe(null)

    function fn () {}
    fn.foo = { bar: 1 }
    expect(dpp.get(fn)).toBe(null)
    expect(dpp.get(fn, 'foo')).toBe(fn.foo)
    expect(dpp.get(fn, 'foo.bar')).toBe(1)

    const g3 = { foo: null }
    expect(dpp.get(g3, 'foo.bar')).toBe(null)
    expect(dpp.get(g3, 'foo.bar', 'some value')).toBe('some value')
    expect(dpp.get([], 'foo.bar', false)).toBe(false)
  })

  test('Get property without valid arguments should return null', () => {
    expect(dpp.get(null, 'foo.bar', false)).toBe(null)
    expect(dpp.get('foo', 'foo.bar', false)).toBe(null)
    expect(dpp.get(undefined, 'foo.bar', false)).toBe(null)
  })
})

describe('Test set method', () => {
  test('set simple property value', () => {
    const func = () => 'test'
    let o1 = {}

    const s1 = dpp.set(o1, 'foo', 2)
    expect(s1.foo).toBe(2)
    expect(s1).toBe(o1)

    o1 = { foo: { bar: 1 } }
    dpp.set(o1, 'foo.bar', 2)
    expect(o1.foo.bar).toBe(2)

    dpp.set(o1, 'foo.bar.baz', 3)
    expect(o1.foo.bar.baz).toBe(3)

    dpp.set(o1, 'foo.bar', 'test')
    expect(o1.foo.bar).toBe('test')

    dpp.set(o1, 'foo.bar', null)
    expect(o1.foo.bar).toBe(null)

    dpp.set(o1, 'foo.bar', false)
    expect(o1.foo.bar).toBe(false)

    dpp.set(o1, 'foo.fake.fake2', 'fake')
    expect(o1.foo.fake.fake2).toBe('fake')

    dpp.set(o1, 'foo.function', func)
    expect(o1.foo.function).toBe(func)

    function fn () {}
    dpp.set(fn, 'foo.bar', 1)
    expect(dpp.get(fn, 'foo.bar')).toBe(1)

    o1.fn = fn
    dpp.set(o1, 'fn.bar.baz', 2)
    expect(o1.fn.bar.baz).toBe(2)

    const o2 = { foo: null }
    dpp.set(o2, 'foo.bar', 2)
    expect(o2.foo.bar).toBe(2)

    const o3 = {}
    dpp.set(o3, '', 3)
    expect(o3['']).toBe(3)

    const o4 = 'noobject'
    const s4 = dpp.set(o4, 'foo.bar', 2)
    expect(o4).toBe('noobject')
    expect(s4).toBe(false)
  })
})

describe('Test delete method', () => {
  test('Delete property', () => {
    const func = () => 'test'
    func.foo = 'bar'

    const inner = {
      a: 'a',
      b: 'b',
      c: 'c',
      func
    }

    const f1 = {
      foo: {
        bar: {
          baz: inner
        }
      },
      top: {
        dog: 'angelina'
      }
    }

    expect(f1.foo.bar.baz.c).toBe('c')
    dpp.delete(f1, 'foo.bar.baz.c')
    expect(f1.foo.bar.baz.c).toBe(undefined)

    expect(f1.top.dog).toBe('angelina')
    expect(dpp.delete(f1)).toBe(false)

    expect(f1.foo.bar.baz.func.foo).toBe('bar')
    dpp.delete(f1)
    expect(f1.foo.bar.baz.func.foo).toBe('bar')

    expect(f1.foo.bar.baz.func).toBe(func)
    dpp.delete(f1, 'foo.bar.baz.func')
    expect(f1.foo.bar.baz.func).toBe(undefined)

    const f2 = { foo: null }
    expect(dpp.delete(f2, 'foo.bar')).toBe(false)
    expect(f2).toEqual({ foo: null })
  })
})

describe('Test has method', () => {
  test('Has property should return only boolean', () => {
    const f1 = { foo: { bar: 1 } }

    expect(dpp.has(f1)).toBe(false)
    expect(dpp.has(f1, 'foo')).toBe(true)
    expect(dpp.has({ foo: 1 }, 'foo')).toBe(true)
    expect(dpp.has({ foo: null }, 'foo')).toBe(true)
    expect(dpp.has({ foo: undefined }, 'foo')).toBe(true)
    expect(dpp.has({ foo: { bar: true } }, 'foo.bar')).toBe(true)
    expect(dpp.has({ foo: { bar: { baz: true } } }, 'foo.bar.baz')).toBe(true)
    expect(dpp.has({ foo: { bar: { baz: null } } }, 'foo.bar.baz')).toBe(true)
    expect(dpp.has({ foo: { bar: { baz: false } } }, 'foo.bar.baz')).toBe(true)
    expect(dpp.has({ foo: { bar: 'a' } }, 'foo.fake.fake2')).toBe(false)
    expect(dpp.has({ foo: null }, 'foo.bar')).toBe(false)
    expect(dpp.has({ foo: '' }, 'foo.bar')).toBe(false)

    function fn () {}
    fn.foo = { bar: 1 }
    expect(dpp.has(fn)).toBe(false)
    expect(dpp.has(fn, 'foo')).toBe(true)
    expect(dpp.has(fn, 'foo.bar')).toBe(true)
  })
})

const Benchmark = require('benchmark')
const m = require('.')
const p = require('dot-prop')
let suite = new Benchmark.Suite()

function compareDirect (benchArray, suiteName) {
  const getCompared = benchArray.filter(item => item.name.includes(suiteName)).sort(function (a, b) {
    if (a.hz > b.hz) {
      return 1
    }
    if (a.hz < b.bz) {
      return -1
    }
    return 0
  })

  const inPercent = (getCompared[0].hz / getCompared[1].hz) + 1
  return `${getCompared[1].name} is ${Number(inPercent.toFixed(2))} times faster than ${getCompared[0].name}`
}

// add tests
suite.add('opt.get', function () {
  const f1 = { foo: { bar: 1 } }
  p.get(f1)
  f1[''] = 'foo'
  m.get(f1, '')
  m.get(f1, 'foo')
  m.get({ foo: 1 }, 'foo')
  m.get({ foo: null }, 'foo')
  m.get({ foo: undefined }, 'foo')
  m.get({ foo: { bar: true } }, 'foo.bar')
  m.get({ foo: { bar: { baz: true } } }, 'foo.bar.baz')
  m.get({ foo: { bar: { baz: null } } }, 'foo.bar.baz')
  m.get({ foo: { bar: 'a' } }, 'foo.fake')
  m.get({ foo: { bar: 'a' } }, 'foo.fake.fake2')

  const f2 = {}
  Object.defineProperty(f2, 'foo', {
    value: 'bar',
    enumerable: false
  })
  m.get(f2, 'foo')
  m.get({}, 'hasOwnProperty')

  function fn () {}
  fn.foo = { bar: 1 }
  m.get(fn)
  m.get(fn, 'foo')
  m.get(fn, 'foo.bar')

  const f3 = { foo: null }
  m.get(f3, 'foo.bar')
  m.get(null, 'foo.bar', false)
  m.get('foo', 'foo.bar', false)
  m.get([], 'foo.bar', false)
  m.get(undefined, 'foo.bar', false)
})
  .add('opt.set', function () {
    const func = () => 'test'
    let f1 = {}

    m.set(f1, 'foo', 2)

    f1 = { foo: { bar: 1 } }
    m.set(f1, 'foo.bar', 2)

    m.set(f1, 'foo.bar.baz', 3)

    m.set(f1, 'foo.bar', 'test')

    m.set(f1, 'foo.bar', null)

    m.set(f1, 'foo.bar', false)

    m.set(f1, 'foo.bar', undefined)

    m.set(f1, 'foo.fake.fake2', 'fake')

    m.set(f1, 'foo.function', func)

    function fn () {}
    m.set(fn, 'foo.bar', 1)

    f1.fn = fn
    m.set(f1, 'fn.bar.baz', 2)

    const f2 = { foo: null }
    m.set(f2, 'foo.bar', 2)

    const f3 = {}
    m.set(f3, '', 3)
  })
  .add('opt.delete', function () {
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
        dog: 'sindre'
      }
    }

    m.delete(f1, 'foo.bar.baz.c')

    m.delete(f1, 'top')

    m.delete(f1, 'foo.bar.baz.func.foo')

    m.delete(f1, 'foo.bar.baz.func')
  }).add('opt.has', function () {
    const f1 = { foo: { bar: 1 } }
    m.has(f1)
    m.has(f1, 'foo')
    m.has({ foo: 1 }, 'foo')
    m.has({ foo: null }, 'foo')
    m.has({ foo: undefined }, 'foo')
    m.has({ foo: { bar: true } }, 'foo.bar')
    m.has({ foo: { bar: { baz: true } } }, 'foo.bar.baz')
    m.has({ foo: { bar: { baz: null } } }, 'foo.bar.baz')
    m.has({ foo: { bar: 'a' } }, 'foo.fake.fake2')

    function fn () {}
    fn.foo = { bar: 1 }
    m.has(fn)
    m.has(fn, 'foo')
    m.has(fn, 'foo.bar')
  })
  .add('dot-props.get', function () {
    const f1 = { foo: { bar: 1 } }
    p.get(f1)
    f1[''] = 'foo'
    p.get(f1, '')
    p.get(f1, 'foo')
    p.get({ foo: 1 }, 'foo')
    p.get({ foo: null }, 'foo')
    p.get({ foo: undefined }, 'foo')
    p.get({ foo: { bar: true } }, 'foo.bar')
    p.get({ foo: { bar: { baz: true } } }, 'foo.bar.baz')
    p.get({ foo: { bar: { baz: null } } }, 'foo.bar.baz')
    p.get({ foo: { bar: 'a' } }, 'foo.fake')
    p.get({ foo: { bar: 'a' } }, 'foo.fake.fake2')

    const f2 = {}
    Object.defineProperty(f2, 'foo', {
      value: 'bar',
      enumerable: false
    })
    p.get(f2, 'foo')
    p.get({}, 'hasOwnProperty')

    function fn () {}
    fn.foo = { bar: 1 }
    p.get(fn)
    p.get(fn, 'foo')
    p.get(fn, 'foo.bar')

    const f3 = { foo: null }
    p.get(f3, 'foo.bar')
    p.get(null, 'foo.bar', false)
    p.get('foo', 'foo.bar', false)
    p.get([], 'foo.bar', false)
    p.get(undefined, 'foo.bar', false)
  })
  .add('dot-props.set', function () {
    const func = () => 'test'
    let f1 = {}

    p.set(f1, 'foo', 2)

    f1 = { foo: { bar: 1 } }
    p.set(f1, 'foo.bar', 2)

    p.set(f1, 'foo.bar.baz', 3)

    p.set(f1, 'foo.bar', 'test')

    p.set(f1, 'foo.bar', null)

    p.set(f1, 'foo.bar', false)

    p.set(f1, 'foo.bar', undefined)

    p.set(f1, 'foo.fake.fake2', 'fake')

    p.set(f1, 'foo.function', func)

    function fn () {}
    p.set(fn, 'foo.bar', 1)

    f1.fn = fn
    p.set(f1, 'fn.bar.baz', 2)

    const f2 = { foo: null }
    p.set(f2, 'foo.bar', 2)

    const f3 = {}
    p.set(f3, '', 3)
  })
  .add('dot-props.delete', function () {
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
        dog: 'sindre'
      }
    }

    p.delete(f1, 'foo.bar.baz.c')

    p.delete(f1, 'top')

    p.delete(f1, 'foo.bar.baz.func.foo')

    p.delete(f1, 'foo.bar.baz.func')
  }).add('dot-props.has', function () {
    const f1 = { foo: { bar: 1 } }
    p.has(f1)
    p.has(f1, 'foo')
    p.has({ foo: 1 }, 'foo')
    p.has({ foo: null }, 'foo')
    p.has({ foo: undefined }, 'foo')
    p.has({ foo: { bar: true } }, 'foo.bar')
    p.has({ foo: { bar: { baz: true } } }, 'foo.bar.baz')
    p.has({ foo: { bar: { baz: null } } }, 'foo.bar.baz')
    p.has({ foo: { bar: 'a' } }, 'foo.fake.fake2')

    function fn () {}
    fn.foo = { bar: 1 }
    p.has(fn)
    p.has(fn, 'foo')
    p.has(fn, 'foo.bar')
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Finish')
    console.log(compareDirect(this, '.get'))
    console.log(compareDirect(this, '.set'))
    console.log(compareDirect(this, '.delete'))
    console.log(compareDirect(this, '.has'))
  })
  // run async
  .run({ 'async': true })

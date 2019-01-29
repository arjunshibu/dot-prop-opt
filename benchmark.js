const Benchmark = require('benchmark')
const m = require('.')
let suite = new Benchmark.Suite()

// add tests
suite.add('Get', function () {
  const f1 = { foo: { bar: 1 } }
  m.get(f1)
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
  .add('Set', function () {
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
  .add('Delete', function () {
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
  }).add('Has', function () {
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
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Finish')
  })
  // run async
  .run({ 'async': true })

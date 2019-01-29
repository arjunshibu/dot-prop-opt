# dot-prop-opt [![Build Status](https://travis-ci.org/AlexanderVu/dot-prop-opt.svg?branch=master)](https://travis-ci.org/AlexanderVu/dot-prop-optp) [![codecov](https://codecov.io/gh/AlexanderVu/dot-prop-opt/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderVu/dot-prop-opt)

> Modify nested object properties using a dot path. Package is runtime optimized.

I have test this version with dot-prop package. The optimized version is significant faster on `get` and `delete`, but also bit faster on `has` and `set` methods.

```
opt.get x 300,660 ops/sec ±0.69% (89 runs sampled)
opt.set x 301,490 ops/sec ±0.63% (88 runs sampled)
opt.delete x 677,365 ops/sec ±1.10% (89 runs sampled)
opt.has x 397,895 ops/sec ±1.09% (86 runs sampled)
dot-props.get x 183,423 ops/sec ±1.19% (88 runs sampled)
dot-props.set x 216,006 ops/sec ±1.03% (87 runs sampled)
dot-props.delete x 485,108 ops/sec ±0.98% (87 runs sampled)
dot-props.has x 357,707 ops/sec ±1.61% (81 runs sampled)
```


## Install

```
$ npm install dot-prop-opt
```

## Usage

```js
const sdp = require('dot-prop-opt');

// get
sdp.get({name: {first: 'julia'}}, 'name.first');
//=> 'julia'

sdp.get({name: {first: 'a'}}, 'name.notDefined.deep');
//=> undefined

sdp.get({name: {first: 'a'}}, 'name.notDefined.deep', 'default value');
//=> 'default value'

// set
const obj = {foo: {bar: 'a'}};
sdp.set(obj, 'name.first', 'julia');
console.log(obj);
//=> {name: {first: 'julia'}}

const person = sdp.set({}, 'name.first', 'julia');
console.log(person);
//=> {name: {first: 'name.first'}}

sdp.set(obj, 'name.middle', 'marie');
console.log(obj);
//=> {name: {first: 'julia', middle: 'marie'}}

// has
sdp.has({name: {first: 'julia'}}, 'name.first');
//=> true

// delete
const obj = {name: {first: 'julia'}};
sdp.delete(obj, 'name.first');
console.log(obj);
//=> {name: {}}

obj.name = {first: 'julia', middle: 'marie'};
sdp.delete(obj, 'name.first');
console.log(obj);
//=> {name: {middle: 'marie'}}
```

## API

### get(obj, path, [defaultValue])

### set(obj, path, value)

Returns the object or false on error.

### has(obj, path)

### delete(obj, path)

#### obj

Type: `Object`

Object to get, set, or delete the `path` value.

#### path

Type: `string`

Path of the property in the object, using `.` to separate each nested key.

Do not use a `.` in the key (name).

#### value

Type: `any`

Value to set at `path`.

#### defaultValue

Type: `any`

Default value.

## License

MIT © Alexander Vu

const isObject = require('is-obj')

const isPrototypePolluted = (property) => /__proto__|constructor|prototype/.test(property)

module.exports = {
  get (obj, path, value) {
    if (!isObject(obj) || typeof path !== 'string') {
      return null
    }

    if (typeof value === 'undefined') {
      value = null
    }

    return path.split('.').reduce(
      (data, property) => {
        if (data && data.hasOwnProperty(property)) {
          return data[property]
        }

        return value
      },
      obj
    )
  },

  set (obj, path, value) {
    if (!isObject(obj) || typeof path !== 'string') {
      return false
    }

    const propertyArray = path.split('.')
    const propertyCount = propertyArray.length - 1
    let pointer = obj

    propertyArray.forEach((property, index) => {
      if (!pointer[property] || !isObject(pointer[property]) || propertyCount === index) {
        pointer[property] = propertyCount === index ? value : {}
      }

      pointer = isPrototypePolluted(property) ? {} : pointer[property]
    })

    return obj
  },

  delete (obj, path) {
    if (!isObject(obj) || typeof path !== 'string') {
      return false
    }

    const pathArr = path.split('.')

    for (let i = 0; i < pathArr.length; i++) {
      const p = pathArr[i]

      if (i === pathArr.length - 1) {
        delete obj[p]

        return true
      }

      obj = obj[p]

      if (!isObject(obj)) {
        return false
      }
    }
  },

  has (obj, path) {
    if (!isObject(obj) || typeof path !== 'string') {
      return false
    }

    return path.split('.').reduce(
      (data, property, currentIndex, currentArray) => {
        if (data && data.hasOwnProperty(property)) {
          return currentArray.length === (currentIndex + 1) ? true : data[property]
        }

        return false
      },
      obj
    )
  }
}

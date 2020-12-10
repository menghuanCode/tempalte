const toString = Object.prototype.toString
const isArray = (value) => (toString.call(value)).slice(8, -1) === 'Array'
const isFunction = (value) => (toString.call(value)).slice(8, -1) === 'Function'

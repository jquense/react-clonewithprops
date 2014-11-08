'use strict';
var React    = require('react')
  , extend   = require('xtend')
  , hasOwn   = Object.prototype.hasOwnProperty
  , version  = React.version.split('.').map(parseFloat)
  , RESERVED = {
      className:  resolve(joinClasses),
      children:   function(){},
      key:        function(){},
      ref:        function(){},
      style:      resolve(extend)
    };

module.exports = function cloneWithProps(child, props) {
  var newProps = mergeProps(extend(props), child.props);

  if (!hasOwn.call(newProps, 'children') && hasOwn.call(child.props, 'children'))
    newProps.children = child.props.children;

  // < 0.11
  if (version[0] === 0 && version[1] < 11)
    return child.constructor.ConvenienceConstructor(newProps);
  
  // 0.11
  if (version[0] === 0 && version[1] === 11)
    return child.constructor(newProps);

  // 0.12
  else if (version[0] === 0 && version[1] === 12){
    MockLegacyFactory.isReactLegacyFactory = true
    MockLegacyFactory.type = child.type
    return React.createElement(MockLegacyFactory, newProps);
  }

  // 0.13+
  return React.createElement(child.type, newProps);

  function MockLegacyFactory(){}
}

//mutates first arg
function mergeProps(source, target) {
  for (var key in target) {
    if (hasOwn.call(RESERVED, key) )
      RESERVED[key](source, target[key], key)

    else if ( !hasOwn.call(source, key) )
      source[key] = target[key];
  }
  return source
}

function resolve(fn){
  return function(src, value, key){
    if( !hasOwn.call(src, key)) src[key] = value
    else src[key] = fn(src[key], value)
  }
}

function joinClasses(a, b){
  if ( !a ) return b || ''
  return a + (b ? ' ' + b : '')
}
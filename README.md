# What?

Condensate is a super cool library for managing application state inspired by Om, Clojure, Bose and Einstein.

It provides a lightweight atom ([inspired by Clojure](http://clojure.org/atoms)) and cursor ([inspired by Om](https://github.com/omcljs/om/wiki/Cursors)) implementation to enable robust and low ceremony coordination of application state changes. Actual state data is stored using the excellent [Immutable.js](https://github.com/facebook/immutable-js) library.

Though designed to be used in the context of a [React](https://facebook.github.io/react/) application, no actual dependency exists on React, and an attempt has been made to keep the scope restricted to state management.

# Why?

Much has already been written about the benefits of immutable data and careful management of state changes. For now I'll refer you to a few excellent talks:

* [David Nolen - Immutability, interactivity & JavaScript ](https://www.youtube.com/watch?v=mS264h8KGwk)
* [Lee Byron - Immutable Data and React](https://www.youtube.com/watch?v=I7IdS-PbEgI)

# Installation

Currently, Condensate is available as raw, untranspiled ES6. [Webpack](http://webpack.github.io/) and [Babel](https://babeljs.io/) are highly recommended, though I'm not opposed to distributing a transpiled-to-ES5 version. See the `examples/webpack.config.js` for a working example.

# Usage

## Basics

```js
import Atom from 'condensate'
import Immutable from 'immutable'
var atom = new Atom()
```

The initial value defaults to an empty Immutable.Map, but you can pass in your own via the first parameter.

```js
atom = new Atom(Immutable.Map({number: 1}))
```

The current value of the atom is available via the value property:

```js
atom.value.get('number') === 1
```

An Atom has update methods based on Immutable's API, each prefixed with "do":

```js
atom.doSet('number', 2)
atom.doUpdate('number', n => n + 1)
atom.value.get('number') === 3
```


## Transactions

Many state transitions must be coordinated with asynchronous requests to the server. Rather then waiting for the full round trip to succeed, Condensate allows you to optimistically apply the change using a transaction. This is done by passing a transaction function to `doTransact`.

```js
const transaction = atom.doTransact(function(value) {
  return value.set('number', 4)
})
atom.value.get('number') === 4
```

The function will receive the current value and must return a new replacement value. `doTransact` returns a transaction object, which has a commit method and cancel method.

```js
setNumberOnServerWithAjax(4)
  .then(transaction.commit)
  .catch(transaction.cancel)
```

The transaction function is placed in a queue and applied to the state immediately. You can then commit or cancel the transaction depending on the response from the server. If the transaction is canceled, the function will be removed and the state will be rolled back. Any other transactions which come later in the queue will be reapplied.

A transaction function must be pure, as it may be called repeatedly based on results of other transactions that preceed it.

The sugar update functions are actually implemented on top of the base `doTransact` function and automatically call commit.

## Cursors

Managing state from a root atom would seem to severely restrict our ability to build modular components. The Om inspired solution is to allow cursors to be derived from the root atom.

```js
atom = new Atom(Immutable.fromJS({nested: {letter: 'a'}}))
var cursor = atom.cursor(['nested'])
cursor.value.get('letter') === 'a'
```

Cursors maintain an internal reference to their root atom along with a path to their node. The Cursor API is identical the Atom API, and you can even derive deeper cursors if needed. Changes made to the cursor's value will be reflected in the root atom.

```js
cursor.doSet('letter', 'b')
atom.value.getIn(['nested', 'letter']) == 'b'
```

The idea is that you can create modular components that only depend on being passed an atom or cursor which they can update as appropriate without being coupled to a specific overall data structure.


## Subscriptions

A simple subscription API enables straightforward and flexible integration. Subscribing functions will only be called when the relevant value changes.

```js
var cancel = atom.subscribe(function(value, oldValue) {
  console.log(value)
})
// ... later
cancel()
```

Subscriptions can be scoped using a path array. Cursors automatically prefix the path of their subscribers with the path of the cursor.

```js
atom.subscribe(['nested'], function(value, oldValue) {
  console.log(value)
})

// ... is identical to ...

cursor.subscribe(function(value, oldValue) {
  console.log(value)
})
```

# Stability

I've been using it on a few unreleased early stage projects with great success, but I want to let it bake for a bit to ensure everything is conceptually sound before stamping a beta or higher version on it.

The basic (and intentionally narrow) scope of the project is largely in place, with no major functionality currently planned for the code library. I do intend to add a few extras, primarily around integration helpers for other projects such as React and react-router.

There are also some potential optimizations and a few design decisions around error handling that will need to occur, but as of now there are no known glaring issues.

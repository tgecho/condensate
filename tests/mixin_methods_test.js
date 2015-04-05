import Imm from 'immutable';
import Atom from 'condensate';
import {immEqual, parameterize, parameterizeAtomTypes} from './helpers';

const foobar = Imm.Map({'foo': 'bar'});

const atoms = [
	Imm.fromJS({a: {b: {c: 1}}}),
	Imm.fromJS([1, 2, 3]),
	Imm.Set([1, 2, 3])
];

const tests = [
	[0, 'doSet', ['a', 2], Imm.fromJS({a: 2})],
	[0, 'doDelete', ['a'], Imm.fromJS({})],
	[0, 'doClear', [], Imm.fromJS({})],
	[0, 'doUpdate', [v => v.set('a', 2)], Imm.fromJS({a: 2})],
	[0, 'doMerge', [[['a', 2]], {b: 3}], Imm.fromJS({a: 2, b: 3})],
	[0, 'doMergeWith', [(p, n) => p, {a: 2}], Imm.fromJS({a: {b: {c: 1}}})],
	[0, 'doMergeDeep', [{a: {b: 2}}], Imm.fromJS({a: {b: 2}})],
	[0, 'doMergeDeepWith', [(p, n) => n, {a: {b: 2}}], Imm.fromJS({a: {b: 2}})],

	[0, 'doSetIn', [['a', 'b'], 2], Imm.fromJS({a: {b: 2}})],
	[0, 'doDeleteIn', [['a', 'b']], Imm.fromJS({a: {}})],
	[0, 'doUpdateIn', [['a', 'b'], v => v.set('c', 2)], Imm.fromJS({a: {b: {c: 2}}})],
	[0, 'doMergeIn', [['a'], [['b', 2]], {c: 3}], Imm.fromJS({a: {b: 2, c: 3}})],
	[0, 'doMergeDeepIn', [['a'], {b: {d: 3}}], Imm.fromJS({a: {b: {c: 1, d: 3}}})],

	[1, 'doPush', [4], Imm.fromJS([1, 2, 3, 4])],
	[1, 'doPop', [], Imm.fromJS([1, 2])],
	[1, 'doUnshift', [0], Imm.fromJS([0, 1, 2, 3])],
	[1, 'doShift', [], Imm.fromJS([2, 3])],
	[1, 'doSetSize', [2], Imm.fromJS([1, 2])],

	[2, 'doAdd', [4], Imm.Set([1, 2, 3, 4])],
	[2, 'doUnion', [[3, 4]], Imm.Set([1, 2, 3, 4])],
	[2, 'doIntersect', [[2, 5]], Imm.Set([2])],
	[2, 'doSubtract', [[2]], Imm.Set([1, 3])],
];

parameterizeAtomTypes(function([rootName, rootFn]) {

	suite(rootName + ' with mixin', function() {
		setup(function() {
			this.atoms = atoms.map(a => rootFn(a));
		});

		parameterize(function([atom_index, name, args, result], index) {

			test(`(${index}) ${name}`, function() {
				this.atoms[atom_index][name](...args);
				immEqual(this.atoms[atom_index].value, Imm.fromJS(result));
			});

		}, tests);

		teardown(function() {
			this.atoms.forEach(a => assert.equal(a.transactions.size, 0));
		});
	});

});

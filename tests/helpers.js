import Imm from 'immutable';
import Atom from 'condensate';

export function immEqual(left, right) {
	assert(Imm.is(left, right),
		`expected ${String(left)} to equal ${String(right)}`);
}
export function immNotEqual(left, right) {
	assert(!Imm.is(left, right),
		`expected ${String(left)} to not equal ${String(right)}`);
}

export function parameterize(fn, params) {
	params.forEach(function(variation, index) {
		fn(variation, index);
	});
}

export function parameterizeAtomTypes(fn) {
	parameterize(fn, [
		['Atom', function(initial) {
			return new Atom(initial);
		}],
		['Cursor', function(initial) {
			return (new Atom(initial)).cursor();
		}],
		['Deep Cursor', function(initial) {
			return (new Atom(Imm.fromJS({deep: initial || {}}))).cursor(['deep']);
		}]
	]);
}

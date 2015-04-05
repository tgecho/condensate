import Imm from 'immutable';
import Cursor from './Cursor';
import Transaction from './Transaction';
import AtomMixin from './AtomMixin';
import {assign} from './util';


assign(Atom.prototype, AtomMixin);
function Atom(base_state=Imm.Map()) {
	let pending_state = base_state;
	let transactions = Imm.OrderedMap();
	let applied_transactions = transactions;
	let subscribers = Imm.OrderedMap();
	let notifying = false;
	let queued = false;

	const self = this;

	self.valueOf = function() {
		return pending_state;
	};

	Object.defineProperties(this, {
		value: {get: self.valueOf},
		transactions: {get: function() {
			return transactions;
		}}
	});

	function applyTransactions(transactions, state) {
		return transactions.reduce(function(state, [path, fn]) {
			if (path.length > 0) {
				return state.updateIn(path, fn);
			} else {
				return fn(state);
			}
		}, state);
	}

	this.doTransact = function(path, fn) {
		if (fn === undefined) {
			fn = path;
			path = [];
		}
		const addition = new Transaction(commit, cancel);
		transactions = transactions.set(addition, Imm.List([path, fn]));
		notify();
		return addition;
	};

	function commit(trans) {
		transactions = transactions.setIn([trans, 2], true);
		const ready = transactions.takeWhile((t) => !!t.get(2));
		if (!ready.isEmpty()) {
			base_state = applyTransactions(ready, base_state);
		}
		transactions = transactions.skipWhile((t) => !!t.get(2));
		applied_transactions = transactions;
	}

	function cancel(trans) {
		transactions = transactions.remove(trans);
		notify();
	}

	function notify() {
		if (transactions !== applied_transactions) {
			pending_state = applyTransactions(transactions, base_state);
			applied_transactions = transactions;
		}
		const state = pending_state;

		if (notifying) {
			queued = true;
		} else if (queued) {
			queued = false;
			notify();
		} else {
			notifying = true;
			subscribers = subscribers.map(function(last, [path, fn]) {
				const current = state.getIn(path);
				if (!Imm.is(current, last)) {
					fn(current, last);
				}
				return current;
			});
			notifying = false;
		}
	}

	this.subscribe = function(path, fn) {
		if (fn === undefined) {
			fn = path;
			path = [];
		}
		const sub = [path, fn];

		subscribers = subscribers.set(sub, self.value.getIn(path));
		return function unsubscribe() {
			subscribers = subscribers.delete(sub);
		};
	};

	this.cursor = function(path=[]) {
		return new Cursor(path, self);
	};
}

export default Atom;

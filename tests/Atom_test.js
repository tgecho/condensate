import Imm from 'immutable';
import Atom from 'condensate';
import {immEqual, immNotEqual, parameterizeAtomTypes} from './helpers';

const foobar = Imm.Map({'foo': 'bar'});
function foobarer(state) {
	return state.set('foo', 'bar');
}

suite('Atom', function() {

	test('defaults to an empty Map', function() {
		immEqual(new Atom().value, Imm.Map());
	});

	test('uses inital state', function() {
		const intial = Imm.fromJS({a: 1});
		immEqual(new Atom(intial).value, intial);
	});

	parameterizeAtomTypes(function([name, rootFn]) {
		test('is equal to another atom with the same value', function() {
			immEqual(rootFn(), rootFn());
		});
		test("is equal to a cursor pointing at it's root", function() {
			immEqual(rootFn(), rootFn().cursor());
		});
	});
	suite('compared to another atom/cursor', function() {
		setup(function() {
			this.atom = new Atom();
			this.other = new Atom(Imm.fromJS({foo: {}}));
		});

		test('is not equal to an atom with a different value', function() {
			immNotEqual(this.atom, this.other);
		});

		test('is equal to a cursor holding the same value', function() {
			immEqual(this.atom, this.other.cursor(['foo']));
		});
	});

});

parameterizeAtomTypes(function([name, rootFn]) {
	suite(name, function() {
		setup(function() {
			this.root = rootFn();
		});

		test('can spawn a valid cursor', function() {
			const atom = rootFn(Imm.Map({foo: 'bar'}));
			const cursor = atom.cursor(['foo']);
			assert.equal(cursor.value, 'bar');
		});

		suite('transaction', function() {
			setup(function() {
				this.trans = this.root.doTransact(function(node) {
					return node.set('foo', 'bar');
				});
			});

			test('is applied to the state', function() {
				immEqual(this.root.value, foobar);
			});

			test('can be commited', function() {
				this.trans.commit();
				immEqual(this.root.value, foobar);
			});

			test('can be cancelled', function() {
				this.trans.cancel();
				immEqual(this.root.value, Imm.Map());
			});

			test('can stack', function() {
				this.root.doTransact((n) => n.set('foo', n.get('foo') + '!'));
				immEqual(this.root.value, Imm.Map({foo: 'bar!'}));
			});

			test('updates stack', function() {
				this.root.doUpdate((n) => n.set('foo', n.get('foo') + '!'));
				immEqual(this.root.value, Imm.Map({foo: 'bar!'}));
			});
		});

		suite('with a subscription', function() {
			setup(function() {
				this.root = rootFn();
				this.notifications = [];
				this.root.subscribe((state, last) =>
					this.notifications.push([state, last])
				);
			});

			test('notifies on update', function() {
				this.root.doUpdate(foobarer);
				const [state, last] = this.notifications[0];
				immEqual(last, Imm.Map());
				immEqual(state, foobar);
			});

			suite('and a transaction', function() {
				setup(function() {
					this.trans = this.root.doTransact(foobarer);
				});

				test('notifies immediately on transact', function() {
					const [state, last] = this.notifications[0];
					immEqual(last, Imm.Map());
					immEqual(state, foobar);
				});

				test('notifies on cancel', function() {
					this.trans.cancel();
					const [state, last] = this.notifications[1];
					immEqual(last, foobar);
					immEqual(state, Imm.Map());
				});

				test('does not notify on commit', function() {
					this.trans.commit();
					assert.equal(this.notifications.length, 1);
				});
			});
		});

		suite('with a scoped subscription', function() {
			setup(function() {
				this.root = rootFn(Imm.fromJS({one: {two: 'three'}}));
				this.notifications = [];
				this.root.subscribe(['one'], (state, last) =>
					this.notifications.push([state, last])
				);
			});

			test('notifies on relevant updates', function() {
				this.root.doUpdate(s => s.setIn(['one', 'two'], 'four'));
				const [state, last] = this.notifications[0];
				immEqual(last, Imm.Map({two: 'three'}));
				immEqual(state, Imm.Map({two: 'four'}));
			});

			test("doesn't notify on irrelevant updates", function() {
				this.root.doUpdate(foobarer);
				assert.lengthOf(this.notifications, 0);
			});
		});

		suite('when a notification triggers another update', function() {
			setup(function() {
				const self = this;
				self.root = rootFn(Imm.Map({success: undefined}));
				self.root.subscribe(function(state, last) {
					self.root.doUpdate(s => Imm.Map({success: true}));
				});
				self.root.doUpdate(s => Imm.Map({success: false}));
			});

			test('the second update should be applied last', function() {
				assert.ok(this.root.value.get('success'));
			});
		});
	});
});

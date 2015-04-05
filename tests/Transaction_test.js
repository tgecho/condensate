import Imm from 'immutable';
import Atom from 'condensate';
import {immEqual, parameterizeAtomTypes} from './helpers';

parameterizeAtomTypes(function([name, rootFn]) {

	suite(name + ' transaction', function() {
		setup(function() {
			this.atom = rootFn();
			this.trans = this.atom.doTransact(v => v.set('foo', 'bar'));
		});

		test("can be bound to a promise's success", function() {
			const self = this;

			assert.equal(self.atom.transactions.size, 1);

			var promise = this.trans.pending(new Promise(function(resolve, reject) {
				resolve('yes!');
			}));

			return assert.becomes(promise, 'yes!')
				.then(function() {
					assert.equal(self.atom.value.get('foo'), 'bar');
					assert.equal(self.atom.transactions.size, 0);
				});
		});

		test("can be bound to a promise's failure", function() {
			const self = this;

			assert.equal(self.atom.transactions.size, 1);

			var promise = this.trans.pending(new Promise(function(resolve, reject) {
				reject(new Error('no :('));
			}));
			return assert.isRejected(promise, 'no :(')
				.then(function() {
					assert.equal(self.atom.transactions.size, 0);
					assert.isUndefined(self.atom.value.get('foo'));
				});
		});
	});

});

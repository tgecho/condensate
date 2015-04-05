import AtomMixin from './AtomMixin';
import {assign} from './util';

assign(Cursor.prototype, AtomMixin);
function Cursor(cpath, parent) {
	const self = this;

	self.valueOf = function() {
		const value = parent.value;
		return value && value.getIn ? value.getIn(cpath) : value;
	};

	Object.defineProperties(this, {
		value: {get: self.valueOf},
		transactions: {get: function() {
			return parent.transactions;
		}}
	});

	this.cursor = function(path=[]) {
		return parent.cursor(cpath.concat(path));
	};

	['doTransact', 'subscribe'].forEach(function(fn_name) {
		self[fn_name] = function(path, fn) {
			if (fn === undefined) {
				fn = path;
				path = [];
			}
			return parent[fn_name](cpath.concat(path), fn);
		};
	});
}

export default Cursor;

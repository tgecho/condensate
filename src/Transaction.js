function Transaction(commit, cancel) {
	this.commit = () => commit(this);
	this.cancel = () => cancel(this);
}

Transaction.prototype.pending = function(promise) {
	var self = this;
	return promise.then(
		function(result) {
			self.commit();
			return result;
		},
		function(reason) {
			self.cancel();
			throw reason;
		}
	);
};

export default Transaction;

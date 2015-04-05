function mutator(name) {
	return function() {
		const args = arguments;
		return this.doTransact(function(v) {
			if (!v[name]) {
				throw new Error(`TypeError: Cannot read property '${name}' of ${v}`);
			}
			return v[name].apply(v, args);
		}).commit();
	};
}

export default {
	// general / maps
	doSet: mutator('set'),
	doDelete: mutator('delete'),
	doClear: mutator('clear'),
	doUpdate: mutator('update'),
	doMerge: mutator('merge'),
	doMergeWith: mutator('mergeWith'),
	doMergeDeep: mutator('mergeDeep'),
	doMergeDeepWith: mutator('mergeDeepWith'),

	doSetIn: mutator('setIn'),
	doDeleteIn: mutator('deleteIn'),
	doUpdateIn: mutator('updateIn'),
	doMergeIn: mutator('mergeIn'),
	doMergeDeepIn: mutator('mergeDeepIn'),

	// lists
	doPush: mutator('push'),
	doPop: mutator('pop'),
	doUnshift: mutator('unshift'),
	doShift: mutator('shift'),
	doSetSize: mutator('setSize'),

	// sets
	doAdd: mutator('add'),
	doUnion: mutator('union'),
	doIntersect: mutator('intersect'),
	doSubtract: mutator('subtract'),
};

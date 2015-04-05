import React from 'react';
import Imm from 'immutable';

function addItem(atom) {
	atom.doUpdate('items', Imm.List(), function(items) {
		return items.push('item');
	});
}

function removeItem(atom) {
	atom.doUpdate('items', Imm.List(), function(items) {
		return items.pop('item');
	});
}

export default React.createClass({
	render() {
		const {atom} = this.props;
		const items = atom.value.get('items') || [];

		return <div>
			<h1>Hello World</h1>
			<button onClick={c => addItem(atom)}>+</button>
			<button onClick={c => removeItem(atom)}>-</button>
			<ul>
				{items.map((item, index) =>
					<li key={index}>{item}</li>
				)}
			</ul>
		</div>;
	}
});

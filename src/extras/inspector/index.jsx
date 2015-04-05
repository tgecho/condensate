import React from 'react';
import I from 'immutable';
import './style.scss';

function type(obj) {
	if (obj && obj.constructor) {
		return obj.constructor.name;
	}
	return typeof obj;
}

const KeyedNode = React.createClass({
	render() {
		const {value, path, setPath, active} = this.props;
		const nextValue = path.size ? value.get(path.first()) : null;
		const className = [
			'node',
			nextValue ? '' : 'last',
			active ? 'active' : ''
		].join(' ');
		const activeKey = path.first();

		return (<div className={className}>
			<table className="list"><tbody>
				{value.entrySeq().map(function([key, value]) {
					const isBranch = value && value.entrySeq;
					const className = [
						isBranch ? 'nodeKey' : 'nodeEnd',
						activeKey === key ? 'active' : ''
					].join(' ');
					const props = isBranch ? {onClick: e => setPath([key])} : {};
					return (
						<tr key={key} className={className} {...props}>
							<th>{key} <sub>({type(value)})</sub></th>
							{ nextValue ? null : <td className="truncated">{String(value)}</td> }
						</tr>
					);
				})}
			</tbody></table>
			{ nextValue ? <Node value={nextValue} path={path.rest()} setPath={p => setPath(path.slice(0, 1).concat(p))} /> : null }
		</div>);
	}
});

const nodes = I.Map([
	[I.Map, KeyedNode],
	[I.List, KeyedNode]
]);

const Node = React.createClass({
	render() {
		const {value} = this.props;
		const ObjNode = value && nodes.get(value.constructor);
		return ObjNode ? <ObjNode {...this.props} /> : <div className="node">{String(value)}</div>;
	}
});

const Breadcrumbs = React.createClass({
	render() {
		const {path, setPath} = this.props;

		return (<div className="breadcrumbs">
			<button onClick={e => setPath([])}>root</button>
			{path.map(function(key, index) {
				return (<span key={index}>
					/
					<button onClick={e => setPath(path.slice(0, index + 1))}>{ key }</button>
				</span>);
			})}
		</div>);
	}
});


const Inspector = React.createClass({
	getInitialState() {
		return {path: I.List()};
	},
	setPath(path) {
		this.setState({path});
	},
	render() {
		const self = this;
		const {path} = this.state;
		const {value} = this.props.atom;

		return (
			<div className="inspector">
				<Breadcrumbs path={path} setPath={self.setPath} />
				<Node value={value} path={path} setPath={path => self.setPath(I.List(path))} />
			</div>
		);
	}
});

export default Inspector;

import React from 'react';
import Imm from 'immutable';
import Atom from 'condensate';
import Router from 'react-router';
import routes from './routes';
import Inspector from 'condensate/extras/inspector';

const atom = new Atom(Imm.Map());
const app_div = document.getElementById('app');
const inspector_div = document.getElementById('inspector');

atom.subscribe(function(value) {
	React.render(<Handler atom={atom} />, app_div);
	React.render(<Inspector atom={atom} />, inspector_div);
});

const Handler = Router.create({
	routes: routes
});

Handler.run(function(Handler, state) {
  atom.doUpdate((s) => s.set('route', Imm.fromJS(state)));
});

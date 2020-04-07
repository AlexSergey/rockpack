import React from 'react';
import Home from './Home';
import { Switch, Route } from 'react-router-dom';

export default function() {
    return <Switch>
        <Route path="/" component={Home} exact />
    </Switch>;
}

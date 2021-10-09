import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from '../components/universal/Nav/Nav';
import { AppProvider, } from '../context/AppContext';

import Dashboard from './Dashboard';
import Item from './Item';
import ListTree from './ListTree';

export default function Base() {
    
    return (
    <AppProvider>
        <Router>            
            <Nav />
            <Switch> 
                <Route path="/" exact>
                    <Dashboard />
                </Route>
                <Route path="/item/:itemId" component={Item} />   
                <Route path="/tree" component={ListTree} /> 
            </Switch> 
        </Router>     
    </AppProvider>
    )
}

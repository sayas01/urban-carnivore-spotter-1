import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import Resources from "./Resources";
import ResourceCard from "./ResourceCard";

const Main = () => (
  <main className="Main">
    <Switch>
      <Route exact path="/" render={() => <MapView/>}/>
      <Route exact path="/reports/create" component={Form}/>
      <Route exact path="/list" component={ListView}/>
      <Route exact path="/reports/:id" component={ReportViewer}/>
      <Route exact path="/resources" component={Resources}/>
      <Route exact path="/resources/:id" component={ResourceCard}/>
    </Switch>
  </main>
);

export default Main;

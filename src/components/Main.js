import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Form from './Form';
import ListView from './ListView';
import MapView from "./MapView";
import ReportViewer from "./ReportViewer";
import NotFound from './NotFound';
import ResourceCard from "./ResourceCard";
import Resources from "./Resources";
import UnsupportedBrowserNotice from "./UnsupportedBrowserNotice";
import SplashPage from "./SplashPage";

const Main = () => (
  <main className="Main">
    <Switch>
      <Redirect exact from="/" to="/tacoma" />
      <Route exact path="/" render={() => <MapView/>}/>
      <Route exact path="/tacoma" render={() => <MapView/>}/>
      <Route exact path="/(reports/create|tacoma/reports/create)" component={Form}/>
      <Route exact path="/(list|tacoma/list)" component={ListView}/>
      <Route exact path="/reports/:id" component={ReportViewer}/>
      <Route exact path="/tacoma/reports/:id" component={ReportViewer}/>
      <Route exact path="/tacoma/reports/tacoma/:id" component={ReportViewer}/>
      <Route exact path="/(resources|tacoma/resources)" component={Resources}/>
      <Route exact path="/resources/:species" component={ResourceCard}/>
        <Route exact path="/tacoma/resources/:species" component={ResourceCard}/>
      <Route component={NotFound}/>
    </Switch>
    <SplashPage/>
    <UnsupportedBrowserNotice/>
  </main>
);

export default Main;

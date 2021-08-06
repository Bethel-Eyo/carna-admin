/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "views/Login/LoginPage";
import { ProtectedRoute } from "auth/ProtectedRoute";
// import 'bootstrap/dist/css/bootstrap.min.css';

// core components
import Admin from "layouts/Admin.js";
// import RTL from "layouts/RTL.js";

import "assets/css/material-dashboard-react.css?v=1.10.0";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <ProtectedRoute path="/admin" component={Admin} />
      {/* <Route path="/rtl" component={RTL} /> */}
      <Route path="/login" component={LoginPage} />
      <Redirect from="/" to="/login" />
      {/* <Redirect from="/" to="/admin/dashboard" /> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
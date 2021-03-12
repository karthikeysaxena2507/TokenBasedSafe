import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

const App = () => {
  return (
    <Router>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/home" component={Home} />
    </Router>
  );
}
export default App;

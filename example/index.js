import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

let umm = <span>ummmmm</span>;

export class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">home</Link></li>
          <li><Link to="/a">to a</Link></li>
          <li><Link to="/b">to b</Link></li>
          <li><Link to="/c">to c</Link></li>
          <li><Link to="/asd">404</Link></li>
        </ul>
        <Route path="/" exact>
            {({ match }) =>
              match
                ? <span> home sweet home </span>
                : <span> searching... </span>}
          </Route>
        <Switch>
          
          <Route
            path="/a"
            exact
            module="./a"            
          />
          <Route
            path="/b"
            exact
            module="./b"
            render={({ Module }) => Module ? <Module.B /> : umm}
          />
          <Route
            path="/c"
            exact
            module="./c"            
          >{({ Module }) => Module ? <Module.default /> : umm}</Route>
          <Route render={() => <span>no match</span>} />
        </Switch>
      </div>
    );
  }
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);


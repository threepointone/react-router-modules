import React from "react";
let isBrowser = typeof window !== "undefined";

// import { matchPath } from 'react-router-dom'
export class Loading extends React.Component {
  state = { error: undefined, Module: undefined };
  componentDidMount() {
    this.props.listen((type, x) => {
      this.setState({ [type]: x });
    });
  }
  componentWillUnmount() {
    this.props.unlisten();
  }
  render() {
    let { match, history } = this.props.args;
    let { error, Module } = this.state;
    return this.props.fn({ match, history, error, Module });
  }
}

export function wrap(fn, { module, load }) {
  return ({ match, history }) => {
    // if url matches pattern
    if (!isBrowser) {
      // assume server side, non transpiled (tho it should work with transpiled too?)
      // todo - check if in browser, warn that babel hasn't been added
      // todo - defer
      // load only if url matches pattern
      let Module = require(module);
      // todo - make sure webpack ignores this
      return fn({ match, history, Module });
    }
    let Module, sync = true, error;
    let listeners = [],
      listen = fn => listeners.push(fn),
      unlisten = () => listeners = [];

    // load only if url matches pattern? for children func yes. always for render func
    load((err, loaded) => {
      if (err) {
        // todo - retry?
        if (sync) {
          error = err;
        } else {
          listeners.forEach(x => x("error", err));
        }
        return;
      }
      if (sync) {
        Module = loaded;
      } else {
        listeners.forEach(x => x("Module", loaded));
      }
    });
    sync = false;
    if (error || Module) {
      return fn({ match, history, Module, error });
    } else return (
        <Loading
          listen={listen}
          unlisten={unlisten}
          fn={fn}
          args={{ match, history }}
        />
      );
  };
}


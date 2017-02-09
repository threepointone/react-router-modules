import React from "react";
let isBrowser = typeof window !== "undefined";

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

export function wrap(fn, { module, load, defer }) {
  return ({ match, history }) => {
    
    if (!isBrowser) {
      // todo - defer
      
      let rrr = eval('require')
      let Module = match ? rrr(module) : undefined;
      return fn({ match, history, Module });
    }
    let Module, sync = true, error;
    let listeners = [],
      listen = fn => listeners.push(fn),
      unlisten = () => listeners = [];

    
    if(!match){
      return fn({ match, history })
    }
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


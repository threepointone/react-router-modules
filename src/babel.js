let babylon = require("babylon");

function wrap(SOURCE, name) {
  let path = JSON.stringify(name);
  return `require('../src/index.js').wrap(${SOURCE}, { transpiled: true, module:${path}, load: done => {
    let Module, error

    try{    
      let moduleId = require.resolveWeak(${path})
      if(__webpack_modules__[moduleId]) {      
        done(undefined, __webpack_require__(moduleId))        
        return 
      }         
    }
    catch(err) {
      // silent
    }

    require.ensure([], require => {
      try{
        Module = require(${path})  
      }
      catch(err) {
        error = err
      }
      done(error, Module)      
    }, '${name.replace(/[^A-Za-z0-9]/g, "-")}')

  } })`;
  // todo - chunk should have full path
}

module.exports = {
  visitor: {
    JSXElement(path, state) {
      let src = path.hub.file.code;

      function getAttr(name) {
        let ret = path.node.openingElement.attributes.filter(
          attr => attr.name.name === name
        )[0];
        ret = ret ? ret.value : undefined;
        return ret;
      }

      if (path.node.openingElement.name.name === "Route") {
        // if component, throw error
        // if render, wrap
        // if children, wrap
        // else, send own render prop
        let m = getAttr("module");
        let n = getAttr("render");
        let xed = m && n
          ? wrap(src.substring(n.expression.start, n.expression.end), m.value)
          : null;
        if (xed) {
          n.expression = babylon.parse(xed, {
            plugins: [ "*" ]
          }).program.body[0].expression;
        }
      }
    }
  }
};


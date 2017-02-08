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
        let attrModule = getAttr("module");
        let attrRender = getAttr("render");
        let attrChildren = path.node.children.filter(attr => attr.type !== 'JSXText')[0];
        [attrRender, attrChildren].forEach(X => {
          let pts = X ? (X.expression ? X.expression : X) : X
          let xSrc = X ? 
            src.substring(pts.start, pts.end) : 
            `({ Module, match, ...rest }) => (match && Module) ? 
              (Module.default ? 
                <Module.default match={match} {...rest} /> : 
                <Module match={match} {...rest} />) : 
              null`;
          let wrapped = (attrModule && X) ? wrap(xSrc, attrModule.value) : null;
          if (wrapped) {
            X.expression = babylon.parse(wrapped, {
              plugins: [ "*" ]
            }).program.body[0].expression;
          }
        })        
        
      }
    }
  }
};


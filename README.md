rakt
---

[work in progress.]

a framework. for react/dialects. in a box.

usage 
--- 

`npm install rakt -g`

quick start
---

```jsx
// index.js
export default App = () => 
  <div>hello world</div>
```

and then run 

```
$ rakt index.js   
```

the big idea 
---

we augment react-router's `<Route/>` api with one change

```diff
- import User from './user.js'
<Route path='/user/:id'
-  component={User}
+  module='./user.js'
/>
```

- no new imports/apis, everything works as usual
- renders default export by default 
- handles code splitting, SSR, css, behind the scenes 
- works with `render`, `children` props as expected 


```jsx
<Route path='/user/:id'
  module='./user.js'
  render={ ({ Module }) => Module ? 
    <Module.Profile /> : 
    <span>loading...</span> )}
/>
``` 

data fetching
---

```jsx
// user.js
import { data } from 'rakt'

@data((req, res, next) => {  
  // literally write an express route here 
  // gets removed from client side bundle
  let db = require('mongo')(3111)
  db.get('users', req.params.id, (err, profile) => 
    err ? next(err) : res.send(profile))  
})
export default class User {
  render(){
    return <div>
      {this.props.data || 'loading data'}
    </div>  
  }
  
// and elsewhere 
<Route path='/user/:id' module='./user.js' />

// ... that's it! we'll take care of setting up endpoints, hydrating, etc
// you're free to augment with your own systems - relay, redux, whatevs 
```


prpl ootb
---

[todo]


configuration
---

[todo]


integrating with other apps
---

you can take pieces from rakt and use them in your own app sans the rakt stack. 

- `rackt/babel` - 
- `rackt/api` - 
- `rackt/assets` - 

[todo] etc etc 


constraints -

- For SSR to work, `path` has to be a static string
- async fetching won't work without a server

todo - 

- auto endpoints for data fetching 
- prefetch links
- websockets?
- preserve server side rendered html while module asyncly loads 
- `<Html/>`, `<Head/>`, `<Document/>`
- service workers
- all that jazz

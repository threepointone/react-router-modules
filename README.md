react-router-modules
---

[work in progress]

to prpl and beyond


the big idea 
---

we make a single change to the `<Route/>` api

```jsx
// this 
import User from './user.js'
// ...
<Route path='/user/:id'
  component={User}
/>

// becomes this 
// ...
<Route path='/user/:id'
  module='./user.js'
/>
```

- renders default export by default 
- handles code splitting, SSR, behind the scenes 
- works with `render`, `children` props as expected 

```jsx
<Route path='/user/:id'
  module='./user.js'
  render={ ({ Module }) => Module ? 
    <Module.default /> : 
    <span>loading...</span> )}
/>
// or use children-func, to render even when path doesn't match

``` 

- todo - statically extract mapping of url -> modules
```jsx
matchModule('/user/213', { Module } => {
  // and then fetch data, render <App />, whatever you like 
})

// you can now expose this via an api endpoint. and handle data fetching, etc 
// this can also get treeshaked out lol
```

- use in tandem with your server for PRPL
```jsx
// TODO
```

constraints -
- `path` has to be a static string

todo - 

- auto endpoints for data fetching 
- prefetch links
- `<Html/>`
- service workers
- all that jazz

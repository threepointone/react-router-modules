react-router-modules
---

[work in progress]

to prpl and beyond

usage 
--- 

`npm install @threepointone/react-router-modules`

add `@threepointone/react-router-modules/babel` to your babel plugins 


the big idea 
---

we make a single change to the `<Route/>` api

```diff
- import User from './user.js'
<Route path='/user/:id'
-  component={User}
+  module='./user.js'
/>
```

- no new imports/apis, everything works as usual
- renders default export by default 
- handles code splitting, SSR, behind the scenes 
- works with `render`, `children` props as expected 

```jsx
<Route path='/user/:id'
  module='./user.js'
  render={ ({ Module }) => Module ? 
    <Module.Profile /> : 
    <span>loading...</span> )}
/>
// or use children-func, to render even when path doesn't match

``` 

- todo - preserve server side rendered html while module asyncly loads 

```jsx
<Route path='/user/:id'
  module='./user.js'
  preserve />
// this will render SSR, but split code out and load separately
// server side rendered html will stay till module loads(!)
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
- For SSR to work, `path` has to be a static string

todo - 

- auto endpoints for data fetching 
- prefetch links
- `<Html/>`
- service workers
- all that jazz

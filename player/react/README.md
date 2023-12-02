# player

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test player` to execute the unit tests via [Vitest](https://vitest.dev/).

## Setting up a fresh project

```bash
   npm init vite@latest my-project --template react
   # chose React and Typescript
   cd my-project
   npm install
   npm run dev
```

### Installing dependencies

```bash
   npm install @carbon-builder/player-react @carbon/react
```

### Project changes

Rename `App.css` -> `App.scss` and change the import path to it in `App.tsx`
Add the following to the top of `App.scss` to activate Carbon styles

```scss
    @use '@carbon/react';
```

You can remove other existing stuff from it or add your own
Build your page with [Carbon UI Builder](https://builder.carbondesignsystem.com/) or using
[Builder SDK](https://www.npmjs.com/package/@carbon-builder/sdk-react) then click "Export"
and open JSON tab in the export modal

### Minimal app code

```typescript
    import { useState } from 'react'
    import { UIFragment } from '@carbon-builder/player-react';
    import './App.scss'
    
    const componentObj = {}; // paste your exported JSON model here
    
    function App() {
      const [state, setState] = useState(componentObj);
    
      return <UIFragment state={state} setState={setState} />;
    }
    
    export default App;
```

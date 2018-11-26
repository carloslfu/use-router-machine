# use-router-machine

Hook that let's you use XState as a router, by using the `meta` property.

Live example: https://codesandbox.io/s/8n06pwy61l

## Use

Install the library with `npm i use-router-machine`.

```javascript
import { useRouterMachine } from 'use-router-machine'

const config = {
  initial: 'home',
  states: {
    home: { meta: { path: '/' }, on: { NEXT: 'about' } },
    about: { meta: { path: '/about' }, on: { NEXT: 'dashboard' } },
    dashboard: {
      meta: { path: '/dashboard' },
      initial: 'login',
      on: { NEXT: 'home' },
      states: {
        loggedIn: {
          initial: 'main',
          states: {
            main: { meta: { path: '/dashboard/main' } },
            data: { meta: { path: '/dashboard/data' } }
          }
        },
        login: {
          meta: { path: '/dashboard/login' },
          on: { LoggedIn: 'loggedIn' }
        }
      }
    }
  }
}

function App() {
    const service = useRouterMachine({ config })

    return <div>{service.state.value}</div>
}
```

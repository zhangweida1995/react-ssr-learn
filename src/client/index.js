import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from '../Routes'
import { getClientStore } from '../store'
import { Provider } from 'react-redux'

const store = getClientStore()
/**
 * browserRouter会自动从浏览器地址中，匹配对应的路由组件显示出来。
 * //JSX形式的路由：<Route path='/' component={Home}>
 * //数组对象形的。
 */
const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>{renderRoutes(routes)}</div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDom.hydrate(<App />, document.getElementById('root'))

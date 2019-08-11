import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { reducer as headerReducer } from '../components/Header/store'
import { reducer as homeReducer } from '../containers/Home/store'
import { reducer as translationReducer } from '../containers/Translation/store'
import clientAxios from '../client/request'
import serverAxios from '../server/request'

// beyond compare

const reducer = combineReducers({
  home: homeReducer,
  header: headerReducer,
  translation: translationReducer
})
/**
 * 客户端渲染中，浏览器永远只存在一个Store。const store = createStore(reducer, defaultState)
 * 而服务器端的Store是所有用户都要使用的，需要返回一个函数，为每个用户提供一个独立的Store
 */
export const getStore = req => {
  // 改变服务器端store的内容，那么就一定要使用serverAxios
  return createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(serverAxios(req)))
  )
}

export const getClientStore = () => {
  const defaultState = window.context.state
  // 改变客户端store的内容，一定要使用clientAxios
  return createStore(
    reducer,
    defaultState,
    applyMiddleware(thunk.withExtraArgument(clientAxios))
  )
}

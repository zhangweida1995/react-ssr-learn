import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'
/**
 * 服务器端路由需要把location（当前请求路径）传递给StaticRouter组件，
 * 他才能根据路径分析出所需要的组件。
 * PS：StaticRouter 是 React-Router 针对服务器端渲染专门提供的一个路由组件。
 */
export const render = (store, routes, req, context) => {
  //Provider: 类似于Vue的$attrs, 所有容器组件都可以访问store，数据是自上而下传递的，Context 提供了一种在组件之间共享此类值的方式
  //每个context都返回一个provider组件，它允许消费组件订阅context的变化，消费组件都会重新渲染。
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>{renderRoutes(routes)}</div>
      </StaticRouter>
    </Provider>
  )
  const helmet = Helmet.renderStatic()

  const cssStr = context.css.length ? context.css.join('\n') : ''
  /**
   * 对服务器端来说，我们需要把组件转化成字符串，React给我们提供了renderToString的方法来实现。
   */
  return `
			<html>
				<head>
					${helmet.title.toString()}
          ${helmet.meta.toString()}
					<style>${cssStr}</style>
				</head>
				<body>
					<div id="root">${content}</div>
					<script>
						window.context = {
							state: ${JSON.stringify(store.getState())}
						}
					</script>
					<script src='/index.js'></script>
				</body>
			</html>
	  `
}

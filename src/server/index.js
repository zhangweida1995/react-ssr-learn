import express from 'express'
import proxy from 'express-http-proxy'
import { matchRoutes } from 'react-router-config'
import { render } from './utils'
import { getStore } from '../store'
import routes from '../Routes'

const app = express()
app.use(express.static('public'))
/**
 * 服务器端渲染时，直接请求 API 服务器的接口获取数据没有任何问题。但是在客户端，就有可能存在跨域的问题了，
 * 所以，这个时候，我们需要在服务器端搭建 Proxy 代理功能，客户端不直接请求 API 服务器，而是请求 Node 服务器，
 * 经过代理转发，拿到 API 服务器的数据。
 */
app.use(
  '/api',
  proxy('http://47.95.113.63', {
    proxyReqPathResolver: function(req) {
      return '/ssr/api' + req.url
    }
  })
)
/**
 * # SSR中客户端渲染和服务端渲染路由代码的差异 #
 * 实现SSR架构，我们需要让相同的React代码在客户端和服务端各执行一次，所以在此架构中只有组件代码是相同的。
 * 而路由这样的代码是没有办法公用的!
 * 在服务器端需要通过请求路径找到路由组件。而在客户端需要通过浏览器的地址找到路由组件，是两套不同的机制。
 */
app.get('*', function(req, res) {
  //Redux通过store触发一个action去请求数据，然后更新state，注入到组件的props中，更新视图。
  const store = getStore(req)
  // 传入服务器请求路径，分析所需要的组件。
  const matchedRoutes = matchRoutes(routes, req.path)
  // 让matchRoutes里面所有的组件，对应的loadData方法执行一次
  const promises = []

  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      const promise = new Promise((resolve, reject) => {
        item.route
          .loadData(store)
          .then(resolve)
          .catch(resolve)
      })
      promises.push(promise)
    }
  })

  Promise.all(promises).then(() => {
    const context = { css: [] }
    const html = render(store, routes, req, context)

    if (context.action === 'REPLACE') {
      res.redirect(301, context.url)
    } else if (context.NOT_FOUND) {
      res.status(404)
      res.send(html)
    } else {
      res.send(html)
    }
  })
})

var server = app.listen(4000, () => {
  console.log(`server started at http://localhost:4000`)
})

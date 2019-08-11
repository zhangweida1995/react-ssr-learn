import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { getHomeList } from './store/actions'
import styles from './style.css'
import withStyle from '../../withStyle'

class Home extends Component {
  getList() {
    const { list } = this.props
    // console.log(this.props)
    // return list.map(item => (
    //   <div className={styles.item} key={item.id}>
    //     {item.title}
    //   </div>
    // ))
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>这是DellLee的SSR新闻页面 - 丰富多彩的资讯</title>
          <meta
            name="description"
            content="这是DellLee的SSR新闻页面 - 丰富多彩的资讯"
          />
        </Helmet>
        <div className={styles.container}>{this.getList()}</div>
      </Fragment>
    )
  }

  componentDidMount() {
    if (!this.props.list) {
      this.props.getHomeList()
    }
  }
}
// 使用connect前需要先定义这个函数，来指定如何把当前State映射到展示组件的Props中。
const mapStateToProps = state => ({
  list: state.home.newsList
})
// 除了读取State，容器组件还能分发action，定义此方法接收dispatch,并返回期望注入到展示组件的props中的回调函数。
const mapDispatchToProps = dispatch => ({
  getHomeList() {
    dispatch(getHomeList())
  }
})
//容器组件就是从State中读取数据，并通过props来把这些数据提供给要渲染的展示组件。
// connect这个方法做了性能优化，来避免不必要的重复渲染。
// 最后创建exportHome，并传入这两个函数
const ExportHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyle(Home, styles))

ExportHome.loadData = store => {
  return store.dispatch(getHomeList())
}

export default ExportHome

/**
 * connect 返回一个新的已与 Redux store 连接的组件类，是一个高阶组件，（传入一个组件，返回一个新的组件）
 *
 * mapStateToProps 组件将会监听Store的变化，只要发生改变，此函数就会被调用，返回一个对象，该对象会与组件的props合并。
 *
 * mapDispatchToProps (Object or Function): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，
 * 对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中dispatch方法会将action creator的返回值作为参数执行。
 * 这些属性会被合并到组件的 props 中。
 *
 * 如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，
 * 这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起
 */

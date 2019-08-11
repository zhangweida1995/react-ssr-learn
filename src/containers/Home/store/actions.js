import { CHANGE_LIST } from './constants'
/**
 * 普通的action  
 * const ADD_TODO = 'ADD_TODO'
  {
    type: ADD_TODO,
    text: 'Build my first Redux app'
  }
 */

// action创建函数
const changeList = list => ({
  type: CHANGE_LIST,
  list
})
// 发起dispatch过程
// dispatch(changeList(list))

// 或者创建一个被绑定的action创建函数自动dispatch。
// const getHomeList = list => dispatch(changeList(list))
export const getHomeList = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/news.json').then(res => {
      const list = res.data.data
      dispatch(changeList(list))
    })
  }
}

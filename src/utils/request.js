import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
	withCredentials: true,//跨域请求开关
	// headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  timeout: 60000 * 30 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.common['Token'] = getToken() // 让每个请求携带自定义token
    }
    return config
  },
  error => {
    // Do something with request error
    //console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code非200抛错
     */
    const res = response.data
		//特定异常编码捕获 520
		if (res.status === 520) {
			return res
		}
		if (res.status !== 200) {
			Message({
			  message: res.msg,
			  type: 'error',
			  duration: 5 * 1000
			})
			return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
		if (error.request.status === 401) {
			Message({
			  message: "由于您长时间未进行操作，系统为保护您的数据安全帮您断开连接，若需要访问系统请重新登录",
			  type: 'warning',
			  duration: 5 * 1000
			})
		}else {
			Message({
			  message: error.message,
			  type: 'error',
			  duration: 5 * 1000
			})
		}
    return Promise.reject(error)
  }
)

export default service

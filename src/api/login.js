import request from '@/utils/request'

export function login(username, password) {
  const data = {
      username: username,
      password: password
    }
    return request({
      url: '/login',
      method: 'post',
      data
    })
}

export function getAppUserInfo(token) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

import request from '@/utils/request'

export function getUserParam() {
  return request({
    url: '/appUser/getUserParams',
    method: 'get'
  })
}

export function fetchUser(query) {
	return request({
	  url: '/appUser/getUserList',
	  method: 'get',
		params: query
	})
}

export function saveUser(data) {
	return request({
	  url: '/appUser/saveUser',
	  method: 'post',
		data: data
	})
}

/* 根据所属科室名称 
用户名 用户别名 模糊查询用户  */
export function fuzzyQueryUserParam(query) {
	return request({
	  url: '/appUser/fuzzyQueryUser',
	  method: 'get',
		params: query
	})
}

/* 获取登录用户的用户信息 用户所属科室 用户职称等 */
export function getUserInfomation(query) {
	return request({
		url: '/appUser/getUserInfomation',
		method: 'get',
		params: query
	})
}

/* 保存用户新密码 */
export function saveNewPassword(data) {
	return request({
		url: '/appUser/changePassword',
		method: 'post',
		data: data
	})
}
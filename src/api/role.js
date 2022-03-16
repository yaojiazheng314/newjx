import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/appRole/getRoles',
    method: 'get'
  })
}

export function getRoutesTree() {
	return request({
	  url: '/appRole/getRoutePerms',
	  method: 'get'
	})
}

export function getRolesPerms(query) {
	return request({
	  url: '/appRole/getRolesPerms',
	  method: 'get',
		params: query
	})
}

export function saveRolesPerms(data) {
	return request({
	  url: '/appRole/saveRole',
	  method: 'post',
		data: data
	})
}
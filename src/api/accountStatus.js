import request from '@/utils/request'

export function getStatus(query) {
	return request({
		url: '/accountStatus/getAccountStatus',
		method: 'get',
		params: query
	})
}

export function closeAccount(data) {
  return request({
    url: '/accountStatus/closeAccount',
    method: 'post',
		data: data
  })
}

export function relieveAccount(data) {
	return request({
	  url: '/accountStatus/relieveAccount',
	  method: 'post',
		data: data
	})
}

export function getAccountStatusForAdjust(query) {
	return request({
		url: '/accountStatus/getAccountStatusForAdjust',
		method: 'get',
		params: query
	})
}

export function closeAccountNew(data) {
  return request({
    url: '/accountStatus/closeAccountNew',
    method: 'post',
		data: data
  })
}

export function getAccountDataStatus(query) {
	return request({
		url: '/accountStatus/getAccountDataStatus',
		method: 'get',
		params: query
	})
}
export function generateNextMonth(data) {
  return request({
    url: '/accountStatus/generateNextMonth',
    method: 'post',
		data: data
  })
}

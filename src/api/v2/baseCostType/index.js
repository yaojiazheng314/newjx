import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/v2/baseCostType/page',
    method: 'get',
    params: query
  })
}

export function save(data) {
	return request({
		url: '/v2/baseCostType/save',
		method: 'post',
		data: data
	})
}

export function getDataInfo(query) {
	return request({
		url: '/v2/baseCostType/data/info',
		method: 'get',
		params: query
	})
}

export function getLastOtNextDataInfo(query) {
	return request({
		url: '/v2/baseCostType/data/info/lastOrNext',
		method: 'get',
		params: query
	})
}
import request from '@/utils/request'

export function getPerRunList(query) {
  return request({
    url: '/bnsForPerRun/getPerRuns',
    method: 'get',
		params: query
  })
}

export function getPerRunDetails(query) {
	return request({
	  url: '/bnsForPerRun/getPerRunDetails',
	  method: 'get',
		params: query
	})
}

export function doPerRun(data) {
	return request({
	  url: '/bnsForPerRun/doOnePerRun',
	  method: 'post',
		data: data
	})
}

export function oneKeyRun(data) {
	return request({
		url: '/bnsForPerRun/oneKeyRun',
		method: 'post',
		data: data
	})
}
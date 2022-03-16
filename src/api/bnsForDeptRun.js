import request from '@/utils/request'

export function getDeptRunList(query) {
  return request({
    url: '/bnsForDeptRun/getDeptRuns',
    method: 'get',
		params: query
  })
}

export function getDeptRunDetails(query) {
	return request({
	  url: '/bnsForDeptRun/getDeptRunDetails',
	  method: 'get',
		params: query
	})
}

export function doDeptRun(data) {
	return request({
	  url: '/bnsForDeptRun/doOneDeptRun',
	  method: 'post',
		data: data
	})
}

export function oneKeyRun(data) {
	return request({
	  url: '/bnsForDeptRun/oneKeyRun',
	  method: 'post',
		data: data
	})
}

export function getRunYearMonthList(query) {
	return request({
	  url: '/bnsForDeptRun/getRunYearMonthList',
	  method: 'get',
		params: query
	})
}
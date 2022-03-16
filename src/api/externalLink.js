import request from '@/utils/request'
/* 外部链接配置 */
export function getExternalLinkParam() {
	return request({
	  url: '/exterLink/getExterLinkParam',
	  method: 'get'
	})
}

export function getExterLinkList(query) {
	return request({
	  url: '/exterLink/getExterLinkList',
	  method: 'get',
		params: query
	})
}

export function saveExterLink(data) {
	return request({
	  url: '/exterLink/saveExterLink',
	  method: 'post',
		data: data
	})
}

/* 报表配置 */
export function getReportParam() {
	return request({
	  url: '/exterLink/getReportParam',
	  method: 'get'
	})
}

export function getReportList(query) {
	return request({
	  url: '/exterLink/getReportList',
	  method: 'get',
		params: query
	})
}

export function saveExterReport(data) {
	return request({
	  url: '/exterLink/saveExterReport',
	  method: 'post',
		data: data
	})
}

/* 获取用户可以访问的指定类型的全部报表 */
export function getAllReports(query) {
	return request({
		url: '/exterLink/getAllReports',
		method: 'get',
		params: query
	})
}
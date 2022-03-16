import request from '@/utils/request'

/**
 * @description 获取科室用户分配项信息列表
 * @param {Object} query: { yearmonth, fuzzyQueryDeptName }
 * @return {Object} data: { items: Array, accountStatus: Boolean }
 */
export function getDeptReportPage(query) {
	return request({
		url: '/v2/feedBackReportStatus/page/dept',
		method: 'get',
		params: query
	})
}

export function getDeptReportExamineInfo(query) {
	return request({
		url: '/v2/feedBackReportStatus/deptReportInfo/examine',
		method: 'get',
		params: query
	})
}

export function saveReportStatusList(data) {
	return request({
		url: '/v2/feedBackReportStatus/save/list',
		method: 'post',
		data: data
	})
}

export function passAllReportExamine(data) {
	return request({
		url: '/v2/feedBackReportStatus/passAll',
		method: 'post',
		data: data
	})
}

export function getLastOrNextExamineDataInfo(query) {
	return request({
		url: '/v2/feedBackReportStatus/getLastOrNextData/examine',
		method: 'get',
		params: query
	})
}
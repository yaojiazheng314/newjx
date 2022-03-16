import request from '@/utils/request'

/* 获取分配项上报列表 */
export function getReportStatusList(query) {
  return request({
    url: '/feedBackReportStatus/getReportStatusList',
    method: 'get',
		params: query
  })
}

/* 获取某一分配项上报明细 */
export function fetchReportStatusDetail(query) {
	return request({
	  url: '/feedBackReportStatus/getReportStatusDetails',
	  method: 'get',
		params: query
	})
}

/* 审核通过某一科室上报的数据 */
export function examinePassed(data) {
	return request({
		url: '/feedBackReportStatus/passExamine',
		method: 'post',
		data: data
	})
}

/* 将某一科室上报的数据回到未上报的状态 */
export function backToUnreport(data) {
	return request({
		url: '/feedBackReportStatus/backToUnreport',
		method: 'post',
		data: data
	})
}

/* 审核通过所有的上报科室 */
export function examineAllPassed(data) {
	return request({
		url: '/feedBackReportStatus/passAllExamine',
		method: 'post',
		data: data
	})
}
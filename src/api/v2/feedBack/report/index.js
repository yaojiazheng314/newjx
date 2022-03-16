import request from '@/utils/request'

/**
 * @description 获取用户分配项信息列表
 * @param {Object} query: { yearmonth, userId }
 * @return {Object} data: { items: Array, accountStatus: Boolean }
 */
export function getFeedBackItemsV2(query) {
	return request({
		url: '/v2/feedBackReport/items',
		method: 'get',
		params: query
	})
}

/* 用户当前分配的人员明细(用于echart数据渲染) */
/**
 * @param {Object} query: { id }
 */
export function getFeedBackDetailV2Echart(query) {
	return request({
	  url: '/v2/feedBackReport/getFeedBackDetail/echart',
	  method: 'get',
		params: query
	})
}

/**
 * @param {Object} query { feedBackDeptId, userId, yearmonth, flag }
 * @return { data: FeedBackReportDept, totalNum, currentNum }
 */
export function getDeptReportInfo(query) {
	return request({
		url: '/v2/feedBackReport/getDeptReportInfo',
		method: 'get',
		params: query
	})
}

/**
 * @param {Object} query {feedBackDeptId, userId, yearmonth, flag,
			currentPosition, direction}
 */
export function getLastOtNextDataInfo(query) {
	return request({
		url: '/v2/feedBackReport/getDeptReportInfo/lastOrNext',
		method: 'get',
		params: query
	})
}

export function getDeptReportItemList(query) {
	return request({
		url: '/v2/feedBackReport/getDeptReport/items',
		method: 'get',
		params: query
	})
}

/**
 * @param {Object} query: { feedBackDeptId, userId, yearmonth }
 * @return {Object} res, res.data: [ {reportVO} ]
 */
export function getReportData(query) {
	return request({
		url: '/v2/feedBackReport/getReportData/dept',
		method: 'get',
		params: query
	})
}

export function saveReportListAndReason(data) {
	return request({
		url: '/v2/feedBackReport/save/listAndReason',
		method: 'post',
		data: data
	})
}

export function submitDeptFeedBackReport(data) {
	return request({
		url: '/v2/feedBackReport/submitReport/dept',
		method: 'post',
		data: data
	})
}

export function deleteDeptFeedBackReport(query) {
	return request({
		url: '/v2/feedBackReport/deleteDeptFeedBackReport',
		method: 'get',
		params: query
	})
}
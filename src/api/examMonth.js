import request from '@/utils/request'
/* 获取考核模板的考核指标与考核依据 */
export function fetchTemp(query) {
	return request({
	  url: '/exam/getTempsTargetAndBasis',
	  method: 'get',
		params: query
	})
}
/* 提交科室考核评分 */
export function submitExamDeptScore(data) {
	return request({
		url: '/examMonth/submitDeptScore',
		method: 'post',
		data: data
	})
}

/* 提交人员考核评分 */
export function submitExamPerScore(data) {
	return request({
		url: '/examMonth/submitPerScore',
		method: 'post',
		data: data
	})
}

/* 获取科室考核评分列表 */
export function getExamMonthDeptList(query) {
	return request({
		url: '/examMonth/getDepts',
		method: 'get',
		params: query
	})
}

/* 删除科室考核结果 */
export function deleteDeptExamInfo(data) {
	return request({
		url: '/examMonth/deleteExamMonthDept',
		method: 'post',
		data: data
	})
}

/* 获取科室月度考核结果明细 */
export function getExamMonthDeptInfo(query) {
	return request({
		url: '/examMonth/getExamMonthDeptInfo',
		method: 'get',
		params: query
	})
}

/* 获取模板月度考核人员列表 */
export function getExamMonthPerList(query) {
	return request({
		url: '/examMonth/getPers',
		method: 'get',
		params: query
	})
}

/* 删除人员月度考核结果 */
export function deletePerExamInfo(data) {
	return request({
		url: '/examMonth/deleteExamMonthPer',
		method: 'post',
		data: data
	})
}

/* 获取人员月度考核结果明细 */
export function getExamMonthPerInfo(query) {
	return request({
		url: '/examMonth/getExamMonthPerInfo',
		method: 'get',
		params: query
	})
}
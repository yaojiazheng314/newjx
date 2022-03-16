import request from '@/utils/request'

export function getAssigneeFbParam(query) {
	return request({
	  url: '/feedBackReport/getAssigneeFeedBackItem',
	  method: 'get',
		params: query
	})
}

export function getAssigneeParam(query) {
	return request({
	  url: '/feedBackReport/getAssigneeParam',
	  method: 'get',
		params: query
	})
}

export function getReportList(query) {
  return request({
    url: '/feedBackReport/getReportList',
    method: 'get',
		params: query
  })
}

/**
 * 获取填报数据
 */
export function getReportData(query) {
	return request({
	  url: '/feedBackReport/getReportData',
	  method: 'get',
		params: query
	})
}

/**
 * 保存分配项填报值
 */
export function saveFeedBackReport(data) {
	return request({
	  url: '/feedBackReport/saveReport',
	  method: 'post',
		data: data
	})
}

/**
 * 删除填报值
 */
export function delReportData(data) {
	return request({
	  url: '/feedBackReport/delReportData',
	  method: 'post',
		data: data
	})
}

//获取同一科室人员
export function getSameDeptPerParam(query) {
	return request({
	  url: '/feedBackReport/getSameDeptPerParam',
	  method: 'get',
		params: query
	})
}

//模糊查询 远程搜索全院人员
export function getAllHospPersonParam(query) {
	return request({
	  url: '/feedBackReport/getAllDeptPerParam',
	  method: 'get',
		params: query
	})
}

//复制最近一次的分配模板
export function copyReportPersonTemp(query) {
	return request({
		url: '/feedBackReport/copyReportPersonTemp',
		method: 'get',
		params: query
	})
}

//上报分配结果
export function reportFeedBackResult(data) {
	return request({
	  url: '/feedBackReport/reportFeedBackResult',
	  method: 'post',
		data: data
	})
}

/* 用户获取填报汇总 */
export function getCollectReport(query) {
	return request({
	  url: '/feedBackReport/getCollectReport',
	  method: 'get',
		params: query
	})
}

/* 获取二次分配的明细项 */
export function getFeedBackReportDetail(query) {
	return request({
	  url: '/feedBackDetail/getFeedBackDetailList',
	  method: 'get',
		params: query
	})
}

/* 获取二次分配的分类项 供下拉框使用 */
export function getFeedBackTypeParams() {
	return request({
	  url: '/feedBackDetail/getFeedBacTypeList',
	  method: 'get'
	})
}

//保存二次分配的明细项
export function updateFeedBackReportDetail(data) {
	return request({
	  url: '/feedBackDetail/saveFeedBackReportDetail',
	  method: 'post',
		data: data
	})
}
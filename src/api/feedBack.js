import request from '@/utils/request'

export function getFeedBackParam() {
  return request({
    url: '/feedBack/getFeedBackItemParam',
    method: 'get'
  })
}

export function getTermParam() {
	return request({
	  url: '/feedBack/getTermParam',
	  method: 'get'
	})
}

export function fetchFeedBack(query) {
	return request({
	  url: '/feedBack/getFeedBackList',
	  method: 'get',
		params: query
	})
}

export function saveFeedBackItem(data) {
	return request({
		url: '/feedBack/saveFeedBackItem',
		method: 'post',
		data: data
	})
}

/**
 * 获取assignee
 */
export function fetchAssignee(query) {
	return request({
		url: '/feedBack/getAssigneeList',
		method: 'get',
		params: query
	})
}

/**
 * 保存assignee
 */
export function saveAssignee(data) {
	return request({
		url: '/feedBack/saveAssignee',
		method: 'post',
		data: data
	})
}

/**
 * 删除assignee
 */
export function delAssignee(data) {
	return request({
		url: '/feedBack/deleteAssignee',
		method: 'post',
		data: data
	})
}

/**
 * 根据关联项部位
 */
export function supplyAssignee(data) {
	return request({
		url: '/feedBack/supplyAssignee',
		method: 'post',
		data: data
	})
}

/**
 * 获取垂直管理分配项参数
 */
export function getVerticalFbParams(query) {
	return request({
		url: '/feedBack/getVerticalFeedBackItems',
		method: 'get',
		params: query
	})
}

//垂直分配列表
export function getVerticalList(query) {
	return request({
		url: '/feedBack/getVerticalList',
		method: 'get',
		params: query
	})
}

//垂直填报数据列表
export function getVerticalData(query) {
	return request({
		url: '/feedBack/getVerticalData',
		method: 'get',
		params: query
	})
}

//保存垂直分配科室数据
export function saveVerticalData(data) {
	return request({
		url: '/feedBack/saveVerticalData',
		method: 'post',
		data: data
	})
}

//删除垂直分配科室数据
export function deleteVD(data) {
	return request({
		url: '/feedBack/deleteVerticalData',
		method: 'post',
		data: data
	})
}

//获取绩效发放列表
export function fetchReleaseList(query) {
	return request({
		url: '/feedBack/getFeedBackReleaseList',
		method: 'get',
		params: query
	})
}

//绩效发放
export function release(data) {
	return request({
		url: '/feedBack/release',
		method: 'post',
		data: data
	})
}
//取得二次分配明细项列表
export function getFeedBackTypeList(query) {
	return request({
		url: '/feedBackType/getFeedBackTypeList',
		method: 'get',
		params: query
	})
}
//保存二次分配明细项数据
export function saveFeedBackType(data) {
	return request({
		url: '/feedBackType/saveFeedBackType',
		method: 'post',
		data: data
	})
}
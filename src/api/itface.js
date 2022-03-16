import request from '@/utils/request'

export function getServerList(query) {
	return request({
	  url: '/itface/getServerList',
	  method: 'get',
		params: query
	})
}

export function saveServer(data) {
	return request({
	  url: '/itface/saveServer',
	  method: 'post',
		data: data
	})
}

/* 连接测试 */
export function serverConnectTest(data) {
	return request({
	  url: '/itface/serverConnectTest',
	  method: 'post',
		data: data
	})
}

/* 获取接口参数 */
export function getItfaceItemParam() {
	return request({
		url: '/itface/getItfaceItemParams',
		method: 'get'
	})
}

/* 获取接口列表 */
export function fetchItfaceItem(query) {
	return request({
		url: '/itface/getItfaceItemList',
		method: 'get',
		params: query
	})
}

/* 服务连接参数列表 */
export function getItfaceServerParam() {
	return request({
		url: '/itface/getServerParams',
		method: 'get'
	})
}

/* 保存接口配置 */
export function saveItfaceItem(data) {
	return request({
		url: '/itface/saveItfaceItem',
		method: 'post',
		data: data
	})
}

/* 获取接口配置的字段 */
export function getItfaceItemFields(query) {
	return request({
		url: '/itface/getItfaceItemFields',
		method: 'get',
		params: query
	})
}

/* 保存接口配置字段 */
export function saveItfaceItemField(data) {
	return request({
		url: '/itface/saveItfaceItemField',
		method: 'post',
		data: data
	})
}

/* 获取可以执行(字段不为空)的接口列表 */
export function fetchExecItfaceItem(query) {
	return request({
		url: '/itface/getExecItfaceItem',
		method: 'get',
		params: query
	})
}

/* 接口执行 */
export function executeItface(data) {
	return request({
		url: '/itface/execItface',
		method: 'post',
		data: data
	})
}

/* 获取接口执行日志 */
export function fetchItfaceLog(query) {
	return request({
		url: '/itface/getItfaceLogs',
		method: 'get',
		params: query
	})
}

/* 删除接口执行日志 */
export function deleteItfaceLog(param) {
	return request({
		url: '/itface/deleteItfaceLog',
		method: 'get',
		params: param
	})
}
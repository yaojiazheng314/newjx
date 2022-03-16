import request from '@/utils/request'

export function getHandleItemList(query) {
  return request({
    url: '/bnsDataItemReport/getHandleItems',
    method: 'get',
		params: query
  })
}

export function getHandleItemParam(query) {
	return request({
		url: '/bnsDataItemReport/getHandleItemParam',
		method: 'get',
		params: query
	})
}
//获取待填报的因子科室列表
export function getHandleItemDeptData(query) {
	return request({
		url: '/bnsDataItemReport/getHandleItemDeptsData',
		method: 'get',
		params: query
	})
}
//单条保存科室的因子填报数据
export function saveDeptItemReport(data) {
	return request({
		url: '/bnsDataItemReport/saveDeptItemReport',
		method: 'post',
		data: data
	})
}
//复制指定月份科室因子的填报数据
export function copyDeptReportData(data) {
	return request({
		url: '/bnsDataItemReport/copyDeptItemReport',
		method: 'post',
		data: data
	})
}
//删除deptItemReport
export function delDeptItemReport(data) {
	return request({
		url: '/bnsDataItemReport/delDeptItemReport',
		method: 'post',
		data: data
	})
}

/* 人员填报 */
//获取待填报的因子人员列表
export function getHandleItemPerData(query) {
	return request({
		url: '/bnsDataItemReport/getHandleItemPersData',
		method: 'get',
		params: query
	})
}
//单条保存人员的因子填报数据
export function savePerItemReport(data) {
	return request({
		url: '/bnsDataItemReport/savePerItemReport',
		method: 'post',
		data: data
	})
}
//复制指定月份人员因子的填报数据
export function copyPerReportData(data) {
	return request({
		url: '/bnsDataItemReport/copyPerItemReport',
		method: 'post',
		data: data
	})
}
//删除deptItemReport
export function delPerItemReport(data) {
	return request({
		url: '/bnsDataItemReport/delPerItemReport',
		method: 'post',
		data: data
	})
}

//获取接口导入因子
export function getInterfaceItemList(query) {
  return request({
    url: '/bnsDataItemReport/getInterFaceItems',
    method: 'get',
		params: query
  })
}

export function getInterfaceItemParam(query) {
	return request({
		url: '/bnsDataItemReport/getInterfaceItemParam',
		method: 'get',
		params: query
	})
}

export function getInterfaceItemParamWithJK(query) {
	return request({
		url: '/bnsDataItemReport/getInterFaceItemParamsWithJK',
		method: 'get',
		params: query
	})
}

//接口提取
export function drawInterfaceItemData(data) {
	return request({
		url: '/bnsDataItemReport/drawInterfaceData',
		method: 'post',
		data: data
	})
}

export function oneKeyDraw(data) {
	return request({
		url: '/bnsDataItemReport/oneKeyDraw',
		method: 'post',
		data: data
	})
}

/* 批量提交科室填报数据 */
export function batchSaveDeptReport(data) {
	return request({
		url: '/bnsDataItemReport/batchSaveDeptReport',
		method: 'post',
		data: data
	})
}

/* 批量提交人员填报数据 */
export function batchSavePerReport(data) {
	return request({
		url: '/bnsDataItemReport/batchSavePerReport',
		method: 'post',
		data: data
	})
}

/* 获取接口导入科室因子数据 */
export function getInterfaceItemDeptData(query) {
	return request({
		url: '/bnsDataItemReport/getInterfaceDeptData',
		method: 'get',
		params: query
	})
}

/* 获取接口导入人员因子数据 */
export function getInterfaceItemPerData(query) {
	return request({
		url: '/bnsDataItemReport/getInterfacePerData',
		method: 'get',
		params: query
	})
}

/* 补充公式未适用产生因子数据的科室或人员 */
export function supplementDeptOrPer(data) {
	return request({
		url: '/bnsDataItemReport/supplementDeptOrPerByItem',
		method: 'post',
		data: data
	})
}

/* 重置公式适用科室或人员 */
export function resetDeptOrPer(data) {
	return request({
		url: '/bnsDataItemReport/resetDeptOrPerByItem',
		method: 'post',
		data: data
	})
}

/* 获取考核导入因子参数 */
export function getExamItemParam(query) {
	return request({
		url: '/bnsDataItemReport/getExamItemParam',
		method: 'get',
		params: query
	})
}

/* 获取考核导入的因子列表 */
export function getExamItemList(query) {
	return request({
		url: '/bnsDataItemReport/getExamItems',
		method: 'get',
		params: query
	})
}

/* 提取考核结果 */
export function drawExamItemData(data) {
	return request({
		url: '/bnsDataItemReport/drawExamData',
		method: 'post',
		data: data
	})
}
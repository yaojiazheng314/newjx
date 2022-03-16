import request from '@/utils/request'

/* 获取用户目标参数 */
export function getAimConfigParamByUser(query) {
	return request({
		url: '/aimConfig/getAimConfigParamByUser',
		method: 'get',
		params: query
	})
}

/* 获取用户目标列表 */
export function fetchAimConfigByUser(query) {
	return request({
		url: '/aimConfig/getAimConfigListByUser',
		method: 'get',
		params: query
	})
}

/* 保存目标 */
export function saveAimConfig(data) {
	return request({
		url: '/aimConfig/saveAimConfig',
		method: 'post',
		data: data
	})
}

/* 获取用户为责任人的目标列表 */
export function getAimProgressByRespPerson(query) {
	return request({
		url: '/aimProgress/getAimProgressByRespPerson',
		method: 'get',
		params: query
	})
}

/* 获取最新进度的aimConfig实体 aimReport实体 */
export function getAimReport(query) {
	return request({
		url: '/aimReport/getAimReport',
		method: 'get',
		params: query
	})
}

/* 保存目标进度报告 返回一个AimReport实体*/
export function saveAimReport(data) {
	return request({
		url: '/aimReport/saveAimReport',
		method: 'post',
		data: data
	})
}

/* 保存目标进度执行的状态 */
export function keepAimProgressStatus(data) {
	return request({
		url: '/aimProgress/keepAimProgressStatus',
		method: 'post',
		data: data
	})
}

/* 查询目标进度报告 */
export function fetchAimReports(query) {
	return request({
		url: '/aimReport/getAimReportList',
		method: 'get',
		params: query
	})
}

/* 保存修改的进度记录 */
export function saveAimReportResult(data) {
	return request({
		url: '/aimReport/saveAimReportResult',
		method: 'post',
		data: data
	})
}

/* 删除aimReport */
export function deleteAimReport(data) {
	return request({
		url: '/aimReport/deleteAimReport',
		method: 'post',
		data: data
	})
}

/* 获取目标权重分配明细 */
export function getAimConfigWeightInfo(query) {
	return request({
		url: '/aimConfig/getAimConfigWeightInfo',
		method: 'get',
		params: query
	})
}

/* 全局进度 */
/* 获取目标树 */
export function getAimTree() {
	return request({
		url: '/aimConfig/getAimTree',
		method: 'get'
	})
}

/* 获取目标进度 */
export function getAimProgressLine(query) {
	return request({
		url: '/aimProgress/getAimProgressLine',
		method: 'get',
		params: query
	})
}

/* 获取该目标的进度表 */
export function getAimProgressListByAimConfig(query) {
	return request({
		url: '/aimProgress/getAimProgressListByAimConfig',
		method: 'get',
		params: query
	})
}
//新规api接口

export function getAimConfigDataByYear(yearTemp) {
	return request({
		url: '/aimconfig/getAimConfigData',
		method: 'get',
		params: {
			yearTemp
		}
	})
}
//权重信息
export function generateAimconfig(yearTemp) {
	return request({
		url: '/aimconfig/generateAimconfig',
		method: 'get',
		params: {
			yearTemp
		}
	})
}
//整体调整

export function AimConfigDataAdjust(yearTemp,ratio) {
	return request({
		url: '/aimconfig/AimConfigDataAdjust',
		method: 'get',
		params: {
			yearTemp,
			ratio
		}
	})
}

//更新目标的停用和启用状态
export function AimConfigDataModifyState(data) {
	return request({
		url: '/aimconfig/AimConfigDataModifyState',
		method: 'post',
		data: data
	})
}
//取得历年目标库的年列表
export function getAimConfigYearList() {
	return request({
		url: '/aimconfig/getAimConfigYearSelect',
		method: 'get'		
	})
}


/* 目标列表 */
export function getAimTargets(query) {
	return request({
		// url: '/exam/getExamTargets',
		url: '/aim/getAimLibTargets',
	  method: 'get',
		params: {query}
	})
}


/* 更新目标的step状态 */
export function updateAimConfigDataStep(yearTemp,step) {
	return request({
		// url: '/exam/getExamTargets',
		url: '/aimconfig/AimConfigDataModifyStep',
	  method: 'get',
		params: {
			yearTemp,
			step
		}
	})
}

//更新目标的调整信息
export function AimConfigDataAdjustForEntity(data) {
	return request({
		url: '/aimconfig/AimConfigDataAdjustForEntity',
		method: 'post',
		data: data
	})
}

//根据目标ID取得目标分解列表
export function getDissociationListByAimId(id) {
	return request({
	url: '/aimDissociation/getDissociationListByAimId',
	  method: 'get',
		params: {
			id
		}
	})
}

/* 通过选择是个人模板还是科室模板生成树形接口 */
export function getDeptUserTree(query) {
	return request({
	  url: '/exam/getDeptUserTree',
	  method: 'get',
		params: query
	})
}

//根据目标ID取得目标分解列表
export function saveDissociation(data) {
	return request({
	url: '/aimDissociation/saveDissociation',
	  method: 'post',
	data:data
	})
}

/* 通过选择是科室模板生成树形接口 */
export function getDeptTree(query) {
	return request({
	  url: '/exam/getDeptTree',
	  method: 'get',
		params: query
	})
}
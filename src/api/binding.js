import request from '@/utils/request'

/* 模糊查询接口科室名称 */
export function fuzzyQueryItfDeptName(query) {
	return request({
		url: '/itfDepartmentLink/fuzzyQueryItfDeptName',
		method: 'get',
		params: query
	})
}

/* 获取接口来源参数列表 */
export function getSyslbParam() {
	return request({
		url: '/itfDepartmentLink/getSyslbParam',
		method: 'get'
	})
}

/* 获取接口科室绑定信息列表 */
export function fetchItfDeptLinkList(query) {
	return request({
		url: '/itfDepartmentLink/fetchList',
		method: 'get',
		params: query
	})
}
/* 获取接口科室绑定信息列表 */
export function fetchItfDeptLinkListKpi(query) {
	return request({
		url: '/itfDepartmentLink/fetchListKpi',
		method: 'get',
		params: query
	})
}
/* 保存绑定信息 */
export function saveItfDeptLink(data) {
	return request({
		url: '/itfDepartmentLink/saveItfDeptLink',
		method: 'post',
		data: data
	})
}

/* 模糊查询接口人员姓名 */
export function fuzzyQueryItfPerName(query) {
	return request({
		url: '/itfPersonLink/fuzzyQueryItfPerName',
		method: 'get',
		params: query
	})
}

/* 获取人员接口来源 */
export function getItfPerSyslbParam() {
	return request({
		url: '/itfPersonLink/getSyslbParam',
		method: 'get'
	})
}

/* 获取接口人员绑定信息 */
export function fetchItfPerLinkList(query) {
	return request({
		url: '/itfPersonLink/fetchList',
		method: 'get',
		params: query
	})
}

/* 保存接口人员绑定信息 */
export function saveItfPerLink(data) {
	return request({
		url: '/itfPersonLink/saveItfPerLink',
		method: 'post',
		data: data
	})
}

/* 自动绑定人员信息 */
export function personLinkautoBinding() {
	return request({
		url: '/itfPersonLink/autoBinding',
		method: 'post'
	})
}

/* 根据接口来源人员信息所属科室轮转基础人员信息所属科室 */
export function rotatePersonsDept(param) {
	return request({
		url: '/itfPersonLink/rotateBasePersonsDepartment',
		method: 'get',
		params: param
	})
}

/* 获取收费类别列表 */
export function fetchChargeTypeList(query) {
	return request({
		url: '/chargeType/getChargeTypeList',
		method: 'get',
		params: query
	})
}

/* 模糊查询收费类别名称 */
export function fuzzyQueryChargeTypeName(query) {
	return request({
		url: '/chargeType/fuzzyQueryChargeTypeName',
		method: 'get',
		params: query
	})
}

/* 更新收费类别系数 */
export function saveBaseChargeType(data) {
	return request({
		url: '/chargeType/saveBaseChargeType',
		method: 'post',
		data: data
	})
}

/* 分页查询收费项目列表 */
export function fetchChargeItemList(query) {
	return request({
		url: '/chargeItem/getChargeItemList',
		method: 'get',
		params: query
	})
}

/* 模糊查询收费项目名称 */
export function fuzzyQueryChargeItemName(param) {
	return request({
		url: '/chargeItem/fuzzyQueryChargeItemName',
		method: 'get',
		params: param
	})
}

/* 获取收费项目参数 */
export function getChargeTypeParam() {
	return request({
		url: '/chargeType/getChargeTypeParam',
		method: 'get'
	})
}

/* 保存收费项目 */
export function saveBaseChargeItem(data) {
	return request({
		url: '/chargeItem/saveBaseChargeItem',
		method: 'post',
		data: data
	})
}

/* 根据收费类别调整保存收费项目系数 */
export function adjustChargeItemCoef() {
	return request({
		url: '/chargeItem/adjustChargeItemCoef',
		method: 'get'
	})
}

/* 取得收费类别对应的院属关系 */
export function fetchBindHisTypeList(query) {
	return request({
		url: '/chargeType/getBindHisTypeList',
		method: 'get',
		params: query
	})
}

/* 获取HIS收费类别列表 */
export function fetchHisTypeList() {
	return request({
		url: '/itfchargeType/getItfChargType',
		method: 'get'
	})
}

/* 保存绩效与his的收费类别对照关系 */
export function saveBaseItfChargType(data) {
	return request({
		url: '/itfchargeType/saveBaseItfChargType',
		method: 'post',
		data: data
	})
}

/* 删除绩效与his的收费类别对照关系 */
export function delSelectedData(data) {
	return request({
		url: '/itfchargeType/delBaseItfChargType',
		method: 'post',
		data: data
	})
}

/* 成本绑定--start */

/* 模糊查询成本类别名称 */
export function fuzzyQueryCostTypeName(query) {
	return request({
		url: '/CostTypeBind/fuzzyQueryName',
		method: 'get',
		params: query
	})
}

/* 获取成本类别列表 */
export function fetchCostTypeList(query) {
	return request({
		url: '/CostTypeBind/getList',
		method: 'get',
		params: query
	})
}
/* 取得成本类别对应的院属关系 */
export function fetchBindCostList(query) {
	return request({
		url: '/CostTypeBind/getCostTypeBindList',
		method: 'get',
		params: query
	})
}

/* 获取接口成本列表 */
export function fetchItfCostList() {
	return request({
		url: '/CostTypeBind/getItfCostType',
		method: 'get'
	})
}

/* 保存绩效与his的成本类别对照关系 */
export function saveBaseItfCostype(data) {
	return request({
		url: '/CostTypeBind/saveBaseItfCostType',
		method: 'post',
		data: data
	})
}
/* 删除绩效与his的成本类别对照关系 */
export function delSelectedCostData(data) {
	return request({
		url: '/CostTypeBind/delSelectedCostData',
		method: 'post',
		data: data
	})
}
/* 成本绑定--end */
/* 通过Id获取绩效科室与his科室的关联列表*/
export function fetchDeptLinkListById(query) {
	return request({
		url: '/itfDepartmentLink/getDeptLinkListById',
		method: 'get',
		params: query
	})
}

/* 绩效考核科室对应HIS科室 */
export function saveBaseItfDept(data) {
	return request({
		url: '/itfDepartmentLink/saveBaseItfDept',
		method: 'post',
		data: data
	})
}

/* 删除绩效考核科室对应HIS科室 */
export function delSelectedBaseItfDeptData(data) {
	return request({
		url: '/itfDepartmentLink/delSelectedBaseItfDeptData',
		method: 'post',
		data: data
	})
}

/* 得到院属数据*/
export function getBaseHospParam(query) {
	return request({
		url: '/itfDepartmentLink/getHospitalList',
		method: 'get',
		params: query
	})
}
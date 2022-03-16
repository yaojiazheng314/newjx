import request from '@/utils/request'

export function getFormulaList(query) {
  return request({
    url: '/bnsFormula/getList',
    method: 'get',
		params: query
  })
}

export function getFormulaParam() {
	return request({
		url: '/bnsFormula/getParams',
		method: 'get'
	})
}

export function saveFormulaBaseInfo(data) {
	return request({
		url: '/bnsFormula/saveBaseInfo',
		method: 'post',
		data: data
	})
}

export function getBOSuggestion() {
	return request({
		url: '/bnsFormula/getExistedBO',
		method: 'get'
	})
}

export function saveFormulaBody(data) {
	return request({
		url: '/bnsFormula/saveBody',
		method: 'post',
		data: data
	})
}

export function saveNewFormulaSeq(data) {
	return request({
		url: '/bnsFormula/adjustFormulaSort',
		method: 'post',
		data: data
	})
}

export function getBodyRepList(query) {
	return request({
		url: '/bnsFormula/getBodyReplaceList',
		method: 'get',
		params: query
	})
}

export function getCleanBody(query) {
	return request({
		url: '/bnsFormula/getCleanBody',
		method: 'get',
		params: query
	})
}

export function saveRepBody(data) {
	return request({
		url: '/bnsFormula/saveBodyReplace',
		method: 'post',
		data: data
	})
}

export function deleteRepBody(data) {
	return request({
		url: '/bnsFormula/deleteBodyReplace',
		method: 'post',
		data: data
	})
}

export function getRepConditionList(query) {
	return request({
		url: '/bnsFormula/getReplaceConditions',
		method: 'get',
		params: query
	})
}

export function getExistedTFs(query) {
	return request({
		url: '/bnsFormula/getTermsAndFuncs',
		method: 'get',
		params: query
	})
}

export function saveCondition(data) {
	return request({
		url: '/bnsFormula/saveRepCondition',
		method: 'post',
		data: data
	})
}

export function deleteRepCondition(data) {
	return request({
		url: '/bnsFormula/deleteRepCondition',
		method: 'post',
		data: data
	})
}

export function saveDepartments(data) {
  return request({
    url: '/bnsFormula/saveDepartments',
    method: 'post',
		data: data
  })
}

export function getDepartments(query) {
  return request({
    url: '/bnsFormula/getDepartments',
    method: 'get',
		params: query
  })
}

export function savePeople(data) {
  return request({
    url: '/bnsFormula/savePeople',
    method: 'post',
		data: data
  })
}

export function getPeople(query) {
  return request({
    url: '/bnsFormula/getPeople',
    method: 'get',
		params: query
  })
}

export function copyDepartment(data) {
	return request({
		url: '/bnsFormula/copyDepartments',
		method: 'post',
		data: data
	})
}

export function getFormulaCopyDepts() {
	return request({
		url: '/bnsFormula/getFormulaCopyDepts',
		method: 'get'
	})
}

export function getFormulaPerCopyParam() {
	return request({
		url: '/bnsFormula/getFormulaPersParam',
		method: 'get'
	})
}

export function copyPeople(data) {
	return request({
		url: '/bnsFormula/copyPeople',
		method: 'post',
		data: data
	})
}

export function getFormulas(query) {
	return request({
		url: '/bnsFormula/getFormulas',
		method: 'get',
		params: query
	})
}

/* 快速删除公式的适用科室 */
export function fastDeleteFormulaDept(data) {
  return request({
  	url: '/bnsFormula/fastDeleteFormulaDepartment',
  	method: 'post',
  	data: data
  })
}

/* 快速添加公式的适用科室 */
export function fastAddFormulaDept(data) {
  return request({
  	url: '/bnsFormula/fastAddFormulaDepartment',
  	method: 'post',
  	data: data
  })
}

/* 快速删除公式的适用人员 */
export function fastDeleteFormulaPer(data) {
  return request({
    url: '/bnsFormula/fastDelFormulaPerson',
    method: 'post',
    data: data
  })
}

/* 快速添加公式的适用人员 */
export function fastAddFormulaPer(data) {
  return request({
  	url: '/bnsFormula/fastAddFormulaPerson',
  	method: 'post',
  	data: data
  })
}

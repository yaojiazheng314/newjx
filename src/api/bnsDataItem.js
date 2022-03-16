import request from '@/utils/request'

export function getBnsDataItemList(query) {
  return request({
    url: '/bnsDataItem/getBnsDataItems',
    method: 'get',
		params: query
  })
}

export function getDataItemParam() {
  return request({
    url: '/bnsDataItem/getDataItemParams',
    method: 'get'
  })
}

export function getDataItemParamForExam() {
  return request({
    url: '/bnsDataItem/getDataItemParamsForExam',
    method: 'get'
  })
}
export function saveDataItem(data) {
  return request({
    url: '/bnsDataItem/save',
    method: 'post',
		data: data
  })
}

export function saveDepartments(data) {
  return request({
    url: '/bnsDataItem/saveDepartments',
    method: 'post',
		data: data
  })
}

export function getDepartments(query) {
  return request({
    url: '/bnsDataItem/getDepartments',
    method: 'get',
		params: query
  })
}

export function savePeople(data) {
  return request({
    url: '/bnsDataItem/savePeople',
    method: 'post',
		data: data
  })
}

export function getPeople(query) {
  return request({
    url: '/bnsDataItem/getPeople',
    method: 'get',
		params: query
  })
}

export function getItemApplyTip(query) {
	return request({
		url: '/bnsDataItem/getItemApplyTips',
		method: 'get',
		params: query
	})
}

export function getItemDeptParam() {
	return request({
		url: '/bnsDataItem/getItemDeptParam',
		method: 'get'
	})
}

export function getItemPerCopyParam() {
	return request({
		url: '/bnsDataItem/getItemPerCopyParam',
		method: 'get'
	})
}

export function copyDepartment(data) {
	return request({
		url: '/bnsDataItem/copyDepartments',
		method: 'post',
		data: data
	})
}

export function copyPeople(data) {
	return request({
		url: '/bnsDataItem/copyPeople',
		method: 'post',
		data: data
	})
}

/* 获取手动填报和接口导入因子参数 */
export function getHandleAndInterfaceParams() {
	return request({
		url: '/bnsDataItem/getHandleAndInterfaceParams',
		method: 'get'
	})
}

/* 获取目标导入因子参数 */
export function getAimDataItemParam() {
	return request ({
		url: '/bnsDataItem/getAimDataItemParams',
		method: 'get'
	})
}
import request from '@/utils/request'

export function getcoefList(query) {
  return request({
    url: '/bnsCoef/getBnsCoefList',
    method: 'get',
		params: query
  })
}

export function getCoefParam() {
  return request({
    url: '/bnsCoef/getCoefParam',
    method: 'get'
  })
}

export function getCoefDeptParam(query) {
  return request({
    url: '/bnsCoef/getCoefDepartmentParams',
    method: 'get',
		params: query
  })
}

export function saveCoef(data) {
  return request({
    url: '/bnsCoef/save',
    method: 'post',
		data: data
  })
}

export function saveDepartments(data) {
  return request({
    url: '/bnsCoef/saveDepartments',
    method: 'post',
		data: data
  })
}

export function getDepartments(query) {
  return request({
    url: '/bnsCoef/getDepartments',
    method: 'get',
		params: query
  })
}

export function savePeople(data) {
  return request({
    url: '/bnsCoef/savePeople',
    method: 'post',
		data: data
  })
}

export function getCoefPeopleParam(query) {
  return request({
    url: '/bnsCoef/getCoefPersonParams',
    method: 'get',
		params: query
  })
}

export function getPeople(query) {
  return request({
    url: '/bnsCoef/getPeople',
    method: 'get',
		params: query
  })
}

export function getCoefPositionParam(query) {
  return request({
    url: '/bnsCoef/getCoefPositionParams',
    method: 'get',
		params: query
  })
}

export function getPositions(query) {
  return request({
    url: '/bnsCoef/getPositions',
    method: 'get',
		params: query
  })
}

export function savePositions(data) {
  return request({
    url: '/bnsCoef/savePositions',
    method: 'post',
		data: data
  })
}

export function getCoefCopyDepts() {
	return request({
		url: '/bnsCoef/getCoefCopyDepartments',
		method: 'get'
	})
}

export function copyDepartment(data) {
	return request({
		url: '/bnsCoef/copyDepartments',
		method: 'post',
		data: data
	})
}

export function getCoefPerCopyParam() {
	return request({
		url: '/bnsCoef/getCoefPerCopyParam',
		method: 'get'
	})
}

export function copyPeople(data) {
	return request({
		url: '/bnsCoef/copyPeople',
		method: 'post',
		data: data
	})
}

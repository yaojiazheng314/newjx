import request from '@/utils/request'

export function fetchPeople(query) {
  return request({
    url: '/person',
    method: 'get',
		params: query
  })
}

export function getPersonParam() {
  return request({
    url: '/personParam',
    method: 'get'
  })
}

export function savePerson(data) {
  return request({
    url: '/person/save',
    method: 'post',
		params: data
  })
}

/* 模糊查询人员参数 */
export function fuzzyQueryPerParam(query) {
	return request({
	  url: '/person/fuzzyquery',
	  method: 'get',
		params: query
	})
}

/* 获取同科室人员 */
export function getUserSameDeptPeople(query) {
	return request({
		url: '/person/getSameDeptPeople',
		method: 'get',
		params: query
	})
}

/* 模糊查询人员姓名 */
export function fuzzyQueryPerName(query) {
	return request({
	  url: '/person/fuzzyqueryPerName',
	  method: 'get',
		params: query
	})
}

export function fetchPeopleAdjust(query) {
	return request({
		url: '/person/getPrsonAdjustList',
		method: 'get',
		params: query
	})
}

export function savePersonAdjust(data) {
  return request({
    url: '/person/savePersonAdjust',
    method: 'post',
		params: data
  })
}

export function deletePersonAdjust(data) {
  return request({
    url: '/person/deletePersonAdjust',
    method: 'post',
		params: data
  })
}
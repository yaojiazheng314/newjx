import request from '@/utils/request'

export function getDepartmentTree() {
  return request({
    url: '/department',
    method: 'get'
  })
}

export function getDepartmentParam() {
  return request({
    url: '/department/departmentParam',
    method: 'get'
  })
}

export function getDepartmentParamAll() {
  return request({
    url: '/department/departmentParamAll',
    method: 'get'
  })
}
export function saveDepartment(data) {
  return request({
    url: '/department/save',
    method: 'post',
		data: data
  })
}

export function adjustDepartmentStructure(data) {
  return request({
    url: '/department/restructure',
    method: 'post',
		data: data
  })
}

/* 根据关键字模糊查询编码 名称 类别
	 关键字输入‘全部’ 返回全部科室 */
export function fuzzyQueryDeptParam(query) {
	return request({
	  url: '/department/fuzzyquery',
	  method: 'get',
		params: query
	})
}

/* 模糊查询科室名称 */
/* 返回科室名称列表 不包含科室id */
export function fuzzyQueryDeptName(query) {
	return request({
	  url: '/department/fuzzyqueryDeptName',
	  method: 'get',
		params: query
	})
}
/* 返回科室名称列表 包含科室id */
export function getDepartmentParamWithId() {
  return request({
    url: '/department/getDepartmentParamWithId',
    method: 'get'
  })
}

/* 返回基础表 */
export function getBaseCurrentYearmonth() {
  return request({
    url: '/department/getBaseCurrentYearmonth',
    method: 'get'
  })
}
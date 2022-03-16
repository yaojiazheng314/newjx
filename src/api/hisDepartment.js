import request from '@/utils/request'



export function getHisDepartmentParam() {
  return request({
    url: '/hisDepartment/departmentParam',
    method: 'get'
  })
}

export function getHisDepartmentParamAll(query) {
  return request({
    url: '/hisDepartment/departmentParamAll',
    method: 'get',
    params: query
  })
}


export function fuzzyQueryDeptLinkParam(query) {
  return request({
    url: '/hisDepartment/fuzzyQueryDeptLinkParam',
    method: 'get',
    params: query
  })
}

// /* 根据关键字模糊查询编码 名称 类别
// 	 关键字输入‘全部’ 返回全部科室 */
// export function fuzzyQueryDeptParam(query) {
// 	return request({
// 	  url: '/department/fuzzyquery',
// 	  method: 'get',
// 		params: query
// 	})
// }

// /* 模糊查询科室名称 */
// /* 返回科室名称列表 不包含科室id */
// export function fuzzyQueryDeptName(query) {
// 	return request({
// 	  url: '/department/fuzzyqueryDeptName',
// 	  method: 'get',
// 		params: query
// 	})
// }
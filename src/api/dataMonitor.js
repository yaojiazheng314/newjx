import request from '@/utils/request'
/* 查询kdys列表 */
export function getKdysList(data) {
  return request({
    url: '/deptRevenue/getKdysList',
    method: 'post',
		data: data
  })
}
/* 查询kssr列表 住院收入 门诊收入 药品收入 */
export function getKssrList(data) {
  return request({
    url: '/deptRevenue/getKssrList',
    method: 'post',
    data: data
  })
}

/* 查询srlb 词云数据 */
export function getSrlb(data) {
  return request({
    url: '/deptRevenue/getSrlb',
    method: 'post',
    data: data
  })
}

/* 查询科室收入组成 */
export function getKssrzc(data) {
  return request({
    url: '/deptRevenue/getKssrzc',
    method: 'post',
    data: data
  })
}

/* 住院收入 门诊收入 药品收入分类汇总 */
export function getKssrfl(data) {
  return request({
    url: '/deptRevenue/getKssrfl',
    method: 'post',
    data: data
  })
}

/* 收入类别组成 */
export function getSrlbzc(data) {
  return request({
    url: '/deptRevenue/getSrlbzc',
    method: 'post',
    data: data
  })
}

/* 获取科室每日的收入 暂未分成 */
export function getKssrrq(data) {
  return request({
    url: '/deptRevenue/getKssrrq',
    method: 'post',
    data: data
  })
}

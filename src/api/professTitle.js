import request from '@/utils/request'

export function getProfessTitleList() {
  return request({
    url: '/professTitleList',
    method: 'get'
  })
}

export function saveProfessTitle(data) {
  return request({
    url: '/professTitle/save',
    method: 'post',
		params: data
  })
}

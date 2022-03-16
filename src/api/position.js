import request from '@/utils/request'

export function getPositionList() {
  return request({
    url: '/getPositionList',
    method: 'get'
  })
}

export function savePosition(data) {
  return request({
    url: '/position/save',
    method: 'post',
		params: data
  })
}

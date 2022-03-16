import request from '@/utils/request'

export function fuzzyQueryItfChargeType(query) {
  return request({
    url: '/v2/baseItfChargeTypeLink/itfChargeType/fuzzyQuery',
    method: 'get',
    params: query
  })
}

export function getLinkList(query) {
	return request({
	  url: '/v2/baseItfChargeTypeLink/list/byBaseChargeType',
	  method: 'get',
	  params: query
	})
}
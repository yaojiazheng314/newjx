import request from '@/utils/request'

export function fuzzyQueryItfCostType(query) {
  return request({
    url: '/v2/baseItfCostTypeLink/itfCostType/fuzzyQuery',
    method: 'get',
    params: query
  })
}

export function getLinkList(query) {
	return request({
	  url: '/v2/baseItfCostTypeLink/list/byBaseCostType',
	  method: 'get',
	  params: query
	})
}
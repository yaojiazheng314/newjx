import request from '@/utils/request'

export function getItemDeptWithModifyDataList(query) {
  return request({
    url: '/bnsDataItemReport/getItemDeptWithModifyData',
    method: 'get',
		params: query
  })
}

export function getItemIncomehModifyDataList(query) {
  return request({
    url: '/bnsSumIncome/getItemIncomehModifyData',
    method: 'get',
		params: query
  })
}

export function getIncomehModifyList(query) {
  return request({
    url: '/bnsSumIncome/getIncomehModifyDataList',
    method: 'get',
		params: query
  })
}

export function saveItemIncomehModifyData(data) {
  return request({
    url: '/bnsSumIncome/saveSumIncomeModify',
    method: 'post',
		data: data
  })
}

export function createIncomData(query) {
  return request({
    url: '/bnsSumIncome/createIncomData',
    method: 'get',
		params: query
  })
}
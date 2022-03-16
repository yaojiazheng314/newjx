import request from '@/utils/request'

export function fetchDataList(query) {
  return request({
    url: '/CostAdjust/dataList',
    method: 'get',
		params: query
  })
}

export function fetchConfirmDataList(query) {
  return request({
    url: '/CostAdjust/fetchConfirmDataList',
    method: 'get',
		params: query
  })
}
export function getCostTypeList() {
  return request({
    url: '/CostAdjust/getCostTypeParam',
    method: 'get'
  })
}


export function saveCostTypeData(data) {
  return request({
    url: '/CostAdjust/saveCostAdjustData',
    method: 'post',
		params: data
  })
}
export function confirmCostTypeData(query) {
  return request({
    url: '/CostAdjust/confirmCostTypeData',
    method: 'get',
		params: query
  })
}

export function cancelConfirmCostTypeData(query) {
  return request({
    url: '/CostAdjust/cancelConfirmCostTypeData',
    method: 'get',
		params: query
  })
}
//deleteCostAdjustData
export function deleteCostAdjustData(data) {
  return request({
    url: '/CostAdjust/deleteCostAdjustData',
    method: 'post',
		params: data
  })
}

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  }
}
export function costAdjustExcelTemplate(data) {
  return request({
    url: '/CostAdjust/costAdjustExcelTemplate',
    method: 'post',
		params: data
  })
}

export function costAdjustExcelUpload(formData) {
  return request({
    url: '/CostAdjust/costAdjustUploadExcel',
    method: 'post',
    data: formData,
    config:config
  })
}

export function getBaseCostTypeWithId() {
  return request({
    url: '/CostAdjust/getBaseCostTypeWithId',
    method: 'get'
  })
}

export function saveAdjustDataMore(data) {
  return request({
    // url: '/bnsIncomeAdjust/saveIncomeModify',
    url: '/CostAdjust/saveCostAdjustMore',
    method: 'post',
		params: data
  })
}
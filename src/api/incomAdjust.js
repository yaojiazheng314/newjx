import request from '@/utils/request'

export function fetchIncomeAdjustDataList(query) {
  return request({
    url: '/bnsIncomeAdjust/getItemIncomeAdjustData',
    method: 'get',
		params: query
  })
}

export function fetchIncomeAdjustConfirmDataList(query) {
  return request({
    url: '/bnsIncomeAdjust/getItemIncomeConfirmAdjustData',
    method: 'get',
		params: query
  })
}

export function saveIncomeAdjustData(data) {
  return request({
    url: '/bnsIncomeAdjust/saveIncomeModify',
    method: 'post',
		params: data
  })
}

export function saveIncomeAdjustDataAll(data) {
  return request({
    url: '/bnsIncomeAdjust/saveIncomeModifyAll',
    method: 'post',
		data: data
  })
}
export function confirmIncomeAdjustData(query) {
  return request({
    url: '/bnsIncomeAdjust/confirmIncomeAdjustData',
    method: 'get',
		params: query
  })
}

export function confirmCancelIncomeAdjustData(query) {
  return request({
    url: '/bnsIncomeAdjust/cancelConfirmIncomeAdjustData',
    method: 'get',
		params: query
  })
}
	/* 删除收入调整 */
	export function deleteIncomeAdjustData(data) {
		return request({
			url: '/bnsIncomeAdjust/delIncomeAdjust',
			method: 'post',
			data: data
		})
  }
  
  	/* 删除收入调整-多选 */
	export function deleteIncomeAdjustDataMore(data) {
		return request({
			url: '/bnsIncomeAdjust/delIncomeAdjustMore',
			method: 'post',
			data: data
		})
	}

	

	export function getIncomeAdjustDataForExcel(query) {
		return request({
			url: '/bnsIncomeAdjust/getIncomeAdjustDataForExcel',
			method: 'get',
			params: query
		})
	}
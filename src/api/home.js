import request from '@/utils/request'
/* 近六个月用户绩效分配总额 */
export function getHalfYearFeedBackData(query) {
  return request({
    url: '/home/getHalfYearFeedBack',
    method: 'get',
		params: query
  })
}

/* 用户当前需要分配的绩效 */
export function getCurrentFeedBackData(query) {
	return request({
	  url: '/home/getCurrentFeedBackData',
	  method: 'get',
		params: query
	})
}

/* 用户当前分配的人员明细 */
export function getFeedBackPersonDetail(query) {
	return request({
	  url: '/home/getCurrentFeedBackDetail',
	  method: 'get',
		params: query
	})
}
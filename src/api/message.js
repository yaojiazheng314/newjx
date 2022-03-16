import request from '@/utils/request'

export function saveMessage(data) {
  return request({
    url: '/message/saveMessage',
    method: 'post',
    data: data
  })
}

/* 获取全院发布的最近5条留言 */
export function getAllHospMessage(query) {
	return request({
		url: '/message/getAllHospMessage',
    method: 'get',
    params: query
	})
}

import request from '@/utils/request'



export function fetchDipInfo(query) {
	return request({
	  url: '/dip/getDipList',
	  method: 'get',
		params: query
	})
}


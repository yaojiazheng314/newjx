import request from '@/utils/request'

export function getHospitalInfo() {
  return request({
    url: '/getHospitalInfo',
    method: 'get'
  })
}

export function updateHospitalInfo(hosp) {
  return request({
    url: '/updateHospitalInfo',
    method: 'post',
		params: hosp
  })
}
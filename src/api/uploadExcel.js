import request from '@/utils/request'

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  }
}

export function uploadDeptData(formData) {
  return request({
    url: '/uploadexcel/bnsDataItemReport',
    method: 'post',
    data: formData,
    config: config
  })
}

export function uploadMedicalInsurance(formData) {
  return request({
    url: '/uploadexcel/medicalInsurance',
    method: 'post',
    data: formData,
    config: config
  })
}

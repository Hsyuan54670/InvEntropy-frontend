import request from '@/utils/request'

export const getUserInfoApi = (id) => {
    return request.get(`/homes/userInfo/${id}`)
}
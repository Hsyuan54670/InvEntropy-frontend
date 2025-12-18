import request from '@/utils/request'

export const changePasswordApi = (data) => {
    return request.put('/user/changePassword',data)
}
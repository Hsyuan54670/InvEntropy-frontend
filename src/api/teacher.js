import request from '@/utils/request'

export const changePasswordApi = (data) => {
    return request.post('/teacher/changePassword',data)
}
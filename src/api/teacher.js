import request from '@/utils/request'

export const changePasswordApi = (data) => {
    return request.put('/user/changePassword',data)
}

export const commitPayFundsApi = (data) => {
    console.log(data)
    return request.put('/admin/fundsApprovalList',data)
}
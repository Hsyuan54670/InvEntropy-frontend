import request from '@/utils/request'
export const getProjectsApprovalApi=() => {
    return request.get(`/admin/projectsApprovalList`)
}
export const approvalProjectApi=(id)=>{
    return request.put(`/admin/approvalProject/${id}`)
}

export const NotApprovalProjectApi=(id,reason)=>{
    return request.put(`/admin/notApprovalProject/${id}?reason=${encodeURIComponent(reason)}`)
}

export const getFundsApprovalApi=() => {
    return request.get(`/admin/fundsApprovalList`)
}

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

export const approvalFundsApi=(appliedFunds, id, comment)=>{
    return request.put(`/admin/approvalFunds/${id}`, {
        appliedFunds: appliedFunds,
        comment: comment
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const NotApprovalFundsApi=(id,comment)=>{
    return request.put(`/admin/notApprovalFunds/${id}?comment=${encodeURIComponent(comment)}`)
}

export const getProjectsLogApi=()=>{
    return request.get(`/admin/projectsLogList`)
}

export const getFundsLogApi=()=>{
    return request.get(`/admin/fundsLogList`)
}

export const getAllProjectsApi=()=>{
    return request.get(`/admin/projectsList`)
}
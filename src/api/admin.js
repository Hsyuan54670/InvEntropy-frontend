import request from '@/utils/request'
export const getProjectsApprovalApi=(params) => {
    return request.get(`/admin/projectsApprovalList`, { params })
}

export const getFundsApprovalApi=(params) => {
    return request.get(`/admin/fundsApprovalList`, { params })
}

export const getAllProjectsApi=(params) => {
    return request.get(`/admin/projectsList`, { params })
}

export const getProjectsLogApi=(params) => {
    return request.get(`/admin/projectsLogList`, { params })
}

export const getFundsLogApi=(params) => {
    return request.get(`/admin/fundsLogList`, { params })
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
    return request.put(`/admin/notApprovalFunds/${id}`, {
        comment: comment
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const approvalProjectApi=(id)=>{
    return request.put(`/admin/approvalProject/${id}`)
}

export const NotApprovalProjectApi=(id,reason)=>{
    return request.put(`/admin/notApprovalProject/${id}?reason=${encodeURIComponent(reason)}`)
}

export const getWorkApi=()=>{
    return request.get(`/admin/work`)
}

export const getFundsApi=()=>{
    return request.get(`/admin/funds`)
}

export const getKindsApi=()=>{
    return request.get(`/admin/kinds`)
}


export const getAccountApi=()=>{
    return request.get(`/admin/accountList`)
}

export const addAccountApi=(form)=>{
    return request.post(`/admin/addAccount`, {
        name: form.name,
        gender: form.gender,
        age: form.age,
        phone: form.phone,
        college: form.college
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const deleteAccountApi=(id)=>{
    return request.delete(`/admin/deleteAccount/${id}`)
}
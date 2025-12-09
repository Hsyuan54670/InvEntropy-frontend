import request from '@/utils/request'

export const getUserInfoApi = (id) => {
    return request.get(`/homes/userInfo/${id}`)
}

export const getUserIngProjectsApi = (id) => {
    return request.get(`/homes/userIngProjects/${id}`)
}
import request from '@/utils/request'

export const getUserInfoApi = () => {
    return request.get(`/homes/userInfo`)
}

export const getUserIngProjectsApi = () => {
    return request.get(`/homes/userIngProjects`)
}
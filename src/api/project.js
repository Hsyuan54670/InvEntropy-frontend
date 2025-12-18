import request from '@/utils/request'

export const submitProjectApi = (data) => {
    return request.post('/project/submit',data)
}
export const getIngProjectsApi = () => {
    return request.get(`/project/getIngProjects`)
}
export const getFinishedProjectsApi = () => {
    return request.get(`/project/getFinishedProjects`)
}
export const getUnpassedProjectsApi = () => {
    return request.get(`/project/getUnpassedProjects`)
}

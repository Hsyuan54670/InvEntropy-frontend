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

export const updateProjectStatusApi=(params)=>{
    return request.put(`/project/updateProjectStatus`,params)
}

export const deleteProjectApi=(id)=>{
    return request.delete(`/project/deleteProject/${id}`)
}

export const updateDeadlineApi=(params)=>{
    return request.put(`/project/updateDeadline`,params)
}
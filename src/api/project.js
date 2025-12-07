import request from '@/utils/request'

export const submitProjectApi = (data) => {
    return request.post('/project/submit',data)
}
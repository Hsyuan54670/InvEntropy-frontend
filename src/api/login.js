import request from '@/utils/request'
export const loginApi = (data) => {
    return request.post('/login',{
        username: data.username,
        password: data.password,
        userType: data.userType,
        timestamp: data.timestamp,
    },{
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const getPublicKeyApi = () => {
    return request.get('/login/auth/publicKey')
}
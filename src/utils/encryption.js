import JSEncrypt from 'jsencrypt'
import { getPublicKeyApi } from '@/api/login'

//RSA加密密码
class RSACrypto {
    constructor() {
        this.publicKey = null;
        this.encryptor = new JSEncrypt();
    }

    
    async getPublicKey() { 
        try {
            const res = await getPublicKeyApi()
            this.publicKey = res.data.publicKey
            this.encryptor.setPublicKey(this.publicKey)
            return true
        } catch (error) {
            console.log(error)
            throw new Error('获取公钥失败！')
        }
    }

    encryptPassword = (password) => { 
        if(!this.publicKey){
            throw new Error('公钥未初始化')
        }
        
        const randomStr =   Math.random().toString(36).substring(2,15) +
                            Math.random().toString(36).substring(2,15)
        const dataToEncrypt = JSON.stringify(
            {
                password: password,
                random: randomStr,
                timestamp: Date.now()
            }
        )
        return this.encryptor.encrypt(dataToEncrypt)
    }

    
}

export default new RSACrypto()
/**
 * 加密工具
 * 陈登文
 * 2018年9月29日 22:05:21
 */

import Setting from '@/setting';
import dataUtils from '@/utils/dataUtils'

var CryptoJS = require('crypto-js')
let secretUtils = {}
var key = CryptoJS.enc.Latin1.parse('abcdef0123456789')

// 加密
secretUtils.EncryptData = (data) => {
    var srcs = CryptoJS.enc.Utf8.parse(data)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

// 解密
secretUtils.DecryptData = (data) => {
    var decrypt = CryptoJS.AES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    var result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
    return result
}

/**
 * 权限验证
 * @param el
 * @param data
 */
secretUtils.permission = (el, data) => {
    let have = false
    const userInfo = dataUtils.getData(Setting.key.userInfo)
    if(userInfo!=null){
        let permissions = userInfo.permissions
        if (permissions != null) {
            for(let i = 0;i<permissions.length;i++){
                if(permissions[i]==data){
                    have = true
                    break;
                }
            }
        }
    }
    if(!have){
        el.remove()
    }
}
export default secretUtils

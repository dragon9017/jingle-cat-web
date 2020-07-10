import request from '@/plugins/request';
import Setting from '@/setting';


export function login (params,randomStr) {
    return request({
        url: '/system/login/login/'+randomStr,
        method: 'get',
        params:params
    });
}

export function info () {
    return request({
        url: '/system/login/info',
        method: 'get'
    });
}

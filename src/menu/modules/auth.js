const pre = '/auth/';

export default {
    path: '/auth',
    title: '权限管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    children: [
        {
            path: `${pre}user`,
            title: '用户管理'
        }, {
            path: `${pre}menu`,
            title: '菜单管理'
        }, {
            path: `${pre}role`,
            title: '角色管理'
        }, {
            path: `${pre}dept`,
            title: '部门管理'
        }, {
            path: `${pre}tenant`,
            title: '企业管理'
        }
    ]
}

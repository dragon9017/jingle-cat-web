const pre = '/system/';

export default {
    path: '/system',
    title: '系统管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    children: [
        {
            path: `${pre}banner`,
            title: 'banner管理'
        },
        {
            path: `${pre}log`,
            title: '日志管理'
        },
        {
            path: `${pre}leaveMessage`,
            title: '留言管理'
        },{
            path: `${pre}banner`,
            title: 'banner管理'
        },{
            path: `${pre}dict`,
            title: '字典管理'
        },{
            path: `${pre}param`,
            title: '参数管理'
        },{
            path: `${pre}client`,
            title: '终端管理'
        },{
            path: `${pre}social`,
            title: '密钥管理'
        },{
            path: `${pre}token`,
            title: '令牌管理'
        },{
            path: `${pre}routes`,
            title: '动态路由'
        }, {
            path: `${pre}sys-file`,
            title: '文件管理'
        }, {
            path: `${pre}job`,
            title: '调度管理'
        }
    ]
}

import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'system-';

export default {
    path: '/system',
    name: 'system',
    redirect: {
        name: `${pre}system`
    },
    meta,
    component: BasicLayout,
    children: [
        /*{
            path: 'log',
            name: `${pre}log`,
            meta: {
                ...meta,
                title: '日志管理',
                closable: false
            },
            component: () => import('@/pages/system/log/log')
        },{
            path: 'sys-file',
            name: `${pre}sys-file`,
            meta: {
                ...meta,
                title: '文件管理',
                closable: false
            },
            component: () => import('@/pages/system/sys-file/sys-file')
        },*/{
            path: 'dict',
            name: `${pre}dict`,
            meta: {
                ...meta,
                title: '字典管理',
                closable: false
            },
            component: () => import('@/pages/system/dict/dict')
        },{
            path: 'param',
            name: `${pre}param`,
            meta: {
                ...meta,
                title: '参数管理',
                closable: false
            },
            component: () => import('@/pages/system/param/param')
        }/*,{
            path: 'client',
            name: `${pre}client`,
            meta: {
                ...meta,
                title: '终端管理',
                closable: false
            },
            component: () => import('@/pages/system/client/client')
        },{
            path: 'social',
            name: `${pre}social`,
            meta: {
                ...meta,
                title: '密钥管理',
                closable: false
            },
            component: () => import('@/pages/system/social/social')
        },{
            path: 'token',
            name: `${pre}token`,
            meta: {
                ...meta,
                title: '令牌管理',
                closable: false
            },
            component: () => import('@/pages/system/token/token')
        },{
            path: 'routes',
            name: `${pre}routes`,
            meta: {
                ...meta,
                title: '动态路由',
                closable: false
            },
            component: () => import('@/pages/system/routes/routes')
        }*/
    ]
};

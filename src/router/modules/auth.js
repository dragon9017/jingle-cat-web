import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'auth-';

export default {
    path: '/auth',
    name: 'auth',
    redirect: {
        name: `${pre}menu`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'menu',
            name: `${pre}menu`,
            meta: {
                ...meta,
                title: '菜单管理',
                closable: false
            },
            component: () => import('@/pages/system/menu')
        }
    ]
};

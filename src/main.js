// Vue
import Vue from 'vue';
import App from './App';

// 配置
import Setting from './setting';

// 混合
import mixinApp from '@/mixins/app';

// 插件
import plugins from '@/plugins';

// store
import store from '@/store/index';

// iView 和 iView Pro
import ViewUI from 'view-design';
import iViewPro from '@/libs/iview-pro/iview-pro.min.js';

// 菜单和路由
import router from './router';
import menuHeader from '@/menu/header';
import menuSider from '@/menu/sider';
import { frameInRoutes } from '@/router/routes';

// 多语言
import i18n from '@/i18n';

// 方法
import { getHeaderName, getMenuSider, getSiderSubmenu } from '@/libs/system';

// 内置组件
import iLink from '@/components/link';
import iFrame from '@/components/frame';

// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 iView 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less';
import './libs/iview-pro/iview-pro.css';

if (window) window.$t = (key, value) => i18n.t(key, value);

Vue.use(plugins);

Vue.use(ViewUI, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(iViewPro);
Vue.component('i-link', iLink);
Vue.component('i-frame', iFrame);

new Vue({
    mixins: [mixinApp],
    router,
    store,
    i18n,
    render: h => h(App),
    created () {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('admin/page/init', frameInRoutes);
        // 设置顶栏菜单
        this.$store.commit('admin/menu/setHeader', menuHeader);
        // 加载用户登录的数据
        this.$store.dispatch('admin/account/load');
        // 初始化全屏监听
        this.$store.dispatch('admin/layout/listenFullscreen')
    },
    watch: {
        // 监听路由 控制侧边栏显示 标记当前顶栏菜单（如需要）
        '$route' (to, from) {
            let path = to.matched[to.matched.length - 1].path;
            if (!Setting.dynamicSiderMenu) {
                let menu = dataUtils.getData(Setting.key.menu)

                if (menu != null) {
                    const headerName = getHeaderName(path, menu);
                    this.$store.commit('admin/menu/setHeaderName', headerName);
                    const filterMenuSider = getMenuSider(menu, headerName);
                    this.$store.commit('admin/menu/setSider', filterMenuSider);
                    this.$store.commit('admin/menu/setActivePath', path);

                    let openNames = ''
                    var replacePath = null
                    if(Setting.replaceRoute!=null){
                        for (let i = 0;i<Setting.replaceRoute.length;i++){
                            if (path.indexOf(Setting.replaceRoute[i].from) >= 0) {
                                replacePath = Setting.replaceRoute[i].to
                                break;
                            }
                        }
                    }
                    if (replacePath!=null) {
                        this.$store.commit('admin/menu/setActivePath', replacePath);
                        openNames = getSiderSubmenu(replacePath, menuSider);
                    } else {
                        this.$store.commit('admin/menu/setActivePath', path);
                        openNames = getSiderSubmenu(path, menuSider);
                    }
                    this.$store.commit('admin/menu/setOpenNames', openNames);
                }
            }
            this.appRouteChange(to, from);
        }
    }
}).$mount('#app');

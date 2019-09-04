import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 一个进度条的插件
import 'nprogress/nprogress.css' // progress bar style
import { getRoles } from '@/utils/auth' // get roles
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration 是否有转圈效果

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title);

    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next()
      NProgress.done()
    } else if(whiteList.indexOf(to.path) !== -1){
      // 在免费登录白名单，直接去
      next()
    }else {
      const roles = getRoles() && JSON.parse(getRoles());
      if (roles) {
        console.log("有用户信息");
        store.dispatch('permission/GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
          router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
          router.options.routes=store.getters.routers;
        })
        next()
      } else {
        console.log("无用户信息");
        next(`/login?redirect=${to.path}`)
        NProgress.done();
      }
    }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

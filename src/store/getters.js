const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  addRouters: state => state.permission.addRouters,//新增的符合用户权限的路由
  routers: state => state.permission.routers,//获取动态添加过的路由
  roles: state => state.user.roles,//新增  获取用户权限
}
export default getters

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
	language: state => state.app.language,
	visitedViews: state => state.tagsView.visitedViews,
	cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
	userID: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
	perms: state => state.user.perms,
	addRouters: state => state.permission.addRouters,
	routers: state => state.permission.routers
}
export default getters

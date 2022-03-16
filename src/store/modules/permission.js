// store/permission.js 
import { asyncRouterMap, constantRouterMap } from '@/router';

function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.some(p => route.meta.permission.indexOf(p) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
				const { permissions } = data;
				let accessedRoutes = filterAsyncRoutes(asyncRouterMap, permissions);
        commit('SET_ROUTERS', accessedRoutes);
        resolve();
      })
    }
  }
};

export default permission;


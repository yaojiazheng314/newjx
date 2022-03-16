import { login, logout, getAppUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import avatar from '@/assets/gif/mykita_11.gif'

const user = {
  state: {
    token: getToken(),
		id: null,
    name: '',
    avatar: '',
    roles: [],
		perms: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
		SET_USERID: (state, id) => {
			state.id = id
		},
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
		SET_PERMS: (state, perms) => {
		  state.perms = perms
		}
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
				login(username, userInfo.password).then(response => {
					const data = response.data
					setToken(data)
					commit('SET_TOKEN', data)
					resolve(response)
				}).catch(error => {
					reject(error)
				});
			});
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getAppUserInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { 
						// 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
						if(data.permissions && data.permissions.length > 0) {
							commit('SET_PERMS', data.permissions)
						}
          } else {
            reject('获取权限失败: 对不起 ! 您没有访问权限 ！')
          }
					commit('SET_USERID', data.id)
          commit('SET_NAME', data.name)
					if (data.avatar === '' || data.avatar === null) {
						commit('SET_AVATAR', avatar)
					} else {
						commit('SET_AVATAR', data.avatar)
					}
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(response => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
					commit('SET_PERMS', [])
          removeToken()
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
		//防止同一浏览器登录多个账户
		//todo
  }
}

export default user

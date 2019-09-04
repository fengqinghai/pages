import { login, logout, getInfo } from '@/api/user'
import { removeRoles } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  name: '',
  avatar: '',
  roles: '',//自定义权限
}

const mutations = {
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state,roles) => {//新增
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      console.log("vuex中的请求")
      login({ username: username.trim(), password: password }).then(response => {
        console.log('vuex中');
        console.log(response);
        const { data } = response
        commit('SET_TOKEN', data.token);//存在vueX中
        setToken(data.token);//存在cookie中
        resolve()
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录。');
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES',['admin','super_editor']);//自定义权限
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
        removeRoles();//清空roles
        resetRouter();//重置router
        resolve();
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


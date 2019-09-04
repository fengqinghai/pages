import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function setRoles(roles){
  return Cookies.set('roles',roles);
}

export function getRoles(){
  return Cookies.get('roles');
}

export function removeRoles(){
  return Cookies.remove('roles');
}

export function getUserId(){
  return Cookies.get("userId");
}

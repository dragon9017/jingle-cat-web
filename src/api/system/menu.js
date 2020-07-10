import request from '@/plugins/request';

export function getMenu(id) {
  return request({
    url: '/system/menu',
    params: {parentId: id},
    method: 'get'
  })
}

export function getTopMenu() {
  return request({
    url: '/admin/menu',
    params: {type: 'left'},
    method: 'get'
  })
}

export function fetchMenuTree(query) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: obj
  })
}

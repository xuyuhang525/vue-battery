import request from '@/utils/request'

// 查询参数人员列表
export function getUserPage(query) {
    return request({
        url: '/user/list',
        method: 'get',
        params: query
    })
}
// 新增用户
export function addUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/user/update',
        method: 'post',
        data: data
    })
}

// 删除用户
export function delUser(userId) {
    return request({
        url: '/user/delete?id=' + userId,
        method: 'delete'
    })
}
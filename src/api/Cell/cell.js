import request from '@/utils/request'

// 查询参数列表
export function getBatteryPage(query) {
    return request({
        url: '/battery/page',
        method: 'get',
        params: query
    })
}
// 管理列表
export function getInfosPage(query) {
    return request({
        url: '/infos',
        method: 'get',
        params: query
    })
}

// 获取表头
export function getBatteryTitle(query) {
    return request({
        url: '/get/title',
        method: 'get',
        params: query
    })
}
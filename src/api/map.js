import request from '@/utils/request'

export function getMapData() {
    return request({
        url: '/api/processmap/data',
        method: 'get'
    })
}
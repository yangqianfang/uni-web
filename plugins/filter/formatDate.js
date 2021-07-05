/**
 * @author zwcong
 * @time 2019-10-29
 * @description  日期格式化（时间戳转日期）
 * @param de 时间戳
 * @param fmts 格式
 *
 * @usage
 *  import formatDate from '@/plugins/filter/formatDate'
 *
 *  {{item.end_time | formatDate}}
 * 
 */
import Vue from 'vue'

Vue.filter('formatDate', (de, fmts) => {
    let date = de
    let fmt = fmts || 'yyyy.MM.dd'
    if (String(de).length < 13) {
        date *= 1000
    }
    date = new Date(date)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
        )
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const str = `${o[k]}`
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : `00${str}`.substr(str.length)
            )
        }
    }
    return fmt
})

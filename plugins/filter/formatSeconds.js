/**
 * @author zwcong
 * @time 2019-11-13
 * @description  时间格式化（时间戳转日期）
 * @param value 时间戳
 *
 * @usage
 *  import formatSeconds from '@/plugins/filter/formatSeconds'
 *
 *  {{item.end_time | formatSeconds}}
 * 
 */
import Vue from 'vue'

Vue.filter('formatSeconds', (value, fmts) => {
    const format = fmts || "{h}小时{m}分钟{s}秒"

    let theTime = parseInt(value)       // 秒  
    let theTime1 = 0            // 分  
    let theTime2 = 0            // 小时  
    if(theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60)
            theTime1 = parseInt(theTime1%60)
        }
    }
    let seconds = ""+parseInt(theTime)
    let minutes
    let hours
    if(theTime1 > 0) {
        minutes = ""+parseInt(theTime1)
    }
    if(theTime2 > 0) {
        hours = ""+parseInt(theTime2)
    }
    const formatObj = {
        h: hours,
        m: minutes,
        s: seconds
    }
    
    const time_str = format.replace(/{(h|m|s)+}/g, (result, key) => {
        let value = formatObj[key];
        if (result.length > 0 && value < 10) {
            value = "" + value;
        }
        return value || 0
    })

    return time_str
})

/**
 * @author zwcong
 * @time 2019-11-13
 * @description  元格式化
 * @param value 数值
 * @param num 保留位数
 *
 * @usage
 *  import formatMoney from '@/plugins/filter/formatMoney'
 *
 *  {{item.money | formatMoney}}
 * 
 */
import Vue from 'vue'

Vue.filter('formatMoney', (value, num) => {
    let result = ''
    let number = num || 2

    if(!(typeof value === 'number' && !isNaN(value))){
        return value
    }

    result = value.toFixed(number)

    return result
})

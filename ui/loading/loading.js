/**
 * loading
 * @author  zwcong
 * @time    2019-11-19
 *
 * 例子：
 *  
 */
import Vue from "vue"
import loadingVue from "./loading.vue"

let loadingInstance = null
const loadingVueComponent = Vue.extend(loadingVue)


const defaults = {
    message: "",
    duration: 10000 // ms
}

const merge = function (target) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        const source = arguments[i]
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                const value = source[prop]
                if (value !== undefined) {
                    target[prop] = value
                }
            }
        }
    }
    return target
}

const createInstance = () => {
    loadingInstance = new loadingVueComponent({
        el: document.createElement("view")
    })
}

const show = function (options) {
    createInstance()

    document.body.appendChild(loadingInstance.$el)

    options = merge({}, defaults, options)
    for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
            loadingInstance[prop] = options[prop]
        }
    }

    Vue.nextTick(() => {
        loadingInstance.show(options)
    })
}

export default {
    /**
     * 显示loading：
     *  message: 文本信息
     *  duration: 时间间隔（单位：毫秒）
     */
    hide() {
        loadingInstance.close()
    },

    show
}

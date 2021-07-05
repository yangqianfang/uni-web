/**
 * toast，通知
 * @author  zwcong
 * @time    2019-10-29
 *
 * 例子：
 *  this.$toast.info("通知内容")
 */
import Vue from "vue"
import toastVue from "./toast.vue"

let toastInstance = null
const toastVueComponent = Vue.extend(toastVue)


const defaults = {
    type: "info",
    message: "",
    duration: 1600, // ms
    position: "center-center"
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
    toastInstance = new toastVueComponent({
        el: document.createElement("view")
    })
}

const show = function (options) {
    createInstance()

    document.body.appendChild(toastInstance.$el)

    // position 类型：
    // "toast-top-right", "toast-bottom-right", "toast-bottom-left",
    // "toast-top-left", "toast-top-full-width", "toast-bottom-full-width",
    // "toast-top-center", "toast-bottom-center"

    options = merge({}, defaults, options)
    for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
            toastInstance[prop] = options[prop]
        }
    }

    Vue.nextTick(() => {
        toastInstance.show(options)
    })
}

export default {
    /**
     * 显示通知：
     *  message: 通知内容
     *  duration: 时间间隔（单位：毫秒）
     */
    info(message, duration) {
        show({type: "info", message, duration})
    },

    success(message, duration) {
        show({type: "success", message, duration})
    },

    failure(message, duration) {
        show({type: "failure", message, duration})
    },

    warning(message, duration) {
        show({type: "warning", message, duration})
    },

    hide() {
        toastInstance.close()
    }
}

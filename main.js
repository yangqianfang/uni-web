import Vue from "vue";
import App from "./App";
import store from "./store";
import Toast from "./ui/toast/toast";
import Loading from "./ui/loading/loading";
import { request, setBaseUrl, addDefaultInterceptor } from "./lib/request";
import AMapJS from "amap-js";
import filters from "./filters"; // 全局vue filter

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
const aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
    key: "84e4b60f7ccf643cbd09ac3b76ae176d",
    v: "1.4.15", // 版本号
    params: {}, // 请求参数
    protocol: "https:" // 请求协议
});

Vue.config.productionTip = false;

App.mpType = "app";

// api 接口
const urlApi = "";

// set request base url
setBaseUrl(urlApi);
// add default response interceptor
addDefaultInterceptor();

Vue.prototype.$request = request;

Vue.prototype.$toast = Toast;
Vue.prototype.$loading = Loading;

Vue.prototype.$aMapJSAPILoader = aMapJSAPILoader;

const app = new Vue({
    store,
    ...App
});
app.$mount();

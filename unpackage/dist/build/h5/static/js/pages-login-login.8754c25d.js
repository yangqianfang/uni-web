(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"0175":function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"content"},[n("v-uni-view",{staticClass:"logobox"},[n("v-uni-image",{staticClass:"logo",attrs:{src:"/static/logo.png"}})],1),n("v-uni-view",{staticClass:"formbox"},[n("v-uni-view",{staticClass:"input-content"},[n("v-uni-view",{staticClass:"input-item"},[n("v-uni-view",{staticClass:"iconfont iconshouji"}),n("v-uni-input",{attrs:{"placeholder-class":"placeholder-class",type:"number",placeholder:"请输入手机号码",maxlength:"11"},on:{blur:function(t){t=e.$handleEvent(t),e.blur(t)}},model:{value:e.loginForm.mobile,callback:function(t){e.$set(e.loginForm,"mobile",t)},expression:"loginForm.mobile"}})],1),n("v-uni-view",{staticClass:"input-item"},[n("v-uni-view",{staticClass:"iconfont iconyanzhengma"}),n("v-uni-button",{staticClass:"code-button",attrs:{disabled:e.codeDisabled},on:{click:function(t){t=e.$handleEvent(t),e.getCode(t)}}},[e._v("获取验证码"+e._s(e.timeText))]),n("v-uni-input",{attrs:{"placeholder-class":"placeholder-class",type:"number",placeholder:"请输入验证码",maxlength:"4"},on:{blur:function(t){t=e.$handleEvent(t),e.blur(t)}},model:{value:e.loginForm.code,callback:function(t){e.$set(e.loginForm,"code",t)},expression:"loginForm.code"}})],1)],1),n("v-uni-view",{staticClass:"bt-box"},[n("v-uni-button",{staticClass:"confirm-btn",attrs:{loading:e.loading,"hover-class":"button-active",disabled:e.loading||!e.checked},on:{click:function(t){t=e.$handleEvent(t),e.toLogin(t)}}},[e._v("登录")])],1),n("v-uni-view",{staticClass:"agreement"},[n("v-uni-checkbox-group",[n("v-uni-label",[n("v-uni-view",{on:{click:function(t){t=e.$handleEvent(t),e.checkBox(t)}}},[n("v-uni-checkbox",{class:e.checked?"checked":"",attrs:{checked:e.checked}})],1),n("v-uni-view",[e._v("点击同意"),n("v-uni-text",{on:{click:function(t){t=e.$handleEvent(t),e.goToAgreement(t)}}},[e._v("《烽鸟共享汽车出行协议》")])],1)],1)],1)],1)],1)],1)},o=[];n.d(t,"a",function(){return i}),n.d(t,"b",function(){return o})},6855:function(e,t,n){"use strict";var i=n("addb"),o=n.n(i);o.a},"81bd":function(e,t,n){"use strict";var i=n("288e");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("96cf");var o=i(n("3b8d")),a=i(n("cebc")),c=n("2f62"),r=n("d16a"),s=n("09ce"),l=n("2a25"),u=getApp(),d={data:function(){return{loginForm:{mobile:"",code:""},codeDisabled:!1,checked:!0,loading:!1,time:60,timeText:"",timeout:"",isWx:!1}},computed:(0,a.default)({},(0,c.mapState)("user",{user:function(e){return e.user}})),onLoad:function(){var e=(0,o.default)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=uni.getStorageSync(s.localStorageKey.FENGNIAO_USER),!t){e.next=5;break}this.goToIndex(),e.next=8;break;case 5:return e.next=7,u.onUserInfo();case 7:this.user&&this.goToIndex();case 8:this.isWx=(0,l.isWxBrowser)();case 9:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{checkForm:function(e){var t=this.loginForm.mobile;if(t){if(/^1[3456789]\d{9}$/.test(t)){if(e){var n=this.loginForm.code;if(!n)return void this.$toast.info("请输入验证码！")}return!0}this.$toast.info("手机号码有误，请重新输入！")}else this.$toast.info("请输入手机号！")},getCode:function(){var e=this;this.checkForm()&&(this.codeDisabled=!0,(0,r.getCode)({mobile:this.loginForm.mobile}).then(function(t){e.countDown(),e.codeDisabled=!0,e.$toast.info("验证码已发出请注意查收！")},function(t){e.codeDisabled=!1}))},toLogin:function(){var e=(0,o.default)(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.checkForm(!0)){e.next=2;break}return e.abrupt("return");case 2:return t={mobile:this.loginForm.mobile,verifyCode:this.loginForm.code,publicKey:1},this.loading=!0,e.prev=4,e.next=7,this.$store.dispatch("user/Login",t);case 7:if(n=e.sent,!this.isWx||!n.return_url){e.next=11;break}return location.href=n.return_url,e.abrupt("return");case 11:return e.next=13,u.onUserInfo();case 13:this.goToIndex(),this.loading=!1,e.next=21;break;case 17:e.prev=17,e.t0=e["catch"](4),this.$toast.info(e.t0.message),this.loading=!1;case 21:case"end":return e.stop()}},e,this,[[4,17]])}));function t(){return e.apply(this,arguments)}return t}(),goToIndex:function(){uni.navigateTo({url:"/pages/index/index"})},blur:function(){window.scrollTo(0,0)},countDown:function(){var e=this,t=this.time;this.timeout=setInterval(function(){0==t?(clearInterval(e.timeout),e.codeDisabled=!1,e.timeText=""):(t--,e.timeText="("+t+"s)")},1e3)},checkBox:function(){this.checked=!this.checked},goToAgreement:function(){window.open(s.userAgreementUrl)}}};t.default=d},addb:function(e,t,n){var i=n("d771");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var o=n("4f06").default;o("20330774",i,!0,{sourceMap:!1,shadowMode:!1})},d771:function(e,t,n){t=e.exports=n("2350")(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.content[data-v-5cbba01a]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;background:#fff}.logobox[data-v-5cbba01a]{margin-bottom:%?300?%;height:%?170?%;width:%?256?%}.logobox .logo[data-v-5cbba01a]{height:%?170?%;width:%?256?%;margin-top:%?200?%;margin-left:auto;margin-right:auto;margin-bottom:%?50?%}.input-content[data-v-5cbba01a]{width:%?572?%}.input-item[data-v-5cbba01a]{position:relative;border-bottom:1px solid hsla(0,0%,80%,.4);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:%?8?% %?50?%}.input-item[data-v-5cbba01a]:last-child{margin-top:%?26?%}.input-item .iconshouji[data-v-5cbba01a]{position:absolute;top:%?16?%;left:%?0?%;font-size:%?40?%;color:#ccc}.input-item .iconyanzhengma[data-v-5cbba01a]{position:absolute;top:%?12?%;left:%?0?%;font-size:%?40?%;color:#ccc}.input-item .code-button[data-v-5cbba01a]{width:%?200?%;height:%?60?%;padding:0 %?5?%;border-radius:%?30?%;border:1px solid #fc8b27;color:#fc8b27;font-size:%?22?%;text-align:center;line-height:%?60?%;position:absolute;background:#fff;right:0;top:%?8?%;z-index:2}.input-item .code-button[disabled][data-v-5cbba01a]{background:#f7f7f7;border:1px solid #f7f7f7;color:#999}.input-item .disabled[data-v-5cbba01a]{border-color:#ddd;color:#ddd}.input-item .disabled[data-v-5cbba01a]:active{background-color:#fff}.input-item uni-input[data-v-5cbba01a]{height:%?60?%;font-size:%?30?%;color:#333;width:100%}.bt-box[data-v-5cbba01a]{margin-top:%?80?%}.confirm-btn[data-v-5cbba01a]{width:286px;height:45px;letter-spacing:%?20?%;background:-o-linear-gradient(333deg,#ffa800 0,#ff6100 100%);background:linear-gradient(117deg,#ffa800,#ff6100);border-radius:5px;color:#fff;font-weight:400}.confirm-btn[disabled][data-v-5cbba01a]{background:#f7f7f7}.agreement[data-v-5cbba01a]{padding:%?15?% 0;height:%?30?%;line-height:%?30?%;text-align:center;font-size:%?24?%;color:#999}.agreement uni-label[data-v-5cbba01a]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.agreement uni-label uni-navigator[data-v-5cbba01a]{display:inline}',""])},e6c8:function(e,t,n){"use strict";n.r(t);var i=n("81bd"),o=n.n(i);for(var a in i)"default"!==a&&function(e){n.d(t,e,function(){return i[e]})}(a);t["default"]=o.a},f71e:function(e,t,n){"use strict";n.r(t);var i=n("0175"),o=n("e6c8");for(var a in o)"default"!==a&&function(e){n.d(t,e,function(){return o[e]})}(a);n("6855");var c=n("2877"),r=Object(c["a"])(o["default"],i["a"],i["b"],!1,null,"5cbba01a",null);t["default"]=r.exports}}]);
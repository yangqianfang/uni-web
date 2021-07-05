<template>
  <transition name="fade">
    <view class="uni-loading-container" v-show="visiable">
        <view class="uni-loading-wrap">
            <view class="uni-loading-img">
                <image src="../../static/loadding.gif"></image>
            </view>
            <view class="uni-loading-message" v-html="message"></view>
        </view>
    </view>
  </transition>
</template>


<script type="text/ecmascript-6">
export default {
    name: "UniLoading",
    props: {
        message: String,
        duration: Number
    },

    data() {
        return {
            visiable: false
        }
    },

    methods: {
        show() {
            this.visiable = true
            setTimeout(() => {
                this.close()
            }, this.duration)
        },

        close() {
            this.visiable = false
            this.$el.addEventListener("transitionend", this.destroyElement)
            this.$destroy(true)
            this.$el.remove()
        },

        destroyElement() {
            this.$el.removeEventListener("transitionend", this.destroyElement)
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
        }
    }
}
</script>
<style scoped lang="scss">
    @import "./loading.scss";
</style>
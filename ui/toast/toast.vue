<template>
  <transition name="fade">
    <view :class="['uni-toast-container', 'uni-toast-' + position]" v-show="visiable">
        <view :class="['uni-toast', 'uni-toast-' + type]">
          <view class="uni-toast-message" v-html="message"></view>
        </view>
    </view>
  </transition>
</template>


<script type="text/ecmascript-6">
export default {
    name: "UniToast",
    props: {
        type: String,
        message: String,
        duration: Number,
        position: String
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
    @import "./toast.scss";
</style>
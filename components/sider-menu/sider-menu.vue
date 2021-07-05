<template>
    <view class="sider-menu">
        <uni-drawer :visible="visible" @close="close">
            <view class="drawer-container">
                <view class="drawer-header"> 
                    <image class="user-avatar" :src="avatar" />
                    <view class="user-name">{{user.user_phone_number}}</view> 
                    <view class="user-tips" v-if="information.user&&information.user.use_total_miles>0">烽鸟至今已陪伴您{{information.user.use_total_miles}}公里</view>
                </view>
                <view class="drawer-menu">
                    <!-- <uni-list>
                        <uni-list-item class="coupons-item" :show-arrow="false" :show-extra-icon="true" title="优惠券" @click="enterPage('/pages/coupons/coupons')" >11</uni-list-item>
                        <uni-list-item class="authentication-item" :show-arrow="false" :show-extra-icon="true" title="认证" @click="enterPage('/pages/authentication/authentication')"/>
                    </uni-list> -->
                    <view class="item" @click="enterPage('/pages/coupons/coupons')"><text class="iconfont iconyouhuiquan"></text>优惠券</view>
                    <view class="item" @click="enterPage('/pages/authentication/authentication')"><text class="iconfont iconrenzheng"></text>认证</view>
                </view>
                <view class="logout" @click="logout"><text class="iconfont icontuichu2"></text>退出</view>
            </view>
        </uni-drawer>
    </view>
</template>
<script>
    import { uniDrawer, uniList, uniListItem } from '@dcloudio/uni-ui'
    import { mapState } from 'vuex'
	export default {
        props: {
            visible: {
				type: Boolean,
				default: false
			}
        },
        data() {
			return {
                avatar: '../../static/avatar-no.png'
			}
		},
        components: {
			uniDrawer,
			uniList,
			uniListItem
        },
        computed: {
			...mapState('user', {
				user: (state) => state.user,
				information: (state) => state.information
			}),
			
		},
        methods: {
            close(){
                this.$emit('close')
            },
            enterPage(url) {
                uni.navigateTo({
                    url
                })
            },
            async logout() {
                try{
                    await this.$store.dispatch('user/logout')
                    uni.navigateTo({
                        url: `/pages/login/login`
                    })
                }catch(err){
                    //this.$toast.info(err.message)
                }
            }
        },
        mounted() {
            if(this.user){
                if(this.user.user_verify_type === 1){
                    this.avatar = '../../static/avatar-yes.png'
                }else if(this.user.user_verify_type === 3){
                    this.avatar = '../../static/avatar-shen.png'
                }
            }
        },
	}
</script>

<style lang='scss'>
.sider-menu{
    /deep/ .uni-drawer__content{
        width: 258px;
    }
    /deep/ .uni-list-item__container:after{
        background-color: transparent;
    }
    /deep/ .uni-list:after{
        background-color: transparent;
    }
    /deep/ .uni-list:before{
        background-color: transparent;
    }
    .drawer-container{
        padding: 63px 36px;
        height: 100%;

        .drawer-header{
            text-align: center;

            .user-avatar{
                margin-bottom:13px;
                width:54px;
                height: 54px;
                // border-radius: 50%;
            }
            .user-name{
                font-size: 18px;
                color:#333333;
                font-weight: bold;
                margin-bottom: 2px;
            }
            .user-tips{
                color:#655553;
                font-size: 14px;
            }
        }
        .drawer-menu{
            margin-top: 70px;

            .item{
                padding: 12px 15px;
                font-size: 16px;
                position: relative;

                text{
                    margin-right: 20upx;
                    font-size: 40upx;
                    vertical-align: middle;
                    position: relative;
                    top: -4upx;
                }
            }
        }

        /deep/ .uni-list-item__content-note{
            position: absolute;
            right: 0;
        }

        .logout{
            display: inline-block;
            position: absolute;
            bottom: 40rpx;
            left: 40rpx;
        }
        .icontuichu2{
            margin-right: 6upx;
        }
    }
}
</style>

<template>
	<view>
		<uni-popup :show="visible" :type="type" :maskClick="false" @change="change">
			<view class="cy-body">
				<view class="iconbox"></view>
				<view class="textbox">
					<view class="text1">人脸识别</view>
					<view class="text2">
						<text>您还没有进行人脸识别认证</text>
						<text>认证通过后即可使用</text>
					</view>
					<text class="go" @click="faceAuth">去认证</text>
				</view>
				<button class="close" @click="close()"></button>
			</view>

		</uni-popup>
	</view>
</template> 
<script>
	import {
		uniPopup
	} from '@dcloudio/uni-ui';
	import { faceReturnUrl } from '@/lib/base'

	export default {
		components: {
			uniPopup
		},
		name: 'layerface',
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				type: "center"
			}
		},
		watch: {

		},
		methods: {
			close() {
				this.$emit('close');
			},
			change(e) {
				// this.visible=e.show; 
			},
			async faceAuth(){
				try{
					const res = await this.$store.dispatch('authentication/getFaceIdToken',{
						face_return_url: faceReturnUrl
					})
					if(res && res.url){
						location.href = res.url
					}
				}catch(err){ 
					this.$toast.info(err.message)
				}
			}
		},
		mounted() {
			 
		},
	}
</script>
<style lang="scss">
	.cy-body {
		width: 560upx;
		background: #fff;
		position: relative;
		border-radius: 20upx;
		height: 500upx;
		overflow: visible;
		z-index: 99999;

		.iconbox {
			width: 272upx;
			height: 242upx;
			position: absolute;
			left: 50%;
			top: -120upx;
    		margin-left: -150upx;
			background: url(/static/face-icon.png) no-repeat;
			background-size: cover;
		}

		.close {
			width: 42upx;
			height: 42upx;
			border: 0;
			position: absolute;
			left: 50%;
			bottom: -100upx;
			z-index: 999999;
			margin-left: -21upx;
			background: url(/static/icon-09.png) no-repeat;
			background-size: cover;
			padding: 0;
		}

		view {
			text-align: center;
		}

		.text1 {
			padding-top: 120upx;
			font-size: $uni-font-size-lg;

		}

		.text2 {
			padding: 70upx 30upx;
			color: $uni-text-color-grey;
			font-size: $uni-font-size-base;
			margin: 0 auto;
			line-height: 42upx;

			text{
				display: block;
			}
		}

		.go {
			color: $uni-text-orange;
			font-size: $uni-font-size-lg;
		}
	}

	/deep/.uni-popup {
		overflow: visible;
	}

	/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
		overflow: visible;
		border-radius: 20upx;
		padding: 0;
	}
</style>

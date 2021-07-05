<template>
	<view class="wrap">
		<view class="result-container">
			<view class="result-info">
				<text class="ok-bg"></text>
				<text class="ok-text">恭喜您，验证成功！</text>
			</view>
			<button class="btn" @click="onHome">开始用车</button>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import { faceReturnUrl } from '@/lib/base'

	export default {
		data() {
			return {}
		},
		methods: {
			/**
			 * 返回首页
			 */
			onHome(){
				uni.navigateTo({
					url: '/pages/index/index'
				})  
			}
		}
	}
</script>
<style lang='scss' scope>
.result-container{
	background: url(../../static/result-bg.png) no-repeat;
	background-size: contain;
    width: 100%;
    min-height: 800upx;

	.result-info{
		text-align: center;
		padding-top: 400upx;

		.ok-bg{
			background: url(../../static/success-icon.png) no-repeat;
			width: 112upx;
			height: 112upx;
			display: inline-block;
			background-size: cover;
		}
		.ok-text{
			display: block;
			margin-top: 20upx;
		}
	}

	.btn{
		width: 50%;
		height: 80upx;
		line-height: 80upx;
		position: absolute;
		bottom: 100upx;
		left:0;
		right:0;
		margin: 0 auto;
	}
}
</style>

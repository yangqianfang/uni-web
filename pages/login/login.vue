<template>
	<view class="content">
		<view class="logobox">
			<image class="logo"
			 src="/static/logo.png"></image>
		</view>
		<view class="formbox">
			<view class="input-content">
				<view class="input-item">
					<view class="iconfont iconshouji"></view>
					<input placeholder-class="placeholder-class"
					 @blur="blur"
					 type="number"
					 v-model="loginForm.mobile"
					 placeholder="请输入手机号码"
					 maxlength="11" />
				</view>
				<view class="input-item">
					<view class="iconfont iconyanzhengma"></view>
					<button class="code-button"
					 @click="getCode"
					 :disabled="codeDisabled">获取验证码{{timeText}}</button>
					<input placeholder-class="placeholder-class"
					 type="number"
					 @blur="blur"
					 v-model="loginForm.code"
					 placeholder="请输入验证码"
					 maxlength="4" />
				</view>
			</view>
			<view class="bt-box">
				<button class="confirm-btn"
				 :loading="loading"
				 hover-class="button-active"
				 @click="toLogin"
				 :disabled="loading || !checked">登录</button>
			</view>
			<view class="agreement">
				<checkbox-group>
					<label>
						<view @click="checkBox">
							<checkbox :checked="checked"
							 :class="checked?'checked':''"></checkbox>
						</view>
						<view>点击同意<text @click="goToAgreement">《烽鸟共享汽车出行协议》</text>
						</view>
					</label>
				</checkbox-group>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import { getCode, login } from "@/api/login"
	import { localStorageKey, userAgreementUrl } from '@/lib/base'
	import { isWxBrowser } from '@/lib/utils'
	const app = getApp()
	export default {
		data() {
			return {
				loginForm: {
					mobile: "",
					code: ""
				},
				codeDisabled: false,
				checked: true,
				loading: false,
				time: 60,
				timeText: "",
				timeout: "",
				isWx: false
			}
		},
		computed: {
			...mapState('user', {
				user: (state) => state.user
			})
		},
		async onLoad() {
			const res = uni.getStorageSync( localStorageKey.FENGNIAO_USER )
			if ( res) {
				this.goToIndex()
			}else{
				await app.onUserInfo()
				if(this.user){
					this.goToIndex()
				}
			}

			this.isWx = isWxBrowser()
		},
		methods: {
			checkForm( submmit ) {
				let mobile = this.loginForm.mobile
				if ( !mobile ) {
					this.$toast.info( '请输入手机号！' )
					return;
				}
				if ( !( /^1[3456789]\d{9}$/.test( mobile ) ) ) {
					this.$toast.info( '手机号码有误，请重新输入！' )
					return
				}
				if ( submmit ) {
					let code = this.loginForm.code
					if ( !code ) {
						this.$toast.info( '请输入验证码！' )
						return
					}
				}
				return true
			},
			getCode() {
				let _this = this;
				if ( !this.checkForm() ) {
					return
				}
				this.codeDisabled = true
				getCode( {
					mobile: this.loginForm.mobile
				} ).then( function( res ) {
					_this.countDown();
					_this.codeDisabled = true;
					_this.$toast.info( '验证码已发出请注意查收！' )
				}, function( res ) { 
					_this.codeDisabled = false;
				} );
			},
			async toLogin() {
				if ( !this.checkForm( true ) ) {
					return
				}
				let subData = {
					mobile: this.loginForm.mobile,
					verifyCode: this.loginForm.code,
					publicKey: 1
				}
				this.loading = true
				try {
					const res = await this.$store.dispatch( 'user/Login', subData )

					if(this.isWx && res.return_url){
						location.href = res.return_url
						return 
					}

					await app.onUserInfo()
					this.goToIndex()
					this.loading = false
				} catch ( err ) {
					this.$toast.info( err.message )
					this.loading = false
				}
			},
			goToIndex() {
				uni.navigateTo( {
					url: '/pages/index/index'
				} )
			},
			blur() { 
				window.scrollTo( 0, 0 )
			},
			countDown() {
				let _this = this,
					time = this.time;
				this.timeout = setInterval( function() {
					if ( time == 0 ) {
						clearInterval( _this.timeout );
						_this.codeDisabled = false;
						_this.timeText = "";
					} else {
						time--;
						_this.timeText = "(" + time + "s)";
					}
				}, 1000 )
			},
			checkBox() {
				this.checked = !this.checked;
			},
			/**
			 * 跳转用户协议页面
			 */
			goToAgreement() {
				window.open( userAgreementUrl )
			}
		}
	}
</script>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fff;
	}

	.logobox {
		margin-bottom: 300upx;
		height: 170rpx;
		width: 256rpx;

		.logo {
			height: 170rpx;
			width: 256rpx;
			margin-top: 200rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
		}
	}

	.input-content {
		width: 572upx;
	}

	.input-item {
		position: relative;
		border-bottom: 1px solid rgba(204, 204, 204, 0.4);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 8upx 50upx;

		&:last-child {
			margin-top: 26upx;
		}

		.iconshouji {
			position: absolute;
			top: 16upx;
			left: 0upx;
			font-size: 40upx;
			color: #CCCCCC;
		}

		.iconyanzhengma {
			position: absolute;
			top: 12upx;
			left: 0upx;
			font-size: 40upx;
			color: #CCCCCC;
		}

		.code-button {
			width: 200upx;
			height: 60upx;
			padding: 0 5upx;
			border-radius: 30upx;
			border: 1px solid rgba(252, 139, 39, 1);
			color: $uni-text-orange;
			font-size: $uni-font-size-ssm;
			text-align: center;
			line-height: 60upx;
			position: absolute;
			background: #fff;
			right: 0;
			top: 8upx;
			z-index: 2;
		}

		.code-button[disabled] {
			background: #f7f7f7;
			border: 1px solid #f7f7f7;
			color: #999;
		}

		.disabled {
			border-color: #ddd;
			color: #ddd;

			&:active {
				background-color: #fff;
			}
		}

		input {
			height: 60upx;
			font-size: $uni-font-size-base2;
			color: #333;
			width: 100%;
		}
	}

	.bt-box {
		margin-top: 80upx;
	}

	.confirm-btn {
		width: 286px;
		height: 45px;
		letter-spacing: 20upx;
		background: linear-gradient(117deg, rgba(255, 168, 0, 1) 0%, rgba(255, 97, 0, 1) 100%);
		border-radius: 5px;
		color: $uni-text-color-inverse;
		font-weight: normal;
	}

	.confirm-btn[disabled] {
		background: #f7f7f7;
	}

	.agreement {
		padding: 15upx 0;
		height: 30upx;
		line-height: 30upx;
		text-align: center;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;

		label {
			display: flex;
			align-items: center;
			justify-content: center;

			navigator {
				display: inline
			}
		}
	}
</style>

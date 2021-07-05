<script>
	export default {
		globalData: {
			userinfo: null,
			onUserInfo: null
		},
		async onLaunch() {
			this.globalData.onUserInfo = this.onUserInfo 
			await this.onUserInfo()   
		},
		mounted () { 
		},
		onShow() {},
		onHide() {},
		methods: {
			/**
			 * 获取用户信息
			 */
			async onUserInfo() {
				try {
					const res = await this.$store.dispatch( 'user/getInfo' )
					this.globalData.userinfo = res 
					return res
				} catch ( err ) {
					return Promise.reject( err )
				}
			}
		}
	}
</script>
<style>
	@import "./iconfont.scss";
	@import "./common/main.css";
</style>

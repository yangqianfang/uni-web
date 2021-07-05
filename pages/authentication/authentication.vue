<template>
	<view class="wrap">
		<view class="tab">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#FF711B"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-show="current === 0">
				<view class="photo-box">
					<view class="photo-item photo-front" @click="uploadID(1, 'id')">
						<label class="iconfont iconicon-x"></label>
						<text>拍摄身份证首页</text>
						<image class="id-front" :src="idSrcFront" v-if="idSrcFront"></image>
					</view>
					<view class="photo-item photo-after" @click="uploadID(2, 'id')">
						<label class="iconfont iconicon-x"></label>
						<text>拍摄身份证副页</text>
						<image class="id-after" :src="idSrcAfter" v-if="idSrcAfter"></image>
					</view>
				</view>
				<view class="tips-label">请核对关键信息</view>
				<view class="label-item"><label>证件姓名：</label><text>{{name}}</text></view>
				<view class="label-item"><label>证件号码：</label><text>{{id}}</text></view>
				<button class="btn" :class="name && id && idSrcFront && idSrcAfter ? '' : 'disabled' " @click="submitId">提交审核</button>
			</view>
			<view v-show="current === 1">
				<view class="photo-box">
					<view class="photo-item photo-front" @click="uploadID(1, 'drive')">
						<label class="iconfont iconicon-x"></label>
						<text>拍摄驾驶证首页</text>
						<image class="id-front" :src="driveSrcFront" v-if="driveSrcFront"></image>
					</view>
					<view class="photo-item photo-after" @click="uploadID(2, 'drive')">
						<label class="iconfont iconicon-x"></label>
						<text>拍摄驾驶证副页</text>
						<image class="id-after" :src="driveSrcAfter" v-if="driveSrcAfter"></image>
					</view>
				</view>
				<view class="tips-label">请核对关键信息</view>
				<view class="label-item">
					<label>档案编号：
						<input class="uni-input" placeholder="请输入档案编号" v-model="driveId" @blur="blur" />
					</label>
				</view>
				<button class="btn" :class="driveId && driveFrontUrl && driveAfterUrl ? '' : 'disabled' " @click="submitDrive">提交并进行人脸识别</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { uniSegmentedControl } from '@dcloudio/uni-ui'
	import { compress, uploadImg } from '@/lib/uniUtils'
	import { faceReturnUrl } from '@/lib/base'
	export default {
		data() {
			return {
				items: ['身份认证','驾驶证'],
				current: 0,				
				idSrcFront: '',			//身份证首页
				idSrcAfter: '',			//身份证副页
				driveSrcFront: '',		//驾驶证首页
				driveSrcAfter: '',		//驾驶证副页
				name: '',
				id: '',
				idFrontUrl: '',			//身份证首页url
				idAfterUrl: '',			//身份证副页url
				driveFrontUrl: '',		//驾驶证首页url
				driveAfterUrl: '',		//驾驶证副页url
				driveId: '',
				isIdOk: false           //是否进行身份认证

			}
		},
		components: {
			uniSegmentedControl
		},
		created(){
			// this.faceAuth()
		},
		onLoad(option){
			this.type = option.type || 0

			this.current = Number(this.type) === 0 ? Number(this.type) : 1
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}

				if(!this.isIdOk){
					// uniSegmentedControl bug fix
					this.current = 1
					this.$toast.info('请先进行身份认证')
					setTimeout(()=>{
						this.current = 0
					},500)
				}
			},
			/**
			 * 上传图片
			 * 
			 * @param {Number} type 1：正面  2:反面
			 * @param {String} mode id：身份证  drive:驾驶证
			 * 
			 */
			uploadID(type, mode) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有  h5不支持
					success: async (res)=> {
						let paths = res.tempFilePaths[0]
						if(type === 1 && mode === 'id'){
							this.idSrcFront = paths
							const result = await compress(paths)
							this.upload(result)
						}else if(type === 2 && mode === 'id'){
							this.idSrcAfter = paths
							const result = await compress(paths)
							this.idAfterUrl = await uploadImg(result)
						}else if(type === 1 && mode === 'drive'){
							this.driveSrcFront = paths
							const result = await compress(paths)
							//this.upload(result, 2)
							this.driveFrontUrl = await uploadImg(result)
						}else if(type === 2 && mode === 'drive'){
							this.driveSrcAfter = paths
							const result = await compress(paths)
							this.driveAfterUrl = await uploadImg(result)
						}
					},
					fail: (res)=> {
						// console.log(JSON.stringify(res.tempFilePaths));
					}
				})
			},
			/**
			 * 照片识别
			 * 
			 * @param {String} url 图片地址
			 * @param {Number} type 1：身份证 2：驾驶证
			 * 
			 */
			upload(url, type = 1){
				this.$loading.show({
					duration: 100000
				})
				uni.uploadFile({
					url: '/api/app/photo-ocr', 
					filePath: url,
					name: 'image',
					formData: {
						'type': type || 1
					},
					success: async (uploadFileRes) => {
						this.$loading.hide()
						let data = JSON.parse(uploadFileRes.data)
						if(data.code === 0){
							if(type === 1){
								this.name = data.data.name
								this.id = data.data.idcard

								this.idFrontUrl = await uploadImg(url)
							}else{
								this.driveId = data.data.license_number
								this.driveFrontUrl = await uploadImg(url)
							}
						}else{
							if(data.code === 10001){
								uni.removeStorageSync('user')
								uni.navigateTo({
									url: '/pages/login/login'
								})  
							}else{
								this.$toast.info(data.message)
							}
						}
					},
					complete: () => {
						this.$loading.hide()
					}
				});
			},
			/**
			 * 提交上传身份证
			 */
			async submitId() {
				if(!(this.name && this.id && this.idFrontUrl && this.idAfterUrl)){
					this.$toast.info('识别错误，请正确上传身份证！')
					return
				}

				let data = {
					realname: this.name,
					id_number: this.id,
					idcard_pic_1_url: this.idFrontUrl,
					idcard_pic_2_url: this.idAfterUrl
				}

				try{
					await this.$store.dispatch('authentication/commitIdcard', data)
					this.isIdOk = true
					this.current = 1
				}catch(err){
					this.isIdOk = false
					this.$toast.info(err.message)
				}
			},
			/**
			 * 提交上传驾驶证
			 */
			async submitDrive() {
				if(!(this.driveId && this.driveFrontUrl && this.driveAfterUrl)){
					this.$toast.info('识别错误，请正确上传驾驶证')
					return
				}

				let data = {
					driver_number: this.driveId,
					driver_license_1_url: this.driveFrontUrl,
					driver_license_2_url: this.driveAfterUrl
				}

				try{
					await this.$store.dispatch('authentication/commitDriver', data)

					this.faceAuth()
				}catch(err){
					this.$toast.info(err.message)
				}
			},
			/**
			 * 人脸识别
			 */
			async faceAuth(){
				try{
					const res = await this.$store.dispatch('authentication/getFaceIdToken', {
						face_return_url: faceReturnUrl
					})
					if(res && res.url){
						location.href = res.url
					}
				}catch(err){
					this.$toast.info(err.message)
				}
			},
			blur() {
				window.scrollTo( 0, 0 )
			}
			
		}
	}
</script>
<style lang='scss' scope>
	.tab {
		border-bottom: 1upx solid #999999;

		/deep/ .segmented-control-item{
			line-height: 100upx;
			font-size: 32upx;
		}
	}
	.content{
		padding: 0 32upx;

		.photo-box{
			margin-top: 56upx;
			margin-bottom: 40upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.photo-item{
				box-sizing: border-box; 
				flex: 0 0 46%;
				background:rgba(238,238,238,1);
				border-radius:8upx;
				height: 188upx;
				margin-right: 4%;
				padding: 40upx 0;
				text-align: center;
				position: relative;

				&:nth-child(2) {
					margin-right: 0;
				}
				
				.iconfont{
					display: block;
					font-size: 60upx;
					color: #666;
					margin-bottom: 12upx;
				}

				text{
					color: #999999;
					font-size: 28upx;
				}

				.id-front,.id-after{
					width: 100%; 
					height: 100%;
					position: absolute;
					top:0;
					left:0;
				}
			}
		}
		.tips-label {
			color:#333333;
			font-size: 32upx;
			margin-bottom: 10upx;
		}
		.label-item {
			color:#666666;
			font-size: 32upx;
			border-bottom: 1upx solid #EAEAEA;
			padding: 20upx 0;
			margin-bottom: 20upx;

			.uni-input {
				display: inline-block;
				vertical-align: middle;
			}
		}

		.btn{
			width:60%;
			margin: 0 auto;
			position: absolute;
			bottom:100upx;
			left:0;
			right:0;

			&.disabled{
				background:rgba(255,144,37,0.6);
			}
		}
	}
</style>

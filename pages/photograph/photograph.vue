<template>
	<view class="wrap">
		<view class="photo-container">
			<view>请确认车辆外观照</view>
			<view class="photo-box clearfix">
				<view class="photo-item" @click="onLoadImg(1)">
					<view class="photo-wrap">
						<image :src="photo1" />
						<view class="photo-footer">
							左前45°视角
						</view>
					</view>
				</view>
				<view class="photo-item" @click="onLoadImg(2)">
					<view class="photo-wrap">
						<image :src="photo2" />
						<view class="photo-footer">
							右前45°视角
						</view>
					</view>
				</view>
				<view class="photo-item" @click="onLoadImg(3)">
					<view class="photo-wrap">
						<image :src="photo3" />
						<view class="photo-footer">
							右后45°视角
						</view>
					</view>
				</view>
				<view class="photo-item" @click="onLoadImg(4)">
					<view class="photo-wrap">
						<image :src="photo4" />
						<view class="photo-footer">
							左后45°视角
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="warn">请留意车内卫生，如卫生较差请拍照存证！</view> -->
			<view class="more-photo-list">
				<view class="more-item" v-for="(item, index) in moreList" :key="index">
					<text class="close" @click="delPhoto(index)">X</text>
					<image :src="item" />
				</view>
				<view class="more-photo" @click="morePhoto" >更多视角</view>
			</view>
			<view class="btn-box">
				<button class="btn" :class="photo1 && photo2 && photo3 && photo4 && imgArr.length >= 4 ? '' : 'disabled' " @click="orderStart">{{btnText}}</button>
			</view>
		</view>
		<uni-popup class="popup-dialog" :show="visible" :maskClick="false">
			<view>
				<text class="msg-test">{{msgText}}</text>
				<button class="btn" @click="returnCar">好的</button>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import { compress, uploadImg } from '@/lib/uniUtils'
	import { localStorageKey, faceReturnUrl } from '@/lib/base'
	import { uniPopup } from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
				photo1: '',
				photo2: '',
				photo3: '',
				photo4: '',
				imgArr: [],
				photoArr:[],
				moreList: [],
				orderData:"",
				type: "0", //0 解锁 1还车,
				return_type:"",
				address:"",
				btnText: '开始解锁',
				msgText: '',
				visible: false
			}
		},
		components: {
			uniPopup
		},
		onLoad(params) {
			this.type = params.type || 0
			this.return_type = params.return_type || "0"
			this.address = params.address||""
			this.user_location = params.user_location||""

			this.btnText = this.type == 0 ? '开始解锁' : '开始还车'

			// this.onLoadImg()
			uni.getStorage({
				key: localStorageKey.START_ORDER,
				success: (res) => { 
					 this.orderData = res.data
				}
			})


		},
		methods: {
			/**
			 * 上传图片
			 * 
			 * @param {Number} pos 索引
			 * 
			 */
			onLoadImg(pos){
				let count = 4
				if(pos){
					count = 1
				}

				uni.chooseImage({
					count, 		// 默认9 h5不支持（只能限制单选/多选）
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  h5不支持
					sourceType: ['camera'],
					success: async (res)=> {
						const paths = res.tempFilePaths
						
						let len = paths.length >4 ? 4 : paths.length
						// let photoArr = []
						if(pos){
							this['photo' + pos] = await compress(paths[0])
							
							this.photoArr[pos-1] = this['photo' + pos]
						}else{
							for(let i=1; i<= len; i++){
								this['photo' + i] = await compress(paths[i-1])
								this.photoArr.push(this['photo' + i])
							}
						}

						if(this.photoArr.length === 4){
							let imgArr = []

							for (let k in this.photoArr) {
								imgArr.push(await uploadImg(this.photoArr[k]))
							}
							this.imgArr = imgArr
						}
					},
					fail: (res)=> {
						// console.log(JSON.stringify(res.tempFilePaths));
					}
				})
			},
			/**
			 * 添加更多图片
			 */
			morePhoto() {
				if(!(this.photo1 && this.photo2 && this.photo3 && this.photo4)){
					this.$toast.info('请先上传4张角度后，再上传更多视角。')
					return
				}
				uni.chooseImage({
					count: 1, // 默认9 h5不支持（只能限制单选/多选）
					sourceType: ['camera'],
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  h5不支持
					success: async (res)=> {
						const paths = res.tempFilePaths
						const img = await compress(paths[0])

						this.moreList.push(img)
						this.imgArr.push(await uploadImg(img))
					},
					fail: (res)=> {
						// console.log(JSON.stringify(res.tempFilePaths));
					}
				})
			},
			/**
			 * 开始订单
			 */
			async orderStart() { 
				if(!(this.orderData && this.photo1 && this.photo2 && this.photo3 && this.photo4 && this.imgArr.length >= 4)){
					return
				}  
					
				let orderData = this.orderData;
				await this.$store.dispatch('photograph/uploadCarImg', {
					type: this.type,   //0开始订单 1还车
					plan_status: orderData.send_info.plan_status ? orderData.send_info.plan_status: 0,   //送车信息中 送车状态(无值传0)
					img_arr: this.imgArr,
					order_id: orderData.order_info.order_id || ""  
				}).catch((res) => { 						 
					this.$toast.info(res.message)
				})
					 			
				/* 解锁车辆 */
				if(this.type == 0){ 
					try{
						/* 解锁送车 */
						let res; 
						if(orderData.order_info.get_car_type == 1){
							 res = await this.$store.dispatch('photograph/orderStartSend', {
								bluetooth_start: 0,
								location: [orderData.car_info.lng,orderData.car_info.lat].toString(), 
								order_id: orderData.order_info.order_id || ""
							})
						}else{
							  res = await this.$store.dispatch('photograph/orderStart', {
								bluetooth_start: 0,
								location: [orderData.car_info.lng,orderData.car_info.lat].toString(), 
								order_id: orderData.order_info.order_id || ""
							})
						}
						 
						if(res.pay_record_info && res.pay_record_info.pay_id){
							uni.navigateTo({
								url: `/pages/settlement/settlement?payId=${res.pay_record_info.pay_id}`
							})
						}else{
							uni.navigateTo({
								url: `/pages/returncar/returncar`
							})
						}
						
					}catch(err){
						// 人脸识别重新验证
						if(err.code === 90005){
							this.faceAuth()
						}else{
							this.$toast.info(err.message)
						}
					}
				}
				/* 还车 */
				if(this.type == 1){
					this.finishOrder()
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
			/**
			 * 删除更多图片
			 * 
			 * @param {Number} index 索引
			 * 
			 */
			delPhoto(index) {
				this.moreList.splice(index, 1)
				this.imgArr.splice(4+index, 1)
			},
			returnCar() {
				this.finishOrder(1)
			},
			async finishOrder(off_lamp) {
				let orderData = this.orderData;
				try{
					const res = await this.$store.dispatch('photograph/finishOrder', {
						bluetooth_end: 0,
						off_lamp: off_lamp || '',//关灯提醒 默认传空
						address:this.address,//停车场
						return_type:this.return_type, //1 不收费还车 2收费还车
						user_location: this.user_location,  //用户位置信息
						order_id: orderData.order_info.order_id || "" 
					})

					uni.navigateTo({
						url: `/pages/settlement/settlement?orderId=${this.orderData.order_info.order_id}`
					}) 
				}catch(err){
					if(err.code === 90007){
						this.msgText = err.message || ''
						this.visible = true
					}else{
						this.$toast.info(err.message)
					}
				}
			}
		}
	}
</script>
<style lang='scss' scope>
	.photo-container{
		padding: 36upx;
		padding-top: 20upx;
		padding-bottom: 200upx;

		.photo-box{
			margin-left: -10px;
			margin-right: -10px;
			margin-top: 4upx;

			.photo-item{
				padding-left: 10px;
				padding-right: 10px;
				width: 50%;
				height: 290upx;
				float: left;
				margin: 16upx 0;

				.photo-wrap{
					width: 100%;
					height: 100%;
					border-radius:4px;
					position: relative;
					overflow: hidden;
					background:rgba(103,103,103,1);

					.photo-footer{
						background: #FF711B;
						font-size: 24upx;
						color:#FFF;
						text-align: center;
						width: 100%;
						height: 62upx;
						line-height: 62upx;
						position: absolute;
						bottom:0;
						left:0;
					}

					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.warn{
			color:#FF0000;
			font-size: 24upx;
			margin: 28rpx 0;
		}

		.more-photo{
			width:92px;
			height:92px;
			line-height: 92px;
			text-align: center;
			background:rgba(239,239,239,1);
			border-radius:4px;
			font-size: 24upx;
			color:#666;
			display: inline-block;
		}

		.btn-box{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #FFF;
			padding: 40upx 0;

			.btn{
				width: 60%;

				&.disabled{
					background:rgba(255,144,37,0.6);
				}
			}
		}
		.more-photo-list{
			display: flex;
    		justify-content: space-between;
			flex-wrap: wrap;
			height: 200upx;
    		overflow-y: auto;
			padding: 20upx 10upx;
    		overflow-x: hidden;

			.more-item {
				width:92px;
				height:92px;
				line-height: 92px;
				text-align: center;
				background:rgba(239,239,239,1);
				border-radius:4px;
				font-size: 24upx;
				color:#666;
				display: inline-block;
				margin-bottom: 20upx;
				position: relative;

				image {
					width: 100%;
					height: 100%;
					vertical-align: middle;
				}

				.close {
					position: absolute;
					color: #fff;
					border-radius: 50%;
					width: 30upx;
					height: 30upx;
					top: -10upx;
					right: -12upx;
					background: #FF711B;
					line-height: 30upx;
					text-align: center;
					font-family: "黑休";
					z-index: 2;
				}

			}	

			&:after {
				display: block;
				content: "";
				width: 92px;
				height: 0px;
			}
		}
	}
	.msg-test{
		margin: 20upx;
		margin-bottom: 80upx;
		display: block;
	}
	.popup-dialog{
		.btn{
			width: 260upx;
			height: 80upx;
			line-height: 80upx;
		}
	}
</style>

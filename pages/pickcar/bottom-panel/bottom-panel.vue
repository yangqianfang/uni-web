<template> 
    <!-- layerbox start -->
    <view class="layerbox-unlock" v-if="pickCarData"> 
				 <!-- car-list start -->
				 <view v-if="pickcardata.car_info && !pickcardata.send_info.order_status ">
					<view class="address-panel"> 
							<view class="ap-text">
								<text class="title" >{{pickcardata.car_info.address}}</text>
								<text class="tips">请{{lastTime}}分钟内开启车门</text>
							</view>
					</view>
					<view class="car-list">
							<view class="car-item">
									<view class="text-box"> 
										<view class="title"   >{{pickcardata.car_info.car_brand}} - {{pickcardata.car_info.seat_num}}座 - {{pickcardata.car_info.car_color}}</view>
										<view class="price">
												<view class="tips" @click="goToOrder">订单详情</view> 
										</view> 
									</view>	
									<view class="img-box"  >
											<view class="img"  >
												<image :src="pickcardata.car_info.car_image"></image>
											</view>
											<view class="text">{{pickcardata.car_info.car_plate}}</view>
									</view>
									<view :class="'drive-limit-'+ driveLimit(pickcardata.car_info.drive_limit)"
									 v-if="pickcardata.car_info.drive_limit>0">
									</view>
							</view>
					</view>
					<view class="butbox">
						<button @click="gotoPhotograph">开始解锁</button> 
					</view> 
				 </view>
    		<!-- car-list start --> 
			<view v-if="pickcardata.car_info && pickcardata.send_info && pickcardata.send_info.order_status >=3">
				<view class="address-panel"> 
						<view class="ap-text">
							<text class="title" >{{pickcardata.send_info.use_place}}</text>
							<text class="tips"> 
								<text v-if="arrivedTime >0 && this.pickcardata.send_info.order_status != 5 && this.pickcardata.send_info.order_status != 6">预计{{arrivedTime}}分钟送达</text>
								<text v-if="arrivedTime <=0 || this.pickcardata.send_info.order_status == 5 || this.pickcardata.send_info.order_status == 6">车辆已送达</text>
							 </text>
						</view>
				</view>
				<view class="car-list">
						<view class="car-item">
								<view class="text-box">
									<view v-if="pickcardata.send_info">
										<view class="phone-button" @click="makePhoneCall" v-if="pickcardata.send_info.give_user_phone">
											<uni-icons type="phone-filled" size="16" color="#fff" /> 联系派送人
										</view>
									</view>
									<view class="title"   >{{pickcardata.car_info.car_brand}} - {{pickcardata.car_info.seat_num}}座 - {{pickcardata.car_info.car_color}}</view>
									<view class="price">
											<view class="tips" @click="goToOrder">订单详情</view> 
									</view> 
								</view>	
								<view class="img-box"  >
										<view class="img"  >
											<image v-if="pickcardata.car_info.car_image" :src="pickcardata.car_info.car_image"></image>
										</view>
										<view class="text">{{pickcardata.car_info.car_plate}}</view>
								</view>
								<view :class="'drive-limit-'+ driveLimit(pickcardata.car_info.drive_limit)"
								 v-if="pickcardata.car_info.drive_limit>0">
								</view>
						</view>
				</view>
				<view class="butbox"> 
					<button :disabled = "disabled" @click="gotoPhotograph">
						 {{this.pickcardata.send_info.order_status == 5 ?'面对面取车':'开始解锁'}}						
					</button>
					
					<!-- <button>面对面取车</button> -->  
				</view> 
			</view>
    		<!-- car-list end --> 
    		
    </view>
    <!-- layerbox end --> 
</template>
<script>
    	import { localStorageKey } from '@/lib/base';
		import { uniIcons } from '@dcloudio/uni-ui';
	export default {
        props: {
            visible: {
				type: Boolean,
				default: false
			},
			pickCarData:{
				type: Object,
				default: null
			},
			opsData:{
				type: Object,
				default: null
			},
			lastTime:{
				type: String,
				default: "15"
			},
			orderId:{
				type: String,
				default: ''
			}
        },
        data() {
			return {
			}
		},
		
		 computed:{
			 pickcardata(){
				 return this.pickCarData;
			 },
			 disabled(){
				 if(this.pickcardata.send_info.order_status != 5 && this.pickcardata.send_info.order_status!=6 ){
					return true;
				 }
				 return false; 
			 },
			  arrivedTime(){
					 if(this.opsData && this.opsData.plan_info){ 
						 let time =this.opsData.plan_info.start_time;
						 return  Math.round(time/60);
					 } 
				 return ""; 
			 }	 
		 },
        components: {
			 uniIcons
        },
        methods: {
            close(){
                this.$emit('close')
            },
			isShowCheck(){
				this.$emit("isShowCheck")
			},
			gotoPhotograph(){
				this.$emit("clearInterval");
				uni.setStorage({
					key: localStorageKey.START_ORDER,
					data:this.pickcardata
				});	
				uni.navigateTo({
					url:"/pages/photograph/photograph"
				})				
			},
			goToOrder(){
				uni.navigateTo({
					url: `/pages/order/order?type=1&orderId=${this.orderId}`
				})
				
			},
			driveLimit( value ) {
				return this.pickcardata.car_info.city == "武汉市" ? value == 3 || value == 1 ? 3 : 2 : value == 3 || value == 1 ? 1 : 2;
			},
			makePhoneCall(){
				 uni.makePhoneCall({
					phoneNumber: this.pickcardata.send_info.give_user_phone //仅为示例
				});
			},
		}
	}
</script>

<style lang='scss'> 
   .layerbox-unlock { 
   	position: fixed;
   	bottom: 0;
   	width: 100%;
   	height: 285px ;
   	z-index: 3; 
	background: #fff;
   	border-radius: 30upx;
	padding: 30upx 20upx 0 20upx;
	.car-list{padding-top: 30upx;}
	.butbox{
		padding: 30upx 0 50upx 0 ;
		button{
			width:416upx;
			height:80upx;
			background:rgba(255,144,37,1);
			box-shadow:0px 2px 8px 0px rgba(255,144,37,0.59);
			border-radius:25px;
			color: #fff;
			font-size: 36upx;
			line-height: 80upx;
		}
		button[disabled]{
			background: #f7f7f7;
			border: 1px solid #f7f7f7;
			color: #999;
			box-shadow:0px 2px 8px 0px #f7f7f7;
		}
	}
	.drive-limit-1 {
		position: absolute;
		width: 102upx;
		height: 84upx;
		z-index: 5;
		right: 40upx;
		top: 40upx;
		background: url(/static/icon_30.png);
		background-size: cover;
	}
	
	.drive-limit-2 {
		position: absolute;
		width: 102upx;
		height: 84upx;
		z-index: 5;
		right: 40upx;
		top: 40upx;
		background: url(/static/icon_31.png);
		background-size: cover;
	}
	
	.drive-limit-3 {
		position: absolute;
		width: 102upx;
		height: 84upx;
		z-index: 5;
		right: 40upx;
		top: 40upx;
		background: url(/static/icon_32.png);
		background-size: cover;
	}
	.address-panel{ 
			box-shadow:0px 0px 10px #eeeeee;
		 	border-radius: 10upx;
			padding: 20upx 36upx;
			.ap-text{ 
					padding-left: 80upx;
					background: url(/static/store_0.png) no-repeat left;
					background-size: 67upx 74upx;
					text{display: block;}
					.title{
						font-size: 28upx;
						max-height: 70upx;
						line-height: 36upx;
						overflow: hidden;
					
					}
					.tips{
						font-size: 24upx;
						color: #FF9025;
					}
			}
	}
   }
   .car-item{
   	display: flex;
	position: relative;
   	justify-content: space-between;
   	padding: 30upx;
   	border-radius: 10upx;
   	-moz-box-shadow:0px 0px 10px #eeeeee;
   	 -webkit-box-shadow:0px 0px 10px #eeeeee;
   	 box-shadow:0px 0px 10px #eeeeee;
   	 background: #fff;
   	.text-box{ 
   		padding-right: 20upx;
		padding:  0upx  0upx  0upx 20upx;
		.phone-button{
			width: 200upx;
			color: #fff;
			text-align: center;
			font-size: 24upx;
			border-radius: 20upx;
			padding: 10upx;
			background: linear-gradient(117deg, rgba(255, 168, 0, 1) 0%, rgba(255, 97, 0, 1) 100%);
		}
   		.title{ 
   			font-size: 30upx; 
   			margin: 15upx 0; 
   			 	overflow: hidden;
   			 	text-overflow: ellipsis;
   			 	display: -webkit-box;
   			 	-webkit-line-clamp:1;  
   			 	-webkit-box-orient: vertical 
   		}
   		.price{		
   			overflow: hidden;
   			padding: 10upx 0;
   			font-size: 26upx; 
   			.red{color: #ff3030;}
   			view{
   				overflow: hidden;
   				float: left;					
   			}
   			.tips{ 
   				background: url(/static/icon-05.png) no-repeat right center ;					 
   				padding-right: 40upx;
   				background-size:  24upx 24upx;
   				
   			}
   			.mianpei{ 
   				background: url(/static/icon-04.png) no-repeat right center ; 
   				padding:0  40upx 0 20upx;
   				background-size:  25upx 28upx;
   			}
   		}
   		.endurance{
   			font-size: 26upx;
   			padding: 15upx 0;
   			background: url(/static/icon-06.png) no-repeat left center ;
   			padding:15upx  0upx 15upx 30upx;
   			background-size:  20upx 24upx;
   		}
   	}
   .img-box{ 
   	width: 211upx; 
		.img{ 
			background-size:cover;
			width: 211upx;
			height: 138upx;
			}
			image{ 
				width: 211upx;
				height: 138upx;
			}
   	.text{
   			text-align:center; 
   			font-size: 30upx;
   		}
   	}
   }
   .testbox{
   	overflow: hidden;
   	button{
   		display: block;
   		float: left;
   		margin: 5upx;
   		font-size: 24upx;			
   		
   	}
   }
</style>

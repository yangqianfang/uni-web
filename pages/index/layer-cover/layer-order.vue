<template>
	<view>
		<uni-popup :show="visible" :type="type" :maskClick="false" @change="change">
			<view class="cy-body">
				<view class="title">确认使用车辆</view>
				<view class="order-item">
					<view class="text">车型：</view>
					<view class="text" v-if="orderInfo.from == 1"> {{orderInfo.cate_name}} </view>
					<view class="text" v-if="orderInfo.from == 0"> {{orderInfo.car_brand}} </view>
				</view>
				<view class="order-item" v-if="orderInfo.from == 0">
					<view class="text">车牌：</view>
					<view class="text">{{orderInfo.car_plate}}</view>
				</view>
				<view class="order-item">
					<view class="text">计费类型：</view>
					<view class="text price-type">
						<!-- {{orderInfo.price_type == 1?'立即用车':'配送'}}  --> 
						<view class="picker">
							<picker  @change="bindPickerChange" :value="index" :range="array" range-key="name">
								<view class="uni-input">{{array[index].name}}</view>
							</picker>
						</view>
						<uni-icons type="arrowdown" size="22" color="##FF9025" />
					</view>
				</view>

				<view class="order-item">
					<view class="text">用车时间：</view>
					<!-- 15:15:00  立即用车    预约 -->
					<view v-if="orderInfo.use_car_type == 1" class="text">
						立即用车
					 </view>
					<view v-if="orderInfo.use_car_type == 2" class="text">
						{{orderInfo.use_time|formatTime}}
					</view>
				</view>
				<view class="order-item">
					<view class="text">取车形式：</view>
					<!-- 自取  配送 from 0 自取 1 配送  -->
					<view class="text">{{orderInfo.from == 0 ? '自取':'配送'}} </view>
				</view>
				
				<view class="order-item" v-if="safeList.length > 0">
					<view class="text">车损免赔：</view> 
					<view class="text"> 
					<checkbox-group @change="checkBox" >
						<label v-for="(item,index) in safeList" :key="index">
							 {{item.info}} <checkbox  :checked="index==0?true:false" :value="item.id.toString()"></checkbox>
						</label>
					</checkbox-group>
					</view>
				</view>
				<view class="detailbox" @click="gotoOrder">
					查看订单详情
				</view>
				<view class="buttonbox">
					<button hover-class="button-active" @click="orderSubmit">确认下单</button>
				</view>
				<button class="close" @click="close()"></button>
			</view>

		</uni-popup>
	</view>
</template>
<script>
	import { uniPopup, uniIcons } from '@dcloudio/uni-ui';
	import { getSafeList } from '@/api/index';
	export default {
		components: {
			uniPopup,
			uniIcons
		},
		name: 'layercheck',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			orderData: {
				type: Object,
				default: null
			},
		},
		data() {
			return {
				type: "center",
				index: 0,
				checked:true,
				userLong:["0","1","30"],
				array: [{name:'时租'},{name: '日租(1天)'},{name:'月租(30天)'}],
				orderInfo: this.orderData,
				safeValue:"",
				safeList:[]
			}
		},
		watch: {
			orderData(value) {
				this.orderInfo = value;
			},
			visible(value){
				if(value && this.safeList.length == 0){
					this.getSafeList();
				}
				
			}
		},
		mounted() {
			///this.getSafeList();
		},
		methods: {
			bindPickerChange: function(e) { 
				this.index = e.target.value;				
				let userLong = this.userLong[this.index]; 
				this.$emit("setUserLong",userLong);
			},
			orderSubmit(){
			this.$emit("orderSubmit",this.safeValue);
				/* uni.navigateTo({
					url: "/pages/pickcar/pickcar"
				}) */
			},
			async getSafeList(){
				let res = await getSafeList();
				this.safeList =res; 
				this.safeValue = res[0].id;
			},
			gotoOrder() { 
				uni.navigateTo({
					url: "/pages/order/order"
				})
			},
			close() {
				this.$emit('close');
			},
			checkBox(e){ 
				this.safeValue = e.detail.value.toString()
				 
			},
			change(e) {
				// this.visible=e.show; 
			}
		} 
	}
</script>
<style lang="scss">
	.cy-body {
		width: 560upx;
		padding: 50upx 36upx 50upx 36upx;
		background: #fff;
		position: relative;
		border-radius: 20upx;
		overflow: visible;
		text-align: center;
		z-index: 99999;

		.title {
			font-size: 36upx;
			text-align: center;
			font-weight: bold;
			margin-bottom: 30upx;
		}

		.order-item {
			display: flex;
			justify-content: space-between;
			color: #666;
			font-size: 28upx;
			padding: 15upx 0;

			.price-type {
				color: #FF9025;
				display: flex;
				 
			}
		}

		.detailbox {
			margin: 30upx auto;
			width: 320upx;
			height: 88upx;
			font-size: 24upx;
			;
			line-height: 88upx;
			border-radius: 2px;
			color: #666;
			border: 1px solid rgba(232, 232, 232, 1);
		}

		.buttonbox {
			padding-top: 30upx;

			button {
				color: #fff;
				width: 208px;
				font-size: 36upx;
				line-height: 50px;;
				height: 50px;
				background: rgba(255, 144, 37, 1);
				box-shadow: 0px 2px 8px 0px rgba(255, 144, 37, 0.59);
				border-radius: 25px
			}
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


	}

	/deep/.uni-popup {
		overflow: visible;
	}

	/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
		overflow: visible;
		border-radius: 20upx;
		padding: 0;
	}
	checkbox-group{
		text-align: right;
	}
</style>

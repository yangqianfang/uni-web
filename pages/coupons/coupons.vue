<template>
	<view class="wrap">
		<view class="coupons-container">
			<view class="coupons-head" v-if="order_id || pay_id">
				<view class="use-number">可用优惠券<text>({{list.length}}张)</text></view>
				<view class="no-use" @click="noUse">暂不使用</view>
			</view>
			<view class="coupons-list">
				<view v-if="list && list.length !== 0">
					<view class="coupons-item" v-for="(item, index) in list" :key="item.uc_id" @click="onSelect(item.uc_id)" :class="item.status === 4 ? 'used' : item.status === 103 ? 'overdue' : ''">
						<view class="coupons-sign">
							<text v-if="item.limit_first_order === 1">首单专享</text>
							<text v-if="item.car_brand">限车型</text>
							<text v-if="item.car_brand_cate">限车型分类</text>
							<text v-if="item.order_statime_min !== '00:00'">限时段</text>
							<text v-if="item.order_mile_min">限里程</text>
							<text v-if="item.order_use_time_min !== '00:00'">限订单</text>
							<text v-if="item.type === 4">还车减免</text>
						</view>
						<view class="coupons-body">
							<view class="coupons-amount">
								<view class="price" v-if="item.type === 0"><text>¥</text>{{item.value}}</view>
								<view class="price" v-if="item.type === 1">{{Number(item.value)*10}}<text>折</text></view>
								<view class="price" v-if="item.type === 2">{{item.value}}<text>小时</text></view>
								<view class="price" v-if="item.type === 4">1<text>张</text></view>
								<text class="price-sub" v-if="item.amount_limit == 1 && item.min_amount && item.min_amount != 0 && item.type !== 1">满{{item.min_amount}}可用</text>
								<text class="price-sub" v-if="item.amount_limit == 1 && item.max_amount != 0 && item.type === 1">最大抵扣{{item.max_amount}}元</text>
							</view>
							<view class="coupons-desc">
								<view class="coupons-name">{{item.name}}</view>
								<!-- <view>有效期至 {{item.end_time | formatDate}}</view>
								<view>{{item.time_limit === 0 ? '长期有效' : '有效期至' + (item.end_time | formatDate)}}</view> -->
								<view v-if="item.time_limit === 0">
									长期有效
								</view>
								<view v-else>
									有效期至 {{item.end_time | formatDate}}
								</view>
								<view v-if="item.money_type_desc && item.money_type_desc.length !== 0" class="coupons-tips">{{item.money_type_desc.join('，')}}</view>
								<view v-else-if="item.order_type_desc" class="coupons-tips">{{item.order_type_desc.join('，')}}</view>
								<view v-else class="coupons-tips">只抵扣用车费用，不含油费等费用</view>
							</view>
						</view>
						<view class="coupons-footer" :ref="'item' + index" @click.stop="onFold(index)" :class="{'active':item.active}">
							<view class="coupons-footer-body">
								<view class="arrow-bottom arrow-box">
									<view class="bottom">
										<text class="bottom-arrow1"></text>
										<text class="bottom-arrow2"></text>
									</view>
								</view>
								<view v-if="item.city && item.city !=0  && !item.city.includes('全国')">仅限 {{item.city instanceof Array ? item.city.join('，') : item.city}}</view>
                                <view v-else>全国通用</view>
								<view v-if="item.car_brand">仅限 {{item.car_brand}}</view>
								<view v-if="item.car_brand_cate">仅限 {{item.car_brand_cate}}</view>
								<view v-if="item.order_statime_min && item.order_statime_min !== '00:00'">
									仅限 {{item.order_statime_min}}-{{item.order_statime_max}}时段内下单成功用户使用
								</view>
								<view v-if="item.order_mile_min">仅限行驶{{item.order_mile_min}}-{{item.order_mile_max}}里程内订单使用</view>
								<view v-if="item.order_use_time_min && item.order_use_time_min !== '00:00'">
									仅限订单用车时长在{{Number(item.order_use_time_min.replace(/:00/,''))}}-{{Number(item.order_use_time_max.replace(/:00/,''))}}时间内使用
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="no-data"></view>
				</view>
			</view>
			<view class="coupons-link" v-if="!order_id && !isHistory">
				没有更多优惠券 | <view @click="seeHistory">查看历史优惠券<text>></text></view>
			</view>
			<view class="coupons-exchange" v-if="!order_id && !isHistory">
				<view class="coupons-text">
					<input type="text" class="exchange-input" v-model="redeemCode" placeholder="请输入兑换码" />
					<view class="line"></view>
					<view class="exchange-btn" @click="exchangeCode">兑换</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import { toggleClass } from '@/lib/utils'
	import formatDate from '@/plugins/filter/formatDate'
	export default {
		data() {
			return {
				order_id:'',
				redeemCode:'',
				isHistory: false
			}
		},
		components: {
		},
		computed: {
			...mapState('coupons', {
				list: (state) => state.list
			})
		},
		created(){
			this.isHistory = location.hash === '#history' ? true : false

			let data = {
				type: this.isHistory ? 1 : 0
			}
			if(this.order_id){
				data.order_id = this.order_id
			}
			if(this.pay_id){
				data.pay_id = this.pay_id
			}
			this.getMyCoupons(data)
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数  
			this.order_id = option.order_id
			this.pay_id = option.pay_id
		},
		methods: {
			/**
			 * 展开收起
			 * 
			 * @param {Number} index 索引
			 * 
			 */
			onFold(index){
				let key = `item${index}`
        		toggleClass(this.$refs[key][0].$el, ' unfold')
			},
			/**
			 * 获取优惠券列表
			 * 
			 * @param {Object} data 请求参数
			 * 
			 */
			async getMyCoupons(data){
				await this.$store.dispatch('coupons/getList', data)
			},
			/**
			 * 兑换优惠券
			 */
			async exchangeCode(){
				if(this.redeemCode.replace(/\s*/g,"") === ''){
					this.$toast.info('请输入兑换码')
					return 
				}
				try{
					await this.$store.dispatch('coupons/exchangeCode',{
						code: this.redeemCode
					})

					this.$toast.info('兑换成功！')
					this.getMyCoupons({
						type: 0
					})
					this.redeemCode = ''
				}catch(err){
					this.$toast.info(err.message)
				}
			},
			/**
			 * 选择使用优惠券
			 * 
			 * @param {String} id 优惠券id
			 * 
			 */
			onSelect(id) {
				this.updateOrder(id)
			},
			/**
			 * 暂时不使用
			 */
			noUse(){
				this.updateOrder(-1)
			},
			/**
			 * 查看历史
			 */
			seeHistory() {
				window.location.hash = '#history'
			},
			/**
			 * 使用优惠券后，跳转支付页，进行更新
			 */
			async updateOrder(couponId) {
				let url = ''
				if(this.order_id){
					url = `/pages/settlement/settlement?orderId=${this.order_id}&couponId=${couponId}` 
				}
				if(this.pay_id){
					url = `/pages/settlement/settlement?payId=${this.pay_id}&couponId=${couponId}` 
				}
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>
<style lang='scss' scope>
	.coupons-container {
	    padding: 30upx;
	    padding-bottom: 288upx;
	
		.coupons-item {
			background: rgba(255,255,255,1);
			box-shadow: 0upx 4upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius: 10upx;
			margin-bottom: 20upx;
			position: relative;
			
			&.active{
				&:before{
					content: '';
					position: absolute;
					top: -50%;
					bottom: -50%;
					left: -50%;
					right: -50%;
					-webkit-transform: scale(0.5);
					transform: scale(0.5);
					border-style: solid;
					border-width: 2upx;
					border-color: red;
					border-radius: 10upx;
				}
			}
			.coupons-sign{
				position: absolute;
				right:0;
				top:0;
				width:auto;
				height:30upx;
				background:rgba(255,144,37,1);
				border-radius:0upx 10upx 0upx 10upx;
				font-size: 20upx;
				color:#FFF;
				text-align: center;
				line-height: 30upx;
				
				text{
					display: inline-block;
					margin: 0 8upx;
				}
			}
			.coupons-body {
				display: flex;
				padding: 20upx 46upx;
			}
			.coupons-amount {
				width: 230upx;
				
				view {
					display: block;
					font-size: 12px;
					color: #999999;
					padding-left: 5px;
					
					&.price {
						font-size: 60upx;
						color: #FF0000;
						position: relative;
						top: 12upx;
						letter-spacing: -6upx;
						font-weight: bold;
						padding-left: 10upx;
						font-family: "arial";
						margin-bottom: 20upx;
					}
					text{
						font-size: 20upx;
						font-style: normal;
						margin-left: 4upx;
						letter-spacing: 2upx;
					}
				}
				.price-sub{
					display: block;
					font-size: 24upx;
					color: #999999;
					padding-left: 10upx;
				}
			}
			.coupons-desc {
				flex: 1;
				
				.coupons-name {
					font-size: 28upx;
					color: #333333;
					-webkit-line-clamp: 3;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					width: 85%;
					font-weight: normal;
					display: -webkit-box;
					line-height: 1.25;
					margin-top: 8upx;
				}
				view{
					font-size: 24upx;
					color: #999999;
					margin: 14upx 0;
					line-height: 1.25;
					-webkit-line-clamp: 3;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					display: -webkit-box;
				}
				.coupons-tips{
					color: #FF9025;
					margin-bottom: 0;
				}
			}
		}
		.coupons-footer {
			height:auto;
			max-height: 46upx;
			min-height: 56upx;
			background:rgba(250,250,250,1);
			font-size: 20upx;
			color:#666666;
			position: relative;
			border-radius: 10upx;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			width: 100%;
			line-height: 40upx;
			padding: 10upx 20upx;
			padding-top:12upx;
			padding-right: 54upx;
			overflow: hidden;
			// text-align: justify;
			transition: max-height 0.6s ease-out;
			
			&.active{
				&:before{
					content: '';
					position: absolute;
					top: -50%;
					bottom: -50%;
					left: -50%;
					right: -50%;
					-webkit-transform: scale(0.5);
					transform: scale(0.5);
					border-style: solid;
					border-width: 2upx;
					border-color: red;
					border-radius: 20upx;
					border-top: 0;
					border-top-left-radius: 0;
					border-top-right-radius: 0;
				}
			}
			
			&.unfold {
				max-height:600upx;
				transition: max-height 0.6s ease-in;
			}
			
			.coupons-footer-body .bottom{
				top: 8upx;
			}
		}
		/*下箭头*/
		.bottom {
			width: 40upx;
			height: 40upx;
			position: absolute;
			right: 14upx;
			top: 20upx;
			text-align: center;
		}
		.bottom-arrow1,.bottom-arrow2 {
			width: 0;
			height: 0;
			display: block;
			position: absolute;
			left: 30%;
			top: 12upx;
			border-bottom: 8upx transparent dashed;
			border-left: 8upx transparent dashed;
			border-right: 8upx transparent dashed;
			border-top: 8upx white solid;
			overflow: hidden;
		}
		.bottom-arrow1 {
			top: 14upx;
			border-top: 8upx #999999 solid;
		}
		.bottom-arrow2 {
			border-top: 8upx white solid;
		}
		.unfold  {
			.bottom{
				transform: rotate(180deg);
				-webkit-transform: rotate(180deg);
				-moz-transform: rotate(180deg);
				-ms-transform: rotate(180deg);
				-o-transform: rotate(180deg);
				top: 14upx;
			}
		}
		.coupons-link {
			margin-top: 54upx;
			text-align: center;
			font-size: 24upx;
			color:#999999;
			
			view {
				color: #FF9025;
				display: inline-block;
				margin-left: 10upx;
				
				text{
					font-family: "宋体";
					font-weight: bold;
					font-style: normal;
					margin-left: 4upx;
				}
			}
		}
		.coupons-exchange {
			width:100%;
			height:auto;
			background:rgba(255,255,255,1);
			box-shadow:0upx 4upx 20upx 0upx rgba(0,0,0,0.07);
			filter:blur(0upx);
			padding: 46upx 30upx 46upx;
			position: fixed;
			bottom: 0;
			left: 0;
			-webkit-appearance: none;
		}
		.coupons-text{
			position: relative;
			
			.exchange-input {
				width:100%;
				height:88upx;
				background:rgba(255,255,255,1);
				box-shadow:0upx 4upx 20upx 0upx rgba(0,0,0,0.09);
				border-radius:88upx;
				font-size: 24upx;
				outline: none;
				border: 0;
				padding-left: 56upx;
				-webkit-appearance: none;
			}
			.exchange-btn{
				position: absolute;
				font-size: 24upx;
				color:#999999;
				top: 0;
				right: 0upx;
				width: 136upx;
				height:88upx;
				line-height: 88upx;
				text-align: center;
			}
		}
		.line {
			position: absolute;
			top: 0;
			right: 136upx;
		}
		.line:after {
			content: '';
			position: absolute;
			top: 32upx;
			left: 0upx;
			width: 2upx;
			height: 28upx;
			border-left: 2upx solid #E7E7E7;
			transform: scaleX(.5);
			-webkit-transform: scaleX(.5);
			-moz-transform: scaleX(.5);
			-ms-transform: scaleX(.5);
			-o-transform: scaleX(.5);
		}
		.coupons-item.overdue{
			background: url(../../static/overdue-bg.png) no-repeat;
			background-position: 100% 19%;
			background-size: 100upx 84upx;
		}
		.coupons-item.used{
			background: url(../../static/used-bg.png) no-repeat;
			background-position: 100% 19%;
			background-size: 100upx 84upx;
		}
		.coupons-item.overdue *,.coupons-item.used *{
			color: #E1E1E1!important;
		}
		.coupons-item.overdue .coupons-sign,.coupons-item.used .coupons-sign{
			background: #FAFAFA;
		}
		.none{
			display: none;
		}
		.no-data {
			background: url(../../static/conpous-bg.png) no-repeat;
			width: 474upx;
			height: 446upx;
			background-size: cover;
			margin: 0 auto;
			margin-top: 40%;
		}
		.coupons-head{
			margin-bottom: 20upx;
			font-size: 30upx;
			color: #333333;

			.use-number{
				display: inline-block;

				text{
					font-style: normal;
					color:#999999;
					font-size:20upx;
					margin-left: 10upx;
				}
			}
			
			.no-use{
				float: right;
				font-size:24upx;
			}
		}
		
	}
	
	/* iphone X */
	@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
	    .coupons-exchange{
	        height:117px;
	    }
	}
	/* iphone XR */
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:2) {
	    .coupons-exchange{
	        height:117px;
	    }
	}
	/* iphone Xs Max */
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3) {
	    .coupons-exchange{
	        height:117px;
	    }
	}
</style>

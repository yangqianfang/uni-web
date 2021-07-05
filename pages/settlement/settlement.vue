<template>
	<view class="wrap">
		<view class="settlement-container" v-if="orderInfo">
			<view class="car-info">
				<image :src="carInfo && carInfo.car_image || orderInfo.car_image"></image>
				<view>
					<text>{{orderInfo.car_brand}}</text>-
					<text>{{orderInfo.car_plate}}</text>
				</view>
			</view>
			<view class="order-list">
				<!-- 违约金  -->
				<view v-if="isViolate">
					<view class="order-item">
						<text>违约金</text>
						<text>{{payRecord.pay_amount | formatMoney}}元</text>
					</view>
				</view>
				<view v-else>
					<view class="order-item">
						<text>订单编号</text>
						<text>{{orderInfo.order_no}}</text>
					</view>
					<view class="order-item">
						<text>租车形式</text>
						<text>{{orderInfo.use_time_type === 0 ? '按时计费' : '按日计费'}}</text>
					</view>
					<view class="order-item">
						<text>取车时间</text>
						<text>{{orderInfo.use_time | formatDate('yyyy.MM.dd hh:mm')}}</text>
					</view>
					<view class="order-item" v-if="!payId">
						<text>还车时间</text>
						<text>{{orderInfo.order_end_time | formatDate('yyyy.MM.dd hh:mm')}}</text>
					</view>
					<view class="order-item" v-else>
						<text>日租({{payRecord.use_num}}天)</text>
						<text class="red">+{{payRecord.use_car_amount | formatMoney}}元</text>
					</view>
					<!-- 时租 start -->
					<view v-if="orderInfo.use_time_type === 0">
						<!-- 封顶价 start -->
						<view class="order-block" v-if="orderInfo.half_day_amount > 0">
							<!-- 超封顶价，同时显示half和power start -->
							<view v-if="orderInfo.times_amount > 0" class="item-red">
								<view class="item-title">12小时封顶</view>
								<view class="order-item">
									<view>驾驶时长({{orderInfo.half_day_power_on_time | formatSeconds('{h}小时{m}分钟')}})<!--<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text>--></view>
									<text class="item-merge item-bottom red">+{{orderInfo.half_day_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.half_day_power_off_time | formatSeconds('{h}小时{m}分钟')}})<!--<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text>--></view>
									<text class="item-merge item-top green">12小时封顶价</text>
								</view>
								<view class="item-title">12小时以外</view>
								<view class="order-item">
									<view>驾驶时长({{orderInfo.power_on_time | formatSeconds('{h}小时{m}分钟')}})<!--<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text>--></view>
									<text class="">+{{orderInfo.power_on_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.power_off_time | formatSeconds('{h}小时{m}分钟')}})<!--<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text>--></view>
									<text class="">+{{orderInfo.power_off_amount | formatMoney}}元</text>
								</view>
							</view>
							<!-- 超封顶价，同时显示half和power end -->

							<!-- 未超封顶价 start -->
							<view v-else>
								<view class="item-title">12小时封顶</view>
								<view class="order-item">
									<view>驾驶时长({{orderInfo.half_day_power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
									<text class="item-merge item-bottom red">+{{orderInfo.half_day_power_on_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.half_day_power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
									<text class="item-merge item-top green">+{{orderInfo.half_day_power_on_amount | formatMoney}}元</text>
								</view>
							</view>
							<!-- 未超封顶价 end -->
						</view>
						<!-- 封顶价 end -->
						
						<view v-else>
							<!-- 最低消费 start -->
							<view v-if="orderInfo.times_amount < orderInfo.order_detail_amount">
								<view class="order-item">
									<view>驾驶时长({{orderInfo.power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
									<text class="item-merge item-bottom red">+{{orderInfo.order_detail_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
									<text class="item-merge item-top green">最低消费</text>
								</view>
							</view>
							<!-- 最低消费 end -->
							<view v-else>
								<view class="order-item">
									<view>驾驶时长({{orderInfo.power_on_time | formatSeconds('{h}小时{m}分钟') }})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
									<text class="item-merge item-bottom red">+{{orderInfo.times_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.power_off_time | formatSeconds('{h}小时{m}分钟') }})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
								</view>
							</view>
						</view>
					</view>
					<!-- 时租 end -->

					<!-- 日租 start -->
					<view class="order-block" v-else>
						<!-- 超时 start -->
						<view v-if="orderInfo.half_day_amount > 0 || orderInfo.times_amount > 0">
							<!-- 封顶价 start -->
							<view v-if="orderInfo.half_day_amount > 0">
								<!-- 封顶价之外的费用 start -->
								<view v-if="orderInfo.times_amount > 0">
									<view class="order-item">
										<view>驾驶时长({{orderInfo.half_day_power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
										<text class="item-merge item-bottom red">+{{orderInfo.half_day_amount}}</text>
									</view>
									<view class="order-item">
										<view>临停时长({{orderInfo.half_day_power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
										<text class="item-merge item-top green">12小时封顶价</text>
									</view>
									<view class="order-item">
										<view>驾驶时长({{orderInfo.power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
										<text class="item-merge item-bottom red">+{{orderInfo.half_day_amount}}</text>
									</view>
									<view class="order-item">
										<view>临停时长({{orderInfo.power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
										<text class="item-merge item-top green">12小时封顶价</text>
									</view>
								</view>
								<!-- 封顶价之外的费用 end -->

								<view v-else>
									<view class="order-item">
										<view>驾驶时长({{orderInfo.half_day_power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
										<text class="item-merge item-bottom red">+{{orderInfo.half_day_amount | formatMoney}}元</text>
									</view>
									<view class="order-item">
										<view>临停时长({{orderInfo.half_day_power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
										<text class="item-merge item-top green">12小时封顶价</text>
									</view>
								</view>
							</view>
							<!-- 封顶价 end -->

							<view v-else>
								<view>超时时长({{orderInfo.order_current_times | formatSeconds('{h}小时{m}分钟')}})</view>
								<view class="order-item">
									<view>驾驶时长({{orderInfo.power_on_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_on_amount | formatMoney}}元</text></view>
									<text class="item-merge item-bottom red">+{{orderInfo.times_amount | formatMoney}}元</text>
								</view>
								<view class="order-item">
									<view>临停时长({{orderInfo.power_off_time | formatSeconds('{h}小时{m}分钟')}})<text class="gray">+{{orderInfo.power_off_amount | formatMoney}}元</text></view>
								</view>
							</view>
						</view>
						<!-- 超时 end -->
					</view>
					<!-- 日租 end -->
					
					<view class="order-item" v-if="orderInfo.total_miles">
						<text>驾驶里程/油耗({{orderInfo.total_miles}}km/{{orderInfo.oil_num}}L)</text>
						<text class="red">+{{orderInfo.oil_amount + orderInfo.miles_amount | formatMoney}}元</text>
					</view>
					<view class="order-item">
						<text>车损免赔 {{payId ? `(${payRecord.use_num}天)` : ''}} </text>
						<text class="red" v-if="!payId">+{{orderInfo.safe_indemnify_amount | formatMoney}}元</text>
						<text class="red" v-else>+{{payRecord.safe_indemnify_amount | formatMoney}}元</text>
					</view>
					<view v-if="!payId">
						<view class="order-item" v-if="orderInfo.remote_car_money > 0">
							<text>还车服务费</text>
							<text class="red">+{{orderInfo.remote_car_money | formatMoney}}元</text>
						</view>
						<view class="order-item" v-else>
							<text>随还费用</text>
							<text class="red">+{{orderInfo.night_service_fee | formatMoney}}元</text>
						</view>
					</view>
					<view class="order-item">
						<text v-if="!payId">可用优惠券({{info && info.valid_coupon_count}}张)</text>
						<text v-else>可用优惠券({{payRecord && payRecord.valid_coupon_count}}张)</text>
						<text class="green" @click="changeCoupons" v-if="!payId">{{orderInfo.coupon && orderInfo.coupon.text ? orderInfo.coupon.text : '无可用优惠券'}}></text>
						<text class="green" @click="changeCoupons" v-else>{{payRecord.coupon && payRecord.coupon.text ? payRecord.coupon.text : '无可用优惠券'}}></text>
					</view>
					<view class="order-item" v-if="orderInfo && orderInfo.active && orderInfo.valid_active_count === 1">
						<text>优惠活动</text>
						<text class="green">{{orderInfo.active.name}}{{orderInfo.active.text}}</text>
					</view>
					<view class="order-item" v-if="payRecord && payRecord.active && payRecord.valid_active_count === 1">
						<text>优惠活动</text>
						<text class="green">{{payRecord.active.name}}{{payRecord.active.text}}</text>
					</view>
				</view>
				<view class="line"></view>
				<view class="order-item">
					<text>支付金额</text>
					<view class="amount" v-if="!payId">{{orderInfo.pay_amount | formatMoney}}<label>元</label></view>
					<view class="amount" v-else>{{payRecord.pay_amount | formatMoney}}<label>元</label></view>
				</view>
			</view>

			<view class="pay-way">
				<view class="title">支付方式</view>
				<view class="pay-list">
					<view class="pay-item">
						<view>
							<text class="iconfont iconicon-yuex"></text>
							使用出行卡支付<label>(余额{{userInfo.money}}元)</label></view>
						<view>
							<radio value="r1" color="#FC8B27" :checked="0 === radioCurrent" @click="switchWay(0)"/>
						</view>
					</view>
					<view class="pay-item">
						<view><text class="iconfont iconicon-weixinx"></text>使用微信支付</view>
						<view>
							<radio value="r2" color="#FC8B27" :checked="1 === radioCurrent" @click="switchWay(1)"/>
						</view>
					</view>
					<view class="pay-item" v-if="!isWx">
						<view><text class="iconfont iconicon-zhifubaox"></text>使用支付宝支付</view>
						<view>
							<radio value="r3" color="#FC8B27" :checked="2 === radioCurrent" @click="switchWay(2)"/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box" v-if="orderInfo">
			<button class="confirm-pay btn" @click="placeOrder" v-if="!payId">确认支付{{orderInfo.pay_amount | formatMoney}}</button>
			<button class="confirm-pay btn" @click="placeOrder" v-else>确认支付{{payRecord.pay_amount | formatMoney}}</button>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import formatDate from '@/plugins/filter/formatDate'
	import formatSeconds from '@/plugins/filter/formatSeconds'
	import formatMoney from '@/plugins/filter/formatMoney'
	import { commonPay, aliPay, recordPay, recordAlipay } from '@/lib/pay'
	import wxPay from '@/lib/wxpay'
	import { param, getQueryObject, isWxBrowser } from '@/lib/utils'
	import { payReturnUrl } from '@/lib/base'

	export default {
		data() {
			return {
				radioCurrent: 0,
				orderInfo: null,
				userInfo: null,
				carInfo: null,
				payRecord: null,
				accountPay: 0,
				acId: 0,
				couponId: 0,
				isWx: false,
				isViolate: false			//是否是违约金支付
				// orderId: '511275',
			}
		},
		components: {
		},
		computed: {
			...mapState('settlement', {
				info: (state) => state.info,
				wxconfig: (state) => state.wxconfig
			})
		},
		onLoad(option){
			this.couponId = option.couponId
			this.orderId = option.orderId
			this.payId = option.payId

			this.isWx = isWxBrowser()

			if(this.payId){
				document.title = '预支付费用结算'
			}
		},
		created(){
			this.getInfo()
			this.getWxConfig()

		},
		methods: {
			/**
			 * 获取订单信息
			 * 
			 * @param {Boolean} change 是否切换支付方式
			 * 
			 */
			async getInfo(change) {
				if(!this.orderId && !this.payId){
					uni.navigateBack()
				}
				let data = {
					
				}
				if(this.payId){
					data.pay_id = this.payId
				}else{
					data.order_id = this.orderId
				}

				if(change){
					data.account_pay = this.accountPay
				}

				if(this.couponId){
					data.coupon_id = this.couponId
				}

				if(this.acId){
					data.ac_id = this.acId
				}

				if(this.payId){
					try{
						await this.$store.dispatch('settlement/getPayRecord', data)
						this.orderInfo = this.info.order_info
						this.userInfo = this.info.user_info
						this.payRecord = this.info.pay_record
						// 记录类型 0订单 1日租 2小时 3转日租 4日租续费 5违约金
						this.isViolate = this.payRecord.record_type === 5
						if(this.isViolate){
							document.title = '违约金费用结算'
						}
					}catch(err){
						uni.navigateTo({
							url: '/pages/index/index'
						}) 
					}
				}else{
					try{
						await this.$store.dispatch('settlement/getFinishAmount', data)
						this.orderInfo = this.info.order_info
						this.userInfo = this.info.user_info
						this.carInfo = this.info.car_info
					}catch(err){
						uni.navigateTo({
							url: '/pages/index/index'
						}) 
					}
				}
			},
			/**
			 * 确认支付
			 */
			async placeOrder(){
				const data = {
					order_id: this.orderId || this.payId
				}
				if(this.radioCurrent !== 2){
					try{
						if(this.radioCurrent === 1){
							if(this.isWx){
								data.pay_source = 'jsapi'
							}else{
								data.pay_source = 'wap'
							}
							
							data.return_url = payReturnUrl
						}
						let res

						if(this.payId){
							res = await recordPay(data)
						}else{
							res = await commonPay(data)
						}
						
						console.log(res)
						
						if(!(res && res.pay_status === 1)){
							console.log(111111)
							//wx支付

							if(this.isWx){
								//let wxData = Object.assign({}, res, this.wxconfig)

								wxPay(res, info=>{
									console.log('调用成功!', info)
								},fail=>{
									console.log('调用失败!', fail)
								})
							}else{
								location.href = res.mweb_url
							}
							
						}else{
							//余额支付
							console.log("余额支付")
							if(this.payId && !this.isViolate){
								console.log("支付："+this.payRecord.record_type);
								if(this.payRecord.record_type === 1){
									console.log("jump");
									uni.navigateTo({
										url: `/pages/pickcar/pickcar?orderId=${this.orderInfo.order_id}`
									}) 
								}else{
									uni.navigateTo({
										url: `/pages/returncar/returncar`
									}) 
								}								
							}else{
								uni.navigateTo({
									url: '/pages/result/result'
								}) 
							}
						}
					}catch(err){
						this.$toast.info(err.message)
					}
				}else{
					//支付宝支付
					try{
						data.pay_source = 'wap'
						data.return_url = payReturnUrl
						
						let res
						if(this.payId){
							res = await recordAlipay(data)
						}else{
							res = await aliPay(data)
						}

						let params = res.urlParams

						location.href = `https://openapi.alipay.com/gateway.do?${params}`
						
					}catch(err){
						this.$toast.info(err.message)
					}
				}
			},
			/**
			 * 切换支付方式
			 * 
			 * @param {Number} index 索引
			 * 
			 */
			switchWay(index){
				this.radioCurrent = index
				if(index === 0){
					this.accountPay = 1
				}
				if(index === 1 || index === 2){
					this.accountPay = 0
				}

				// if(index !== 2){
					this.getInfo(1)
				// }
			},
			/**
			 * 选择优惠券
			 */
			changeCoupons(){
				let url = ''
				if(this.orderId){
					url = `/pages/coupons/coupons?order_id=${this.orderId}` 
				}
				
				if(this.payId){
					url = `/pages/coupons/coupons?pay_id=${this.payId}` 
				}

				uni.navigateTo({
					url
				}) 
			},
			/**
			 * 获取微信config
			 */
			async getWxConfig(){
				await this.$store.dispatch('settlement/getWxConfig', {
					url: location.href
				})
				console.log("getWxConfig", this.wxconfig)
			}
		}
	}
</script>
<style lang='scss' scope>
	.wrap{
		overflow: hidden;
		padding: 20upx 20upx 0;
		padding-bottom: 180upx;

		.settlement-container{
			padding: 0 88upx;
			.car-info{
				text-align: center;
				margin-bottom: 30upx;
				
				image{
					background: url(/static/car-01.png) no-repeat;
					background-size: cover;
					width: 211upx;
					height: 138upx;
					margin-bottom: 10upx;
				}
			}
			.order-list{
				.order-item{
					color:#666666;
					font-size: 24upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					line-height: 64upx;
				}

				.item-merge{
					position: relative;

					&.item-bottom{
						top: 24upx;
					}
					&.item-top{
						top: -16upx;
					}
				}

				.item-title{
					font-size: 24upx;
					line-height: 64upx;
				}

				.item-red{
					color:#FF0000;

					.order-item{
						color:#FF0000;				
					}
				}
			}

			.line{
				height: 1upx;
				width: 100%;
				background: #F1F1F1;
				margin: 20upx 0;
			}

			.amount{
				color:#FF0000;
				font-size: 44upx;

				label{
					font-size: 24upx;
				}
			}

			.pay-way{
				.title{
					text-align: center;
					font-size: 28upx;
					color:#666666;
					margin: 40upx 0 20upx;
				}
				.pay-list{
					.pay-item{
						display: flex;
						justify-content: space-between;
						align-items: center;
						color:#666666;
						font-size: 24upx;
						line-height: 80upx;

						// label{
						// 	color:#30D4A0;
						// }

						.iconfont{
							font-size: 40upx;
							vertical-align: middle;
    						margin-right: 12upx;

							&.iconicon-yuex{
								color:#FC8B27;
							}
							&.iconicon-weixinx{
								color:#57B63C;
							}
							&.iconicon-zhifubaox{
								color:#62B5FF;
							}
						}
					}
				}
			}
		}
		.btn-box{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #FFF;
			padding: 40upx 0;

			.confirm-pay{
				width: 60%;
				box-shadow:0px 2px 8px 0px rgba(255,144,37,0.59);
			}
		}
		.gray{
			color:#999999;
			margin-left: 6upx;
		}
		.red{
			color: #FF0000;
		}
		.green{
			color: #30D4A0;
		}
		
	}
</style>

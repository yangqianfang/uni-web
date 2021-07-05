<template>
	<view class="wrap">
		<view class="order-container" v-if="orderInfo">
			<view class="order-info">
				<!-- 来自分类车型 from :1  无车牌-->
				<view class="car-item" v-if="orderInfo.from == 1">
					<view class="text-box">
						<view class="title" >{{orderInfo.cate_name}} · {{orderInfo.seat_num}}座 </view>
						<view class="price" @click="onValuation">
							<view class="tips">
								<text class="red">{{orderInfo.power_on_price}}元起</text>/分钟
								<text class="iconfont icontanhao"></text>
							</view>
						</view>
						<text class="car-pos" v-sendTimeIntro> {{orderInfo.send_time_intro}}</text>
					</view>
					<view class="img-box">
						<view class="img">
							<image :src="orderInfo.car_image"></image>
						</view>
					</view>
				</view>
				<!-- 来自车型 from :0  有车牌-->
				<view class="car-item" v-if="orderInfo.from == 0">
					<view class="text-box">
						<view class="title" >{{orderInfo.car_brand}} · <label>{{orderInfo.seat_num}}座</label> · <label>{{orderInfo.car_color}} </label></view>
						<view class="price" @click="onValuation">
							<view class="tips">
								<text class="red">{{orderInfo.power_on_price}}元起</text>/分钟
								<text class="iconfont icontanhao"></text>
							</view>
						</view>
						<view class="endurance" v-if="orderInfo.remile">
							<text class="iconfont iconicon-endurance"></text>
							续航约{{orderInfo.remile}}m
						</view>
						<text class="car-pos" v-if="orderInfo.address">停放位置：{{orderInfo.address}}</text>
					</view>
					<view class="img-box">
						<view class="img">
							<image :src="orderInfo.car_image"></image>
						</view>
						<view class="text" >{{orderInfo.cate_name || orderInfo.car_plate}}</view>
					</view>
				</view>
			</view>
			
			<view class="oil-info">
				<view class="oil-icon">
					<image src="../../static/oil-icon.png" />
				</view>
				<view class="oil-block">
					<text class="title">汽油价格({{oilDetail && oilDetail.oil_type}}号油)</text>
					<text class="sub">{{orderInfo.from == 0 ? orderInfo.car_brand : '此车型'}}百公里油耗约{{oilDetail && oilDetail.oil_wear | formatMoney}}升</text>
				</view>
				<text class="oil-price">{{ oilDetail && oilDetail.oil_price | formatMoney}}元/升</text>
			</view>
			
			<view class="order-details">
				<view class="order-title">计费类型
					<text class="charging-details" @click="onValuation">
						计费详情
						<text class="iconfont icontanhao"></text>
					</text>
				</view>
				<view>
					<view class="charging-type" :class="current === 0 ? 'active' : ''" @click="switchType(0)">
						<view class="title">时租
							<text v-if="current !== 0">{{orderInfo.power_on_price}}元/分钟+{{orderInfo.power_off_price}}元/分钟(临停)</text>
						</view>
						<view>
							<text>用车时间:</text>
							<text>{{useDate ? useDate : '立即用车'}}</text>
						</view>
						<view>
							<text>行驶</text>
							<text>{{orderInfo.power_on_price}}元/分钟</text>
						</view>
						<view>
							<text>临停</text>
							<text>{{orderInfo.power_off_price}}元/分钟</text>
						</view>
						<view>
							<text>{{orderInfo.active_info}}</text>
							<!-- <text>160元</text> -->
						</view>
					</view>
					<view class="charging-type" :class="current === 1 ? 'active' : ''" @click="switchType(1)">
						<view class="title">
							日租
							<text v-if="current !== 1">{{priceCount}}元/天</text>
						</view>
						<view>
							<text>用车时间:</text>
							<text>{{useDate ? useDate : '立即用车'}}</text>
						</view>
						<view class="use-date">
							<text>用车天数：</text>
							<view class="use-date-select">
								<picker mode="selector" :value="day" @change="bindChange" :range="dayArray">
									<view class="uni-input">{{dayArray[day]}}</view>
								</picker>
								<label class="corner"></label>
							</view>
						</view>
						<view>
							<text>还车时间: </text>
							<text>{{returnDate}}</text>
						</view>
						<view>
							<text>价格：</text>
							<text>{{priceCount}}元{{useDate ? '' : '/天'}}</text>
						</view>
					</view>
					<view class="charging-type" :class="current === 2 ? 'active' : ''" @click="switchType(2)">
						<view class="title">长租
							<text v-if="current !== 2">{{longPrice && longPrice[0].amount}}元/{{longPrice && longPrice[0].day}}天</text>
						</view>
						<view>
							<text>用车时间:</text>
							<text>{{useDate ? useDate : '立即用车'}}</text>
						</view>
						<view v-for="(item, index) in longPrice" :key="index">
							<text>{{item.day}}天/{{item.amount}}元</text>
							<view>
								<radio color="#FC8B27" :checked="index === radioCurrent" @click.stop="switchTime(index, item.day)"/>
							</view>
						</view>
					</view>
				</view>
				<view class="car-damage">
					<text class="label" @click="showDamage">车损免赔</text>
					<view>{{current === 0 ? safeList.info : current === 1 ? safeList.top_money + '元' : safeList.long_rent_info}}<checkbox :checked="isBuySafe" @click="onBuySafe" /></view>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<button class="place-order btn" @click="placeOrder" v-if="type != 1">确认下单</button>
		</view>
		<uni-popup :show="damageShow" :type="damageType" :custom="true" :mask-click="false">
			<view class="uni-tip">
				<view class="uni-tip-title">车损免赔</view>
				<view class="uni-tip-content">{{safeList.desc}}</view>
				<view class="uni-tip-group-button">
				<view class="uni-tip-button" @click="damageCancel">知道了</view>
				<view class="uni-tip-button ok-btn" @click="damageOk">了解详情</view>
				</view>
			</view>
		</uni-popup>
		<view class="mask" v-if="type == 1"></view>
	</view>
</template>
<script>
	import { localStorageKey, damageUrl } from '@/lib/base'
	import { orderSubmit } from '@/lib/orderUtils'
	import { parseTime } from '@/lib/utils'
	import { mapState } from 'vuex'
	import { param } from '@/lib/utils'
	import { uniPopup } from '@dcloudio/uni-ui'
	import formatMoney from '@/plugins/filter/formatMoney'

	const DATE_FORMAT = '{m}月{d}日 {h}:{i}'

	export default {
		data() {
			return {
				current: 0,
				day: 0,
				damageShow: false,
				damageType: 'center',
				dayArray: [],
				radioCurrent: 0,
				orderInfo: null,
				priceCount: 0,
				isBuySafe: true,
				useDate: '',
				returnDate: parseTime(new Date().getTime() + 24*60*60*1000, DATE_FORMAT),
				orderType: 0,		//订单类型 1立即用车 2预约用车 3预约日租
				type: 0
			}
		},
		components: {
			uniPopup
		},
		computed: {
			...mapState('order', {
				oilDetail: (state) => state.oilDetail,
				longPrice: (state) => state.longPrice,
				safeList: (state) => state.safeList
			})
		},
		watch:{
			day(newVal, oldVal) {
				let newDay = this.dayArray[newVal].replace(/天/g,'')
				if(newVal !== 0){
					this.orderInfo.use_long = newDay
				}
				this.priceCount = Number(newDay) * Number(this.orderInfo.day_price)
				let day = 24 * newDay * 60 * 60 * 1000

				if(this.orderInfo.use_car_type === "2"){
					this.returnDate = parseTime(this.orderInfo.use_time*1000 + day, DATE_FORMAT)
					this.useDate = parseTime(this.orderInfo.use_time*1000, DATE_FORMAT)
				}else{
					this.returnDate = parseTime(new Date().getTime() + day, DATE_FORMAT)
					this.useDate = parseTime(new Date().getTime(), DATE_FORMAT)
				}
			}
		},
		async onLoad(options) {
			this.type = options.type || 0
			this.orderId = options.orderId
			if(this.type !== '1'){
				uni.getStorage({
					key: localStorageKey.ORDER_INFO,
					success: (res) => {
						if (res.data) {	
							this.orderInfo = res.data;
							this.priceCount = this.orderInfo.day_price
							
							if(this.orderInfo.use_time){
								this.orderInfo.use_time = this.orderInfo.use_time
							}

							//1立即 2预约
							if(this.orderInfo.use_car_type === "2"){
								this.useDate = parseTime(this.orderInfo.use_time, '{m}月{d}日 {h}:{i}')
								this.returnDate = parseTime(this.orderInfo.use_time*1000 + 24*60*60*1000, DATE_FORMAT)
							}

							this.orderType = this.orderInfo.order_type

							this.getOilDetail()
							this.getLongPrice()
						}
					}
				})

				uni.getStorage({
					key: localStorageKey.END_ADDRESS_TEXT,
					success:  (res) => {
						if (res.data) {
							this.endAddressTextValue = res.data.name
							this.endAddressLngLat = [res.data.lng, res.data.lat]
						}
					}
				})
			}else{
				this.getOrderInfo()
			}

			this.setDay()
			await this.$store.dispatch('order/getSafeList', {})
		},
		methods: {
			/**
			 * 获取订单信息
			 */
			async getOrderInfo() {
				try{

					let res = await this.$store.dispatch('order/getOrdrData', {})

					//如果v2接口为空 查询 getOrderV2
					if(!(res && res.order_info)){
						if(this.orderId){
							res = await this.$store.dispatch('order/getOrderV2', {
								order_id: this.orderId
							})
						}
					}

					if(res && res.order_info){
						this.orderInfo = res.order_info

						this.orderInfo = Object.assign({}, res.car_info, this.orderInfo)

						this.priceCount = this.orderInfo.day_price

						this.orderInfo.city_data = {
							city: {
								cf_city: this.orderInfo.city
							}
						}

						//是否有车牌
						this.orderInfo.from = this.orderInfo.car_plate ? 0 : 1

						this.current = this.orderInfo.use_time_type === 1 ? 0 : 1

						this.day = this.day ? this.orderInfo.use_day - 1 : 0


						//是否选中 车损免赔
						this.isBuySafe = this.orderInfo.safe_indemnify == 0 ? false : true

						if(this.orderInfo.use_time){
							this.orderInfo.use_time = this.orderInfo.use_time
						}

						// //1立即 2预约
						if(this.orderInfo.use_car_type === "2"){
							this.useDate = parseTime(this.orderInfo.use_time, '{m}月{d}日 {h}:{i}')
							this.returnDate = parseTime(this.orderInfo.use_time*1000 + 24*60*60*1000, DATE_FORMAT)
						}

						this.orderType = this.orderInfo.order_type

						this.getOilDetail()
						this.getLongPrice()
					}else{
						uni.redirectTo({
							url: "/pages/index/index"
						})
					}
				}catch(err){
					this.$toast.info(err.message)
				}
			},
			/**
			 * 确认下单
			 */
			async placeOrder() {
				const {city_data, currentstore, use_long, use_time, brand_cate, car_id,
						car_brand, userlocation, return_address, is_buy_safe, from, cate_name,mapcenterdata,address } = this.orderInfo

				let city = city_data && city_data.city.cf_city
				let location = currentstore.lng ?  currentstore.lng + ',' + currentstore.lat : mapcenterdata
				let _address = currentstore.address ? currentstore.address : address
				let point_id = currentstore.store_id ? currentstore.store_id : currentstore.id
				let create_location = userlocation

				let data = {}

				if(from === 1){
					data = {
						city: city || '',
						location: location || '',
						address: _address || 'test',
						use_long: use_long || 0,			//用车天数 0 为时租
						use_time: use_time || '',
						brand_cate: brand_cate || cate_name || '',
						//car_brand: car_brand || '', 
						create_location: create_location || '',
						is_buy_safe: typeof is_buy_safe !== 'undefined' ? is_buy_safe : 2,		//默认 2不计免赔
						order_type: this.orderType || 1
					}
					if(point_id){
						data.point_id = point_id || ''						
					}

					if(return_address){
						data.return_address = return_address
					}
					try{  
						let res = await orderSubmit( data, "1" );
						/* 预约用车到首页 */
						//"use_car_type": 0,用车类型 （0自取 1立即 2预约） 
						if(res.pay_record_info.pay_id){
							this.gotoPay(res.pay_record_info.pay_id);
						} else if(res.order_info.use_car_type == 2){
							this.$toast.info( "预约成功！" )
							this.gotoIndex();
						}else if(res.order_info.use_car_type == 0 || res.order_info.use_car_type == 1){
							this.gotoPickCar(res.order_info.order_id);
						} 
					}catch(err){}
				}else{
					data={
						car_id: car_id || '',
						city: city || '',
						is_buy_safe: typeof is_buy_safe !== 'undefined' ? is_buy_safe : 2,		//默认 2不计免赔					
						use_long: use_long || 0,
						use_time_type: use_long !== 0 ? "1" : "0" // 0时租 1日租
					}
					try{
						let res = await orderSubmit(data, "0")
							//"use_car_type": 0,用车类型 （0自取 1立即 2预约）	 
						this.gotoPickCar(res.order_info.order_id) 
					}catch(res){
						this.$toast.info( res.message )
					}
				}
			},
			/* 页面跳转至取车页面 */
			gotoPickCar(orderid) {
				uni.navigateTo({
					url: `/pages/pickcar/pickcar?orderId=${orderid}`
				})
			},
			/**
			 * 跳转到费用结算页面
			 * 
			 * @param {String} payId 支付id
			 * 
			 */
			gotoPay(payId){
				uni.navigateTo({
					url: `/pages/settlement/settlement?payId=${payId}`
				})
			},
			/**
			 * 跳转到首页
			 */
			gotoIndex() {
				uni.navigateTo( {
					url: "/pages/index/index"
				} )
			},
			/**
			 * 切换租车类型  
			 * 
			 * @param {Number} index 索引
			 * 
			 */
			switchType(index){
				this.current = index
				if(index === 0){
					//时租
					this.orderInfo.use_long = 0
					this.orderType = this.useDate ? 1 : 2  
				}else if(index === 1){
					//日租，默认1天
					this.orderInfo.use_long = 1
					this.orderType = 3
				}else{
					//长租，默认7天
					this.orderInfo.use_long = this.longPrice.length != 0 ? this.longPrice[0].day : 7
					this.radioCurrent = 0
					this.orderType = 3
				}
				this.day = 0
				this.priceCount = this.orderInfo.day_price
			},
			/**
			 * 切换天数
			 * 
			 * @param {Object} e event对象
			 * 
			 */
			bindChange(e) {
				this.day = e.target.value
			},
			/**
			 * 切换时间
			 * 
			 * @param {Number} index 索引
			 * @param {String} val 值
			 * 
			 */
			switchTime(index, val){
				this.radioCurrent = index
				this.orderInfo.use_long = val
			},
			/**
			 * 获取油耗信息
			 */
			getOilDetail(){
				const {brand_cate, car_brand, cate_name, city_data } = this.orderInfo

				let city = city_data && city_data.city.cf_city

				let carBrand = ''
				if(car_brand.indexOf(',') === -1){
					carBrand = car_brand
				}
				
				this.$store.dispatch('order/getCarOilDetail',{
					city,
					brand_cate: brand_cate || cate_name || '',  //brand_cate和 cate_name   一个意思
					car_brand: carBrand
				})
			},
			/**
			 * 获取长租用车信息
			 */
			getLongPrice(){
				const {brand_cate, car_brand, use_time, cate_name, city_data } = this.orderInfo
				let city = city_data && city_data.city.cf_city

				this.$store.dispatch('order/getLongPrice',{
					city,
					brand_cate: brand_cate || cate_name || '',
					car_brand: car_brand || '',
					use_time: use_time || ''
				})
			},
			/**
			 * 设置天数
			 */
			setDay() {
				for(let i=1; i<=30; i++){
					this.dayArray.push(i+'天')	
				}
			},
			/**
			 * 是否选中车损免赔
			 */
			onBuySafe() {
				this.isBuySafe = !this.isBuySafe
				this.orderInfo.is_buy_safe = this.isBuySafe ? 2 : 0
			},
			/**
			 * 跳转到计价规则
			 */
			onValuation(){
				const { currentstore, startAddressLngLat, use_time, brand_cate, miles, power_off_time, endaddresslnglat, city_data, cate_name } = this.orderInfo

				let city = city_data && city_data.city.cf_city

				let parms = {
					city,
					brand_cate: brand_cate || cate_name || '',
					miles: miles || 0,
					drive_time: 0,
					use_time,
					power_off_time: power_off_time || 0,
					start_location: startAddressLngLat ? startAddressLngLat.toString() : '',
					return_location: this.endAddressLngLat ? this.endAddressLngLat.toString() : ''
				}

				let pstr = param(parms);

				uni.navigateTo({
					url: `/pages/valuation/valuation?${pstr}`
				}) 
			},
			// 显示车损免赔
			showDamage(){
				this.damageShow = true	
			},
			// 取消车损免赔
			damageCancel(){
				this.damageShow = false
			},
			// 车损免赔弹窗确定按钮
			damageOk(){
				this.damageShow = false
				window.open(damageUrl)
			}
		},
		directives: {
			sendTimeIntro: function( el, binding ) {
				let text = el.innerHTML,
					reg = /#(.*?)#/,
					subtext = text.match( reg );
				if ( subtext ) {
					el.innerHTML = text.replace( reg, "<text style='color:orange;font-size:28upx'>" + subtext[ 1 ] + "</text>" );
				}
			}
		}
	}
</script>
<style lang='scss' scope>
	.wrap{
		padding-bottom: 194upx;

		.order-container{
			padding: 20upx 20upx 0;
		}

		.order-info{
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
			border-radius:5px;
			filter:blur(0px);
			margin-bottom: 30upx;
			
			.car-item {
				display: flex;
				justify-content: space-between;
				padding: 20upx 30upx;

				.text-box {
					padding-right: 20upx;

					.title {
						font-size: 30upx;
						margin: 15upx 0;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						font-weight: bold;

						label{
							font-weight: normal;
							margin-left: 6upx;
							margin-right: 6upx;
							font-size: 24upx;
						}
					}

					.price {
						overflow: hidden;
						padding: 10upx 0;
						font-size: 26upx;

						.red {
							color: #ff3030;
							font-weight: bold;
						}

						view {
							overflow: hidden;
							float: left;
						}

						.mianpei {
							background: url(/static/icon-04.png) no-repeat right center;
							padding: 0 40upx 0 20upx;
							background-size: 25upx 28upx;
							font-size: 20upx;
							color:#666666;
							text-decoration: underline;
						}
					}

					.endurance {
						font-size: 26upx;
						padding: 15upx 0upx 15upx 0upx;
					}

					.car-pos{
						color:#999999;
						font-size: 24upx;
					}
				}

				.img-box {
					width: 211upx;
					height: 138upx;

					.img {
						background: url(/static/car-01.png) no-repeat;
						background-size: cover;
						width: 211upx;
						height: 138upx;
						image{
							width: 211upx;
							height: 138upx;
						}
					}

					.text {
						text-align: center;
						padding: 6upx 0;
						font-size: 24upx;
					}
				}
			}
		}
		.oil-info{
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
			border-radius:5px;
			filter:blur(0px);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20upx;
			margin: 20upx 0;

			.oil-icon{
				width: 68upx;
				height: 68upx;
				margin-right: 16upx;

				image{
					width: 100%;
					height: 100%;
				}
			}
			.oil-block{
				flex:1;

				.title{
					color:#666666;
					font-size: 24upx;
					display: block;
				}
				.sub{
					color:#FF9025;
					font-size: 20upx;
					display: block;
				}
			}
			.oil-price{
				width: 140upx;
				color:#333333;
				text-align: right;
				font-size: 28upx;
				font-weight: bold;
			}
		}
		.order-details{
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
			border-radius:5px;
			filter:blur(0px);
			padding: 30upx;

			.order-title{
				position: relative;
				color:#333333;
				font-size: 28upx;
				margin-bottom: 30upx;
				font-weight: bold;

				.charging-details{
					position: absolute;
					top:4upx;
					right: 0;
					font-size: 24upx;
					color:#666666;
					font-weight: normal;
					
					.icontanhao{
						margin-right: 0;
						vertical-align: middle;
					}
				}
			}
			.charging-type{
				background:rgba(248,248,248,1);
				border-radius:5px;
				border:1px solid transparent;
				padding: 24upx 36upx;
				font-size: 24upx;
				line-height: 44upx;
				margin: 20upx 0;
				height: 88upx;
    			overflow: hidden;

				&.active{
					background:rgba(255,245,236,1);
					border:1px solid rgba(255,144,37,1);
					height: auto;
				}

				view{
					display: flex;
					justify-content: space-between;

					&.title{
						margin-bottom: 10upx;
					}
				}
				.use-date{
					position: relative;

					.use-date-select{
						padding-right: 26upx;
					}

					.corner{
						position: absolute;
						top: 20upx;
						right:0;
					}
				}
			}

			.car-damage{
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666666;
				font-size: 24upx;

				.label{
					background: url(/static/icon-05.png) no-repeat right center;
					padding-right: 20px;
					background-size: 12px 12px;
				}
			}
		}
		.btn-box{
			position: fixed;
			left:0;
			bottom: 0;
			width: 100%;
			padding: 40upx 0;
			background: #FFF;

			.place-order{
				width: 60%;
				box-shadow:0px 2px 8px 0px rgba(255,144,37,0.59);
			}
		}
	}
	/* 提示窗口 */
	.uni-tip {
		padding: 15px;
		width: 300px;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10px;
	}
	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}
	.uni-tip-content {
		padding: 15px;
		font-size: 14px;
		color: #666;
	}
	.uni-tip-group-button {
		margin-top: 10px;
		display: flex;
	}
	.uni-tip-button {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
	.ok-btn{
		color:rgba(255,144,37,1);
	}
	.mask{
		width: 100%;
		height: 100%;
		position: fixed;
		top:0;
		left:0;
		z-index: 9999;
	}
	.icontanhao{
		position: relative;
		top: -4upx;
	}
</style>

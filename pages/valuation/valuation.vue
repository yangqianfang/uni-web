<template>
	<view class="wrap">
		<view class="valuation-container">
			<view @click="showCity" class="city-picker">{{city}}{{cate_name ? ',' + cate_name : ''}}{{mode_name? ',' + mode_name: ''}}</view>
			<mpvue-picker 
				:pickerValueArray="modeData" 
				:themeColor="themeColor" 
				ref="mpvueCityPicker" 
				mode="multiLinkageSelector"
				:deepLength="3"
				:pickerValueDefault="cityPickerValueDefault"
				@onCancel="onCancel" 
				@onConfirm="onConfirm">
			</mpvue-picker>
			<view class="valuation-item search-box">
				<view class="input-box">
					<label class="dot green"></label>
					<input class="first-input" v-model="start" placeholder="请输入出发地点" disabled  @click="changeStart"/>
				</view>
				<view v-for="(item, index) in middleArr" :key="index" class="middle-box">
					<text class="del-input" @click="delInput(index)">-</text>
					<input class="middle-input" v-model="item.val" placeholder="请输入途径点" disabled @click="changeMiddle(index)"/>
				</view>
				<view class="input-box">
					<label class="dot orange"></label>
					<input class="last-input" v-model="end" placeholder="请输入目的地" disabled @click="changeEnd"/>
				</view>
				<view class="search-opt" @click="addMiddle">
					<view class="add-btn">+</view>
					<view class="add-text">添加途经点</view>
				</view>
			</view>
			<view class="valuation-item valuation-way" id="pos0">
				<label class="item-title">计价方式</label>
				<view class="way-list">
					<label>车辆使用费</label>
					<view class="way-number">
						<text>{{usepriceunit}}元</text>
						<text class="symbol">×</text>
						<input class="minutes-input" type="number" v-model="useprice" @input="getVal($event, 'useprice')" />
						<text>分钟</text>
						<text>=</text>
						<text>{{usepriceresult}}元</text>
					</view>
					<view class="stepper">
						<view class="stepper-plus" @click="stepPlus('useprice')">
							<label></label>
						</view>
						<label class="line"></label>
						<view class="stepper-minus" @click="stepMinus('useprice')">
							<label></label>
						</view>
					</view>
				</view>
				<view class="dividing-line"><label class="plus-icon">+</label></view>
				<view class="way-list">
					<label>车辆临停收费</label>
					<view class="way-number">
						<text>{{parkpriceunit}}元</text>
						<text class="symbol">×</text>
						<input class="minutes-input" type="number" v-model="parkprice" @input="getVal($event, 'parkprice')" />
						<text>分钟</text>
						<text>=</text>
						<text>{{parkpriceresult}}元</text>
					</view>
					<view class="stepper">
						<view class="stepper-plus" @click="stepPlus('parkprice')">
							<label></label>
						</view>
						<label class="line"></label>
						<view class="stepper-minus" @click="stepMinus('parkprice')">
							<label></label>
						</view>
					</view>
				</view>
				<view class="dividing-line"><label class="plus-icon">+</label></view>
				<view class="way-list">
					<label>燃油使用费</label>
					<view class="way-number">
						<text>{{fuelpriceunit}}元</text>
						<text class="symbol">×</text>
						<input class="minutes-input" type="number" v-model="fuelprice" @input="getVal($event, 'fuelprice')"/>
						<text>升</text>
						<text>=</text>
						<text>{{fuelpriceresult}}元</text>
					</view>
					<view class="stepper">
						<view class="stepper-plus" @click="stepPlus('fuelprice')">
							<label></label>
						</view>
						<label class="line"></label>
						<view class="stepper-minus" @click="stepMinus('fuelprice')">
							<label></label>
						</view>
					</view>
				</view>
				<view class="dividing-line"><label class="plus-icon">+</label></view>
				<view class="way-list">
					<label>还车服务费<text>(可减免）</text></label>
					<view class="way-number">
						<input class="minutes-input" type="number" v-model="additional" @input="getVal($event, 'additional')"/>
						<text>元</text>
					</view>
					<view class="stepper">
						<view class="stepper-plus" @click="stepPlus('additional')">
							<label></label>
						</view>
						<label class="line"></label>
						<view class="stepper-minus" @click="stepMinus('additional')">
							<label></label>
						</view>
					</view>
				</view>
				<view class="dividing-line"><label class="plus-icon">+</label></view>
				<view class="way-list">
					<label>车损免赔<text class="label-sub-other">（如选择）</text></label>
					<view class="way-number">
						<text>{{chesunpriceunit}}元</text>
						<text class="symbol">×</text>
						<input class="minutes-input" type="number" v-model="chesunprice" @input="getVal($event, 'chesunprice')"/>
						<text>小时</text>
						<text>=</text>
						<text>{{chesunpriceresult}}元</text>
					</view>
					<view class="stepper">
						<view class="stepper-plus" @click="stepPlus('chesunprice')">
							<label></label>
						</view>
						<label class="line"></label>
						<view class="stepper-minus" @click="stepMinus('chesunprice')">
							<label></label>
						</view>
					</view>
				</view>
				<view class="dividing-line"><label class="minus-icon">-</label></view>
				<view class="way-list">
					<label class="minus-title">优惠活动</label>
					<view class="way-text">
						根据实际情况进行减免
					</view>
				</view>
				<view class="dividing-line"><label class="minus-icon">-</label></view>
				<view class="way-list">
					<label class="minus-title">优惠券</label>
					<view class="way-text">
						根据实际情况进行减免
					</view>
				</view>
				<view class="dividing-line"><label class="equal-icon">=</label></view>
				<view class="way-list way-result">
					<label>最终支付价格</label>
					<view class="way-text">
						<text class="count">{{countPrice}}</text>
						<text>元</text>
					</view>
				</view>
			</view>
			<view class="valuation-item valuation-damage" id="pos1">
				<label class="item-title">车损免赔</label>
				<view class="tips">{{info && info.car_safe_list.desc}}</view>
				<table>
					<tbody>
						<tr>
							<td>每小时</td>
							<td>{{info && info.car_safe_list.money}}元</td>
						</tr>
						<tr>
							<td>每日封顶</td>
							<td>{{info && info.car_safe_list.top_money}}元</td>
						</tr>
					</tbody>
				</table>
			</view>
			<text class="sub-title" id="pos2">车辆使用费</text>
			<view class="valuation-item hour-rent">
				<label class="item-title">时租价格</label>
				<table>
					<tbody>
						<tr>
							<td></td>
							<td>日间<br/>8:00-20:00</td>
							<td>夜间<br/>20:00-08:00(次日)</td>
						</tr>
						<tr>
							<td>行驶</td>
							<td>{{info && info.rent_data.power_on_price}}元/分钟</td>
							<td>{{info && info.rent_data.power_on_price}}元/分钟</td>
						</tr>
						<tr>
							<td>临停</td>
							<td>{{info && info.rent_data.power_off_price}}元/分钟</td>
							<td>{{info && info.rent_data.night_power_off_price}}元/分钟</td>
						</tr>
						<tr>
							<td>12小时封顶</td>
							<td colSpan=2>{{info && info.rent_data.half_day_price}}元</td>
						</tr>
					</tbody>
				</table>
			</view>
			<view class="valuation-item" id="pos3">
				<label class="item-title">日租价格({{month}})</label>
				<calendar :calendarData="calendarData"></calendar>
			</view>
			<view class="valuation-item hour-rent" id="pos4">
				<label class="item-title">长租计价</label>
				<table>
					<tbody v-if="info && info.long_rent_data.length !== 0">
						<tr v-for="(item, index) in info.long_rent_data" :key="index">
							<td>{{item.day}}天</td>
							<td>{{item.amount}}元</td>
						</tr>
					</tbody>
				</table>
			</view>
			<view class="valuation-item surcharge" id="pos5">
				<view v-if="info && info.return_car_data && info.return_car_data.return_car_money_status !== 0 && info.return_car_data.return_car_money.length !==0">
					<label class="item-title">还车附加费</label>
					<view class="tips">根据您还车位置和出发位置的距离收取还车附加费。
						<text @click="onAdditional">{{this.city}}收费标准</text>
					</view>
				</view>
				<label class="item-title">非网点还车费</label>
				<table>
					<tbody>
						<tr v-if="info && info.return_car_data && info.return_car_data.day_service_fee !== 0">
							<td>{{info && info.return_car_data.no_dot_operation_time.day}}</td>
							<td>{{info && info.return_car_data.day_service_fee}}元</td>
						</tr>
						<tr v-if="info && info.return_car_data && info.return_car_data.night_service_fee !== 0">
							<td>{{info && info.return_car_data.no_dot_operation_time.night}}</td>
							<td>{{info && info.return_car_data.night_service_fee}}元</td>
						</tr>
					</tbody>
				</table>
				<!-- <view class="guide" onClick={this.onGuide}>
					<img src='../../static/return-car-area.png' alt="" />
					<view class="guide-info">
						<text>还车区域指引</text>
						<text class="sub">点击了解【还车区域】</text>
					</view>
					<b class="right-arrow"></b>
				</view> -->
			</view>
			<view class="valuation-item details" id="pos6">
				<label class="item-title">当前选择车型：{{this.mode_name}}</label>
				<table>
					<tbody>
						<tr>
							<td>每升</td>
							<td>{{info && info.oil_data.oil_price}}元</td>
						</tr>
						<tr>
							<td>平均油耗</td>
							<td>{{info && info.oil_data.oil_wear}}升/百公里</td>
						</tr>
					</tbody>
				</table>
				<view class="tips">
					平均油耗为平均数值，实际费用以驾驶过程中产生的实际消耗为准。
					燃油使用费以燃油市场价格为基准，本价格供参考。
				</view>
			</view>
		</view>
		<view class="dialog" v-show="dialogShow">
			<view class="dialog-body valuation-item">
				<table>
					<tbody v-if="info && info.return_car_data && info.return_car_data.return_car_money.length !== 0">
						<tr>
							<td>里程（公里）</td>
							<td>价格（元）</td>
						</tr>
						<tr v-for="(item, index) in info.return_car_data.return_car_money" :key="index">
							<td>{{item.keys}}</td>
							<td>{{item.val}}</td>
						</tr>
					</tbody>
				</table>
				<view class="dialog-footer">
					<a class="dialog-ok" @click="onAdditional">确定</a>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import calendar from './components/calendar'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker'
	export default {
		data() {
			return {
				city: '',
				cate_name: '',
				mode_name: '',
				start: '',
				startLngLat: '',
				end: '',
				endLngLat: '',
				middle1LngLat: '',
				middle2LngLat: '',
				middle3LngLat: '',
				usepriceunit: 0,
				useprice: '',
				usepriceresult: 0,
				parkpriceunit: 0,
				parkprice: '',
				parkpriceresult: 0,
				fuelpriceunit: 0,
				fuelprice: '',
				fuelpriceresult: 0,
				chesunpriceunit: 0,
				chesunprice: '',
				chesunpriceresult: 0,
				additional: '',
				countPrice: 0,
				month: new Date().getMonth()+1 + '月',
				damage: true,
				dialogShow: false,
				calendarData: {},
				cityPickerValueDefault:[0,0,0],
				themeColor: '#ff9025',
				middleArr: [],
				AMap: null,
				miles: 0,
				driveTime: 0
			}
		},
		components: {
			calendar,
			mpvuePicker
		},
		computed: {
			...mapState('valuation', {
				info: (state) => state.info,
				budget: (state) => state.budget,
				modeData: (state) => state.modeData
			})
		},
		onLoad(option){
			let {city, brand_cate, miles, use_time, power_off_time, return_location, start_location, drive_time} = option

			this.city = city
			this.cate_name = brand_cate
			this.miles = miles
			this.use_time = use_time
			this.power_off_time = power_off_time
			this.return_location = return_location
			this.start_location = start_location
			this.drive_time = drive_time

			this.startLngLat = start_location || ''
			this.endLngLat = return_location || ''

			this.start = uni.getStorageSync('START_ADDRESS_TEXT') || ''
			const end = uni.getStorageSync('END_ADDRESS_TEXT')
			this.end = end && end.name
		},
		created(){
			this.getInfo()
			this.removeAddress()
		},
		onShow(){
			
			// 调用load方法加载loader并调用执行回调。
			this.$aMapJSAPILoader.load().then((AMap) => {
				this.AMap = AMap

				this.getAddress()
			}).catch(function(e) {
				console.log('map fail', e)
			}).finally(function() {
				// 总是执行
				console.log('map finally')
			})
		},
		methods: {
			/**
			 * 获取地址信息
			 */
			getAddress(){
				this.setAddress(uni.getStorageSync('RULE-START'), 'start')
				this.setAddress(uni.getStorageSync('RULE-MIDDLE0'), 'middleArr', 0)
				this.setAddress(uni.getStorageSync('RULE-MIDDLE1'), 'middleArr', 1)
				this.setAddress(uni.getStorageSync('RULE-MIDDLE2'), 'middleArr', 2)
				this.setAddress(uni.getStorageSync('RULE-END'), 'end')

				this.waypoints = ''
				if(this.middle1LngLat){
					this.waypoints += this.middle1LngLat 
				}
				if(this.middle2LngLat){
					this.waypoints += ';' + this.middle2LngLat
				}
				if(this.middle3LngLat){
					this.waypoints += ';' + this.middle3LngLat
				}

				if(this.startLngLat && this.endLngLat){
					this.start_location = typeof this.startLngLat === 'object' ? this.startLngLat[0] + ',' + this.startLngLat[1] : this.startLngLat
					this.return_location = typeof this.endLngLat === 'object' ? this.endLngLat[0] + ',' + this.endLngLat[1] : this.endLngLat
					

					let start = this.start_location.split(',')
					let end = this.return_location.split(',')

					this.AMap.plugin('AMap.Driving', () => {
						let driving = new this.AMap.Driving({})
						driving.search( new this.AMap.LngLat(...start), 
										new this.AMap.LngLat(...end), 
						(status, result) => {
							
							this.miles = result.routes[0].distance		//获取两地之间的导航的实际距离（米）
							this.driveTime = result.routes[0].time		//获取两地之间距离所需要的时间（分钟）

							this.getInfo()
						})
					})
				}
			},
			/**
			 * 设置地址
			 * 
			 * @param {Object} res 地址对象
			 * @param {String} key data key
			 * @param {Number} index 索引
			 * 
			 */
			setAddress(res, key, index) {
				const lnglat = key + 'LngLat'
				if (res) {
					if(typeof index === 'undefined'){
						this[key] = res.name
						this[lnglat] = [res.lng, res.lat]
					}else{
						this.$set(this.middleArr, index, {
							val: res.name
						})
						let middleLngLat = `middle${index+1}LngLat`
						this[middleLngLat] = [res.lng, res.lat]
					}
				}
			},
			/**
			 * 删除地址
			 */
			removeAddress(){
				uni.removeStorageSync('RULE-START')
				uni.removeStorageSync('RULE-MIDDLE0')
				uni.removeStorageSync('RULE-MIDDLE1')
				uni.removeStorageSync('RULE-MIDDLE2')
				uni.removeStorageSync('RULE-END')
			},
			/**
			 * 获取值
			 * 
			 * @param {Object} event event 对象
			 * @param {String} key data key
			 * 
			 */
			getVal(event, key) {
				this[key] = event.target.value
				this.computeVal(key)
			},
			/**
			 * 上调
			 * 
			 * @param {any} key 当前的ref key
			 * 
			 */
			stepPlus(key) {
				let val = typeof Number(this[key]) === 'number' ? this[key] : 0
				val ++

				this[key] = val
				this.computeVal(key)
			},
			/**
			 * 下调
			 * 
			 * @param {any} key 当前的ref key
			 * 
			 */
			stepMinus(key) {
				let val = typeof Number(this[key]) === 'number' ? this[key] : 0
				val --
				val = val < 0 ? 0 : val

				this[key] = val
				this.computeVal(key)
			},
			/**
			 * 计算总值
			 * 
			 * @param {any} key 当前的ref key
			 * 
			 */
			computeVal(key){
				let val = this[key]
				let resultKey = key + 'result'
				let unitKey = key + 'unit'
				let equal = (val * this[unitKey]).toFixed(2)

				this[resultKey] = equal
				this.setCount()
			},
			/**
			 * 获取信息
			 */
			async getInfo() {
				let {city, cate_name, miles, use_time, power_off_time, return_location, start_location, drive_time, waypoints} = this

				let data = {
					city,
					cate_name
				}			
				await this.$store.dispatch('valuation/getInfo', data)
				
				this.calendarData = this.info.rent_calendar

				let ndata = {
					city: city,
					brand_cate: cate_name,
					use_time_type: 0,
					use_long: 0,
					miles: miles,
					use_time: use_time,
					power_off_time: power_off_time,
					return_location: return_location,
					is_return: 0,
					start_location,
					drive_time,
					waypoints
				}

				if(miles.toString() === '0'){
					return
				}
				await this.$store.dispatch('valuation/getBudget', ndata)

				this.getBudget()
			},
			/**
			 * 设置参数
			 */
			getBudget() {
				this.usepriceunit = this.budget.power_on_price || 0,
				this.useprice = this.budget.power_on_time || 0,
				this.usepriceresult = this.budget.power_on_amount || 0,
				this.parkpriceunit = this.budget.power_off_price || 0,
				this.parkprice = this.budget.power_on_off || 0,
				this.parkpriceresult = this.budget.power_off_amount || 0,
				this.fuelpriceunit = this.budget.oil_price || 0,
				this.fuelprice = this.budget.oil_num || 0,
				this.fuelpriceresult = this.budget.oil_amount || 0,
				this.chesunpriceunit = this.budget.safe_price || 0,
				this.chesunprice = Math.ceil(Number(this.budget.safe_time) / 60),
				this.chesunpriceresult = this.budget.safe_amount || 0,
				this.additional = this.budget.remote_car_money || 0,
				this.countPrice = this.budget.total_amount || 0,
				this.min_use_amount = this.budget.min_use_amount || 0
			},
			/**
			 * 设置总值
			 */
			setCount() {
				const {usepriceresult, parkpriceresult, fuelpriceresult, chesunpriceresult, additional, min_use_amount} = this
				let count
				if(Number(usepriceresult) + Number(parkpriceresult) < Number(min_use_amount)){
					count = (Number(min_use_amount) + Number(fuelpriceresult) + Number(chesunpriceresult) + Number(additional)).toFixed(2)
				}else{
					count = (Number(usepriceresult) + Number(parkpriceresult) + Number(fuelpriceresult) + Number(chesunpriceresult) + Number(additional)).toFixed(2)
				}
				
				this.countPrice = count
			},
			/**
			 * 显示隐藏收费标准
			 */
			onAdditional() {
				this.dialogShow = !this.dialogShow
			},
			/**
			 * 显示城市下拉框
			 */
			showCity() {
				this.$refs.mpvueCityPicker.show()
			},
			/**
			 * 城市下拉框取消
			 */
			onCancel(e) {
				console.log(e)
			},
			/**
			 * 城市下拉框确定
			 * 
			 * @param {Object} e event对象
			 * 
			 */
			onConfirm(e) {
				console.log(e);

				this.city = e.value[0]
				this.cate_name = e.value[1]
				this.mode_name = e.value[2]

				this.getInfo()
			},
			/**
			 * 添加途经点
			 */
			addMiddle() {
				let params = {val: ''}
				if(this.middleArr.length < 3){
					this.middleArr.push(Object.assign({}, params))
				}else{
					this.$toast.info('最多只能输入3个途经点')
				}
			},
			/**
			 * 删除途经点
			 */
			delInput(index) {
				this.middleArr.splice(index, 1)
			},
			/**
			 * 改变起始点
			 */
			changeStart(){
				uni.navigateTo({
					url: "/pages/search/search?type=RULE-START"
				})
			},
			/**
			 * 改变途经点
			 */
			changeMiddle(index){
				uni.navigateTo({
					url: `/pages/search/search?type=RULE-MIDDLE${index}`
				})
			},
			/**
			 * 改变目的地
			 */
			changeEnd(){
				uni.navigateTo({
					url: "/pages/search/search?type=RULE-END"
				})
			}
		},
		mounted() {
			
		}
	}
</script>
<style lang='scss' scope>
	.valuation-container{
		padding: 20upx;
		position: relative;

		.city-picker{
			font-size: 28upx;
			color: #655553;
			text-align: right;
		}
		.search-box {
			margin-top: 40upx;
			width:100%;
			min-height:202upx;
			background:rgba(255,255,255,1);
			box-shadow:0upx 4upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius:10upx;
			filter:blur(0upx);
			position: relative;

			.input-box{
				position: relative;

				.dot{
					position: absolute;
					top:50%;
					left: 20upx;
					width: 14upx;
					height: 14upx;
					background:rgba(48,212,160,1);
					border-radius:4px;
					transform:translateY(-50%);

					&.orange {
						background:rgba(255,144,37,1);
					}
				}
			}

			input{
				padding-left: 60upx;
				padding-right: 150upx;
				height: 100upx;
				font-size: 28upx;
				position: relative;
			}

			/deep/ .first-input .uni-input-wrapper{
				&::after{
					content: '';
					position: absolute;
					background-color: #ddd;
					display: block;
					z-index: 1;
					top: auto;
					right: auto;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 2upx;
					transform-origin: 50% 100%;
					transform: scaleY(0.5);
				}
			}
			/deep/ .uni-input-placeholder{
				color:#CCC;
			}

			/deep/ .middle-input .uni-input-wrapper{
				&::after{
					content: '';
					position: absolute;
					background-color: #ddd;
					display: block;
					z-index: 1;
					top: auto;
					right: auto;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 2upx;
					transform-origin: 50% 100%;
					transform: scaleY(0.5);
				}
			}

			.middle-box{
				position: relative;

				.del-input{
					position: absolute;
					top:50%;
					left:20upx;
					transform:translateY(-50%);
					z-index: 2;
				}
			}
		}
		.add-btn {
			width:68upx;
			height:68upx;
			line-height: 68upx;
			background:rgba(255,144,37,1);
			box-shadow:0upx 4upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius:34upx;
			filter:blur(0upx);
			color: #FFF;
			text-align: center;
			font-weight: bold;
			display: inline-block;
			margin-bottom: 4upx;
		}
		.add-text {
			text-align: center;
			color: #333333;
			font-size: 20upx;
		}
		.valuation-item{
			width:100%;
			background:rgba(255,255,255,1);
			box-shadow:0upx 4upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius:12upx;
			margin-top:20upx;
			padding: 30upx 26upx;
		}
		
		.way-list{
			display: flex;
			line-height: 80upx;
			padding: 28upx 0;

			label{
				width: 160upx;
				font-size: 24upx;
				line-height: 80upx;
				font-weight: bold;
				position: relative;

				text{
					position: absolute;
					top: 40upx;
					left: 16upx;
					font-size: 20upx;
					color: #30D4A0;

					&.label-sub-other{
						color: #FF9933;
						left: 0upx;
					}
				}
			}
			.symbol{
				color: #999999;
			}
		}
		.way-number {
			flex:1;
			font-size: 26upx;

			text{
				vertical-align: middle;
				margin:0 10upx;
			}
		}
		.valuation-way {
			.minutes-input{
				display: inline-block;
				padding: 0;
				width: 66upx;
				height: 54upx;
				background: rgba(241,241,241,1);
				border-radius: 10upx;
				min-height: 54upx;
				text-align: center;
				vertical-align: middle;
				font-size: 26upx;
			}
			.minutes-input {
				input{
					text-align: center;
					padding:0;
					height: 54upx;
					line-height: 112upx;
					font-size: 26upx;
				}
			}
		}
		.stepper {
			width: 30upx;
			position: relative;

			.stepper-plus{
				position: absolute;
				width: 30upx;
				height: 40upx;
				top: 0;
				left: 0;

				label{
					position: absolute;
					top:0;
					left:50%;
					width:0;
					height:0;
					border-right:10upx solid transparent;
					border-left:10upx solid transparent;
					border-bottom:10upx solid #FF9025;
					transform:translateX(-50%);
				}
			}

			.stepper-minus{
				position: absolute;
				width: 30upx;
				height: 40upx;
				bottom: 0;
				left: 0;

				label{
					position: absolute;
					bottom:0;
					left:50%;
					width:0;
					height:0;
					border-right:10upx solid transparent;
					border-left:10upx solid transparent;
					border-top:10upx solid #FF9025;
					transform:translateX(-50%);
				}
			}

			.line {
				position: absolute;
				top: 12upx;
				left: 0;
			}
		}
		.stepper .line:after,.dividing-line:after {
			content: '';
			position: absolute;
			top: 26upx;
			left: -4upx;
			width: 40upx;
			height: 2upx;
			border-top: 2upx solid #E6E6E6;
			transform: scaleY(.5);
			-webkit-transform: scaleY(.5);
			-moz-transform: scaleY(.5);
			-ms-transform: scaleY(.5);
			-o-transform: scaleY(.5);
		}
		.dividing-line{
			position: relative;
			width: 100%;
			display: block;

			&:after{
				width: 99%;
				left:0;
			}
		}
		.plus-icon,.minus-icon,.equal-icon {
			width:40upx;
			height:40upx;
			line-height: 40upx;
			background:rgba(255,255,255,1);
			box-shadow:0upx 4upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius:20upx;
			filter:blur(0upx);
			color: #FF0000;
			font-size: 32upx;
			font-style: normal;
			font-weight: bold;
			display: inline-block;
			text-align: center;
			z-index: 2;
			position: relative;
			left: 52upx;
			top: -2upx;
		}
		.minus-icon {
			color: #30D4A0;
		}
		.equal-icon{
			color: #FF9025;
		}
		.way-text {
			flex: 1;
			text-align: right;
			color:#30D4A0;
			font-size: 14upx;
			padding-right: 10upx;
		}
		.minus-title {
			color: #30D4A0;
		}
		.way-result,.way-result .way-text{
			color: #FF9025;
		}
		.way-result .count{
			font-size: 44upx;
		}
		.valuation-damage{
			.tips{
				color: #666666;
				font-size: 20upx;
				margin: 10upx 0;
			}
		}
		.valuation-damage table tr td:first-child{
			width:140upx;
		}
		.valuation-item .item-title{
			font-size: 30upx;
			font-weight: normal;
			margin-bottom: 20upx;
			display: block;
		}
		table td,table{
			position: relative;
		}
		.hour-rent table tr td:first-child{
			width: 180upx;
		}
		.sub-title{
			font-size:30upx;
			margin: 20upx 0;
			padding-left: 10upx;
			display: block;
			font-weight: bold;
		}
		.surcharge table tr td:first-child{
			width: 300upx;
		}
		.details table tr td:first-child{
			width: 300upx;
		}
		.surcharge{
			.tips{
				font-size: 20upx;
				margin-bottom: 20upx;
				color: #999999;

				text {
					color: #30D4A0;
					text-decoration: underline;
				}
			}
		}
		.details{
			.tips{
				font-size: 20upx;
				margin-top: 10upx;
				color: #999999;
			}
		}
		.guide{
			margin-top:20upx;
			width:100%;
			height:124upx;
			background:rgba(250,250,250,1);
			border-radius:10upx;
			display: flex;
			padding: 14upx;
			position: relative;

			img{
				width: 96upx;
				height: 96upx;
				vertical-align: middle;
				margin-right: 26upx;
			}
		}
		.guide-info {
			flex: 1;

			text{
				font-size: 28upx;
				margin-bottom: 10upx;
				color: #666666;
				display: block;
			}
			.sub{
				font-size: 20upx;
				margin-bottom: 20upx;
				color: #999999;
			}
		}
		/*下箭头*/
		.right-arrow {
			border-right: 4upx solid #999999;
			border-top: 4upx solid #999999;
			height: 10upx;
			width: 10upx;
			transform: rotate(45deg);
			border-left: 4upx solid transparent;
			border-bottom: 4upx solid transparent;
			-webkit-transform: rotate(45deg);
			-moz-transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			-o-transform: rotate(45deg);
			position: absolute;
			top: 20upx;
			right: 20upx;
		}
		
	}

	.valuation-item {
		table{
			border-collapse: collapse;
			width: 100%;

			tr{
				td{
					border:1upx solid #CCCCCC;
					height: 90upx;
					text-align: center;
					background: #FAFAFA;
					font-size: 24upx;
				}
			}
		}
	}
	.dialog{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
	}
	.dialog-body{
		width: 600upx;
		height: auto;
		background: #FFF;
		position: absolute;
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
		border-radius: 10upx;
		-webkit-border-radius: 10upx;
		-moz-border-radius: 10upx;
		-ms-border-radius: 10upx;
		-o-border-radius: 10upx;
		padding:0;
		overflow: hidden;
	}
	.dialog-footer{
		width: 100%;
		text-align: center;

		a{
			width:100%;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 24upx;
			color:#FF9025;
		}
	}
	.search-opt{
		position: absolute;
		top: 50%;
		right: 36upx;
		text-align: center;
		transform: translate(0, -50%);
	}
</style>

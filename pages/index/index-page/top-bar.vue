<template>
    <view>
        <view class="topbar">
            <!-- status-01 start  -->
            <view class="status status-01 ">
                <view class="user-box">
                    <text class="iconfont iconren" @click="switchDrawer"></text>
                    <view class="user-text" @click="switchShow">
                        <text class="user-text-address">{{cityNameValue}}</text>
                        <text class="iconfont iconxiangxiayuan"></text>
                    </view>
                </view>
                <view class="bar-box">
                    <!-- <view class="icon kefu-icon"></view> -->
                </view>
            </view>
            <!-- status-01 end  -->
            
        </view>

        <uni-popup :show="show" :type="type" :custom="true" @change="change">
            <view class="titlebar">
                <view class="title">
                    <view class="backbox" @click="switchShow">
                        <uni-icons size="25" type="back" class="backbutton" />
                    </view>
                    <text>选择城市</text>
                </view>
                <view class="localaddress">{{localcityname}}（定位城市）</view>
            </view>
            <view class="address-box">
                <view class="listbox">
                    <view class="lb-item" hover-class="lb-item-active" v-for="(item,index) in cityList" :key="index" @click="setCity(item)">
                        <text class="t1">{{item.cf_city}}</text>
                        <text class="t2">{{item.checked?'(已选择)':""}}</text>
                    </view>
                </view>
            </view>
        </uni-popup>
        <siderMenu :visible="isShowDrawer" @close="switchDrawer"></siderMenu>
    </view>
</template>
<script>
    import siderMenu from '@/components/sider-menu/sider-menu.vue';
    import { getCity } from '@/api/index';
    import { UniPopup, uniIcons, uniNavBar } from '@dcloudio/uni-ui';
    export default {
        components: {
            UniPopup,
            uniIcons,
            uniNavBar,
            siderMenu
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            cityname: {
             type: String,
             default: "定位中。。"
            },
            localCityName: {
                type: String,
                default: "定位中..."
            },  
			citylist: {
                type: Array 
            },
        },
        data() {
            return {
                show: false,
                type: "bottom",
                cityNameValue: this.localCityName,
				localcityname: this.localCityName,
                isShowDrawer: false,
                cityList: []
            }
        },
        watch: {
			citylist(value){
				this.cityList = value
			},
			cityname(value){ 
				this.cityNameValue = value  
			},
			
            localCityName(value) {
               this.localcityname = value;	 
            },
           cityData(value){
                 if(value){
					 let cityname = value.cityname;
					 let citylist = value.citylist;					 
                        if(cityname.indexOf("定位中") < 0 && citylist.length > 0){
						let res = citylist.filter(item => item.cf_city==cityname );
							res[0].checked = true; 
                        }
                 }
            }
        },
        computed :{
               cityData:function (){
                    let cityname = this.cityNameValue;
                    let citylist = this.cityList;
                    return {cityname,citylist}
                }
        },
        mounted() {
          //  this.getCityList()
        },
        methods: {
            async getCityList() {
               // this.cityList = await getCity();
			  // this.cityList = [{"cf_city":"武汉市","cf_city_code":"027","cf_city_simple":"武汉","longitude":114.41092,"latitude":30.478958,"city_hash":"4df942c54a26a7a41357175ceb7fe88f"},{"cf_city":"西安市","cf_city_code":"029","cf_city_simple":"西安","longitude":108.870704,"latitude":34.230967,"city_hash":"e48f5c3de57ed84cd990f8cde04892fb"},{"cf_city":"郑州市","cf_city_code":"0371","cf_city_simple":"郑州","longitude":113.616765,"latitude":34.789666,"city_hash":"d59b41c2bc2f222dbeb2c0f6b2dd9ee5"},{"cf_city":"深圳市","cf_city_code":"0755","cf_city_simple":"深圳","longitude":114.062551,"latitude":22.655835,"city_hash":"2593c2905a50421e4fd266042e0cc826"},{"cf_city":"舟山市","cf_city_code":"0580","cf_city_simple":"舟山","longitude":122.122342,"latitude":30.037056,"city_hash":"d0bc0f53c8492436c97b4bb6b8252816"},{"cf_city":"大理白族自治州","cf_city_code":"0872","cf_city_simple":"大理","longitude":100.160233,"latitude":25.70038,"city_hash":"357350ec2b1fde59c71f6dfbd4a27caf"},{"cf_city":"太原市","cf_city_code":"0351","cf_city_simple":"太原","longitude":112.720264,"latitude":37.748552,"city_hash":"fb120dd693813ef61143f47a2d291e72"}]
            },
            switchShow() {
                this.show = !this.show;
            },
            switchDrawer() {
                this.isShowDrawer = !this.isShowDrawer;
            },
            openAddress() {
                this.show = true;
            },
            setCity(item,init = true) {
				
				if(item.cf_city == this.cityname){
					this.switchShow();
					return
				}
                this.cityList.map(function(item) {
                    item.checked = false;
                })
                this.switchShow();
                this.cityNameValue = item.cf_city;
                item.checked = true;
				 
                this.$emit("getCityInfo",this.cityNameValue)
            },
            change(e) {
                if (!e.show) {
                    this.show = e.show;
                }
            }
        }
    }
</script>
<style lang='scss' scope>
    @import "@/common/topbar.scss";

    .titlebar {
        position: fixed;
        display: block;
        z-index: 8888;
        width: 100%;
        background: #fff;

        .title {
            height: 60upx;
            line-height: 60upx;
            text-align: center;
            font-size: 30upx;
            width: 100%;

            .backbox {
                position: absolute;
                padding: 0 10upx;
            }

        }

        .localaddress {
            font-size: 24upx;
            padding: 20upx;
        }
    }

    .address-box {
        height: 100vh;
        width: 100%;
        background: #fff;
        position: relative;

        .listbox {
            font-size: 24upx;
            padding: 120upx 20upx 20upx 20upx;
            overflow: auto;
            height: 100vh;

            .lb-item {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                height: 80upx;
                line-height: 80upx;

                .t2 {
                    font-size: 14upx;
                    color: #FF9025;
                }
            }

            .lb-item-active {
                background: #eee;
            }
        }
    }

    .input-view {
        display: flex;
        background: #fff;
        border-radius: 44upx;
        line-height: 88upx;
        padding: 0 30upx;
        width: 80%;

        .uni-icon {
            line-height: 88upx !important;
        }

        .input {
            font-size: 28upx;
            height: 88upx;
            line-height: 88upx;
        }

    }
</style>

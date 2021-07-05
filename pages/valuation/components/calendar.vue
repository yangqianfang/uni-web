<template>
	<view class="wrap">
		<view class="calendar-num clearfix">
            <view class="calendar-thead-item">日</view>
            <view class="calendar-thead-item">一</view>
            <view class="calendar-thead-item">二</view>
            <view class="calendar-thead-item">三</view>
            <view class="calendar-thead-item">四</view>
            <view class="calendar-thead-item">五</view>
            <view class="calendar-thead-item">六</view>
        </view>
        <view id="info" v-html="calendarHtml"></view>
	</view>
</template>
<script>
	export default {
        props:{
            calendarData: {
				type: Object,
				default: {}
			}
        },
		data() {
			return {
                calendarHtml: ''
			}
		},
		components: {
        },
        watch: {
		    calendarData(value){
                this.calendarObj = value
                this.renderDate()
			}
		},
		methods: {
            /**
             * 渲染日期
             */
			renderDate() {
                let str = `<table class="calendar-box"><tbody>`
                let dateData = this.calendarObj
                let week = new Date(Object.keys(dateData)[0]).getDay()
            
                Object.keys(dateData).map((item,index) => {
                    const day = item.substring(item.length-2,item.length)
                    let today = this.getToday() === item ? 'today' : ''
                    if(index === 0){
                        str += `<tr>`
                    }
                    if(index === 0){
                        for(let i=0;i<week;i++){
                            str += `<td><a></a></td>`
                        }
                    }
                    if((index+week) % 7 === 0 && index !== 0){
                        str += `</tr>`
                        str += `<tr>`
                        str += `<td class="${today}"><a><span class="date basefix">${day}</span><span class="calendar-price"><dfn>¥</dfn>${dateData[item].day_price}</span></a></td>`
                    }else{
                        str += `<td class="${today}"><a><span class="date basefix">${day}</span><span class="calendar-price"><dfn>¥</dfn>${dateData[item].day_price}</span></a></td>`
                    }
                })

                str += `</tbody></table>`

                this.calendarHtml = str
            },
            /**
             * 获取当前日期
             */
            getToday() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                };
                var currentdate = year + '-' + month + '-' + day;

                return currentdate
            }
        }
	}
</script>
<style lang='scss' scope>
    .wrap{
        /deep/ .calendar-box{
            margin: 0 auto;
            width: 100%;

            tr {
                td{
                    text-align: center;
                    height: 76upx;
                    vertical-align: top;
                    color: #999999;
                    line-height: 1;
                    padding: 8upx;
                    background: #FFF;
                    border:0;

                    a{
                        text-align: center;
                        width: 76upx;
                        height: 76upx;
                        color: #999999;
                        line-height: 1;
                        padding: 8upx;
                        display: block;
                        box-sizing: border-box;
                    }

                    .date {
                        display: block;
                        text-align: center;
                        color: #333333;
                        font-size: 28upx;
                        margin-bottom: 2upx;
                        font-weight: bold;
                    }
                }

                 .calendar-price{
                    display: block;
                    color: #999999;
                    text-align: center;
                    font-size: 18upx;
                }

                dfn{
                    font-style: normal;
                    font-size: 14upx;
                    font-family: Arial !important;
                }

                .today {
                    a{
                        background:linear-gradient(90deg,rgba(255,168,0,1) 1%,rgba(255,97,0,1) 100%);
                        border-radius:50%;
                    }

                    .date,.calendar-price{
                        color: #FFF;
                    }
                }
            }
        }
    }

    .calendar-num {
        position: relative;
        height: 66upx;
        border-top:2upx solid #CCC;
        border-bottom:2upx solid #CCC;
        display: flex;
        margin-bottom: 14upx;

        .calendar-thead-item {
            height: 66upx;
            line-height: 66upx;
            text-align: center;
            color:#999999;
            flex: 1;
        }
    }
</style>

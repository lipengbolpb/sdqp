<template>
	<view class="signPage">
		<view class="top">
			<view class="title">
				<view @click="toBack" class="jiantou" :style="{'margin-top':(safeHeight + customBarHeight*1/3) + 'px' ,'margin-left':'20px'}"></view>
				<view :style="{'padding-top':safeHeight + 'px' ,'line-height':customBarHeight + 'px'}" class="head">签到</view>
			</view>
			<view class="qd">
				<view class="total" @click="toList">我的积分：{{restVpoints|toThousands}} > </view>

				<view class="btn" @click="qdFuc" v-if='!isQd'>
					<view class="innerBtn">签到</view>
				</view>

				<view class="btn" v-else>
					<text class="innerBtn qdOver">签到 \n 成功</text>
				</view>
			</view>
		</view>

		<view class="calendar">
			<view class="total">
				<view class="quan">
					<view class="yes"></view>
				</view>
				<view class="txt">本月共签到{{qdDays}}天，获得<text>{{qdTotalVpoints|toThousands}}积分</text></view>
			</view>
			<view class="switch">
				<!-- <view class="oprate month-less" @click="prevMonth">
					<view class="prev"></view>
				</view> -->
				<view class="h4">{{year}}年{{month}}月</view>
				<!-- <view class="oprate month-add" @click="nextMonth">
					<view class="add"></view>
				</view> -->
			</view>
			<view class="sign_tab" border="0rpx" cellpadding="0rpx" cellspacing="0rpx">
				<view class="week">
					<text>日</text>
					<text>一</text>
					<text>二</text>
					<text>三</text>
					<text>四</text>
					<text>五</text>
					<text>六</text>
				</view>
				<view class="riqi" v-for="(item,index) in dateArr" :key="index" v-if="contains(item)">
					<view class="td" v-for="(data,idx) in item" :class="{ 'specil_day': (isSpecilDay(data) || isSpecilWeek(idx)) && !isCheck(data),'cur_day': data == date , 'check': isCheck(data)}">
						<view class="day" v-if="(isSpecilDay(data) || isSpecilWeek(idx)) && !isCheck(data)"></view>
						<view class="day" v-else>{{data}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="hightTip">
			要酒日“
			<image class="hb" :src="imgUrl + 'hb.png' " mode="widthFix"></image>
			”签到，可得高积分
		</view>


		<!-- 提示弹框 -->
		<view class="toast" v-show="getScore">
			<view class="toastBox">
				<view class="img">
					<image :src="imgUrl + 'bigCoin.png?v=1' " mode="widthFix" class="coinL"></image>
				</view>
				<view class="text">积分领取成功</view>
				<view class="text">本次获得<text class="point">{{getVpoints}}积分</text></view>
			</view>
		</view>

	</view>
</template>
<script>
	import {
		requestGet,
		requestPost,
		config
	} from '@/utils/api.js';
	export default {
		data() {
			return {
				imgUrl: config.mallImgUrl,
				safeHeight: getApp().globalData.safeHeight,
				customBarHeight: getApp().globalData.customBarHeight,
				today: new Date(),
				year: '',
				month: '',
				day: '',
				date: '',
				dateArr: [],
				checkin: [], //[1,2, 3, 5,20],
				specil_days: [], //[19,11],
				specil_Weeks: [], //[19,11],

				restVpoints: '0',

				isQd: false,
				qdDays: '0',
				qdTotalVpoints: '0',
				qdList: [],

				getScore: false, //得到积分弹框
				getVpoints: '0', //签到一次获得
				// isCheck:false,                              
			};
		},
		onLoad() {},
		onShow() {
			this.getSignInfo(); //查询账户积分数
		},
		created() {
			this.year = this.today.getFullYear();
			this.month = this.today.getMonth() + 1;
			this.day = this.today.getDay();
			this.date = this.today.getDate();
			this.getCalendar();
		},
		methods: {
			toList(){ //积分记录
				uni.navigateTo({
					url:'../scoreList/scoreList'
				})
			},
			async qdFuc() { // 点击签到
				var params = {
					"openid": getApp().globalData.openid,
				};
				var jo = await requestPost('/taskSignin/taskSignin', params);
				console.log(jo); // reply result replyTime
				if (jo.result.code == 0) {
					if (jo.result.businessCode == 0) {
						if (jo.reply) {
							this.getVpoints = jo.reply.earnVpoints; //获取积分
							this.isQd = true; // 已签到
							this.getScore = true; // 显示得到积分弹框
							let timer = null;
							timer = setTimeout(() => {
								this.getScore = false; //消失得到积分数
								this.getVpoints = 0;
							}, 2000)
							// uni.showToast({
							//     title: '成功获取'+ this.earnVpoints + '积分',
							//     duration: 2000,
							// 	icon:'none'
							// });
						}
						this.getSignInfo(); //更新账户积分
					} else {
						uni.showModal({
							title: '提示',
							content: jo.result.msg,
						})
					}
				} else {
					uni.showModal({
						title: '提示',
						content: jo.result.msg,
					})
				}
			},
			async getSignInfo() {
				var params = {
					"openid": getApp().globalData.openid,
				};
				var jo = await requestPost('/taskSignin/queryTaskSigninRecord', params);
				console.log(jo); // reply result replyTime
				if (jo.result.code == 0) {
					if (jo.result.businessCode == 0) {
						if (jo.reply) {
							this.restVpoints = jo.reply.surplusVpoints; //用户剩余积分

							this.qdDays = jo.reply.signinRecordList.length;

							var checkDayList = jo.reply.signinRecordList; //有签到的日子
							var points = 0;
							for (var i in checkDayList) {
								points += checkDayList[i].earnVpoints;
								// this.chekDayList[i].signDay.slice(7) // 20200831 xxx.slice(7)
								// console.log(checkDayList[i].signDay.slice(6))
								this.checkin.push(checkDayList[i].signDay.slice(6))
								// console.log(points)
							}
							this.qdTotalVpoints = points
							console.log(this.checkin)
							
							var nowTime = new Date(jo.replyTime); //当前日期
							console.log(nowTime);  
							var today = this.formatDate(nowTime)
							var todayDate = today.substring(today.length-2,today.length); //今天的日期 
							for(var k in this.checkin){
								if(todayDate == this.checkin[k]){
									this.isQd = true; // 今日已经签到
								}
							}  
							// 特殊高积分日                                             
							// "timeType":"时间类型：默认空，1 按天，2按周",  
							// "timeValue":"时间值：多个使用英文逗号分开"        
							if (jo.reply.signinInfo.timeType == 1) {
								for (let j in jo.reply.signinInfo.timeValue) {
									this.specil_days.push(jo.reply.signinInfo.timeValue[j])
									console.log(this.specil_days)
								}
							} else if (jo.reply.signinInfo.timeType == 2) {
								for (let j in jo.reply.signinInfo.timeValue) { // 周？？
									this.specil_Weeks.push(jo.reply.signinInfo.timeValue[j])
									console.log(this.specil_Weeks)
								}
							}
							// console.log( jo.reply.signinInfo)
							// console.log( jo.reply.signinRecordList)             
						}
					} else {
						uni.showModal({
							title: '提示',
							content: jo.result.msg,
						})
					}
				} else {
					uni.showModal({
						title: '提示',
						content: jo.result.msg,
					})
				}
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			isLeap() {
				const year = this.year;
				if (year % 4 == 0 && year % 100 > 0) {
					return true;
				} else if (year % 400 == 0 && year % 3200 > 0) {
					return true;
				} else {
					return false;
				}
			},
			getLen() {
				const month = this.month;
				if (month == 2) {
					if (this.isLeap) {
						return 29;
					} else {
						return 28;
					}
				} else {
					if (month < 8) {
						if (month % 2 > 0) {
							return 31;
						} else {
							return 30;
						}
					} else {
						if (month % 2 > 0) {
							return 30;
						} else {
							return 31;
						}
					}
				}
			},
			getCalendarTime() {
				return this.year + '-' + this.month + '-' + this.date;
			},
			getCalendar() {
				var len = this.getLen();
				var d = new Date(this.year, this.month - 1, 1);
				var dfw = d.getDay();
				var arr = new Array();
				var tem = 0;
				for (var i = 0; i < 6; i++) {
					arr[i] = new Array();
					for (var j = 0; j < 7; j++) {
						tem++;
						if (tem - dfw > 0 && tem - dfw <= len) {
							arr[i][j] = tem - dfw;
						} else {
							arr[i][j] = "";
						}
					}
				}
				this.dateArr = arr;
			},
			nextMonth() {
				if (this.month == 12) {
					this.year++;
					this.month = 1;
				} else {
					this.month++;
				};
				this.getCalendar();
			},
			prevMonth() {
				if (this.month == 1) {
					this.year--;
					this.month = 12;
				} else {
					this.month--;
				}
				this.getCalendar();
			},
			contains(arr) {
				if ((arr[0] == '') && (arr[1] == '') && (arr[2] == '') && (arr[3] == '') && (arr[4] == '') && (arr[5] == '') && (
						arr[6] == '')) {
					return false;
				} else {
					return true;
				}
			},
			isCheck(index) {
				for (let i in this.checkin) {
					if (index == this.checkin[i]) {
						return true;
					}
				}
				return false;
			},
			isSpecilDay(index) {
				for (let i in this.specil_days) {
					if (index == this.specil_days[i]) {
						return true;
					}
				}
				return false;
			},
			isSpecilWeek(idx) {
				for (let i in this.specil_Weeks) {
					if (idx == this.specil_Weeks[i]) {
						return true;
					}
				}
				return false;
			},

			  formatDate: function (value) {// 时间戳转换日期格式方法
				if (value == null) {
					return '';
				} else {
					let date = new Date(value);
					let y = date.getFullYear();// 年
					let MM = date.getMonth() + 1;// 月
					MM = MM < 10 ? ('0' + MM) : MM;
					let d = date.getDate();// 日
					d = d < 10 ? ('0' + d) : d;
					let h = date.getHours();// 时
					h = h < 10 ? ('0' + h) : h;
					let m = date.getMinutes();// 分
					m = m < 10 ? ('0' + m) : m;
					let s = date.getSeconds();// 秒
					s = s < 10 ? ('0' + s) : s;
					return y + '-' + MM + '-' + d ;//+ ' ' + h + ':' + m + ':' + s
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.signPage {
		background: url($mallImg+'qdBg.png') no-repeat center top;
		background-size: 100% 606rpx;
		height: 100%;
		box-sizing: border-box;
	}

	.top {

		// position: relative;
		// height: 626rpx;
		.title {
			padding-bottom: 35rpx;

			.jiantou {
				width: 24rpx;
				height: 24rpx;
				border-top: 3rpx solid #333;
				border-right: 3rpx solid #333;
				transform: rotate(225deg);
				position: absolute;
			}

			.head {
				text-align: center;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333;
				z-index: 1;
			}
		}

		.qd {
			display: flex;
			justify-content: center;

			.total {
				font-size: 28rpx;
				position: absolute;
				right: 30rpx;
				color: #000;
				margin-top: -30rpx;
			}

			.btn {
				width: 260rpx;
				height: 260rpx;
				background: rgba(255, 242, 213, .5);
				// border: 2rpx solid #FFF;
				// opacity: 0.5;  	       
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;

				.innerBtn {
					width: 194rpx;
					height: 194rpx;
					line-height: 194rpx;
					background: #FDCE5F;
					border-radius: 50%;
					font-size: 40rpx;
					color: #FFF;
					box-shadow: 0 0 30rpx 14rpx rgb(255, 255, 255) inset;

					&.qdOver {
						background: #fff;
						color: #FF4824;
						line-height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}

	.calendar {
		margin: 34rpx;
		padding: 25rpx;
		border: 5rpx solid #FFD671;
		border-radius: 20rpx;
		// position: relative;
		// margin-top: -16%;
		background: #fff;

		.total {
			display: flex;
			border-bottom: 1rpx solid #FBCA5A;
			padding-bottom: 35rpx;

			.quan {
				width: 30rpx;
				height: 30rpx;
				background: #fff;
				border: 2rpx solid #888;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				margin-right: 16rpx;

				.yes {
					width: 10rpx;
					height: 16rpx;
					border-right: 2rpx solid #888;
					border-bottom: 2rpx solid #888;
					transform: rotate(40deg);
					margin-top: 4rpx;
				}
			}

			.txt {
				font-size: 30rpx;
				color: #000;

				text {
					color: #EF8305;
				}
			}
		}

		.switch {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-top: 40rpx;

			.h4 {
				text-align: center;
				margin-bottom: 0rpx;
				padding: 12rpx 40rpx;
				font-size: 32rpx;
				color: #000000;
			}

			.oprate {
				width: 35rpx;
				height: 35rpx;
				border: 2rpx solid #D5D5D5;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

			}

			.month-add {
				.add {
					width: 10rpx;
					height: 10rpx;
					border-top: 4rpx solid #000;
					border-right: 4rpx solid #000;
					transform: rotate(45deg);
				}
			}

			.month-less {
				.prev {
					left: 20rpx;
					width: 10rpx;
					height: 10rpx;
					border-top: 4rpx solid #000;
					border-right: 4rpx solid #000;
					transform: rotate(225deg);
				}
			}
		}
	}

	.calendar .sign_tab {

		// width: 100%;
		.week {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 80rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #333;
		}

		.riqi {
			.td {
				width: 14.285714285714285%;
				text-align: center;
				font-size: 32rpx;
				font-family: arial;
				display: inline-block;
				line-height: 90rpx;

				&.over {
					background-color: #fff;
					color: #333;
				}

				&.cur_day {
					// color: pink;                              
				}

				&.specil_day {
					.day {
						background: url($mallImg + 'specilDay.png') no-repeat center bottom;
						background-size: 35rpx 36rpx;
						height: 60rpx;
					}
				}

				&.check {
					.day {
						color: #FFF;
						width: 52rpx;
						height: 52rpx;
						background: linear-gradient(149deg, #FF4824, #FF6F4E);
						border-radius: 50%;
						margin: 0 auto;
						line-height: 52rpx;
					}
				}
			}
		}
	}

	.hightTip {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #8D4403;
		padding-bottom: 20rpx;

		.hb {
			width: 100rpx;
		}
	}

	.toast {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		// background: rgba(0, 0, 0, .5);
		text-align: center;
		white-space: nowrap;
		z-index: 99;

		&:after {
			content: "";
			display: inline-block;
			height: 100%;
			vertical-align: middle;
		}

		.toastBox {
			//得到积分
			width: 475rpx;
			height: 270rpx;
			background: #fff;
			border: 3rpx solid #4EB435;
			border-radius: 20rpx;
			display: inline-block;
			vertical-align: middle;
			background-color: #fff;
			text-align: center;
			white-space: normal;

			.img {
				padding-top: 8%;

				image {
					width: 185rpx;
				}
			}

			.text {
				font-size: 28rpx;
				font-weight: 400;
				color: #333;
				line-height: 42rpx;

				.point {
					color: #FF2D29;
				}
			}
		}
	}
</style>

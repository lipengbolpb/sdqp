<template>
	<view>
		<scroll-view scroll-y @scrolltolower="lower">
			<view class="tab_box" v-show="expressStatus!=3">
				<view class="all">
					<text @click="tab(3)">全部订单</text>
					<image :src="imgUrl + 'icon_right.png' " mode="widthFix"></image>
				</view>
				<view class="tab">
					<text :class="expressStatus==4?'cur':''" @click="tab(4)">待付款</text>
					<!-- 没有待发货 用待收货替代待发货 -->        
					<!-- 1已发货 0未发货 -->
					<text :class="expressStatus==0?'cur':''" @click="tab(0)">待发货</text>
					<text :class="expressStatus==1?'cur':''" @click="tab(1)">待收货</text>
					<text :class="expressStatus==2?'cur':''" @click="tab(2)">已完成</text>
					<text :class="expressStatus==5?'cur':''" @click="tab(5)">退款/售后</text>
				</view>
			</view>
			<!-- 每一条 -->    
			<view class="orderList">
				<block  v-if="orderList.length>0">      
					<view class="order" v-for="(item,index) in orderList" :key="index" @click="toOrderDetails(item.exchangeId,item.tradeNo)">   
						<view class="time_type">
							<text>{{item.exchangeTime|timeSplit}}</text>
							<text v-if="item.exchangeStatus==-1">待支付</text>
							<text v-else-if="item.exchangeStatus==3">订单已关闭</text>
							<text v-else-if="item.exchangeStatus==0">{{item.expressStatus==1?'待收货':item.expressStatus==0?'待发货':item.expressStatus==2?'已完成':''}}</text>
							<text v-else-if="item.exchangeStatus==1">交易失败</text>
							<text v-else-if="item.exchangeStatus==2">交易处理中</text>
							<text v-else-if="item.exchangeStatus==4">退款中</text>
							 <!-- 已撤单 -->
							 <!-- 5 待发货撤单 -->
							<text v-else-if="item.exchangeStatus==5">退款成功</text>
							<text v-else-if="item.exchangeStatus==6">退款失败</text>
							
							<text v-else-if="item.exchangeStatus==7">退款审核中</text>
							<text v-else-if="item.exchangeStatus==10">待提交物流信息</text>
							<text v-else-if="item.exchangeStatus==8">退款处理中</text>
							<text v-else-if="item.exchangeStatus==9">退款成功</text>
						</view>
						<!-- 待支付的订单 -->
						<view v-if="item.exchangeStatus==-1 ">
							<view class="order_msg"  v-for="(lis,idx) in item.unpaidExchangeList" :key="idx">
								<image :src="goodsImgRoot+lis.goodsUrl|imgUrlSplit" mode="widthFix"></image>
								<view class="msg">
									<view class="goods_name">{{lis.goodsShortName}}</view>
									<view class="unit">
										<view v-if="lis.goodsSpecification">{{lis.goodsSpecification}}{{lis.goodsUnitName}}</view>
									</view>
									<block>
										<view class="money">
											<text class="moneyItem">待支付：</text>
											<text class="free">
												<text v-if="lis.exchangePay!=0"><text class="danwei">¥</text>{{(lis.exchangePay/100)|toFixed|toThousands}} </text>
												<text v-if="lis.exchangePay!=0 && lis.exchangeVpoints!=0 ">+</text>
											    <text v-if="lis.exchangeVpoints!=0">{{lis.exchangeVpoints|toThousands}}<text class="danwei">积分</text></text>
											</text>	
										</view> 
										<view class="num">共{{lis.exchangeNum}}件商品</view>
									</block>
								</view>            
							</view>
						</view>
						
						<!-- 非待支付 -->
						<view v-else >
							<view class="order_msg">
								<image v-if="item.goodsUrl" :src="goodsImgRoot+item.goodsUrl|imgUrlSplit" mode="widthFix"></image>
								<view class="msg">
									<view class="goods_name">{{item.goodsShortName}}</view>
									<view class="unit">
										<view v-if="item.goodsSpecification">{{item.goodsSpecification}}{{item.goodsUnitName}}</view>
									</view>
									<block>
										<view class="money">
											<text class="moneyItem" v-if="item.exchangeStatus==3">待支付：</text>
											<text class="moneyItem" v-else-if="item.exchangeStatus==0">实际支付：</text>
											<text class="moneyItem" v-else-if="item.exchangeStatus==4 || item.exchangeStatus==6 || item.exchangeStatus==7 || item.exchangeStatus==8 || item.exchangeStatus==10">待退款：</text>
											<text class="moneyItem" v-else-if="item.exchangeStatus==5 || item.exchangeStatus==9">已退款：</text>
											<text class="free">
												<text v-if="item.exchangePay!=0"><text class="danwei">¥</text>{{(item.exchangePay/100)|toFixed|toThousands}} </text>
												<text v-if="item.exchangePay!=0 && item.exchangeVpoints!=0 ">+</text>
											    <text v-if="item.exchangeVpoints!=0">{{item.exchangeVpoints|toThousands}}<text class="danwei">积分</text></text>
											</text>	
										  
										</view> 
										<view class="num">共{{item.exchangeNum}}件商品</view>
									</block>
								</view>            
							</view>
						</view>
						<!-- 待支付 -->
						<view class="order_btn" v-if="item.exchangeStatus==-1">
							<text class="cancel_Btn" @click.stop="showCancel(item.tradeNo)">取消订单</text>
							<text class="pay_Btn" @click.stop="payAgain(index,item.tradeNo)">立即付款</text>
						</view> 
						
						<!-- 待发货  -->
						<view class="order_btn" v-else-if="item.exchangeStatus==0 && item.expressStatus==0">
							<text class="buy_Btn" v-if="item.secKill == '1' " @click.stop="toGoods(item.goodsId,item.youPinFlag)">再次购买</text>
						</view>
				
						<!-- 待收货  -->
						<view class="order_btn" v-else-if="item.exchangeStatus==0 && item.expressStatus==1">
							<text  class="buy_Btn" @click.stop="toGoods(item.goodsId,item.youPinFlag)">再次购买</text>
							<text  class="receive_Btn" @click.stop="showReceipt(item.exchangeId)">确认收货</text>
						</view>
				                         
						<!-- 已完成 -->
						<view class="order_btn" v-else-if="item.exchangeStatus==0 && item.expressStatus==2">
							<text  class="aftersale_Btn" v-if="item.goodsReturnFlag == 0" @click.stop="toOrderDetails(item.exchangeId,item.tradeNo)">申请售后</text>
							<text  class="buy_Btn"  v-if="item.secKill == '1' " @click.stop="toGoods(item.goodsId,item.youPinFlag)">再次购买</text>
						</view>
				
						 <!-- 订单已关闭 -->
						<view class="order_btn" v-else-if="item.exchangeStatus==3">
							<text  class="delete_Btn" @click.stop="showDelete(item.exchangeId)">删除订单</text>
							<text  class="buy_Btn" v-if="item.secKill == '1' " @click.stop="toGoods(item.goodsId,item.youPinFlag)">再次购买</text>
						</view>
					</view>
				</block>
				
				<view class="nomore" v-else>
					暂无订单信息
				</view>   
			</view>
			<view class="tipBox" :style="{'display':showTip?'flex':'none'}" >
				<image :src="imgUrl +  'icon_close.png' " mode="widthFix" v-show="!(warnCancel||warnCancelPay||warnDelete || warnReceive)"
				 class="close" @click="closeTip"></image>
				<view class="tip_msg" :style="{'padding-bottom':safeBottom==0?'40rpx':safeBottom}">
					<!-- 确认收货 -->
					<view class="warn" :style="{'display':warnReceive?'block':'none'}">   
						<text>要确认收货此订单吗？</text>
					</view>
		
					<!-- 支付相关 -->
					<view :style="{'display':aboutPay?'block':'none'}">
						<image :src="tipIcon" mode="widthFix"></image>
						<view class="msg">
							<text :style="{'color':completePay?'#4dab6c':'#d73334'}">{{text1}}</text>
							<text>{{text2}}</text>
						</view>
					</view>
					<!-- 取消订单 -->
					<view class="warn" :style="{'display':warnCancel?'block':'none'}">
						<text>要取消此订单吗？</text>
					</view>
					<!-- 删除订单 -->
					<view class="warn" :style="{'display':warnDelete?'block':'none'}">
						<text>要删除此订单吗？</text>
						<text>删除后订单无法找回</text>
					</view>
					<!-- 放弃支付  -->     
					<view class="warn" :style="{'display':warnCancelPay?'block':'none'}" >      
						<text>确定放弃支付吗？</text>
						<text>超过订单支付时效后，订单将会被取消，请尽快完成支付！</text>
					</view>
		
					<!-- 取消确认收货按钮 -->
					<view class="btn_box_alert" :style="{'display':warnReceive?'flex':'none'}">
						<buttonBg :size="'small'" @confirm="receiveOrder" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
						<buttonBg @confirm="showTip=warnReceive=false" :size="'small'" :btn="'取消'"></buttonBg>
					</view>
		   
					<!-- 取消订单按钮 -->
					<view class="btn_box_alert" :style="{'display':warnCancel?'flex':'none'}">
						<buttonBg :size="'small'" @confirm="cancelOrder" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
						<buttonBg @confirm="showTip=warnCancel=false" :size="'small'" :btn="'取消'"></buttonBg>
					</view>
					<!-- 删除订单按钮 -->
					<view class="btn_box_alert" :style="{'display':warnDelete?'flex':'none'}">
						<buttonBg :size="'small'" @confirm="deleteOrder" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
						<buttonBg @confirm="showTip=warnDelete=false" :size="'small'" :btn="'取消'"></buttonBg>
					</view>
					<!-- 放弃支付按钮 -->
					<view class="btn_box_alert" :style="{'display':warnCancelPay?'flex':'none'}">
						<buttonBg @confirm="warnCancelPay=showTip=false" :size="'small'" :btn="'放弃'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
						<buttonBg :size="'small'" :btn="'继续支付'" :bgColor="'gradient'"></buttonBg>
					</view>
					<!-- 支付相关按钮 -->
					<view class="btn_box_alert" :style="{'display':aboutPay?'flex':'none'}">
						<buttonBg :size="'small'" @confirm="toOrderDetails(exchangeId,tradeNo)" :btn="'查看订单'" :color="'#4eac6d'" :bgColor="'#dfebdf'"
						 v-if="completePay"></buttonBg>
						<buttonBg :size="'small'" :btn="'重新发起支付'" :bgColor="'gradient'" v-else></buttonBg>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<movable-area class="moveArea" >
		  	<movable-view direction="all" class="back" @click="back" :x="x" :y="y">
				<text>{{expressStatus==3?'返回\n订单':'返回\n首页'}}</text>
			</movable-view>
		</movable-area>
		<!-- <text class="back" @click="back">{{expressStatus==3?'返回\n订单':'返回\n首页'}}</text> -->
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';        
	const count = 30;
	export default {
		data() {
			return {
				imgUrl: config.mallImgUrl,
				requestUrl: config.requestUrl,
				goodsImgRoot: config.goodsImgRoot,
				expressStatus: -1,
				orderList: [],
				next: true,
				currentPage: 1,
				safeBottom: getApp().globalData.isIphoneX ? '68rpx' : 0,
				showTip: false, //显示提示窗口
				warnCancel: false, //取消订单
				warnCancelPay: false, //放弃支付
				warnDelete: false, //删除订单

				warnReceive: false, //确认收货

				aboutPay: false, //支付相关
				completePay: false, //支付完成
				text1: '订单支付失败',
				text2: '您的订单支付失败，请重新发起支付',
				tipIcon: config.mallImgUrl + 'icon_success.png',
				tradeNo: '',
				exchangeId: '',
				
				x:290,
				y:360
			};
		},
		onLoad(options) { //默认待收货
			this.expressStatus = options.type !== undefined ? options.type : 1;
		},
		onShow() {
			if (this.expressStatus != -1) {
				this.query();
			}
		},
		methods: {
			tab(type) {
				this.expressStatus = type;
				this.currentPage = 1;
				this.next = true;
				this.orderList = [];
				// if(type!=1){ //待发货不查询
				// 	this.query();
				// }
				this.query();
			},
			query() {
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/getExchangeRecord',
					method: "POST",
					data: {
						openid: getApp().globalData.openid,
						expressStatus: this.expressStatus, //物流状态：0待发货、1已发货、2已完成、3/null全部、4待支付、5退款,
						queryType:1, //2,河北使用
						currentPage: this.currentPage,
						count: count,
						"projectServerName": 'shandongagt'
					}
				}).then(res => {
					uni.hideLoading();
					console.log(res)
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.reply.length < count) {
								this.next = false;
							}
							if (this.currentPage == 1) {
								this.orderList = r.data.reply;
							} else {
								if (r.data.reply && r.data.reply.length > 0) {
									this.orderList = this.orderList.concat(r.data.reply)
								}
							}
						} else {
							console.log(r);
							this.orderList = [];
						}
					} else {
						console.log(e)
					}
				})
			},
			back() {
				if (this.expressStatus == 3) {
					this.expressStatus = 0;
					this.currentPage = 1;
					this.next = true;
					this.orderList = [];
					this.query();
				} else {
					uni.switchTab({
						url: '../index/index'
					})
				}
			},
			toOrderDetails(id, tradeNo) {
				this.closeTip();
				uni.navigateTo({
					url: './orderDetail?id=' + id + '&tradeNo=' + tradeNo
				})
			},
			lower() {
				if (this.next) {
					this.currentPage++;
					this.query();
				} else {
					uni.showToast({
						title: '没有更多订单啦',
						icon: 'none'
					})
				}
			},
			showReceipt(exchangeId) { //确认收货
				this.exchangeId = exchangeId;
				this.showTip = true;
				this.warnReceive = true;
			},
			receiveOrder() { // 确认收货
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/expressSign',
					method: 'POST',
					data: {
						openid: getApp().globalData.openid,
						exchangeId: this.exchangeId,
						"projectServerName": 'shandongagt'
					}
				}).then(res => {
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.result.businessCode == 0) { //确认收货成功
								uni.showModal({
									title: '提示',
									content: '确认收货成功！',
									showCancel: false
								})
								this.showTip = false;
								this.warnReceive = false;
								this.currentPage = 1;
								this.next = true;
								this.orderList = [];
								this.query();
							} else {
								uni.showModal({
									title: '提示',
									content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
									showCancel: false
								})
								this.showTip = false;
								this.warnReceive = false;
							}
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
							this.showTip = false;
							this.warnReceive = false;
						}
					} else {
						console.log(e)
						uni.showModal({
							title: '提示',
							content: '系统繁忙',
							showCancel: false
						})
						this.showTip = false;
						this.warnReceive = false;
					}
				})
			},
			showCancel(tradeNo) {
				this.tradeNo = tradeNo;
				this.showTip = true;
				this.warnCancel = true;
			},
			cancelOrder() { //取消订单
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/cancelExchangeInfo',
					method: 'POST',
					data: {
						tradeNo: this.tradeNo,
						"projectServerName": 'shandongagt'
					}
				}).then(res => {
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.result.businessCode == 0) { //取消成功
								uni.showModal({
									title: '提示',
									content: '取消订单成功！',
									showCancel: false
								})
								this.showTip = false;
								this.warnCancel = false;
								this.currentPage = 1;
								this.next = true;
								this.orderList = [];
								this.query();
							} else {
								uni.showModal({
									title: '提示',
									content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
									showCancel: false
								})
								this.showTip = false;
								this.warnCancel = false;
							}
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
							this.showTip = false;
							this.warnCancel = false;
						}
					} else {
						console.log(e)
						uni.showModal({
							title: '提示',
							content: '系统繁忙',
							showCancel: false
						})
						this.showTip = false;
						this.warnCancel = false;
					}
				})
			},
			//  youPinFlag=0时，是魔盒优品  1 正价购买 
			toGoods(id, flag) { //再次购买
				if (flag == 0) {
					// uni.navigateTo({
					// 	url: '../../index/goods/goods?id=' + id
					// })
				} else if (flag == 1) {
					uni.navigateTo({
						url: '../goodsDetail/goodsDetail?id=' + id
					})
				}
			},
			showDelete(exchangeId) {
				this.exchangeId = exchangeId;
				this.showTip = true;
				this.warnDelete = true;
			},
			deleteOrder() { //删除订单
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/deleteExchangeInfoForUser',
					method: 'POST',
					data: {
						exchangeId: this.exchangeId,
						"projectServerName": 'shandongagt'
					}
				}).then(res => {
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.result.businessCode == 0) { //删除成功
								uni.showModal({
									title: '提示',
									content: '删除订单成功！',
									showCancel: false
								})
								this.showTip = false;
								this.warnDelete = false;
								this.currentPage = 1;
								this.next = true;
								this.orderList = [];
								this.query();
							} else {
								uni.showModal({
									title: '提示',
									content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
									showCancel: false
								})
								this.showTip = false;
								this.warnDelete = false;
							}
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
							this.showTip = false;
							this.warnDelete = false;
						}
					} else {
						console.log(e)
						uni.showModal({
							title: '提示',
							content: '系统繁忙',
							showCancel: false
						})
						this.showTip = false;
						this.warnDelete = false;
					}
				})
			},
			payAgain(index, tradeNo) { //再次支付
				this.tradeNo = tradeNo;
				this.exchangeId = this.orderList[index].exchangeId;
				uni.requestPayment({
					provider: 'wxpay', //服务商
					timeStamp: this.orderList[index].payParam.timeStamp, //时间戳
					nonceStr: this.orderList[index].payParam.nonceStr, //随机字符串，长度为32个字符以下
					package: this.orderList[index].payParam.package, //统一下单接口返回的 prepay_id 参数值,提交格式如：prepay_id=xx
					signType: this.orderList[index].payParam.signType, //签名算法，暂支持 MD5
					paySign: this.orderList[index].payParam.paySign //签名，具体签名方案参见微信小程序支付文档
				}).then(res => {
					console.log(res)
					let [e, r] = res;
					if (r) { //支付成功
						this.updatePay(); //调接口更改为支付中
						if (r.errMsg.indexOf('ok') != -1) {
							this.showTip = true;
							this.tipIcon = this.imgUrl + 'icon_loading.png';
							this.text1 = '支付完成';
							this.text2 = '客官，订单收到啦！\n我们正在快马加鞭处理~';
							this.completePay = true;
							this.aboutPay = true;
							// uni.requestSubscribeMessage({ //发起订阅消息
							// 	tmplIds: ['2wEMDtfgw0oK84RygiTGGP4xE3H_A08N7aXTsFhamGY'],
							// 	complete: res => {
							// 		console.log(res)
							// 	}
							// })
						}
					} else {
						console.log(e)
						if (e.errMsg.indexOf('cancel') != -1) { //取消支付停留在当前

						}
					}
				})
			},
			updatePay() { //更新订单
				uni.request({
					url: this.requestUrl + '/trade/tradePaying',
					method: 'POST',
					data: {
						tradeNo: this.tradeNo,
						"projectServerName": 'shandongagt'
					},
					success: (res) => {
						console.log('tradePaying', res)
					},
					fail: (err) => {
						console.log('tradePaying', err)
					}
				})
			},
			closeTip() {
				if (this.completePay) {
					this.currentPage = 1;
					this.next = true;
					this.orderList = [];
					this.query();
				}
				this.showTip = false;
				this.warnCancel = false;
				this.warnCancelPay = false;
				this.warnDelete = false;

				this.warnReceive = false;

				this.aboutPay = false;
				this.completePay = false;
			},

			// toAfterSale(exchangeId){//申请售后
			// 	uni.navigateTo({
			// 		url:'../../afterSale/afterSale?exchangeId=' + exchangeId
			// 	})
			// },
		},
		components: {
			buttonBg
		},
		filters: {
			toFixed: function(num) {
				if (num) {
					return Number(num).toFixed(2)
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
	}
	scroll-view {
		width: 100%;
		height: 100%;
		-webkit-over-scrolling: touch;
	}

	// tab
	.tab_box {
		width: 100%;
		// box-shadow: 2rpx 2rpx 10rpx #cac9ce;
		overflow: hidden;
		background: #FFFFFF;
		.all {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 23rpx;
			color: #666;
			padding-right: 66rpx;

			image {
				width: 13rpx;
				margin-left: 10rpx;
				// margin-top: 8rpx;
			}

			text {
				padding-top: 8rpx;
				height: 86rpx;
				line-height: 78rpx;
			}
		}

		.tab {
			height: 94rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 35rpx;

			text {
				height: 94rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				color: #333;
				line-height: 81rpx;
				padding: 0 10rpx 13rpx;
				font-weight: bold;
			}

			text.cur {
				// border-bottom: 33rpx #57BE6F solid;
			    // border-image: -webkit-linear-gradient(rgba(87, 190, 111, .4),rgba(87, 190, 111, .1))1 10 1;
			    // border-image: -moz-linear-gradient(rgba(87, 190, 111, .4),rgba(87, 190, 111, .1))1 10 1;
			    // border-image: linear-gradient(rgba(87, 190, 111, .4),rgba(87, 190, 111, .1))1 10 1;
				background:url($mallImg + 'orderBorder.png') no-repeat;
				background-size: 109rpx 31rpx;
				color: #3FB75B;
				background-position: center 70rpx;
			}
		}
	}

	// 订单列表
	.orderList {
		padding:26rpx 24rpx;
		overflow: hidden;

		.order {
			padding: 34rpx 24rpx;
			overflow: hidden;
			background: #FFFFFF;
			border-radius: 20rpx;
			margin-bottom: 24rpx;

			.time_type {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				color: #999;
				border-bottom: 1rpx solid #EEEEEE;
				padding-bottom: 25rpx;
				text:nth-of-type(2) {
					color: #F9A501;
					font-size: 26rpx;
				}
			}

			.order_msg {
				display: flex;
				margin: 30rpx auto;
				justify-content: space-between;

				image {
					width: 180rpx;
					border: 4rpx solid #F4F4F4;
					border-radius: 10rpx;
					margin-right:26rpx;
				}

				.msg {
					width: 70%;
					.goods_name {
						font-size: 30rpx;
						color: #333;
						padding-bottom:6rpx
					}
					.unit{
						font-size:22rpx;
						color:#999;
						margin: 14rpx 0 0;
						// margin: 30rpx 0 42rpx;
						display: inline-block;
						max-width: 200rpx;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						height: 36rpx;
						view{
							border: 1rpx solid #CACACA;
							border-radius:6rpx;
							padding:0 12rpx;
						}
					}
					.money{
						color: #FF4414;
						font-size: 22rpx;
						line-height: 50rpx;
					}
					.moneyItem{
						font-size: 24rpx;
						color: #656565;
					}
					.free{
						color: #FF4414;
						font-size: 32rpx;
						.danwei{
							font-size: 22rpx;
						}
					}
					.num {
						font-size: 24rpx;
						color: #656565;
						// padding-left:42rpx;
					}
				}
			}

			.order_btn {
				text-align: right;
				text{
					border-radius: 10rpx;
					padding:16rpx 40rpx;
					font-size: 26rpx;
					&:nth-of-type(2){
						margin-left: 30rpx;
					}
				}
				.cancel_Btn{
					border: 2rpx solid #CCCCCC;
					color: #656565;
				}
				.pay_Btn{
					border: 2rpx solid #FF4513;
                    color: #FF4513;
				}
				.buy_Btn{
					border: 2rpx solid #57BD6F;
					color: #57BD6F;
				}
				
				.receive_Btn{
					background: #FF0000;
					color: #FFFFFF;
				}
				.aftersale_Btn{
					border: 2rpx solid #FF4513;
					color: #FF4513;
					&.not{
						border: 2rpx solid #999999;
                        color: #999999;
					}
				}
				.delete_Btn{
					border: 2rpx solid #57BD6F;
					color: #57BD6F;
					border-radius: 10rpx;
				}
				.kefu_Btn{
					border: 2rpx solid #DDDDDD;
					color: #656565;
				}
				.writeExpress{
					background: #57BD6F;
					color: #fff;
				}
			}
		}
	}

	.nomore {
		text-align: center;
		font-size: 26rpx;
		color: #000000;
		line-height: 80rpx;
	}
    .moveArea{
		pointer-events: none;
		height: 100%;
		width: 100%;
		position:absolute;
		left:0px;
		top:0px;
		background: transparent;
	}
	.back {
		width: 126rpx;
		height: 126rpx;
		background: #57BE6F;
		border: 8rpx solid #C9EBD1;
		border-radius: 50%;
		position: fixed;
		right: 0;
		bottom: 350rpx;
		text-align: center;
		color: #FFFFFF;
		background: #4eac6d;
		font-size: 28rpx;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
	}

	// 提示信息
	.tipBox {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: rgba($color: #000000, $alpha: 0.7);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;

		>.close {
			width: 70rpx;
			align-self: flex-end;
			padding-right: 30rpx;
			padding-bottom: 10rpx;
		}

		.tip_msg {
			overflow: hidden;
			padding: 40rpx 60rpx;
			justify-content: space-between;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: #FFFFFF;

			image {
				width: 160rpx;
				display: block;
				margin: 0 auto;
			}

			.msg {
				margin: 30rpx auto 0;
				text-align: center;
				padding: 0 120rpx;

				text:nth-of-type(1) {
					display: block;
					line-height: 80rpx;
					font-size: 48rpx;
					font-weight: bold;
					color: #4dab6c;
				}

				text:nth-of-type(2) {
					font-size: 23rpx;
					color: #666;
				}
			}

			// 客服电话
			.customerService {
				padding: 120rpx 0;
				text-align: center;

				text {
					font-size: 33rpx;
					color: #000000;
				}

				.serviceTel {
					color: #4cac6d;
					display: block;
				}
			}

			// 警告
			.warn {
				padding: 0rpx 110rpx;
				text-align: center;

				text:nth-of-type(1) {
					display: block;
					line-height: 80rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #000;
				}

				text:nth-of-type(2) {
					font-size: 23rpx;
					color: #666;
					line-height: 40rpx;
					display: block;
				}
			}

			.btn_box_alert {
				display: flex;
				justify-content: center;
				margin-top: 70rpx;

				button-bg {
					margin: 0 15rpx;
				}
			}
		}
	}
</style>

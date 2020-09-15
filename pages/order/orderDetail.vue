<template>
	<view class="orderDetailWrap">
		<view class="orderTop">
			<view class="orderState">
				<view class="stateLeft">
					 <view class="state" v-if="exchangeList[0].exchangeStatus==-1">
						 <view class="stateTxt">待支付</view>
						 <view class="time" v-if="timeoutText && exchangeList[0].exchangeStatus==-1 ">{{timeoutText}}</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==3">
						 <view class="stateTxt">订单已关闭</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==0">
					    <view class="stateTxt">{{exchangeList[0].expressStatus==1?'待收货':exchangeList[0].expressStatus==0?'待发货':exchangeList[0].expressStatus==2?'已完成':''}}</view>
					    <view class="tip" v-if="exchangeList[0].expressStatus==0">您的订单已开始处理，请您耐心等待...</view>
						<view class="tip" v-if="exchangeList[0].expressStatus==1 && exchangeList[0].expressSendTime">您的订单{{exchangeList[0].expressSendTime|timeSplit}}已经发出， 请注意查收...</view>
						<view class="tip" v-if="exchangeList[0].expressStatus==2">您的订单已签收，祝您购物愉快！</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==1">
						 <view class="stateTxt">交易失败</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==2">
						 <view class="stateTxt">交易处理中</view>
				     </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==4">
						 <view class="stateTxt">退款中</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==5">
						 <view class="stateTxt">退款成功</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==6">
						 <view class="stateTxt">退款失败</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==7">
						 <view class="stateTxt">退款审核中</view>
						 <view class="tip">您的退款申请已开始处理，请您耐心等待...</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==10">
						 <view class="stateTxt">待提交物流信息</view>
						 <view class="tip">请尽快邮寄并填写物流信息</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==8">
						 <view class="stateTxt">退款处理中</view>
					 </view>
					 <view class="state" v-else-if="exchangeList[0].exchangeStatus==9">
						 <view class="stateTxt">退款成功</view>
					 </view>
				</view>
				<view class="stateRight">
					<!-- 待发货 -->
					<image v-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==0" :src="imgUrl + 'toDelivered.png' " class="stateIcon daifahuo" mode="widthFix"></image>
					<!-- 待支付 -->
					<image v-else-if="exchangeList[0].exchangeStatus=='-1'" :src="imgUrl + 'tobePay.png' " class="stateIcon fukuan" mode="widthFix"></image>
					<!-- 待收货 -->
					<image v-else-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==1" :src="imgUrl + 'tohasTransport.png' " class="stateIcon yifahuo" mode="widthFix"></image>
					<!-- 已完成 -->
					<image v-else-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==2" :src="imgUrl + 'toOver.png' " class="stateIcon wancheng" mode="widthFix"></image>
				</view>
			</view>
			<view class="user_msg">
				<text class="name">{{exchangeList[0].realName}}</text>
				<text class="tel">{{exchangeList[0].phoneNum}}</text>
				<view class="address">{{exchangeList[0].address}}</view>
			</view>
		</view>
		<!-- v-if="reply" -->
		<view class="part goods_msg" v-for="(item,index) in exchangeList" :key="index">
			<image v-if="item.goodsUrl" :src="goodsImgRoot + item.goodsUrl|imgUrlSplit" mode="widthFix"></image>			
			<view class="msg">
				<view class="goods_name">{{item.goodsName}}</view>
				<view class="unit">
					<view v-if="item.goodsSpecification">{{item.goodsSpecification}} {{item.goodsUnitName}}</view>
				</view>
				<block>
					<view class="money"> 
						<text class="free">
							<text v-if="item.exchangePay && item.exchangePay!=0 "><text class="danwei">¥</text>{{(item.exchangePay/100)|toFixed|toThousands}} </text>
							<text v-else-if="item.exchangePay&& item.exchangeVpoints!=0 ">+</text>
						    <text v-else-if="item.exchangeVpoints&& item.exchangeVpoints!=0">{{item.exchangeVpoints|toThousands}}<text class="danwei">积分</text></text>
						</text>	
					</view>     
					<view class="num">共{{item.exchangeNum}}件商品</view>
				</block>
			</view>   
		</view>
		
		<view class="part payInfo" >
			<view class="li">
				<view class="left">商品金额</view>   
				<view class="right"  v-if="totalExchangePay">¥{{totalExchangePay|toFixed|toThousands}}</view>
			</view>
			<view class="li">
				<view class="left">商品积分</view>
				<view class="right red" v-if="totalExchangeVpoints">{{totalExchangeVpoints|toThousands}}</view>
			</view>
			<view class="li">
				<view class="left">运费</view>
				<view class="right red small">¥0.0</view>
			</view>
		</view>
		
		<view class="part payInfo">
			<view class="li">
				<view class="left">订单编号：</view>
				<view class="right small">{{exchangeList[0].exchangeId}}<text class="btnCopy" @click="copy(exchangeList[0].exchangeId)">复制</text></view>
			</view>
			<view class="li">
				<view class="left">下单时间：</view>    
				<view class="right gray" v-if="exchangeList[0].exchangeTime">{{(exchangeList[0].exchangeTime)|timeSplit}}</view>
			</view>
			<!-- 纯积分兑换无 -->
			<view  v-if="exchangeList[0].tradeNo">
				<view class="li">
					<view class="left">交易编号：</view>
					<view class="right gray">{{exchangeList[0].tradeNo|tradeSplit}}</view>
				</view>    
			</view>  
			
			<!-- 已发货 -->
			<view v-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==1">
				<view class="li" v-if="exchangeList[0].expressCompany">
					<view class="left">物流公司：</view>
					<view class="right gray">{{exchangeList[0].expressCompany}}</view>
				</view>
				<view class="li" v-if="exchangeList[0].expressNumber">
					<view class="left">物流编号：</view>
					<view class="right small">{{exchangeList[0].expressNumber}}<text class="btnCopy" @click="copy(exchangeList[0].expressNumber)">复制</text></view>
				</view>
			</view>
			<!-- 交易完成 -->
			<view v-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==2">
				<view class="li">
					<view class="left">发货时间：</view>
					<view class="right gray">{{exchangeList[0].expressSendTime|timeSplit}}</view>
				</view>
				<view class="li">
					<view class="left">收货时间：</view>
					<view class="right gray">{{exchangeList[0].expressSignTime|timeSplit}}</view>
				</view>
			</view>
			<!-- 申请了退款 -->
			<view v-if="exchangeList[0].exchangeStatus==4||exchangeList[0].exchangeStatus==5||exchangeList[0].exchangeStatus==6||exchangeList[0].exchangeStatus==7||exchangeList[0].exchangeStatus==8||exchangeList[0].exchangeStatus==9||exchangeList[0].exchangeStatus==10">
				<view class="li" >
					<view class="left">申请时间：</view>
					<view class="right gray" v-if="exchangeList[0].goodsReturnTime">{{exchangeList[0].goodsReturnTime|timeSplit}}</view>
				</view>
			</view>
			
			<!-- 订单退款中 -->
			<view v-show="exchangeList[0].exchangeStatus==8 || exchangeList[0].exchangeStatus==9">
				<view class="li">
					<view class="left">退单物流公司：</view>
					<view class="right">{{exchangeList[0].goodsReturnExpressCompany}}</view>
				</view>
				<view class="li">
					<view class="left">退单物流编号：</view>
					<view class="right">{{exchangeList[0].goodsReturnExpressNumber}}<text class="btnCopy" @click="copy(exchangeList[0].goodsReturnExpressNumber)">复制</text> </view>
				</view>
			</view>
		</view>
		
		<!-- 退款完成 -->
		<view class="part payInfo" v-if="exchangeList[0].exchangeStatus==5 || exchangeList[0].exchangeStatus==9">
			<view class="li">
				<view class="left">退款方式：</view>
				<view class="right smallGray">原返</view>
			</view>
			<view class="li">
				<view class="left">退款成功时间：</view>
				<view class="right smallGray" v-if="exchangeList[0].goodsReturnSuccessTime">{{exchangeList[0].goodsReturnSuccessTime|timeSplit}} </view>
			</view>
		</view>
		
		<!-- 待收货  -->
		<view class="order_btn" v-if="exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==1">
			<text  class="buy_Btn" @click="toGoods(exchangeList[0].goodsId)">再次购买</text>
			<text  class="receive_Btn" @click="confirmShouhuo">确认收货</text>
		</view>
		<!-- 待发货 -->
		<view class="order_btn" v-else-if="item.exchangeStatus==0 && item.expressStatus==0">
			<text class="buy_Btn" @click="toGoods(exchangeList[0].goodsId)">再次购买</text>
		</view>
		<!-- 待支付  -->
		<view class="order_btn" v-else-if="exchangeList[0].exchangeStatus==-1" >
			<text class="cancel_Btn" @click="cancelDingdan">取消订单</text>
			<text class="pay_Btn" @click="payAgain">继续支付</text>
		</view> 
		
		<!-- 订单已关闭 -->
		<view class="order_btn"  v-else-if="exchangeList[0].exchangeStatus==3">
			<text  class="delete_Btn" @click="deleteDingdan">删除订单</text>
			<text  class="buy_Btn" @click="toGoods(exchangeList[0].goodsId)">再次购买</text>
		</view>
		<!-- 已完成 是否可退货标志：0可退货    -->
		<view class="order_btn" v-else-if="exchangeList[0].exchangeStatus==0&&exchangeList[0].expressStatus==2">
			<text  class="aftersale_Btn"  @click="toAfterSale(exchangeList[0].exchangeId)">申请售后</text>
			<text  class="buy_Btn"  @click="toGoods(exchangeList[0].goodsId)">再次购买</text>
		</view>
		
		<!-- 退款相关 -->
		<view class="order_btn" v-else-if="(exchangeList[0].exchangeStatus==0 && exchangeList[0].expressStatus==0)||exchangeList[0].exchangeStatus==4||exchangeList[0].exchangeStatus==5||exchangeList[0].exchangeStatus==6 || exchangeList[0].exchangeStatus==7 || exchangeList[0].exchangeStatus== 8|| exchangeList[0].exchangeStatus==9 || exchangeList[0].exchangeStatus==10">
			<text class="kefu_Btn" @click="linkKefu">联系客服</text>
			<text class="writeExpress" v-if="exchangeList[0].exchangeStatus==10"  @click="toExpress(exchangeList[0].exchangeId)">填写物流信息</text>
		</view>
		
		<!-- 弹框 -->
		<view class="tipBox" :style="{'display':showTip?'flex':'none'}">
			<image :src="imgUrl + 'icon_close.png' " mode="widthFix" v-show="!(warnCancel||warnCancelPay||warnDelete || showReceipt)"
			 class="close" @click="closeTip"></image>
			<view class="tip_msg" :style="{'padding-bottom':safeBottom==0?'40rpx':safeBottom}">
				<!-- 支付相关 -->    
				<view :style="{'display':aboutPay?'block':'none'}">       
					<image :src="tipIcon" mode="widthFix"></image>
					<view class="msg">
						<text :style="{'color':completePay?'#4dab6c':'#d73334'}">{{text1}}</text>
						<text>{{text2}}</text>
					</view>
				</view>
				
				<!-- 确认收货 -->
				<view class="warn" :style="{'display':showReceipt?'block':'none'}">
					<text>要确认收货此订单吗？</text>
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
				<!-- 放弃支付 -->
				<view class="warn" :style="{'display':warnCancelPay?'block':'none'}">
					<text>确定放弃支付吗？</text>
					<text>超过订单支付时效后，订单将会被取消，请尽快完成支付！</text>
				</view>
				<!-- 联系客服 -->
				<view class="customerService" v-if="callService">
					<text>请拨打客服电话</text>
					<text class="serviceTel" @click="call">0311—66600300</text>
				</view>
				
				<!-- 确认/取消收货按钮 -->
				<view class="btn_box_alert" :style="{'display':showReceipt?'flex':'none'}">
					<buttonBg :size="'small'" @confirm="receiveOrder(exchangeList[0].exchangeId)" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
					<buttonBg @confirm="cancelShouhuo" :size="'small'" :btn="'取消'"></buttonBg>
				</view>
				
				<!-- 取消订单按钮 -->
				<view class="btn_box_alert" :style="{'display':warnCancel?'flex':'none'}">
					<buttonBg :size="'small'" @confirm="cancelOrder" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
					<buttonBg @confirm="quxiaoCancelDingdan" :size="'small'" :btn="'取消'"></buttonBg>
				</view>
				<!-- 删除订单按钮 -->
				<view class="btn_box_alert" :style="{'display':warnDelete?'flex':'none'}">
					<buttonBg :size="'small'" @confirm="deleteOrder(exchangeList[0].exchangeId)" :btn="'确定'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
					<buttonBg @confirm="quxiaoDeleteDingdan" :size="'small'" :btn="'取消'"></buttonBg>
				</view>
				<!-- 放弃支付按钮 -->
				<view class="btn_box_alert" :style="{'display':warnCancelPay?'flex':'none'}">
					<buttonBg @confirm="notPay" :size="'small'" :btn="'放弃'" :color="'#4eac6d'" :bgColor="'#dfebdf'"></buttonBg>
					<buttonBg :size="'small'" :btn="'继续参与'" :bgColor="'gradient'"></buttonBg>
				</view>
				<!-- 支付相关按钮 -->
				<view class="btn_box_alert" :style="{'display':aboutPay?'flex':'none'}">
					<buttonBg :size="'small'" @confirm="closeTip" :btn="'查看订单'" :color="'#4eac6d'" :bgColor="'#dfebdf'" v-if="completePay"></buttonBg>
					<buttonBg :size="'small'" :btn="'继续支付'" :bgColor="'gradient'" v-else></buttonBg>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';
	let timer = null;
	export default {
		data() {
			return {
				imgUrl: config.mallImgUrl,
				goodsImgRoot: config.goodsImgRoot,
				requestUrl: config.requestUrl,
				safeHeight: getApp().globalData.safeHeight,
				customBarHeight: getApp().globalData.customBarHeight,
				// safeBottom: getApp().globalData.isIphoneX ? '68rpx' : 0,
				showTip: false, //显示提示窗口
				warnCancel: false, //取消订单
				warnCancelPay: false, //放弃支付
				warnDelete: false, //删除订单
				
				showReceipt:false,// 确认收货
				
				aboutPay: false, //支付相关
				callService: false, //客服弹窗
				completePay: false, //支付完成
				text1: '订单支付失败',
				text2: '您的订单支付失败，请重新发起支付',
				tipIcon: config.mallImgUrl + 'icon_success.png',
				exchangeId: '',
				
				tradeNo:'', //订单编号
				exchangeList:[{}], //兑换商品列表
				totalExchangePay:'0.00',
				totalExchangeVpoints:'0',
				
				reply: '',
				timeoutText: '',
				stop: false,
			}
		},
		onLoad(options) {
			this.exchangeId = options.id;
			this.tradeNo = options.tradeNo;
			
			this.queryOrderDetail();
		},
		onHide() {
			this.stop = true;                    
		},
		onUnload() {
			this.stop = true;
		},
		methods: {
			queryOrderDetail() { //查看订单 详情
				uni.showLoading({
					title: '加载中'
				})
				uni.request({ // getExchangeInfoById
					url: this.requestUrl + '/vpoints/vpointsExchange/getExchangeDetailByTradeNo',
					method: 'POST',
					data: {
						tradeNo:this.tradeNo == 'undefined'?'':this.tradeNo,
						exchangeId: this.exchangeId,
						"projectServerName":'shandongagt'
					}
				}).then(res => {
					uni.hideLoading();
					let [e, r] = res;
					if (r) {
						getApp().globalData.diffTime = Date.parse(new Date()) - r.data.replyTime;
						console.log(Date.parse(new Date()) - r.data.replyTime)
						if (r.data.result.code == 0 && r.data.result.businessCode == 0) { //查询成功
						    this.reply = r.data.reply;
						    this.exchangeList = r.data.reply.exchangeInfoLst;
							// 实际支付金额
							let sum = 0;
							let point = 0;
							for(var i in this.exchangeList){   
								sum += this.exchangeList[i].exchangePay/100
								point += this.exchangeList[i].exchangeVpoints
							}
							this.totalExchangePay = sum;
							this.totalExchangeVpoints = point;
							console.log(this.totalExchangePay)
							console.log(this.totalExchangeVpoints)
							
							console.log(this.exchangeList)
							
							if(this.exchangeList[0].exchangeStatus==-1){
								this.stop = false;
								clearTimeout(timer)
								this.payTimeout();
							}
							// this.reply = r.data.reply;
							// if(r.data.reply.exchangeStatus==-1){
							// 	this.stop = false;
							// 	clearTimeout(timer)
							// 	this.payTimeout();
							// }
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
						}
					} else {
						uni.showModal({
							title: '提示',
							content: '系统繁忙',
							showCancel: false
						})
						console.log(e)
					}
				})
			},
			copy(data){
				wx.showToast({
				  title: '复制成功',
				})
				wx.setClipboardData({
				  data: data, // '点击复制的内容'
				  success: function (res) {
					wx.getClipboardData({   
					  success: function (res) {
						console.log(res.data) // data
					  }
					})
				  }
				})
			},
			confirmShouhuo(){//确认收货
				this.showTip = true;
				this.showReceipt = true;
			},
			cancelDingdan(){ //取消订单
				this.warnCancel=true;
				this.showTip=true;
			},
			deleteDingdan(){ //删除订单
				this.warnDelete = true;
				this.showTip = true;
			},
			linkKefu(){  // 联系客服
				this.callService=true;
				this.showTip=true;
			},
			cancelShouhuo(){ //取消收货
				this.showTip = false;
				this.showReceipt = false;
			},
			quxiaoCancelDingdan(){ //取消取消订单
				this.showTip=false;
				this.warnCancel=false;
			},
			quxiaoDeleteDingdan(){ //取消删除订单
				this.showTip=false;
				this.warnDelete=false;
			},
			notPay(){//放弃支付
				this.warnCancelPay = false;
				this.showTip = false;
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: '0311—66600300',
					complete: res => {
						console.log(res)
					}
				})
			},
			cancelOrder() {
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/cancelExchangeInfo',
					method: 'POST',
					data: {
						tradeNo: this.tradeNo,
						"projectServerName":'shandongagt'
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
								this.queryOrderDetail();
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
			deleteOrder(exchangeId) {
				uni.request({
					url: this.requestUrl + '/vpoints/vpointsExchange/deleteExchangeInfoForUser',
					method: 'POST',
					data: {
						exchangeId: exchangeId,
						"projectServerName":'shandongagt'
					}
				}).then(res => {
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.result.businessCode == 0) { //删除成功
								uni.showModal({
									title: '提示',
									content: '删除订单成功！',
									showCancel:false,
									complete:res=>{
										if(res.confirm){
											uni.redirectTo({
												url:'../order'
											})
										}
									}
								})
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
			
			receiveOrder(exchangeId) { // 确认收货
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
									showCancel: false,
									complete:res=>{
										if(res.confirm){
											uni.redirectTo({
												url:'../order'
											})
										}
									}
								})
							} else {
								uni.showModal({
									title: '提示',
									content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
									showCancel: false
								})
								this.showTip = false;
								this.showReceipt = false;
							}
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
							this.showTip = false;
							this.showReceipt = false;
						}
					} else {
						console.log(e)
						uni.showModal({
							title: '提示',
							content: '系统繁忙',
							showCancel: false
						})
						this.showTip = false;
						this.showReceipt = false;
					}
				})
			},
			closeTip() {
				if (this.completePay) {
					this.queryOrderDetail();
				}
				this.showTip = false;
				this.warnCancel = false;
				this.warnCancelPay = false;
				this.warnDelete = false;
				
				this.showReceip = false;
				
				this.aboutPay = false;
				this.completePay = false;
			},
			
			toGoods(goodsId) { //再次购买
			   uni.navigateTo({
			   	  url: '../goodsDetail/goodsDetail?id=' + goodsId
			   })
			},
			payAgain() { //再次支付
				uni.requestPayment({
					provider: 'wxpay', //服务商
					timeStamp: this.reply.payParam.timeStamp, //时间戳
					nonceStr: this.reply.payParam.nonceStr, //随机字符串，长度为32个字符以下
					package: this.reply.payParam.package, //统一下单接口返回的 prepay_id 参数值,提交格式如：prepay_id=xx
					signType: this.reply.payParam.signType, //签名算法，暂支持 MD5
					paySign: this.reply.payParam.paySign //签名，具体签名方案参见微信小程序支付文档
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
			updatePay() {
				uni.request({
					url: this.requestUrl + '/trade/tradePaying',
					method: 'POST',
					data: {
						tradeNo: this.tradeNo,
						"projectServerName":'shandongagt'
					},
					success: (res) => {
						console.log('tradePaying', res)
					},
					fail: (err) => {
						console.log('tradePaying', err)
					}
				})
			},
			payTimeout() {
				if (this.stop) {
					clearTimeout(timer)
					return false;
				}
				let time = this.exchangeList[0].exchangeTime.split('.')[0];
				let year = time.split(' ')[0].split('-')[0],
					month = time.split(' ')[0].split('-')[1]-1,
					day = time.split(' ')[0].split('-')[2],
					hour = time.split(' ')[1].split(':')[0],
					min = time.split(' ')[1].split(':')[1],
					sec = time.split(' ')[1].split(':')[2];
				console.log(year, month, day, hour, min, sec)
				console.log(getApp().globalData.diffTime)
				let times = Date.parse(new Date(year, month, day, hour, min, sec)) + 1800000 + getApp().globalData.diffTime - Date.parse(new Date());
				times = parseInt(times/1000);
				if(times<0){
					this.stop = true;
					this.exchangeList[0].exchangeStatus = 3;
					return this.timeoutText = `支付超时订单已关闭`;
				}
				console.log(times,times/60)
				this.timeoutText = `支付剩余时间：${parseInt(times/60)}分${times-parseInt(times/60)*60}秒`;
				timer = setTimeout(() => {
					clearTimeout(timer)
					this.payTimeout()
				}, 1000)
			},
			toAfterSale(exchangeId){//申请售后
				uni.navigateTo({
					url:'../afterSale/afterSale?exchangeId=' + exchangeId
				})
			},
			toExpress(exchangeId){
				uni.navigateTo({
					url:'../logistics/logistics?exchangeId=' + exchangeId
				})
			}
		},
		components: {
			buttonBg
		},     
		// filters: {
		// 	toFixed: function(num) {
		// 		if (num) {
		// 			return Number(num).toFixed(2)
		// 		}
		// 	}
		// }
	}
</script>

<style scoped lang="scss">
	.orderDetailWrap{
		min-height: 100%;
		width: 100%;
		background: #F7F7F7;
		position: absolute;
	}
	
	.orderTop{
		background: #FFFFFF;
		padding:50rpx 40rpx;
		.orderState {
			display: flex;
			justify-content: space-between;
			border-bottom: 3rpx solid #F9CF53;
			.stateLeft{
				.state{
					padding-bottom: 36rpx;
					.stateTxt{
						color: #000000;
						font-size: 40rpx;
						padding-bottom: 36rpx;
						&:first-letter{ 
						  color:#FFFFFF;
						  width: 76rpx;
						  height: 76rpx;
						  background: #F9B901;
						  border-radius: 50%;
						  padding: 20rpx 26rpx;
						  margin-right: 6rpx;
						}
					}
					.time{
						font-size: 28rpx;
						color: #FF4514;
					}
					.tip{
						font-size: 28rpx;
						color: #000000;
						line-height: 40rpx;
					}
				}
			}
			.stateRight{
				.stateIcon{
					&.daifahuo{
						width: 97rpx;
					}
					&.fukuan{
						width: 85rpx;
					}
					&.yifahuo{
						width: 156rpx;
					}
					&.wancheng{
						width: 96rpx;
					}
				}
			}
		}
		.user_msg{
			font-size: 26rpx;
			color: #999999;
			line-height: 44rpx;
			padding-top: 35rpx;
			.tel{
				padding-left: 20rpx;
			}
		}
	}
	.part{
		margin:20rpx 24rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 24rpx 20rpx;
	}
	.goods_msg {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
				font-weight: bold;
				color: #333333;
				padding-bottom:6rpx;
			}
			.unit{
				font-size:22rpx;
				color:#999;
				margin: 10rpx 0;
				display: inline-block;
				max-width: 200rpx;
				white-space:nowrap;
				overflow:hidden;
				text-overflow:ellipsis;
				// height: 36rpx;
				view{
					border: 1rpx solid #CACACA;
					border-radius: 6rpx;
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
	
	.payInfo {
		.li{
			display: flex;
			justify-content: space-between;
			border-bottom:1rpx solid #EEEEEE;
			line-height: 100rpx;
			&:nth-last-child(1){
				border-bottom: none;
			}
			.left{
				font-size: 28rpx;
				color: #656565;
			}
			.right{
				font-size: 30rpx;
				color: #000000;
				&.red{
					color:#FF4513;
				}
				&.small{
					font-size: 28rpx;
				}
				&.gray{
					font-size: 26rpx;
					color: #999999;
				}
				&.smallGray{
					font-size: 26rpx;
					color: #656565;
				}
				.btnCopy{
					border: 2rpx solid #8FD9A1;
					border-radius: 23rpx;
					font-size: 26rpx;
					color: #57BD6F;
					padding:11rpx 27rpx;
					margin-left: 20rpx;
				}
			}
		}
	}

	.order_btn {
		// position: fixed;
		// bottom: 0;
		// left: 0;
		z-index: 1;
		width: 100%;
		background: #FFFFFF;
		display: flex;
		height: 120rpx;
		align-items: center;
		justify-content: center;
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

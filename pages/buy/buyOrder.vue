<template>
	 <!-- v-if="cartList.length > 0" -->
	<scroll-view class="content" scroll-y >
		<view class="part address_box">
			<view class="choose_address">
				<view class="add_site" v-if="noAddress" @click="toAddAddress">
					<view class="addIcon">
						<image :src=" imgUrl + 'addSite.png' "  mode="widthFix"></image>
					</view>
					<view class="dizhiTip">添加收件人信息</view>
			    </view>
				<view class="addressInfo" v-else  @click="chooseAddress">
					<view class="siteIcon">
						<image :src="imgUrl + 'siteIcon.png' "  mode="widthFix"></image>
					</view>
					<view class="siteInfo">
						<view class="userInfo">
							<text class="userName">{{username}}</text>
							<text class="userTel">{{tel}}</text>
						</view>
						<view class="userAddress">{{area+'-'+address}}</view>
					</view>
					<view class="moreIcon">
						<image :src="imgUrl + 'more.png' "  mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="part list">
			<view class="item-list" v-for="(item,index) in cartList" :key="index">
				<view class="proImg">
					<image :src="goodsImgRoot + item.goodsUrl.split(',')[0]"  mode="widthFix" class="" ></image>
				</view>
				<view class="proInfo">
					<view class="proName">{{item.goodsName}}</view>
					<view class="unit">
						<view v-if="item.goodsSpecification">{{item.goodsSpecification}} {{item.goodsUnitName}}</view>
					</view>
					<view class="price">
						<text v-if="item.realPay != 0"><text class="danwei">¥</text>{{(item.realPay/100)|toThousands}}</text>
						<text v-if="item.realPay != 0 && item.realVpoints != 0">+</text>
						<text v-if="item.realVpoints != 0">{{item.realVpoints|toThousands}}<text class="danwei">积分</text></text>
					</view>
				</view>
				<view class="goods_num">x{{item.specialChooseNum}}</view>
			</view>
		</view>
		
		<view class="part list free">
			<!--商品金额 -->
			<view class="item">
				<view class="left">商品金额</view>
				<view class="right total_money">¥{{totalMoney|toThousands}}</view>
			</view>
			<view class="item">
				<view class="left">商品积分</view>
				<view class="right">{{totalVpoint|toThousands}}</view>
			</view>
			<view class="item">
				<view class="left">运费</view>
				<view class="right">包邮</view>
			</view>
		</view>
		
		<!-- 结算处 -->
		<view class="btnpart">
			<view class="btn">
				<view class="heji">合计：</view>
				<view class="total">
					<view class="money">¥{{totalMoney|toThousands}}</view>
					<view class="score">{{totalVpoint|toThousands}}积分</view>
				</view>
				 <!-- :class="['gobuybtn',{'grayBuy':cartNone}]" -->
				<view @click="toPay" class="gobuybtn">立即支付</view>
			</view>
		</view>
		
		<!-- 积分不足 -->
		<view class="shortShadow" v-if="shortTip">
			<view class="toastBox">
				<image class="close" @click="shortTip=false" :src="imgUrl + 'close.png' " mode="widthFix"></image>
				<view class="toastContent">
					<view class="title">积分不足</view>
					<view class="txt">当前账户剩余积分</view>
					<view class="txt tip">{{restVpoints|toThousands}}</view>
					<view class="btn" @click="earnVpoint">获取更多积分</view>
				</view>
			</view>
		</view>
		
	</scroll-view>
	<!-- 购物车为空时 -->
	<!-- <view class="nonePart" v-else>
		<image class="noneImg" :src="imgUrl + 'chooseNone.png' " mode="widthFix"></image>
		<view class="noneTxt">还没有选购商品</view> 
	</view> -->
	
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';
	export default {
		data() {
			return {
				imgUrl:config.mallImgUrl,
				goodsImgRoot: config.goodsImgRoot,
				requestUrl: config.requestUrl,
				noAddress: true , // 是否有地址
				username: '',
				tel: '',
				address: '',
				area: '',
				addressId:'',
				
				cartList:[],
				totalMoney:'0.00',	
				totalVpoint:'0', //总需支付积分
				
				restVpoints:'0', // 账户剩余积分

				payParam: '', //接口返回的发起微信支付的参数
				
				fromType:'notChoose',
				shortTip:false, //积分不足 提示
			}
		},
		components: {buttonBg},
		onShow() {
			if(!getApp().globalData.xcxOpenid){//是否有小程序openid
				this.getOpenid().then(res=>{
					console.log(res)
					getApp().globalData.xcxOpenid = res.openid;
					getApp().globalData.sessionKey = res.session_key;
				})
			}
			
			if(!getApp().globalData.openid){
				this.$store.dispatch('getOpenid').then(res => {
					let [e, r] = res;
					if (r) { //有openid
						getApp().globalData.openid = r.data.openid;
					} else { //重新获取
						console.log(e)
						uni.navigateTo({
							url: '../getOpenid/getOpenid?type=openid'
						})
					}
				})
			}
			// 购物车数据
			uni.getStorage({
			    key: 'cart_data',
				complete: (res) => {
					console.log(res.data)
					this.cartList = res.data;
					if(this.cartList == '' || this.cartList == undefined ){
						this.cartList = []
					} else {
						for(var i in this.cartList){
							this.cartList[i].exchangeNum = this.cartList[i].specialChooseNum
						}
					}
				}
			});
			
			console.log(this.fromType);
			this.defaultAddressGet();
			this.getRestVpoints(); // 获取剩余积分
		},
		onLoad(){
		},
		methods: {
			earnVpoint(){
				uni.switchTab({
					url:'../score/score'
				})
			},
			async getRestVpoints() {
				var params = {
					"openid": getApp().globalData.openid,
				};
				var jo = await requestPost('/user/userInfo',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							this.restVpoints = jo.reply.accountInfo.surplusVpoints; //剩余积分
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
			async defaultAddressGet() {
				var params = {
					"openid": getApp().globalData.openid,
					"projectServerName":'shandongagt'
				};
				var jo = await requestPost('/vpoints/vpointsAddress/getDefaultAddress',params)
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply && this.fromType != 'choose' && (jo.reply.addressId || jo.reply.username) ){ // 有默认地址
						    console.log('啊啊啊')
						    this.noAddress = false;     // 有地址
							this.addressId = jo.reply.addressId
							this.username = jo.reply.userName
							this.tel = jo.reply.phoneNum
							this.address = jo.reply.address
							this.area = jo.reply.province + jo.reply.city + jo.reply.county
							return 
						} else if (this.fromType == 'choose' || getApp().globalData.address){ 
							this.noAddress = false;
							this.addressId = getApp().globalData.addressId?getApp().globalData.addressId:''; //授权没地址
							this.username = getApp().globalData.address.username;
							this.tel = getApp().globalData.address.tel;
							this.area = getApp().globalData.address.area;
							this.address = getApp().globalData.address.address;	
						    return
						} else {
							this.noAddress = true;
						}
					} else {
						if(jo.result.msg == '用户不存在'){
							return
						} else {
							uni.showModal({
							  title: '提示',
							  content: jo.result.msg,   
							})
						}
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
            toAddAddress(){
				uni.navigateTo({
					url: '../address/addressAdd?operate='+ 'add'
				})
			}, 
			chooseAddress() { //去选择地址
				uni.navigateTo({
					url: '../address/addressList?fromType=' + 'choose'
				})
			},
			
			toPay(){
				if (this.username == '' || this.tel == '' || this.address == '') {
					uni.showModal({
						title: '提示',
						content: "请选择收货地址",
						showCancel: false
					})
				} else if(this.restVpoints < this.totalVpoint) {
					this.shortTip = true;
				} else {
					this.paymentApi()
				}
			},
			paymentApi() {
				uni.request({ // 我方下单
					url: this.requestUrl + '/vpoints/vpointsExchange/goodsExchangeForCart',
					method: "POST",
					data: {
						"openid": getApp().globalData.openid,
						"appletOpenid": getApp().globalData.xcxOpenid,
						"shopCartList": this.cartList,
						"payMoney":this.totalMoney,
						"realVpoints":this.totalVpoint, // 支付积分
						"exchangeFlag": 1, //兑换标识：1单瓶兑换，2拼团
						"realName": this.username,
						"phoneNum": this.tel,
						"province": this.area.split('-')[0],
						"city": this.area.split('-')[1],
						"conty": this.area.split('-')[2],
						"address": this.area+'-'+this.address,
						"addressId": getApp().globalData.addressId, //详细地址Id 实物兑换必填
						"projectServerName":'shandongagt'
					}
				}).then(res => {
					let [e, r] = res;
					if (r) {
						if (r.data.result.code == 0) {
							if (r.data.result.businessCode == 0) { // 下单成功 （清空本地购物车）
								uni.removeStorageSync('cart_data'); //清除存储的购物车
								if(r.data.reply.payParam){ // 要支付金额 发起支付
									this.payParam = r.data.reply.payParam;
									this.reqPayment()
								} else {  // 纯积分兑换
									uni.redirectTo({ //支付成功
										url:'./paySuccess'
									}) 
								}
							} else {  //下单失败
							    if(r.data.result.businessCode == '100001'){
									uni.showModal({
										title: '提示',
										content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
										showCancel: false
									})
								} else {
									uni.showModal({
										title: '提示',
										content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
										confirmText:'去购物车',
										showCancel: false, // 取消按钮不显示
										complete: (res) => {
											if (res.confirm) {
											    console.log('用户点击确定');
												// 下单失败 跳转商城页面
												uni.switchTab({
													url:'../mall/mall'
												})
											} else if (res.cancel) {
											    console.log('用户点击取消');
											}
										}
									})
								}
							}
						} else {
							uni.showModal({
								title: '提示',
								content: r.data.result.msg ? r.data.result.msg : '系统开了个小差',
								showCancel: false
							})
						}
					} else {
						uni.showModal({
							title:'商品提示',
							content:'系统繁忙',
							showCancel:false
						})
						console.log('getPayId', e)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			reqPayment() {
				uni.requestPayment({
					provider: 'wxpay', //服务商
					timeStamp: this.payParam.timeStamp, //时间戳
					nonceStr: this.payParam.nonceStr, //随机字符串，长度为32个字符以下
					package: this.payParam.package, //统一下单接口返回的 prepay_id 参数值,提交格式如：prepay_id=xx
					signType: this.payParam.signType, //签名算法，暂支持 MD5
					paySign: this.payParam.paySign //签名，具体签名方案参见微信小程序支付文档
				}).then(res => {
					console.log(res)
					let [e,r] = res;
					if(r){//支付完成
						this.updatePay();//调接口更改为支付中
						if(r.errMsg.indexOf('ok')!=-1){
							this.payParam = '';
							// uni.requestSubscribeMessage({ //发起订阅消息
							// 	tmplIds: ['2wEMDtfgw0oK84RygiTGGP4xE3H_A08N7aXTsFhamGY'],
							// 	complete: res => {
							// 		console.log(res)
							// 	}
							// })
							
							uni.showModal({
							    title: '提示',
							    content: '订单支付完成',
								complete: res => {
									uni.redirectTo({ //支付成功
										url:'./paySuccess'
									}) 
									// uni.redirectTo({ //待收货
									// 	url:'../person/order/order?type=0'
									// }) 
								}
							});
						}else{//支付失败
							uni.showModal({
								title: '提示',
								content: '订单支付失败',
								complete: res => {
									uni.redirectTo({//待支付
										url: '../order/order?type=4'
									});
								}
							});
						}
					}else{
						console.log(e)
						if(e.errMsg.indexOf('cancel')!=-1){//取消支付跳转到订单列表的待支付 状态4
							uni.redirectTo({//待支付
								url: '../order/order?type=4'
							});
						}
					}
				})
			},
			updatePay(){
				uni.request({
					url:this.requestUrl + '/trade/tradePaying',
					method:'POST',
					data:{
						tradeNo:this.payParam.tradeNo,
						"projectServerName":'shandongagt'
					},
					success: (res) => {
						console.log('tradePaying',res)
					},
					fail: (err) => {
						console.log('tradePaying',err)
					}
				})
			},
			
			async getOpenid() {
				let xcxOpenid = await this.$store.dispatch('getXcxOpenid')
				uni.setStorage({
					key: 'xcxOpenid',
					data: xcxOpenid  
				})
				return xcxOpenid
			},
		},
		computed: {
			numOfCart(){
				let that = this;
				var totalMoney = 0;
				var totalVpoint = 0;
				for(var i in that.cartList){
					totalMoney += that.cartList[i].realPay/100 * that.cartList[i].specialChooseNum;
					totalVpoint += that.cartList[i].realVpoints * that.cartList[i].specialChooseNum;
				}
				that.totalMoney = parseFloat(totalMoney).toFixed(2);
				that.totalVpoint = totalVpoint;
			},
		},	
	}
</script>

<style lang="scss">
	.part{
		margin:0 20rpx;
	}
	.content{
		width: 100%;
		height: 100%;
		background-color: #F8F8F8;
		// background-color: pink;
		position: relative;
		
		padding-bottom: 130rpx;
		.address_box{
			color: #FFFFFF;
			overflow: hidden;
			// background: #4eac6d;
			background: #fff;
			border-radius: 20rpx;
			padding: 34rpx 20rpx 30rpx;
			margin:20rpx;
			.choose_address{
				display: flex;
				flex-direction: column;
				justify-content: center;
				background-size: 23rpx auto;
				.add_site{
					margin:0 auto;
					.addIcon{
						text-align: center;
						image{
							width: 60rpx;
						}
					}
					.dizhiTip{
						font-size: 30rpx;
						font-weight: 400;
						color: #333;
						line-height: 44px;
					}
				}
				.addressInfo{
					display: flex;
					justify-content: space-between;
					.siteIcon{
						display: flex;
						align-items: center;
						image{
							width:64rpx;
							align-items: center;
						}
					}
					.siteInfo{
						// margin-left: -16%;
						width: 82%;
						.userTel{
							color:#999;
							font-size: 26rpx;
							padding-left: 40rpx;
						}
						.userName{
							color:#333;
							font-size: 30rpx;
						}
						.userAddress{
							color:#333;
							font-size:28rpx;	
							padding:18rpx 0;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
					.moreIcon{
						display: flex;
						align-items: center;
						image{
							width:15rpx;
							align-items: center;
						}
					}
				}
			}
		}
		//下单商品列表
		.list{
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
			background-color: #FFFFFF;
			// padding-bottom: 110%; // 50rpx
			.item-list {
				padding:30rpx 20rpx;
				border-bottom: 1rpx solid #eee;
				display: flex;
				&:nth-last-child(1){
					border-bottom:none;
				}
				.proImg{
					flex-shrink:1;
					width: 170rpx;
					height: 170rpx;
					border:2rpx solid #e5e5e5;
					border-radius:10rpx;
					position: relative;
					image{
						width: 134rpx;
						position: relative;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
				.proInfo{
					width:50%;
					flex-shrink:2;
					padding-left: 20rpx;
					.proName{
						width:200rpx;
						font-size:30rpx;
						font-weight:500;
						color:#333;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
					}
					.unit{
						font-size:22rpx;
						color:#999;
						margin:24rpx 0;
						display: inline-block;
						max-width: 400rpx;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						height: 36rpx;
						view{
							border:1rpx solid #CACACA;
							border-radius:6px;
							padding: 0 12rpx;
						}
					}
					.price{
						font-size:32rpx;
						font-weight:500;
						color:#FF4514;
						.danwei{
						  font-size:22rpx;	
						}
					}
				}
				.goods_num{
					width:20%;
					flex-shrink:3;
					margin-top: 20%;
					font-size: 26rpx;
					color: #999;
					text-align: right;
				}
			}
			
			&.free{
				padding:0 28rpx;
				.item{
					height:90rpx;
					line-height: 90rpx;
					display: flex;
					justify-content: space-between;
					font-size:28rpx; 
					color:#666;
					border-bottom: 1px solid #EEE;
					&:nth-last-child(1){
						border-bottom:none;
					}
					.right{
						color:#FF4514;
						&.total_money{
							color: #010101;
						}
					}
				}
			}
			&.msgArea{
				padding:0 28rpx;
				margin-bottom:130rpx;
				.message{
					height:190rpx;
					font-size:26rpx;
					color:#000;
					padding-top: 30rpx;
					.txtarea{
						margin-top: 20rpx;
						width: 80%;
						height: auto;
						min-height: auto !important;
					}
				}
			}
		}
	}
	
	.nonePart{
		width: 100%;
		position: relative;
		top: 40%; /*偏移*/
		transform: translateY(-40%);
		.noneImg{
			width: 340rpx;
			padding:44rpx 0; 
			margin:0 auto;
			display: block;
		}
		.noneTxt{
			width:100%;
			text-align: center;
			font-size:36rpx;
			font-weight:bold;
			color:#333;
			opacity:0.8;
		}
	}
	// 买单按钮
	.btnpart{
		width: 100%;
		height: 120rpx;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		box-shadow: 2rpx 2rpx 10rpx #333333;
		line-height: 120rpx;
		z-index: 10;
		// 买单按钮
		.btn{
			width: 100%;
			height: 120rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
	        // box-shadow: 0px -4px 8px 0px rgba(193, 193, 193, 0.2);
            box-shadow: 0px -4px 8px 0px rgba(193, 193, 193, 0.2);
			line-height: 120rpx;
			z-index: 3;
			.heji{
				padding-left: 42rpx;
				font-size: 26rpx;
				color: #333;
			}
			.total{
				width: 54%;
				font-size:30rpx;
				font-weight:500;
				color:#010101;
				.money{
					font-size:30rpx;
					font-weight:500;
					color:#010101;
					line-height:82rpx;
				}
				.score{
					font-size:26rpx;
					font-weight:400;
					color:#F9291D;
					line-height:6rpx;
				}
			}
			.gobuybtn{
				border-radius:0;
				background:#FABA01;
				color: #FFFFFF;
				font-size: 36rpx;
				width: 205rpx;
				height: 120rpx;
				margin: 0;
				padding: 0;
				line-height: 120rpx;
				text-align: center;
			}
		}
	}
	.shortShadow{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.6);
		z-index: 999;
		.toastBox {
		    position: absolute;
		    top: 50%;
		    left: 50%;
		    transform: translate(-50%,-50%);
		    -webkit-transform: translate(-50%,-50%);
		    -moz-transform: translate(-50%,-50%);
			// background: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			background-image: url($mallImg + 'toastBg.png');
			background-repeat: no-repeat;
			background-position: 0;
			background-size: 100% 100%;
			position: relative;
			color: #fff;
			width: 551rpx;
			height: 442rpx;	
			.close{
				width: 49rpx;
				position: absolute;
				top: -10%;
				right: -8%;
				display: block;
			}
			.toastContent{
				text-align: center;
				.title{
					font-size:38rpx;
					font-weight:400;
					color:#fff;
					line-height:80rpx;
					text-align: center;
					padding-bottom: 115rpx;
				}
				.txt{
					font-size: 30rpx;
					color: #666;
					line-height: 62rpx;
					&.tip{
						font-size: 40rpx;
						color: #F9291D;
						margin:0 0 40rpx;
					}
				}
				.btn{
					width: 397rpx;
					height: 75rpx;
					background: #FABA01;
					border-radius: 20rpx;
					text-align: center;
					line-height: 75rpx;
					font-size: 30rpx;
					color: #FFF;
					margin:0 auto;
				}
			}
		}
	}
	
</style>

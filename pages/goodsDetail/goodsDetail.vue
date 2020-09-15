<template>
	<view class="content" :class="cartShow == true ? 'prevent' : ''">
		<view class="banner">
			<swiper :autoplay="true" :interval="3000" :duration="1000" @change="change" circular="true">
				<swiper-item v-for="(item,index) in imgList" :key="index">
					<view class="swiper-item">
						<image :src="goodsImgRoot+item" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
			<text class="banner_length">{{cur}}/{{imgList.length}}</text>
		</view>
		<view class="description">
			<view class="left">
				<view class="goods_price" v-if="reply">
					<text :class="['price', {'unusual':reply.goodsStatus == 1 || reply.goodsStatus == 2  || (reply.goodsStatus == 0 && reply.goodsRemains == 0)}]">
					    <text v-if="reply.realPay != 0"><text class="danwei">¥</text>{{reply.realPay/100|toThousands}}+</text>
					    <text v-if="reply.realVpoints != 0">{{reply.realVpoints|toThousands}}<text class="danwei">积分</text></text>
					</text>
					<text class="normalPrice" v-if="reply.goodsMoney>reply.realPay/100">¥{{reply.goodsMoney|toThousands}}</text>
				</view>
				<view class="proName">{{reply.goodsName}}</view>
				<view class="surplus">剩余{{reply.goodsRemains}}件</view>
			</view>
			<view class="right">
				<view class="mail" @click="showMail">包邮</view>
				<!-- "goodsStatus":"商品状态：0正常，1暂停兑换，2下架", -->
				<block v-if="reply.goodsStatus == 1 ">
					<view class="cartBtn unusual">{{reply.pauseExchangeTips}}</view>
				</block>
				<block v-else-if="reply.goodsStatus == 2 ">
					<view class="cartBtn unusual">商品已下架</view>
				</block>
				<!-- //goodsRemains 商品剩余个数 -->
				<block v-else-if="reply.goodsStatus == 0 && reply.goodsRemains == 0 "> 
					<view class="cartBtn unusual">商品已售罄</view>
				</block>
				<block v-else>
					<view class="cartBtn" @click="addSku()">加入购物车</view>
				</block>
			</view>
		</view>
		<view class="des_content">
			<text class="title">商品详情</text>
			<u-parse v-if="reply&&reply.goodsContent" :content="reply.goodsContent"></u-parse>
		</view>
		
		<!-- 购物车内容  -->
		<view class="cart" v-if="cartShow" >
			<image :src="imgUrl + 'close.png' " mode="widthFix" class="close" @click="cartShow=false"></image>
			<view class="list_box">
				<view class="title">
					<text>购物车</text>
					<view class="delete" @click="emptyCart">
						清空
					</view>
				</view>
				
				<view class="item-list" v-for="(cartItem,index) in cartList" :key="index">
					<view class="proImg">
						<image :src="goodsImgRoot + cartItem.goodsUrl.split(',')[0]"  mode="widthFix" ></image>
					</view>
					<view class="proInfo">
						<view class="proName">{{cartItem.goodsName}}</view>
						<view class="unit">
							<view v-if='cartItem.goodsSpecification'>{{cartItem.goodsSpecification}}{{cartItem.goodsUnitName}}</view>
						</view>
						<!-- <view class="normalPrice">市场价：{{cartItem.goodsMoney}}元</view> -->
						<view class="price">
							<text v-if="cartItem.realPay != 0 "><text class="danwei">¥</text>{{(cartItem.realPay/100)|toThousands}}+</text>
						    <text v-if="cartItem.realVpoints != 0 ">{{cartItem.realVpoints|toThousands}}<text class="danwei">积分</text></text>
						</view>
					</view>
					<view class="goods_num">
						<text class="reduce" @click="reduceFuc(index)"></text>
						<text class="num">{{cartItem.specialChooseNum}}</text>
						<text class="add" @click="increaseFuc(index)"></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 结算处 -->
		<view class="computePart">
			<view class="send_box">
				<block v-if="cartNone">
					<image :src="imgUrl + 'detailBox.png' " mode="widthFix"></image>
				</block>
				
				<view v-else @click="seeCart">
					<image :src="imgUrl + 'detailBox.png' " mode="widthFix"></image>
					<text>{{cartNum}}</text>
				</view>
			</view>
			<view class="btn">
				<view class="total">
					<view class="money" v-if="!cartNone">¥{{totalMoney|toThousands}}</view>
					<view class="score" v-if="!cartNone">{{totalVpoint|toThousands}}积分</view>
				</view>
				<view @click="goBuy" :class="['gobuybtn',{'grayBuy':cartNone}]">去结算</view>
			</view>
		</view>
		
		<!-- 包邮 -->
		<view class="mailShadow" v-if="mailShadow">
			<view class="toastBox">
				<image class="close" @click="mailShadow=false" :src="imgUrl + 'close.png' " mode="widthFix"></image>
				<view class="toastContent">
					<view class="title">运费说明</view>
					<view class="txt"> · 运费说明： </view>
					<view class="txt tip">按订单收取，各商品不同，具体见页面公示。 </view>
					<view class="txt"> · 包邮政策： </view>
					<view class="txt tip">按商品每单满一定金额则免运费，各商品不同，具体见页面公示。 </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	export default {
		data() {
			return {
				imgUrl: config.mallImgUrl,
				goodsImgRoot: config.goodsImgRoot,
				mailShadow:false,
				cur: 1,
				safeBottom: getApp().globalData.isIphoneX ? '68rpx' : 0,
				ww:'', //可视窗口宽度
				hh:'', //可视窗口宽度
				
				reply: '',
				imgList: [],
				num: 1,
				

				cartNone:true,
				cartShow:false, //展示购物车
				cartList:[],   //购物车数据
				cartNum: 0 ,        //购物车角标数
				totalMoney:'0.00',
				totalVpoint:'0',
				
				type:'', //选项卡
			}
		},
		onReady() {

		},
		onShow() {
			if(!getApp().globalData.openid){
				this.$Store.dispatch('getOpenid').then(res => {
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
						this.cartList = [];
						this.cartNone = true; //购物车中为空
					} 
				}
			});
		},
		onShareAppMessage() {
			return {
				title: '青岛啤酒乐享河北',
				path: '/pages/index/index'
			}
		},
		onLoad(options) {
			this.goodsId = options.id;
			this.queryGoodsMsg(options.id);
			
			this.type = options.type;
		},
		onUnload() {
			var pages = getCurrentPages();
			var prepage = pages[pages.length - 2]; //上一个页面
			console.log(prepage.$vm)
			console.log(this.type)
			prepage.$vm.categoryParent = this.type;
			// uni.navigateBack({
			//    delta: 1
			// })
		},
		methods: {
			showMail(){
				this.mailShadow = true;
			},
			change(e) { //轮播商品
				this.cur = e.detail.current + 1;
			},
			/* 点击减号 */
			cutSku() {  
				var num = this.reply.specialChooseNum;  
				// 如果大于1时，才可以减  
				if (num >= 1) {  
					num --;  
				}  
				// if(num <= 0){
				// 	this.isZero = true;
				// }
				// 将数值与状态写回  
				this.reply.specialChooseNum = num;
				// 删除购物车的数组中
				for(var i in this.cartList){
					if(this.reply.goodsId == this.cartList[i].goodsId){
						this.cartList[i].specialChooseNum = num;
						if( this.cartList[i].specialChooseNum == 0){
							this.cartList.splice(i,1);
						}
					}
				}
				if(this.cartList.length == 0){
					this.cartNone = true;
				}
				console.log(this.cartList)
				uni.removeStorageSync('cart_data')
				uni.setStorage({  // 存储本地
				    key: 'cart_data',
				    data: this.cartList,
					complete: (res) => {
						console.log('存储本地购物车');
					}
				});
			},  
			/* 点击加号 */
			addSku(){  
				var num = this.reply.specialChooseNum;  
				
				if(num>=50){
					uni.showToast({
					    title: '已达添加上限',
					    duration: 2000,
						icon:'none'
					});
					return 
				}
				if(this.cartList.length == 20){
					uni.showToast({
					    title: '已达可添加品类上限',
					    duration: 2000,
						icon:'none'
					});
					return 
				}
				// 自增1
				num ++;
				// 将数值与状态写回  
				this.reply.specialChooseNum = num;
				
				// 放入购物车的数组中 
				if(this.cartList.length == 0 ){
					this.cartList.unshift(this.reply);
				} else {
					for(var i in this.cartList){
						if(this.reply.goodsId == this.cartList[i].goodsId){
							this.cartList[i].specialChooseNum = num;
							console.log(this.cartList[i].specialChooseNum)
						} else {
							this.cartList.unshift(this.reply);
						}
					}
				}
				let obj = {};
				var arr = this.cartList.reduce((item, next) => {
				  if (!obj[next.goodsId]) {
					item.push(next);
					obj[next.goodsId] = true;
				  }
				  return item;
				}, []);
				console.log(arr);
				this.cartList = arr;
				uni.removeStorageSync('cart_data')
				console.log(this.cartList)
				uni.setStorage({  // 存储本地
				    key: 'cart_data',
				    data: this.cartList,
					complete: (res) => {
						console.log('存储本地购物车');
					}
				});
			}, 
			async queryGoodsMsg(goodsId) { //查询商品详情
				uni.showLoading({
					title: '加载中'
				})
				var params = {
					"goodsId": goodsId,
					"openid": getApp().globalData.openid,
				};
				var jo = await requestPost('/vpoints/vpointsShop/getGoodsDetail', params);
				console.log('首页数据' + jo); // reply result replyTime
				uni.hideLoading();
				if (jo.reply) {
					if (jo.result.code == 0) {
						this.imgList = jo.reply.goodsUrl.split(',');
						this.reply = jo.reply;
						// 将购物车的数量展示
						if(this.cartList.length != 0 ){
							this.cartNone = false; //购物车有物
							for(var i in this.cartList){
								if(this.reply.goodsId == this.cartList[i].goodsId){
									this.reply.specialChooseNum = this.cartList[i].specialChooseNum;
								}
							}
						} else {
							this.cartNone = true;
						}
					} 
				} else {
					console.log(jo)
				}
			},
			seeCart(){ //查看购物车
				this.cartShow = true;
			},
			closeCart(){ //关闭购物车
				this.cartShow = false;
			},
			// 购物车中商品操作
			emptyCart(){
				uni.showModal({
				    title: '温馨提示',
				    content: '您确定要删除吗？',
				    success: (res) => {
				        if (res.confirm) {
				            console.log('用户点击确定');
							this.cartList.splice(0,this.cartList.length);
							console.log(this.cartList);    // [] 页面清除
							this.reply.specialChooseNum = 0; // 显示【添加购物车】
							uni.removeStorageSync('cart_data') //本地存储中清除
							this.cartShow = false ;  // 不展示购物车
							this.cartNone = true;
							uni.showToast({
							    title: '已成功删除',
							    duration: 2000,
								icon:'none'
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			reduceFuc(index){ //购物车中某商品的减号
				var num = this.cartList[index].specialChooseNum;
				num --;  //减去1
				console.log(num)
				if(num <= 0 ){
					console.log('000')
					this.deleteOne(index);
				} else {
					// 购物车改变此条商品
					this.cartList[index].specialChooseNum = num;
					// 若是此页面数据 同步改变
					if(this.cartList[index].goodsId = this.reply.goodsId){
						this.reply.specialChooseNum = num 
					}
				}
				
				console.log(this.cartList)
				uni.removeStorageSync('cart_data')
				uni.setStorage({  // 存储本地
				    key: 'cart_data',
				    data: this.cartList,
					complete: (res) => {
						console.log('存储本地购物车');
					}
				});
			},
			
			increaseFuc(index){
				var num = this.cartList[index].specialChooseNum;
				num ++;
				if(num < 51 ){
					// 购物车中添加商品数量
					this.cartList[index].specialChooseNum = num;
				} else if (num >= 51) {
					uni.showToast({
					    title: '已达添加上限',
					    duration: 2000,
						icon:'none'
					});
					return 
				}
				if(this.reply.goodsId == this.cartList[index].goodsId){ //当前页面修改
					// 将数值与状态写回商品列表
					this.reply.specialChooseNum = num;
				}
				uni.removeStorageSync('cart_data')
				uni.setStorage({  // 存储本地
				    key: 'cart_data',
				    data: this.cartList,
					complete: (res) => {
						console.log('存储本地购物车');
					}
				});
			},
			deleteOne(index){
				uni.showModal({
				    title: '温馨提示',
				    content: '您确定要删除吗？',
				    success: (res) => {
				        if (res.confirm) {
				            console.log('用户点击确定');
							if(this.reply.goodsId == this.cartList[index].goodsId){
								this.reply.specialChooseNum = 0;
							}
							this.cartList.splice(index,1); //页面移除
							uni.showToast({
							    title: '已成功删除',
							    duration: 2000,           
								icon:'none'
							});
							// 存储移除
							if(this.cartList.length == 0){  //移除后购物车变空了~~
								this.cartShow = false ;  // 不展示购物车
								this.cartNone = true;  //购物车无物
								// this.isZero = true;
								uni.removeStorageSync('cart_data') //存储移除
							} else {
								uni.removeStorageSync('cart_data') //存储移除
								this.cartList = this.cartList;
								console.log(this.cartList)
								uni.setStorage({  // 存储本地
								    key: 'cart_data',
								    data: this.cartList,
									complete: (res) => {
										console.log('删除一条购物车数据');
									}
								});
							}
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			goBuy(){  //去结算
				if(this.cartList.length == 0){
					uni.showToast({
					    title: '您还没有选购商品',
					    duration: 2000,
						icon:'none'
					});
					return
				} else {
					uni.navigateTo({
						url:'../buy/buyOrder'
					})
				}
				// uni.navigateTo({
				// 	url:'../buy/buyOrder'
				// })
			},
		},
		mounted(){

		},
		components: {
			buttonBg,
			uParse
		},
		computed:{
			cartSettle(){
				let that = this;
				var cartNum = 0;
				var totalMoney = 0;
				var totalVpoint = 0;
				console.log('计算计算' + that.cartList);
				for(var i in that.cartList){
					cartNum += parseInt(that.cartList[i].specialChooseNum);
					totalMoney += that.cartList[i].realPay/100 * that.cartList[i].specialChooseNum;
					totalVpoint += that.cartList[i].realVpoints * that.cartList[i].specialChooseNum;
				}
				console.log('oooo')
				that.cartNum = cartNum;
				that.totalMoney = parseFloat(totalMoney).toFixed(2);
				that.totalVpoint = totalVpoint;
				if(that.cartNum > 0 || that.totalMoney > 0){  //购物车有物
					that.cartNone = false; 
				} else {
					that.cartNone = true;
				}
				
				if(that.cartNum>=100){ //数量超过100    
					that.cartNum = '99+';
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.content{
		&.prevent {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			overflow: hidden;
		}
	}
	.banner {
		width: 100%;
		overflow: hidden;
		position: relative;

		.banner_length {
			position: absolute;
			bottom: 80rpx;
			right: 60rpx;
			// color: #FFFFFF;
			color: #000000;
			font-size: 22rpx;
		}
		.tip{
			width: 100%;
			// height: 172rpx;
			min-height: 152rpx;
			text-align: center;
			color: #fff;
			font-size: 38rpx;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			bottom: 0rpx;
			// line-height: 100rpx;
			font-weight: 500;
			letter-spacing: 4rpx;
			&.oneTip{
				line-height: 152rpx;
			}
		}
	}

	swiper {
		height: 658rpx;
		overflow: hidden;
		background: #FFFFFF;
		.swiper-item image {
			width: 100%;
		}
	}

	// 商品描述
	.description {
		overflow: hidden;
		padding: 0 0 0 40rpx;
		background: #57BE6F;
		position: relative;
		display: flex;
		.left{
			width: 70%;
			flex-shrink: 1;
			line-height: 60rpx;
			padding: 14rpx 0;
			.goods_price{
				.price{
					font-size:42rpx;
					font-weight:500;
					color:#FFF79E;
					padding-right: 23rpx;
					&.unusual{
						color:#B4DEBE;
					}
					.danwei{
						font-size:30rpx;
					}
				}
				.normalPrice{
					height: 40rpx;
					line-height: 40rpx;
					background:#fff;
					border-radius:20rpx;
					font-size:26rpx;
					font-weight:400;
					text-decoration:line-through;
					color:#57BE6F;
					text-align: center;
					padding: 0 10rpx;
				}
			}
			.proName{
				font-size:32rpx;
				font-weight:500;
				color:#FFF;
			}
			.surplus{
				font-size:26rpx;
				font-weight:400;
				color:#A9E5B7;
			}
		}
		.right{
			width: 30%;
			flex-shrink: 2;
			float: right;
			.mail{
				font-size:24rpx;
				font-weight:400;
				text-decoration:underline;
				color:#026118;
				text-align: right;
				margin: 40rpx;
			}
			.cartBtn{
				line-height:86rpx;
				background:#FFF;
				border-radius: 43rpx 0 0 43rpx;
				font-size:32rpx;
				font-style:italic;
				color:#FFA032;
				text-align: center;
				&.unusual{
					color:#999;
				}
			}
		}
	}
	.des_content {
		margin: 70rpx auto 120rpx;
		.title {
			font-size: 31rpx;
			color: #000;
			padding: 0 16rpx;
			line-height: 31rpx;
			display: block;
			margin-bottom: 20rpx;
			font-weight: 500;
			// background:#ccc;
			padding:0px 20px; 
			text-align: center;
			&:before{
				display: inline-block;
				position: relative;
				top:-7rpx;
				right: 20rpx;
				content: "";
				width: 200rpx;
				height: 0rpx;
				border: 1rpx solid #E6E6E6;
			}
			&:after{
				display: inline-block;
				position: relative;
				top:-7rpx;
				left: 20rpx;
				content: "";
				width: 200rpx;
				color: #E6E6E6;
				height: 0rpx;
				border: 1rpx solid #E6E6E6;
			}
		}
		image {
			width: 100%;
		}
	}
	
    .cart{  //购物车
    	width: 100%;
    	height: 100%;
    	position: fixed;
    	display: flex;
    	flex-direction: column;
    	justify-content: flex-end;
    	background-color: rgba($color: #000000, $alpha: .4);
    	z-index: 10;
    	bottom: 120rpx;
    	.close{
    		align-self: flex-end;
    		width: 49rpx;
    		margin-right: 25rpx;
			margin-bottom: 20rpx;
    	}
    	.list_box{
    		width: 100%;
    		max-height: 50%;
    		padding-bottom:80rpx;
    		box-sizing: border-box;
    		background: #fff;
    		border-radius: 44rpx 44rpx 0 0;
    		overflow-x: hidden;
    		-webkit-overflow-scrolling:touch;
    		.title{
    			display: flex;
    			justify-content: space-between;
    			line-height: 88rpx;
    			color: #333;
    			font-size: 28rpx;
				border-radius: 44rpx 44rpx 0 0;
    			text{
    				padding:0 40rpx;	
    			}
    			.delete{
    				font-size: 26rpx;
    				color:#999;
    				padding-right: 40rpx;
    			}
    		}
    		.item-list {
				padding:30rpx 0 30rpx 20rpx;
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
						font-size:28rpx;
						font-weight:500;
						color:#333;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
					}
					.unit{
						font-size:22rpx;
						color:#999;
						// margin:14rpx 0 22rpx;
						margin: 24rpx 0 36rpx;
						display: inline-block;
						max-width: 200rpx;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						height:36rpx;
						view{
							border:1rpx solid #CACACA;
							border-radius:6px;
						}
					}
					.normalPrice{
						font-size:22rpx;
						color:#999;
					}
					.price{
						font-size:28rpx;
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
					text-align: center;
					position: relative;
					z-index: 2;
					display: flex;
					justify-content: space-between;
					margin-top: 16%;
					.reduce{
						display: block;
						width: 42rpx;
						height: 42rpx;
						background: url($mallImg +'icon_reduce.png') no-repeat center;
						background-size: 42rpx auto;
					}
					.add{
						display: block;
						width: 42rpx;
						height: 42rpx;
						background: url($mallImg +'icon_add.png') no-repeat center;
						background-size: 42rpx auto;
					}
					.num{
						font-size: 30rpx;
						width: 60rpx;
						color: #57BE6F;
						text-align: center;	
					}
				}
			}
    	}
    }
	// 送货小人儿
	.computePart{
		.send_box{
			position: fixed;
			z-index: 10;
			bottom:0rpx;
			left: 20rpx;
			image{
				width: 172rpx;
			}
			text{
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				border-radius: 50%;
				text-align: center;
				display: block;
				color: #FFF;
				font-size: 22rpx;
				width:45rpx;
				height:45rpx;
				line-height: 45rpx;
				border:2rpx solid #FFF;
				background:linear-gradient(0deg,rgba(253,127,48,1) 0%,rgba(252,153,0,1) 99%);
				border-radius:50%;
			}
		}
		// 买单按钮
		.btn{
			width: 100%;
			height: 120rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			padding-left: 210rpx;
			box-sizing: border-box;
			// box-shadow: 2rpx 2rpx 10rpx #333333;
            box-shadow: 0px -4px 8px 0px rgba(193, 193, 193, 0.2);
			line-height: 120rpx;
			z-index: 3;
			.total{
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
				&.grayBuy{
					background:#BCBCBC;
				}
			}
		}
	}
    .mailShadow{
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
				.title{
					font-size:38rpx;
					font-weight:400;
					color:#fff;
					line-height:80rpx;
					text-align: center;
					padding-bottom: 60rpx;
				}
    			.txt{
    				font-size:26rpx;
    				color:#333333;
    				line-height:42rpx;
    				text-align: left;
					font-weight: 900;
					width: 84%;
					margin: 0 auto;
    				&.tip{
    					font-weight:500;
						padding-left: 32rpx;
    				}
    			}
    		}
    	}
    }
</style>

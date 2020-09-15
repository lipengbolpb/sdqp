<template>
	<view class="page_box">
		<view class="top">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true" @change="swChange"
			 :indicator-color="dotColor" :indicator-active-color="dotCurColor">
				<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
					<view class="swiper-item">
						<image :src="item.url" mode="widthFix" :class="item.className" @tap="handleJumpEvent(item)"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="content_box"  :class="cartShow == true ? 'prevent' : ''">
			<view class="x-f wrapper-box">
				<scroll-view class="left y-f" scroll-y>
					<view class="type-list x-c" :class="[{ 'list-active': categoryType == index }]" v-for="(item, index) in categoryData"
					 :key="index" @tap="onType(index,item.categoryType)">
					     <image :src="imgUrl + 'hot.png' " mode="widthFix" class="hot" v-show="index==1"></image>
						 <view class="menuBox">
							 <view class="menuName">{{ item.categoryName.substring(0,4) }}</view>
						 </view>
						<view class="line" :class="[{ 'line-active': categoryType == index }]"></view>
					</view>
				</scroll-view>
				
				<view class="right">
					<view class="tab" @click="upSort">
						<!-- <text class="txt">综合</text> -->
						<text class="txt">价格</text>
						<view class="sort">
							<image :src="arrowUp"    :class="[{'curUp':curTop}]"  mode="widthFix" class="arrow upper"></image>
							<!-- @click="downSort" -->
							<image :src="arrowDown"  :class="[{'curDown':curBottom}]"  mode="widthFix" class="arrow down"></image>
						</view>
					</view>
					<scroll-view scroll-y class="scroll-box"  >
						<view class="items" v-if="children.length>=1">
							<view class="item-list" v-for="(list, idx) in children" @click="toGoodsDetail(list.goodsId)"  :key="idx" >
								<view class="proImg">
									<image :src="goodsImgRoot+list.goodsUrl.split(',')[0]" mode="widthFix" class="" ></image>
									<view class="skuStatus" v-show="list.goodsStatus == 1">
										<view class="circle">暂停兑换</view>
									</view>
								</view>
								<view class="proInfo">
									<view class="proName">{{list.goodsShortName}}</view>
									<view class="unit" >
										<view v-if="list.goodsSpecification">{{list.goodsSpecification}}{{list.goodsUnitName}}</view>
									</view>
									<view class="normalPrice">市场价：{{list.goodsMoney}}元</view>
									<view  :class="['price',{'overPrice':list.goodsStatus == 1}]">
										<text v-if="list.realPay!=0"><text class="danwei">¥</text>{{(list.realPay/100)|toThousands}}
										      <text v-if="list.realPay!=0 && list.realVpoints!=0" >+</text>
										</text>
										<text v-if="list.realVpoints!=0">{{list.realVpoints|toThousands}}<text class="danwei">积分</text></text>
									</view>
								</view>
								<view class="car" >
									<view class="addArea" @click.stop="addSku(idx,list.goodsStatus)">
										<image :src=" imgUrl + 'car.png' " mode="widthFix" class=""></image>
										<view :class="['numOfCart',{'notShow':list.specialChooseNum <= 0}]">{{list.specialChooseNum}}</view>
									</view>
								</view>
							</view>
							    
							<view class="more" v-if="hasMore" @click="getMore">加载更多</view>
							<view class="more" v-else>没有更多了商品了</view>
							
						</view>
						
						<view class="none" v-else>
							<view class="text">商品即将上线，请耐心等待~</view>
							<view class="noneImg">
								<image :src="imgUrl + 'chooseNone.png' " mode="widthFix" class=""></image>
							</view>
						</view>
					</scroll-view>
					  
					<!-- 结算block -->
					<view class="settle">
						<view class="box" @click="showCart">
							<image :src="imgUrl + 'cartBox.png' " mode="widthFix" class="" ></image>
							<view class="numOfCart" v-if="cartNumShow">{{cartNum}}</view>
						</view>
						<view class="free" >
							<view class="" v-show="cartNumShow">
								<view class="money">¥{{totalMoney|toThousands}}</view>
								<view class="score">{{totalVpoint|toThousands}}</view>
							</view>
						</view>
						<view class="buy" @click="toBuy">去结算 ></view>
					</view>
				</view>
			</view>
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
				<view class="cartGoods">
					<view class="item-list" v-for="(cartItem,index) in cartList" :key="index">
						<view class="proImg">
							<image :src="goodsImgRoot + cartItem.goodsUrl.split(',')[0]"  mode="widthFix" ></image>
						</view>
						<view class="proInfo">
							<view class="proName">{{cartItem.goodsName}}</view>
							<view class="unit">
								<view v-if="cartItem.goodsSpecification">{{cartItem.goodsSpecification}}{{cartItem.goodsUnitName}}</view>
							</view>
							<!-- <view class="normalPrice">市场价：{{cartItem.goodsMoney}}元</view> -->
							<view class="price">
								<text  v-if="cartItem.realPay!=0"><text class="danwei">¥</text>{{(cartItem.realPay/100)|toThousands}}</text>
								<text  v-if="cartItem.realPay!=0 && cartItem.realVpoints!=0">+</text>
								<text  v-if="cartItem.realVpoints!=0">{{cartItem.realVpoints|toThousands}}<text class="danwei">积分</text></text>
							</view>
						</view>
						<view class="goods_num">
							<text class="reduce" @click="reduceFuc(index)"></text>
							<text class="num">{{cartItem.specialChooseNum}}</text>
							<text class="add" @click="increaseFuc(index)"></text>
						</view>
					</view>
				</view>
				<view class="zongji">总计：
				   <text>¥{{totalMoney|toThousands}}</text>元 
				   <text class="jf">{{totalVpoint|toThousands}}</text>积分
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import SwiperMixin from '@/components/swiper-mixin.js'
	export default {
		mixins: [SwiperMixin],
		components: {},
		data() {
			return {
				imgUrl: config.mallImgUrl,   
				goodsImgRoot: config.goodsImgRoot,
				cardCur: 0,
				swiperList: [
					{
						id: 1,
						type: 'image',
						url: config.mallImgUrl + 'banner1.png',
						className: 'index-1' 
					},
					{
						id: 2,
						type: 'image',
						url:  config.mallImgUrl + 'banner2.png',
						className: 'index-2' 
					}
				],
				curTop:false,
				curBottom:false,
				arrowUp:  config.mallImgUrl +'arrowDown.png',
				arrowDown: config.mallImgUrl +'arrowDown.png',
				curArrow:  config.mallImgUrl +'arrowTop.png',
				categoryType: 0,
				categoryData: [],
				children:[],  //右边商品        
				currentPage:1,
				count:4,
				
				categoryParent:'',// 传递的菜单值
				hasMore:false,
				cartList:[], //购物车数据
				cartNumShow:false,
				
				cartShow:false, //展开购物车
				
				cartNum:'0',
				totalMoney:'0.00',
				totalVpoint:'0'
			};
		},
		computed: {},
		onLoad() {
			this.getgoods(0) ; // 全部商品
		},
		onShow() {
			// 获取菜单
			this.getCategory();
			
			// 获取轮播图列表
			console.log('-------------querySwiperlist111------------------');
			// this.querySwiperlist('1')
			// 	.then(res => {
			// 		console.log(res);
			// 		const swiperList = []
			// 		res && res.forEach((item, index) => {
			// 			const curItem = Object.assign(item, {
			// 				id: index,
			// 				type: 'image',
			// 				url: item.picUrl,
			// 				className: 'index-' + (index + 1)
			// 			})
			// 			swiperList.push(curItem)
			// 		})
			// 		this.swiperList = swiperList
			// });
			

			if (!getApp().globalData.openid) { //是否有openid
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
			} else {  
				console.log(getApp().globalData.openid)
			}
			
			// 购物车数据
			uni.getStorage({
			    key: 'cart_data',
				complete: (res) => {
					console.log(res.data)
					this.cartList = res.data;
					if(this.cartList == '' || this.cartList == undefined ){
						this.cartList = [];
						this.cartNumShow = false; // 不显示购物车数量
					}
				}
			});
		},
		methods: {
			addSku(index,goodsStatus){
				if(goodsStatus == 1){ // 无库存
					uni.showToast({
					    title: '抱歉，此商品暂停兑换',
					    duration: 2000,
						icon:'none'
					});
					 return
				} else { // 正常的
					var num = this.children[index].specialChooseNum;
					if (num >= 50){
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
					
					num ++;
					// 将数值与状态写回  
					this.children[index].specialChooseNum = num;
					// 放入购物车的数组中 
					if(this.cartList.length == 0 ){
						this.cartList.unshift(this.children[index]);
					} else {
						for(var i in this.cartList){
							if(this.children[index].goodsId == this.cartList[i].goodsId){
								this.cartList[i].specialChooseNum = num;
							} else {
								this.cartList.unshift(this.children[index]);
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
					// this.cartList = arr.reverse();
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
				}
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
							for(var i in this.children){   
								this.children[i].specialChooseNum = 0;
							}
							uni.removeStorageSync('cart_data') //本地存储中清除
							this.cartShow = false ;  // 不展示购物车
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
				for(var i in this.children){ //商品列表中的 减号& 数字框 不显示
					if(this.children[i].goodsId == this.cartList[index].goodsId){
						console.log(num)
						if(num <= 0 ){
							this.deleteOne(index);
						} else {
							// 将数值与状态写回商品列表
							this.children[i].specialChooseNum = num;
							// 购物车改变此条商品
							this.cartList[index].specialChooseNum = num;
						}
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
				for(var i in this.children){ //商品列表中的 减号& 数字框 不显示
					if(this.children[i].goodsId == this.cartList[index].goodsId){
						// console.log(num < 50)
						// console.log(num>=50)
						if(num < 51 ){
							// 将数值与状态写回商品列表
							this.children[i].specialChooseNum = num;
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
					}
				}
				uni.removeStorageSync('cart_data')
				// console.log(this.cartList)
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
							for(var i in this.children){ //商品列表中的 减号& 数字框 不显示
								if(this.children[i].goodsId == this.cartList[index].goodsId){
									this.children[i].specialChooseNum = 0;
								}
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
								this.isZero = true;
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
			toBuy(){
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
			},
			async getCategory() {
				var jo = await requestPost('/vpoints/vpointsShop/getFistCategoryType');
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							var category = jo.reply;
							var menu1 = {
								categoryName: "全部商品", 
								categoryType: "0"
							};
							var menu2 = {
								categoryName: "热门精选",
								categoryType: "-1"
							};
							var menu3 = {
								categoryName: "积分商品",
								categoryType: "-2"
							};								
							var newCategory = category.unshift(menu1,menu2,menu3);  
							// newCategory 新length
							// category 变成后的新数组
							this.categoryData = category;
							// console.log(this.categoryData);
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
			onType(idx,categoryParent) {
				this.currentPage = 1; // 切换菜单重回第一页
				this.categoryType = idx;
				
				this.categoryParent = categoryParent;//菜单存值
				this.getgoods(categoryParent);    
				
				this.children = []; // 置空
			},
			getMore() { //加载更多
				this.currentPage++;
				this.getgoods(this.categoryParent);    
			},
			async getgoods(categoryParent,order) {
				var params = {
					"currentPage": '',
					"count":'',
					'categoryParent':'',// 之后类目
					'isCommend':'',  // 0 热门
					'payType':'', // 1 积分
					'priceOrderType':'', //排序
					'saleNumOrderType':'',//0-升序、1-降序
				}
				if(order == 'up'){
					var priceOrderType = '0';
					var saleNumOrderType = ''
				} else if(order == 'down'){
					var priceOrderType = '1';
					var saleNumOrderType = ''
				} else {
					var priceOrderType = '';
					var saleNumOrderType = 0
				}
				if(categoryParent>0){
					params = {
						"currentPage": this.currentPage,
						"count":this.count,
						'categoryParent':categoryParent,// 之后类目
						'priceOrderType': priceOrderType,
						'saleNumOrderType':saleNumOrderType,
					}
				} else if(categoryParent == 0) { //全部
					params = {
						"currentPage": this.currentPage,
						"count":this.count,
						'priceOrderType': priceOrderType,
						'saleNumOrderType':saleNumOrderType,
					};
				}else if(categoryParent == -1){ // 热门
					params = {
						"currentPage": this.currentPage,    
						"count":this.count,
						'isCommend':'0',  // 0 热门
						'priceOrderType': priceOrderType,
						'saleNumOrderType':saleNumOrderType,
					};
				} else if(categoryParent == -2){ // 积分商品
					params = {
						"currentPage": this.currentPage,
						"count":this.count,
						'payType':'1', // 1 积分
						'priceOrderType': priceOrderType,
						'saleNumOrderType':saleNumOrderType,
					};
				}
				var jo = await requestPost('/vpoints/vpointsShop/getShopGoods',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {                    
						if(jo.reply){
							this.children = this.children.concat(jo.reply);
							if (jo.reply.length < this.count) {
								this.hasMore = false;
							} else {
								this.hasMore = true;
							}
							
							// 将购物车的数量展示
							if(this.cartList.length != 0 ){
								for(var i in this.cartList){
									for(var j in this.children){
										console.log('详情添加B')
										if(this.children[j].goodsId == this.cartList[i].goodsId){
											console.log('详情添加c')
											console.log(this.cartList[i].specialChooseNum)
											this.children[j].specialChooseNum = this.cartList[i].specialChooseNum;
										}
									}
								}
							}
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
			
			swChange(e) { //轮播图
				this.cardCur = e.detail.current
			},
			upSort(){ //升序
			    this.children = [];
				if(this.curTop == false ){
					this.arrowUp = this.imgUrl + 'arrowTop.png';
					this.arrowDown = this.imgUrl + 'arrowDown.png';
					this.curTop = true;
					this.curBottom = false;
					this.getgoods(this.categoryParent,'up');
				} else {
					this.arrowUp = this.imgUrl + 'arrowDown.png';
					this.arrowDown = this.imgUrl + 'arrowTop.png';
					this.curTop = false;
					this.curBottom = true;
					this.getgoods(this.categoryParent,'down');
				}
			},
			downSort(){ // 降序
				
			},
			//to商品详情
			toGoodsDetail(id) {
				uni.navigateTo({
					url:'../goodsDetail/goodsDetail?id=' + id + '&type=' + this.categoryParent
				})
			},
			showCart(){
				if(this.cartList.length == 0){
					uni.showToast({
					    title: '您还没有选购商品',
					    duration: 2000,
						icon:'none'
					});
					return
				} else {
					this.cartShow = true;
				}
			}
		},
		
		computed: {
			numOfCart(){
				let that = this;
				var cartNum = 0;
				var totalMoney = 0;
				var totalVpoint = 0;
				for(var i in that.cartList){
					cartNum += parseInt(that.cartList[i].specialChooseNum);
					totalMoney += that.cartList[i].realPay/100 * that.cartList[i].specialChooseNum;
					totalVpoint += that.cartList[i].realVpoints * that.cartList[i].specialChooseNum;
				}
				that.cartNum = cartNum;
				that.totalMoney = parseFloat(totalMoney).toFixed(2);
				that.totalVpoint = totalVpoint;
				if(that.cartNum > 0 || that.totalMoney > 0){
					that.cartNumShow = true;
				} else{
					that.cartNumShow = false;
				}
				
				if(that.cartNum>=100){
					that.cartNum = '99+';
				}
			},
		},	
	};
</script>

<style lang="scss">
	.page_box{
		height:100%;
	}
	.top {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		height: 20%;
		swiper {
			width: 100%;
			height: 240rpx;
			padding: 0;
			margin: 0;
			top: 0;
			left: 0;
			.swiper-item {
				width: 702rpx;
				padding: 0 24rpx 20rpx;
				margin: 0;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.content_box {
		margin-top: 10rpx;
		display: flex;
		flex-direction: column;
		// overflow: hidden;
		height: 78%;
		// padding-bottom: 88rpx;
		&.prevent {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			overflow: hidden;
		}
	}

	.wrapper-box {
		// flex: 1;
		display: flex;
		margin-top: 1upx;
		height: 100%;
	}

	.scroll-box {    
		// height: 100%;
		max-height: 1000rpx;
		flex: 1;
		background: #fff;
		-webkit-overflow-scrolling: touch;      
	}

	.left {
		width: 200rpx;
		height: 100%;
		background: url($mallImg + 'menuBg.png') no-repeat center;
		background-size: 100% auto;
		padding-top: 100rpx;
		padding-bottom: 100rpx;
		background-position-y: 0rpx;
		.list-active {
			color: #EDA323 !important;
			font-weight: 500 !important;
		}

		.line-active {
			background: url($mallImg + 'plateOn.png') no-repeat center !important;
			background-size: 154rpx 19rpx !important;
		}

		.type-list {
			height: 120upx;
			position: relative;
			width: 156upx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #1E683F;
			margin:0 auto;
			.hot{
				width: 60rpx;
				position: absolute;
				top: -20rpx;
				right: 6rpx;
			}
			.menuBox{
				width:80%;
				margin:0 auto;
				.menuName{
					text-align: justify;
					&:after{
						content:'.';
						width: 100%;
						display: inline-block;
						overflow: hidden;
						height: 0;
					}
				}
			}
			
			.line {
				width: 100%;
				height: 100%;
				background: url($mallImg + 'plate.png') no-repeat center;
				background-size: 154rpx 19rpx;
				position: absolute;
				bottom: 0;
				background-position: center;
			}
		}
	}
    
	.tab{
		width: 20%;
		padding-left: 80%;
		margin-bottom: 10rpx;
		z-index: 1;
		.txt{
			font-size:26rpx;
			font-weight:400;
			color:#333;
			line-height:44rpx;
			padding-right: 28rpx;
		}
		.sort{
			display: inline-block;
			vertical-align: bottom;
			position: relative;
			.arrow{
				width: 16rpx;
				&.upper{
					transform:rotate(180deg);
					-ms-transform:rotate(180deg); 	/* IE 9 */
					-moz-transform:rotate(180deg); 	/* Firefox */
					-webkit-transform:rotate(180deg); /* Safari 和 Chrome */
					-o-transform:rotate(180deg); 
					position: absolute;
					top: 10rpx;
				}
				&.curDown{
					transform:rotate(180deg);
					-ms-transform:rotate(180deg); 	/* IE 9 */
					-moz-transform:rotate(180deg); 	/* Firefox */
					-webkit-transform:rotate(180deg); /* Safari 和 Chrome */
					-o-transform:rotate(180deg); 
				}
				&.curUp{
					transform:rotate(0deg);
					-ms-transform:rotate(0deg); 	/* IE 9 */
					-moz-transform:rotate(0deg); 	/* Firefox */
					-webkit-transform:rotate(0deg); /* Safari 和 Chrome */
					-o-transform:rotate(0deg);
					 position: absolute;
					 top: 10rpx;
				}
			}
		}
	}
	.right {
		padding: 0 10rpx 0 22rpx;
		margin-top:10rpx;
		flex: 1;
		height: 100%;
		.items{
			padding-bottom: 200rpx;
			.item-list {
				padding:30rpx 0 30rpx 20rpx;
				border-bottom: 1rpx solid #eee;
				display: flex;
				// width:100%;
				z-index: 1;
				&:nth-last-child(2){
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
					.skuStatus{  //暂无库存
					    z-index: 2;
						width: 100%;
						height: 100%;
						position: absolute;
						margin: 0 auto;
						background: rgba(#fff , 0.5);
						left: -2rpx;
						top: -2rpx;
						.circle{
							width: 139rpx;
							height: 139rpx;
							border-radius: 50%;
							background: rgba(0, 0, 0, 0.5);
							text-align: center;
							line-height: 139rpx;
							color: #fff;
							font-size: 30rpx;
							letter-spacing: 4rpx;
							position: absolute;
							top: 12%;
							left:8%;
						}
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
						display: inline-block;
						max-width: 200rpx;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						height: 50rpx;
						view{
							border-radius:6px;
							border:1px solid #CACACA;
							margin:14rpx 0 22rpx;
							padding: 0 12rpx;
						}
					}
					.normalPrice{
						font-size:22rpx;
						color:#999;
						padding: 10rpx 0 4rpx 0;
					}
					.price{
						font-size:28rpx;
						font-weight:500;
						color:#FF4514;
						&.overPrice{
							color:#999;
						}
						.danwei{
							font-size:22rpx;
						}
					}
				}
				.car{
					width:18%;
					flex-shrink:3;
					text-align: center;
					position: relative;
					height: 80rpx;
					.addArea{
						width: 50rpx;
						height: 50rpx;
						position: absolute;
						bottom: -100rpx;
						z-index: 2;
						image{
							width: 45rpx;   
							// position: relative;
							// top: 78%;
						}
						.numOfCart{
							position: absolute;
							right: -20rpx;
							bottom: 30rpx;
							text-align: center;
							display: block;
							width:35rpx;
							height:35rpx;
							background:#fff;
							border:1px solid #FEB611;
							border-radius:50%;
							font-size:24rpx;
							color:#000;
							&.notShow{
								display: none;
							}
						}
					}
				}
			}
			.more{
				font-size: 28rpx;
				font-weight: 400;
				color: #656565;
				line-height: 36rpx;   
				text-align: center;
				padding-top: 30rpx;
			}
		}
		.none{  // 右边无商品
			text-align: center;
			padding-top: 30%;
			.noneImg{
			   margin:0 auto;
			   image{
				   width:280rpx;
				   margin-bottom: 24rpx;
			   }
			}
			.text{
			   font-size: 28rpx;
			   font-weight: 400;
			   color: #656565;
			   line-height: 36rpx;
		    }
		}
		
		.settle{
			z-index: 3;
			position: fixed;
			bottom: 16rpx;
			display: flex;
			width:468rpx;
			height:88rpx;
			background:#E7F3EC;
			border-radius:44rpx;
			margin-left: 30rpx;
			.box{
				flex-shrink: 1;
				width:32%;
				text-align: center;
				position: relative;
			    image{
					width: 138rpx;
					position: relative;
					top: -28rpx;
					left: -30rpx;
				}
				.numOfCart{
					position: absolute;
					right:40rpx;
					top: -20rpx;
					text-align: center;
					display: block;
					width:40rpx;
					height:40rpx;
					line-height:40rpx;
					border:2rpx solid #FFFFFF;
					background:linear-gradient(0deg,rgba(253,127,48,1) 0%,rgba(252,153,42,1) 99%);
					border-radius:50%;
					font-size:20rpx;
					font-weight:400;
					color:#FFFFFF;
				}
			}
			.free{
				width:30%;
		        flex-shrink:2;
				font-size:24rpx;
				font-weight:500;
				text-align: left;
				// margin-left:18rpx;
				margin-top: 16rpx;
				.money{
					color:#060606;
				}
				.score{
					color:#FF4514;
				}
			}
			.buy{
				width:40%;
				flex-shrink:3;
				font-size:26rpx;
				color:#000;
				text-align: center;
				line-height: 88rpx;
			}
		}
	}
	
	.cart{  //购物车
		width: 100%;
		// height: 100%;
		height: 130%;
		position: fixed;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background-color: rgba($color: #000000, $alpha: .4);
		z-index: 10;
		bottom: 0rpx;
		.close{
			align-self: flex-end;
			width: 49rpx;
			margin-right: 25rpx;
			margin-bottom: 20rpx;
		}
		.list_box{
			width: 100%;
			max-height: 50%;
			// padding-bottom:80rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 44rpx 44rpx 0 0;
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
			.cartGoods{
				overflow-x: hidden;
				-webkit-overflow-scrolling:touch;
				max-height: 540rpx;
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
							display: inline-block;
							max-width: 200rpx;
							white-space:nowrap;
							overflow:hidden;
							text-overflow:ellipsis;
							height: 60rpx;
							view{
								border-radius:6px;
								border:1rpx solid #CACACA;
								margin: 24rpx 0 36rpx;
								padding: 0 12rpx;
							}
						}
						// .normalPrice{
						// 	font-size:22rpx;
						// 	color:#999;
						// }
						.price{  
							font-size:28rpx;
							font-weight:500;
							color:#FF4514;
							padding-top: 40rpx;
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
			.zongji{
				padding: 30rpx;
				font-size: 30rpx;
				border-top: 1rpx solid #f8f8f8;
				text{
					color: #FF4514;
					&.jf{
						padding-left: 30rpx;
					}
				}
			}
		}
	}
</style>

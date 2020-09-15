<template>
	<view class="addressList">
		<!-- 地址列表 -->
		<view class="address_list" v-if="addressList.length>0">
			<view class="address_card"  v-for="(item,index) in addressList"  :key="index"  >
				<view class="select"  @click="selectAddress(index)">
					 <!-- 选中仅需此条件就可显示对勾 :class="addressIndex===index?'checked':''" --> 
					<view :class="['chooseBox',addressIndex===index?'checked':'']">
						<view class="choose"></view>
					</view>
				</view>
				<view class="addressInfo">
					<view class="msg">
						<text class="name">{{item.userName}}</text>
						<text class="tel">{{item.phoneNum}}</text>
						<!-- 是否默认，1是 -->
						<text class="defaultFlag" v-if="item.isDefault == 1 ">默认</text> 
					</view>
					<text class="address">{{item.province}}{{item.city}}{{item.county}}{{item.address}}</text>
				</view>
				
				<view class="operation" @click="editAddress(item.addressId)">编辑</view>
			</view>
			
		</view>
		
		<view class="noList" v-else>
			没有更多地址记录了
		</view>
		
		<view class="btn_box" >
			<buttonBg :btn="'新增收货地址'" @confirm="addAddress" :size="'largeGreen'" :bgColor="'#57BE6F'"></buttonBg>
			<buttonBg :btn="'从微信授权通讯地址'" @confirm="useWxAddress"  :size="'largeWhite'"></buttonBg>
		</view>
		
		<!-- 再次授权 -->
		<view class="auth_again" v-show="show">
			<view class="auth_title">
				<text>设置页面重新授权\n</text>
				<text>需要获取您的授权才能使用小程序的功能</text>
			</view>
			<view class="auth_tip">
				<view class="setbg">
					<text>通讯地址</text>
				</view>
				<buttonBg :btn="'去授权'" :size="'small'" @confirm="authAgain"></buttonBg>
			</view>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	import buttonBg from '@/components/button-bg.vue';
	export default {
		data() {
			return {
				show:false,
				imgUrl:config.imgUrl,
				requestUrl:config.requestUrl,
				pickerText: '',
				safeBottom:getApp().globalData.isIphoneX?'68rpx':'',
				addressIndex:0,
				addressList:[],
				fromType:'',
			};
		},
		components:{
			buttonBg
		},
		onLoad(options) {//根据来源需要往后跳转
		    if(options){
				this.fromType = options.fromType;
			}
		},
		onHide() {
		},
		onUnload() {
			var pages = getCurrentPages();
			var prepage = pages[pages.length - 2]; //上一个页面
			console.log(prepage.$vm)
			console.log(this.fromType)
			prepage.$vm.fromType = 'choose';
		},
		onShow() {
			this.queryAddressList();
		},
		methods:{
			useWxAddress(){
				uni.chooseAddress().then(res=>{
					let [e,r] = res;
					if(e){
						console.log(e)
						if(e.errMsg=='chooseAddress:fail auth deny'){//首次拒绝 
							this.show = true;
						}else{//chooseAddress:fail cancel 取消使用
							
						}
					}else{
						console.log(r)
						if(r.errMsg.indexOf('ok')!=-1){
							getApp().globalData.address={
								tel:r.telNumber,
								username:r.userName,
								address:r.detailInfo,
								area:`${r.provinceName}-${r.cityName}-${r.countyName}`
							}
							uni.navigateBack({
								delta:1
							})
						}else{
							uni.showModal({
								title: "提示",
								content: '微信地址异常',
								showCancel: false
							})
						}
					}
				})
			},
		    editAddress(addressId){ // 修改地址
				uni.navigateTo({
					url:'./addressAdd?editId='+ addressId + '&operate='+ 'edit'
				})
			},
			addAddress(){//新增
				uni.navigateTo({
					url:'./addressAdd?operate='+ 'add'
				})
			},
			authAgain(){
				uni.openSetting({
					complete:res=>{
						this.show = false;
					}
				})
			},
			selectAddress(index){
				this.addressIndex = index;
				getApp().globalData.addressId = this.addressList[index].addressId;
				getApp().globalData.address={
					tel:this.addressList[index].phoneNum,
					username:this.addressList[index].userName,
					address:this.addressList[index].address,
					area:`${this.addressList[index].province}-${this.addressList[index].city}-${this.addressList[index].county}`
				};
				uni.navigateBack({
					delta:1
				})
				// console.log('huihuihui')
				// uni.navigateTo({
				// 	url:'../buy/buyOrder'
				// })
			},
			queryAddressList(){
				uni.request({
					url:this.requestUrl+'/vpoints/vpointsAddress/getAddressByOpenid',
					method:'POST',
					data:{
						"openid": getApp().globalData.openid,
						"projectServerName":'shandongagt'
					}
				}).then(res=>{
					let [e,r] = res;
					if(r){
						console.log(r)
						if(r.data.result.code==0){
							this.addressList = r.data.reply;
							if(r.data.reply.length<1){//地址列表为空时删除缓存地址
							    // 详情中删除空了回来没有任何一条
								getApp().globalData.address=false;
								uni.removeStorage({
									key:'address'
								})
							} else {
								getApp().globalData.addressId = this.addressList[0].addressId;
								getApp().globalData.address={
									tel:this.addressList[0].phoneNum,
									username:this.addressList[0].userName,
									address:this.addressList[0].address,
									area:`${this.addressList[0].province}-${this.addressList[0].city}-${this.addressList[0].county}`
								};
							}
						}else{
							uni.showModal({
								title: "查询地址提示",
								content: r.data.result.msg?r.data.result.msg:'系统开了个小差',
								showCancel: false
							})
						}
					}else{
						uni.showModal({
							title: "查询地址提示",
							content: '系统繁忙!',
							showCancel: false
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.addressList{
		width: 100%;
		min-height: 100%;
		background: #F8F8F8;
	}
	.address_list{
		background: #FFF;
		border-radius: 20px;
		// margin:24rpx;
		// position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		margin-bottom: 340rpx;
	}
	// 地址列表
	.address_card{
		margin:30rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1rpx solid #E0E0E0;
		padding-bottom: 30rpx;
		&:nth-last-child(1){
			border-bottom:none;
		}
		.select{
			display: flex;
			justify-content: center;
			align-items: center;
			.chooseBox{
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				background: #fff;
				border:4rpx solid #57BE6F;
				// box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				&.checked{
					width: 40rpx;
					height: 40rpx;
					background: #57BE6F;
					border:4rpx solid #57BE6F;
					.choose{
						width: 12rpx;
						height: 24rpx;
						border-right: 4rpx solid #fff;
						border-bottom: 4rpx solid #fff;
						transform: rotate(40deg);
						margin-top: -6rpx;
					}
					// &:after {
					// 	content: '\2714';//'√';
					// 	pointer-events: none;
					// 	position: absolute;
					// 	color: white;
					// }
				}
			}
			
		}
		.addressInfo{
			width: 72%;
			.msg{
				font-size: 32rpx;
				margin-bottom: 20rpx;
				position: relative;
				.name{
					font-size: 30rpx;
					color: #333;
				}
				.tel{
					font-size: 26rpx;
					color: #999;
					// padding: 0 84rpx 0 23rpx;
					padding-left: 20rpx;
				}
				.defaultFlag{
					height: 34rpx;
					border: 1rpx solid #3E843B;
					border-radius: 6rpx;
					font-size: 22rpx;
					color: #33A84E;
					// text-align: center;
					padding: 7rpx 18rpx;
					position: absolute;
					top: 16rpx;
					right: 0;

				}
			}
			.address{
				font-size: 28rpx;
				color: #333;
			}
		}
		.operation{
			font-size: 28rpx;
			color: #999;
			border-left: 1rpx solid #E6E6E6;
			width: 16%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 30rpx 0;
		}
	}
	.noList{
		line-height: 80rpx;
		font-size: 26rpx;
		text-align: center;
		color: #000000;
		margin-bottom: 120rpx;
	}

	//按钮
	.btn_box{
		width: 100%;
		position: fixed;
		bottom: 30rpx;
		button-bg{
			align-self: center;
			margin: 0 30rpx;
		}
	}
	//再次授权
	.auth_again{
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #f0eff5;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
		.auth_title{
			background: #FFFFFF;
			padding: 0 40rpx;
			height: 120rpx;
			text:nth-of-type(1){
				font-size: 32rpx;
				color: #000000;
				line-height: 50rpx;
			}
			text:nth-of-type(2){
				font-size: 20rpx;
				color: #666;
			}
		}
		.auth_tip{
			height: 80%;
			position: absolute;
			background: #FFFFFF;
			bottom: 0;
			display: flex;
			justify-content: center;
			width: 100%;
			.setbg{
				width: 450rpx;
				height: 160rpx;
				background: url($mallImg + 'auth_again.png') no-repeat center;
				background-size: 100% 100%;
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -225rpx;
				transform: translateY(-40rpx);
				padding-top: 75rpx;
				box-sizing: border-box;
				text{
					line-height: 62rpx;
					color: #000;
					font-size: 20rpx;
					padding: 0 30rpx;
				}
			}
			button-bg{
				align-self: center;
			}
		}
	}
	//编辑、新增地址
	.add_page{
		width: 100%;
		height: 100%;
		z-index: 4;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba($color: #000000, $alpha: 0.7);
		overflow: hidden;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		>.close{
			width: 70rpx;
			align-self: flex-end;
			padding-right: 30rpx;
			padding-bottom: 10rpx;
		}
		.add_msg{
			height: 786rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background: #FFFFFF;
			padding:60rpx 40rpx;
			box-sizing: border-box;
			.title{
				font-size: 30rpx;
				color: #000;
				border-left: 8rpx solid #4eac6d;
				line-height: 30rpx;
				padding: 0 17rpx;
			}
		}
		.add_msg .msg>view{
			height: 60rpx;
			padding-top: 40rpx;
			border-bottom: 1px #f0f0f0 solid;
		}
		.add_msg .msg>view:nth-last-of-type(1){
			display: flex;
			justify-content: space-between;
			text.get_yz{
				width: 180rpx;
				font-size: 23rpx;
				color: #4eac6d;
				display: block;
				text-align: center;
				align-self: center;
				border-left: 1px #4eac6d solid;
			}
			input{
				width: auto;
			}
		}
	}
</style>

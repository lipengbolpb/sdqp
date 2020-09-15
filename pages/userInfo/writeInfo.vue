<template>
	<view class="userInfoPage">
		<view class="wrap">
			<button class="item"  open-type='getUserInfo'  @getuserinfo="getUserInfo">
				<view class="txt">
					<text class="icon">*</text>
					<text class="subject">昵称</text>
				</view>
				<input type="text" v-model="nickName" disabled="true"  placeholder="昵称" class=""/>
			</button>
			<button class="item"  open-type='getUserInfo'  @getuserinfo="getUserInfo">
				<view class="txt">
					<text class="icon">*</text>
					<text class="subject">性别</text>
				</view>
				<input type="text"  v-model="sex" disabled="true"  placeholder="性别" class=""/>
			</button>
			<view class="item">
				<view class="txt">
					<text class="icon">*</text>
					<text class="subject">出生日期</text>
				</view>
				<view class="selectBox">
					<picker mode="date" :value="birthdate"  :start="startDate" @change="startDateChange($event)">
						<view class="date">
							<text class="dateValue">{{birthdate}}</text>
							<image :src="imgUrl + 'more.png'" mode="widthFix"></image>
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view  class="btnBox" >
			<button class="btn" @click="verity">保存</button>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data() {
			return {
				imgUrl:config.mallImgUrl,
				safeBottom:getApp().globalData.isIphoneX?'68rpx':0,
				requestUrl:config.requestUrl,
				nickName:'',
				gender:'',
				birthdate:'',  
				startDate:'',
				sex:'',
			};
		},
		onLoad() {
			
		},
		
		onShow() {
			this.queryUerInfo() 
		},
		methods:{
			async queryUerInfo() {
				var params = {
					"openid": getApp().globalData.openid,
				};
				var jo = await requestPost('/user/userInfo',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							console.log(jo.reply);
							this.nickName = jo.reply.userInfo.nickName;
							var xingbie = jo.reply.userInfo.gender; // 我们 0:女、1男、2:未知
							if(xingbie == 0){ //未知
								this.sex = '女'
								this.gender = '0'
							} else if(xingbie == 1){
								this.sex = '男'
								this.gender = '1'
							} else if(xingbie == 2){
								this.sex = '未知'
								this.gender = '2'
							}
							this.birthdate = jo.reply.userInfo.birthdate;
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
			
			getUserInfo: function(e) {
				let that = this;
				// console.log("nickname=" + e.detail.userInfo.nickName);
				// wx登录
				wx.login({
					success(res) {
						if (res.code) {
							//发起网络请求
							var code = res.code
							// 获取微信用户信息
							wx.getUserInfo({
								success: function(res) {
									console.log(res.userInfo);
									var userInfo = res.userInfo
									that.nickName = userInfo.nickName
									var xingbie = userInfo.gender //性别 官方 0：未知、1：男、2：女  ==== 我们 0:女、1男、2:未知
									
									if(xingbie == 0){ //未知
										that.sex = '未知'
										that.gender = '2'
									} else if(xingbie == 1){
										that.sex = '男'
										that.gender = '1'
									} else if(xingbie == 2){
										that.sex = '女'
										that.gender = '0'
									}
									// that.avatarUrl = userInfo.avatarUrl
									// that.province = userInfo.province
									// that.city = userInfo.city
									// that.country = userInfo.country
									// that.openid = that.$store.state.useropenid
								},
								fail: res => {
									// 获取失败的去引导用户授权 
								}
							})
						} else {
							// ...
						}
					}
				})
			},
			// 选择日期
			startDateChange: function(e) {
				this.birthdate = e.target.value
				console.log(this.birthdate);
			},
			
			verity(){
				if(this.nickName==''||this.nickName== ' '){
					uni.showModal({
						title: "提示",
						content: '请授权昵称、性别',
						showCancel: false
					})
					return
				}else if(this.sex==''||this.sex== ' '){ 
					uni.showModal({
						title: "提示",
						content: '请授权昵称、性别',
						showCancel: false
					})
					return
				}else if(this.birthdate==''||this.birthdate== ' '){ 
					uni.showModal({
						title: "提示",
						content: '请选择出生日期',
						showCancel: false
					})
					return
				} else {
					this.saveUserInfo();
				}
			},
			async saveUserInfo(){
				uni.showLoading({
					title: '加载中...',
				});
				var params = {
					"openid": getApp().globalData.openid,
					"nickname":this.nickName,
					"gender":this.gender,
					"birthdate":this.birthdate
				};
				let jo = await requestPost('/user/updateUserMessage', params);
				console.log('完善用户信息' + JSON.stringify(jo));
				uni.hideLoading();
				if (jo.result.code == 0) { //业务成功
					if (jo.result.businessCode == 0) { // 成功
						uni.showToast({
							title: jo.result.msg,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showModal({
							title: '温馨提示',
							content: jo.result.msg,
						})
					}
				} else {
					uni.showModal({
						title: '温馨提示',
						content: jo.result.msg,
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	button{
		border: 0;
		background-color: transparent;
		outline: none;
		&:after {
		  border: none;
		}
	}
	.userInfoPage{
		background: #F8F8F8;
		width: 100%;
		min-height: 100vh;
		overflow: hidden;
		.wrap{
			background:#fff;
			margin-top: 20rpx;
			.item{
				height: 100rpx;
				padding:0 30rpx;
				border-bottom: 1rpx solid #eee;
				display: flex;
				justify-content: space-between;
				&:nth-last-child(1){
					border-bottom: none;
				}
				.txt{
					font-size: 30rpx;
					color: #343434;
					line-height: 100rpx;
					.icon{
						color: #F10101;
						padding-right: 20rpx;
					}
					.subject{
						text-align: justify;
						display: inline-block;
						width: 20%;
						position: absolute;
						width: 20%;
						&:after{
							content:'.';
							width: 100%;
							display: inline-block;
							overflow: hidden;
							height: 0;
						}
					}
				}
				input,.selectBox{
					text-align: right;
					font-size: 30rpx;
					color: #000;
					vertical-align: middle;
					height: 100rpx;
					line-height: 100rpx;
					width: 60%;
					image{
						width: 15rpx;
					}
				}
				.dateValue{
					padding-right: 30rpx;
				}
			}
		}
		.btnBox{
			width:100%;
			margin: 0 auto;
			position: fixed;
			bottom: 132rpx;
			.btn{
				width: 570rpx;
				height: 90rpx;
				line-height: 90rpx;
				background: #4FC65C;
				border-radius: 20rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>

<template>
	<view class="giveTelPage">
		<view class="wrap">
			<view class="item">
				<text class="txt">手机号授权：</text>
				<input type="number" maxlength="11" v-model="tel"  placeholder="手机号" class=""/>
			</view>
		</view>
		<view  class="btnBox" >
			<button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">授权手机号</button>
		</view>
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data() {
			return {
				imgUrl:config.mallImgUrl,
				sgUrl:config.sgUrl,
				safeBottom:getApp().globalData.isIphoneX?'68rpx':0,
				requestUrl:config.requestUrl,
				tel:' ',
			};
		},
		
		onLoad() {
			this.queryUerInfo()
		},
		
		onShow() {
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
							console.log(jo.reply.userInfo.phoneNumber);
							this.tel = jo.reply.userInfo.phoneNumber;
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
			
			getPhoneNum(e) { 
				if (e.detail.errMsg.indexOf('ok') == -1) { //拒绝授权
					return false
				}
				if (getApp().globalData.sessionKey) {
					uni.request({
						url: this.sgUrl + '/api/decrypt',
						method: "POST",
						data: {
							provinceCode: 'sdqp',
							sessionKey: getApp().globalData.sessionKey,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}
					}).then(res => {
						console.log(res)
						let [e, r] = res;
						if (r) { //获取成功
							if (!r.data.data.decryptData.phoneNumber && r.data.data.decryptData.indexOf('error') != -1) { //解析失败，删除sessionkey
								getApp().globalData.sessionKey = '';
								uni.removeStorage({
									key: 'xcxOpenid',
									success(res) {
										console.log(res)
									}
								})
								uni.showToast({
									icon:'none',
									title:'获取失败请重试'
								})
							} else {
								this.$store.commit('getTelNum', r.data.data.decryptData.phoneNumber);
								console.log(this.$store.state.telNum)
								this.tel = r.data.data.decryptData.phoneNumber?r.data.data.decryptData.phoneNumber:'';
								this.savePhone();
							}
						} else { //获取手机号的其他异常其他异常
							console.log(e)
						}
					}).catch(err => {
						console.log(err)
					})
				} else {
					this.getOpenid().then(res => {
						getApp().globalData.xcxOpenid = res.openid;
						getApp().globalData.sessionKey = res.session_key;
						return uni.request({
							url: config.sgUrl + '/api/decrypt',
							method: "POST",
							data: {
								provinceCode: 'sdqp',
								sessionKey: getApp().globalData.sessionKey,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv
							}
						})
					}).then(res => {
						console.log(res)
						let [e, r] = res;
						if (r) { //获取成功 提现
							// console.log(r.data.data.decryptData.phoneNumber)
							this.$store.commit('getTelNum', r.data.data.decryptData.phoneNumber);
							console.log(this.$store.state.telNum)
							this.tel = r.data.data.decryptData.phoneNumber?r.data.data.decryptData.phoneNumber:'';
							this.savePhone()
						} else { //获取手机号的其他异常其他异常
							console.log(e)
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			
			// 保存手机号
			async savePhone() {
				var params = {
					"openid": getApp().globalData.openid,
					"phonenum": this.tel ? this.tel : this.$store.state.telNum,
					"isCaptcha": 0,
					"projectServerName": 'shandongagt',
				};
				var savePhoneNumber = await requestPost('/user/updateUserInfoMobile', params);
				console.log('savePhoneNumber');
				uni.showModal({
					title: '尊敬的用户',
					content: '手机号授权成功'
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
		}
	}
</script>

<style lang="scss">
	.giveTelPage{
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
				}
				input{
					text-align: right;
					font-size: 30rpx;
					color: #343434;
					vertical-align: middle;
					height: 100rpx;
					line-height: 100rpx;
				}
			}
		}
	}
	//按钮
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
	
</style>

<template>
	<view class="addAddress">
		<!-- 新增地址 -->
		<view class="add_page" >
			<view class="add_msg" :style="{'padding-bottom':safeBottom==0?'60rpx':safeBottom}">
				<view class="msg">
					<view class="item">
						<text>收货人</text>
						<input type="text" maxlength="8" v-model="username"  placeholder="收货人姓名" class="name"/>
					</view>
					<view class="item">
						<text>联系电话</text>
						<input type="number" v-model="tel"  placeholder="+86" class="tel" maxlength="11"/>
					</view>
					<view class="item">
						<text>验证码</text>
						<input type="number" placeholder="输入验证码" class="yzm" v-model="yzcode"  maxlength="4"/>
						<text @click="getVerifyCode" class="get_yz">{{sec==0?'获取验证码':sec+'秒后再次获取'}}</text>
					</view>
					<view class="item area " @click="openAddres">
						<text>所在地区</text>
						<input type="text" v-model="pickerText" placeholder="选择所在地区" class="area" disabled/>
						<view class="select">
							<image :src="imgUrl + 'more.png'" mode="widthFix"></image>
						</view>
					</view>
					<view class="street">
						<view class="tit">详细地址</view>
						<textarea v-model="address"  class="txtarea" maxlength="30" value="" placeholder="街道、楼层门牌号详细信息"  />
					</view>
					
					<view class="row b-b radio-list">
						<radio-group @click="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
								<view class="radios">
									<!-- :checked="item.checked" -->
									<radio :value="item.value" :checked="index === current" />
								</view>
								<view class="radioName">{{item.name}}</view>
							</label>
						</radio-group>
					</view>
					
					<view class="btn_box" :style="{'padding-bottom':safeBottom}">
						<button-bg :size="'largeGreen'" :btn="btnType=='save'?'保存':'确认修改'" @confirm="addAddress"></button-bg>
						<!-- v-if="operate==add" -->
						<buttonBg :btn="'从微信授权通讯地址'" v-if=" btnType=='save' " @confirm="useWxAddress"  :size="'largeWhite'"  ></buttonBg>
						<!-- v-if="operate==edit" -->
						<buttonBg :btn="'删除'"  v-if=" btnType=='update' " @confirm="deleteAddress" :size="'largeWhite'" ></buttonBg>
					</view>
					
				</view>
			</view>
			
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>
		
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
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	export default {
		data() {
			return {
				imgUrl:config.mallImgUrl,
				show:false,
				cityPickerValueDefault: [0, 0, 1],
				safeBottom:getApp().globalData.isIphoneX?'68rpx':0,
				username:'',
				tel:'',
				yzcode:'',
				pickerText: '',
				address:'',
				province:'',
				city:'',
				county:'',
				isDefault:'0', // 0否，1是
				
				requestUrl:config.requestUrl,
				addressList:[],
				btnType:'save',
				fromType:'',
				sec:0,
				stop:false,
				
				operate:'' , // 操作
				addressId:'',// 编辑的地址id
				items: [
					{
						value: 'true',
						name: '设为默认地址'
					}
				],
				current:-1, // 0 选中状态
				setDefault:false,
			};
		},
		components:{
			buttonBg,
			simpleAddress
		},
		onLoad(options) {//根据来源需要往后跳转
		    if(options.operate){
				this.operate = options.operate;
				if(this.operate == 'edit'){
					uni.setNavigationBarTitle({
					   title: '编辑地址'
					})
					this.addressId = options.editId;
					this.btnType = 'update';
					
					this.addressByIdGet(); // 查询编辑内容
				} else if(this.operate == 'add'){ //新增
					this.username = '';
					this.tel = '';
					this.pickerText = '';
					this.address = '';
					this.btnType = 'save';
				}
			}
		},
		onHide() {
			this.stop = true;
		},
		onUnload() {
			this.stop = true;
		},
		onShow() {
			this.stop = false;
		},
		methods:{
			async addressByIdGet() {
				var params = {
					"addressId": this.addressId,
					"projectServerName":'shandongagt'
				};
				var jo = await requestPost('/vpoints/vpointsAddress/getAddressById',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){ // 有默认地址
						   this.username = jo.reply.userName
						   this.tel = jo.reply.phoneNum
						   this.pickerText = jo.reply.province + jo.reply.city + jo.reply.county
						   this.province = jo.reply.province
						   this.city = jo.reply.city 
						   this.county = jo.reply.county
						   this.address = jo.reply.address
						   if(jo.reply.isDefault == 1){ // 是否默认，1是  0否
							   this.current = 0; // 样式选中
							   this.isDefault = 1 ; // 默认传参
						   } else {
							   this.current = -1; // 选中
							   this.isDefault = 0 ; // 默认传参
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
			radioChange: function(e) {
				console.log('radio发生change事件，携带value值为：', e.detail.value)
				console.log(this.setDefault) 
				this.setDefault = !this.setDefault;
				if(this.setDefault){
					this.isDefault = 1;
					this.current = 0;
					console.log('aaa')
				} else {
					this.isDefault = 0;
					this.current = -1;
					console.log('bbb')
				}
				console.log(this.setDefault) // isDefault：0否，1是
			},
			useWxAddress(){
				uni.chooseAddress().then(res=>{
					let [e,r] = res;
					if(e){
						console.log(e)
						if(e.errMsg=='chooseAddress:fail auth deny'){//首次拒绝 
							this.show = true;
						}else{ //chooseAddress:fail cancel 取消使用
							
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
			
			authAgain(){
				uni.openSetting({
					complete:res=>{
						this.show = false;
					}
				})
			},
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.pickerText = e.label
			},
			addAddress(){//新增或修改地址
				if(this.username==''||this.username== ' '){
					uni.showModal({
						title: "提示",
						content: '请输入正确的姓名',
						showCancel: false
					})
				}else if(!(/^1[0-9]{10}$/.test(this.tel))){ // !(/^[1]{1}[0-9]{10}$/).test(this.tel)
					uni.showModal({
						title: "提示",
						content: '请输入正确的手机号',
						showCancel: false
					})
				} else if(this.pickerText==''){
					uni.showModal({
						title: "提示",
						content: '请选择所在地区',
						showCancel: false
					})
				} else if (this.address==''||this.address==' ') {
					uni.showModal({
						title: "提示",
						content: '请输入正确的详细地址',
						showCancel: false
					})
				} else if(!/^[0-9]{4}$/.test(this.yzcode)){
					uni.showModal({
						title: "提示",
						content: '请输入正确的验证码',
						showCancel: false
					})
				} else {
					if(this.btnType=='update'){//修改编辑
						uni.request({
							url:this.requestUrl+'/vpoints/vpointsAddress/updateAddress',
							method:'POST',
							data:{
								"address": this.address,
								"province":  this.province,
								"city": this.city,
								"county": this.county,
								"openid": getApp().globalData.openid,
								"phoneNum": this.tel,
								"userName": this.username,
								"addressId":this.addressId,
								"captcha":this.yzcode,
								"isDefault":this.isDefault, 
								"projectServerName":'shandongagt'
							}
						}).then(res=>{
							console.log(res)
							let [e,r] = res;
							if(r){
								if(r.data.result.code==0&&r.data.result.businessCode==0){
									uni.showToast({
									    title: '修改地址成功',
									    duration: 2000,
										icon:'none'
									});
									uni.navigateTo({
										url:'./addressList'
									})
								}else{
									uni.showModal({
										title: "提示",
										content: r.data.result.msg?r.data.result.msg:'系统开了个小差',
										showCancel: false
									})
								}
							}else{
								uni.showModal({
									title: "修改地址提示",
									content: '系统繁忙!',
									showCancel: false
								})
							}
						})
					}else{  // 新增
						uni.request({
							url:this.requestUrl+'/vpoints/vpointsAddress/addNewAddress',
							method:'POST',
							data:{
								"address": this.address,
								"province": this.pickerText.split('-')[0],
								"city": this.pickerText.split('-')[1]=='市辖区'?this.pickerText.split('-')[0]:this.pickerText.split('-')[1],
								"county": this.pickerText.split('-')[2],
								"openid": getApp().globalData.openid,
								"phoneNum": this.tel,
								"userName": this.username,
								"captcha":this.yzcode,
								"isDefault":this.isDefault, 
								"projectServerName":'shandongagt'
							}
						}).then(res=>{
							console.log(res)
							let [e,r] = res;
							if(r){
								if(r.data.result.code==0&&r.data.result.businessCode==0){
									uni.showToast({
									    title: '新增地址成功',
									    duration: 2000,
										icon:'none'
									});
									uni.navigateTo({
										url:'./addressList'
									})
								}else{
									uni.showModal({
										title: "提示",
										content: r.data.result.msg?r.data.result.msg:'系统开了个小差',
										showCancel: false
									})
								}
							}else{
								uni.showModal({
									title: "新增地址提示",
									content: '系统繁忙!',
									showCancel: false
								})
							}
						})
					}
				}
			},
			
			deleteAddress(){
				uni.showModal({
					title: "提示",
					content: '确定删除这条地址吗？',
					complete:res=>{
						if(res.confirm){
							uni.request({
								url:this.requestUrl+'/vpoints/vpointsAddress/delAddress',
								method:'POST',
								data:{
									"addressId":this.addressId,
									"projectServerName":'shandongagt'
								}
							}).then(res=>{
								let [e,r] = res;
								if(r){
									if(r.data.result.code==0){
										uni.showToast({
											title: '删除地址成功',
											duration: 1600,
											icon: 'none'
										});
										uni.navigateBack({
											delta:1
										})
									}else{
										uni.showModal({
											title: "提示",
											content: r.data.result.msg?r.data.result.msg:'系统开了个小差',
											showCancel: false
										})
									}
								}else{
									uni.showModal({
										title: "删除地址提示",
										content: '系统繁忙!',
										showCancel: false
									})
								}
							})
						}
					}
				})
			},
			timeout() {
				let timer = null;
				this.sec -= 1;
				if (this.sec <= 0 || this.stop) {
					clearTimeout(timer);
					return this.sec = 0;
				}
				timer = setTimeout(() => {
					this.timeout()
				}, 1000)
			},
			getVerifyCode(){
				if(this.sec!=0){
					return false;
				}else if (!(/^1[0-9]{10}$/.test(this.tel))) {
					uni.showModal({
						title: "提示",
						content: "请输入正确的手机号",
						showCancel: false
					})
				} else {
					uni.showLoading({
						title:'获取验证码',
						mask:true
					})
					uni.request({
						url:this.requestUrl+'/user/getCaptcha',
						method:'POST',
						data:{
							"phonenum":this.tel,
							"sendtype": "1",
							"projectServerName":'shandongagt'
						}
					}).then(res=>{
						uni.hideLoading()
						let [e,r] = res;
						if(r){
							if(r.data.result.code==0&&r.data.result.businessCode==0){//成功
								this.sec = 60;
								this.stop = false;
								this.timeout();//开始倒计时
							}else if(r.data.result.code==0&&r.data.result.businessCode==2){
								uni.showModal({
									title: "提示",
									content: '您填写的手机号错误，发送验证码失败！',
									showCancel: false
								})
							}else{
								uni.showModal({
									title: "获取验证码提示",
									content:'验证码获取失败！请稍后再试并确认手机号是否输入正确',
									showCancel: false
								})
							}
						}else{
							uni.showModal({
								title: "获取验证码提示",
								content: '系统繁忙',
								showCancel: false
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	//编辑、新增地址
	.add_page{
		background: #F8F8F8;
		overflow: hidden;
		.add_msg{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background: #FFF;
			margin:20rpx 24rpx;
			box-sizing: border-box;
			background: #fff;
            border-radius: 20rpx;
			padding: 24rpx;
			.title{
				font-size: 30rpx;
				color: #000;
				border-left: 8rpx solid #4eac6d;
				line-height: 30rpx;
				padding: 0 17rpx;
			}
		}
		.add_msg {
			.item{
				height: 110rpx;
				border-bottom: 1px #E0E0E0 solid;
				display: flex;
				justify-content: space-between;
				text:nth-of-type(1){
					font-size: 30rpx;
					color: #333;
					line-height: 110rpx;
				}
				&.area{
					border-bottom: none;
					.select{
						vertical-align: middle;
						image{
							width: 15rpx;
							padding-top: 42rpx;
						}
					}
				}
				input{
					// width:;
					text-align: right;
					font-size: 28rpx;
					font-weight: 400;
					color: #999;
					vertical-align: middle;
					height: 110rpx;
					line-height: 110rpx;
					&.area{
						width: 70%;
					}
				}
			}
		}
		.get_yz{
			display: flex;
			justify-content: space-between;
			width: 180rpx;
			font-size: 28rpx;
			color: #57BE6F;
			display: block;
			text-align: center;
			align-self: center;
		}
		.yzm{
			width: auto;
		}
		
		.street{
			height: 231rpx;
			background: #F7F7F7;
			border-radius: 10rpx;
			padding: 10rpx 20rpx;
			.tit{
				font-size: 30rpx;
				color: #666;
				line-height: 80rpx;
			}
			.txtarea{
				font-size: 28rpx;
				color: #999;
				height: 160rpx;
				// z-index:100;
				// top: 2rpx;
			}
			// .textareaIos{
			// 	top: -12rpx;
			// }
		}
		.radio-list{
			padding:30rpx 0;
			radio-group{
				display: flex;
				justify-content: space-between;
				width: 100%;
			} 
			.radios{
				display: inline-block;
			}
			.radioName{
				display: inline-block;
				padding-left: 20rpx;
			}
			
			radio .wx-radio-input.wx-radio-input-checked{
			    border-color:#4EAC6D !important;
			    background:#4EAC6D !important;
			}
		}
		//按钮
		.btn_box{
			// width: 100%;
			// // height: 100%;
			// // height: 120rpx;
			// background: #FFFFFF;
			// display: flex;
			// justify-content: center;
			button-bg{
				align-self: center;
				margin: 0 30rpx;
			}
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
</style>

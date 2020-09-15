<template>
	<!-- 输入信息 领取大奖 -->
	<view class="strCode flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="填写信息"></uni-nav-bar>
		
		<view class="strCode-center">
			<view class="submitBox">
				<view class="flex-xsb-yc submitBox-list">
					<view class="submitBox-label flex-xsb-yc">
						<text>姓</text>
						<text>名:</text>
					</view>
					<input maxlength="20" v-model.trim="userName" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入姓名" />
				</view>
				<view class="flex-xsb-yc submitBox-list">
					<view class="submitBox-label flex-xsb-yc">
						<text>手</text>
						<text>机</text>
						<text>号:</text>
					</view>
					<input maxlength="11" v-model.trim="phonenum" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入手机号" />
				</view>
				<!-- <view class="flex-xsb-yc">
					<view class="submitBox-label flex-xsb-yc">
						<text>身</text>
						<text>份</text>
						<text>证</text>
						<text>号</text>
					</view>
					<input maxlength="18" v-model.trim="idcard" :disabled="isGetPrize" class="submitBox-input" type="text" value=""
					 placeholder="请输入身份证号" />
				</view> -->
				<view class="flex-xsb-yc submitBox-checkCode submitBox-list" v-if="isShowVerifycode">
					<view class="submitBox-label flex-xsb-yc">
						<text>验</text>
						<text>证</text>
						<text>码:</text>
					</view>
					<input :disabled="isGetPrize" class="submitBox-input yamInput" type="text" value="" placeholder="请输入验证码" maxlength="4" v-model="verifycode" />
					<button class="yamButton submitBox-button" @click="getyzm">{{ sec == 0 ? '获取验证码' : sec + '秒后再次获取' }}</button>
				</view>
				
				<!-- 世界啤酒大奖礼盒1套 开始 -->
				<view class="submitBox-mes submitBox-checkCode" v-if="prizeTypeStatus == 1">
					<view class="submitBox-mes-title"> 
						<text class="">{{ isDay19?'要酒日':'' }}大奖</text>
					</view>
					<view class=""> {{ isDay19?'“要酒日”':'' }}青岛啤酒2018，世界啤酒大奖礼盒1套 (价值98元) </view>
					<view class=""><text>活动区域：</text>山东省</view>
					<view class=""><text>活动起止时间：</text>2020年1月-2020年12月，每月19日</view>
					<view class=""><text>兑奖截止时间：</text>2021年7月31日</view>
					<view class="duihuanMes" @click="showCustomDialog(1)"> <text>兑奖方法>></text></view>
				</view>
				<!-- 世界啤酒大奖礼盒1套 结束 -->
				<!-- 冰墩墩 开始-->
				<view class="submitBox-mes submitBox-checkCode" v-else-if="prizeTypeStatus == 2">
					<view class="submitBox-mes-title"> 
						<text class="">畅赢奖</text>  
					</view>
					<view class="">价值2999元“冬奥黄金冰墩墩”吊坠1个（共100套）</view>
					<view class=""><text>活动区域：</text>山东省</view>
					<view class=""><text>活动截止时间：</text>2020年1月31日</view>
					<view class=""><text>兑奖截止时间：</text>2021年7月31日</view>
					<view class="duihuanMes" @click="showCustomDialog(2)"><text>查看兑奖地址及电话>></text></view>
				</view>
				<!-- 冰墩墩 结束-->
				<button :disabled="isDisabled" :class="[isDisabled?'submitBox-submit-dis':'submitBox-submit','vmdTijiaoxinxi']" @click="submitFun">{{ submitFont }}</button>
			</view>
		</view>
		<view class="strCode-footer">
			<!-- 判断 大奖是 19日 还是 冰墩墩 -->
			<block v-if="prizeTypeStatus == 1">	
				<view class="">1、温馨提示：请尽快拨打：400-680-0899核实中奖者身份 信息，以上信息须完整，真实填写，否则无法兑奖。中奖 瓶盖及拉环是唯一兑奖依据，请妥善保管。 兑奖时间：工作日下午14:00-17:00</view>
				<view class="">2、温馨提示：奖品图片仅供参考，具体样式以实物为准，中奖者需提供完整的中奖瓶盖或拉环，以及个人身份证复印件供我公司或我公司委托的第三方公司核实确认。</view>
			</block>
			<block v-else>
				<view class="">
					温馨提示：奖品图片仅供参考，具体样式以实物为准，中奖者需提供完整的中奖瓶盖或拉环，以及个人身份证复印件供我公司或我公司委托的第三方公司核实确认。
				</view>
			</block>
		</view>
		
		<!-- 弹窗 -->
		<custom-dialog ref="customDialogChild" :customDialogIsShow="customDialogIsShow" :customDialogType="customDialogType"
		 @customDialogColse="updateCustomDialogColse"></custom-dialog>
		
		<!-- 提交信息后 toast 提示 带有 我知道了 按钮  -->
		<view class="customToast" v-show="isShowcCustomToast">
			<view class="customToast-warp">
				<view class="customToast-title">
					您的中奖信息我们已经收到，请尽快 拨打兑奖电话联系我们进行身份核实。
				</view>
				<view class="customToast-confirm" @click="updateCustomToast">
					我知道了
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		savePrize,
		getCaptcha
	} from '@/common/getData.js';
	import {
		idcardValidate
	} from '@/common/basicsFun.js';
	import customDialog from '@/components/customDialog.vue';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		customFooterBar
	} from '@/components/custom-footer-bar/custom-footer-bar.vue'; // 自定义页脚
	export default {
		components: {
			customDialog,
			uniNavBar,
			customFooterBar
		},
		computed: {
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			safeAreaTop() {
				const userSystemInfo = uni.getStorageSync('userSystemInfo');
				let safeAreaTop = '30'
				if(userSystemInfo){
					safeAreaTop = userSystemInfo.safeArea.top==0?'30':userSystemInfo.safeArea.top;
				} else {
					safeAreaTop = '30';
				}
				console.log('safeAreaTopsafeAreaTopsafeAreaTopsafeAreaTop');
				console.log(safeAreaTop);
				return safeAreaTop;
			},
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			isOpenAdaptation() {
				console.log(this.windowHeight);
				if (this.windowHeight > 800) {
					return true;
				} else {
					return false;
				}
			},
		},
		data() {
			name: 'strcode';
			return {
				openid: '',
				staticUrl: config.staticUrl,
				customDialogType: 2, // 提交成功后 提示
				customDialogIsShow: false, // 提交成功后 提示
				userName: '',
				phonenum: '',
				verifycode: '', //验证码
				isShowVerifycode: false, //当领取过 大奖以后不展示 验证码盒子
				idcard: '',
				phonenumReg: /^1[0-9]{10}$/, //手机号验证
				codeReg: /[0-9]{4}/, //验证码验证
				submitFont: '提交',
				isDisabled: false, //提交按钮 是否 可点击
				isGetPrize: false, // 是否已拥有大奖 有（重复扫码） 直接显示信息 没有 显示填写信
				
				sec: '',
				prizeType:'1' ,//大奖 类型
				prizeTypeStatus:'' ,// 1：青啤有一套 2：冰墩墩 大奖
				isShowcCustomToast: false, //是否 显示自定义toast 目前展示 用做提交信息成功后 提示
				isDay19:false ,// 是否是 19 日 活动
				pageSource:''//页面来源 当从 getCash 页面过来 返回到首页 其余返回上一级页面
			};
		},
		async onLoad(options) {
			const that = this;
			console.log(options);
			// 判断 大奖类型 
			if(options.prizeType == 'p' || options.prizeType == 'P'){
				// 青啤 有一套 
				this.prizeTypeStatus = 1 ;
			}else if(options.prizeType == 'P01' || options.prizeType == 'p01'){
				// 冰墩墩 大奖
				this.prizeTypeStatus = 2 ;
			} 
			
			this.isDay19 = options.isDay19=='false'?false:true || false;
			
			this.pageSource = options.pageSource ;
			this.isGetPrize = options.isGetPrize == 'true' ? true : false;
			// 如果已领取大奖 回显信息
			if (this.isGetPrize == true) {
				const sweepQrcodeData = uni.getStorageSync('sweepQrcodeData');
				if (sweepQrcodeData.reply) {
					if(sweepQrcodeData.reply.username){
						that.userName = sweepQrcodeData.reply.username;
						that.phonenum = sweepQrcodeData.reply.phonenum;
						that.idcard = sweepQrcodeData.reply.idcard;
					}else if (przieUserData!=undefined) {
						that.userName = przieUserData.nickName;
						that.phonenum = przieUserData.phonenum;
						that.idcard = przieUserData.idcard;
					}
				} else if (przieUserData!=undefined) {
					that.userName = przieUserData.nickName;
					that.phonenum = przieUserData.phonenum;
					that.idcard = przieUserData.idcard;
				} else {
					that.userName = '';
					that.phonenum = '';
					that.idcard = '';
				}
				that.submitFont = '您已提交';
				that.isDisabled = true;
				// 显示 自定tab
				// this.$refs.customFooterBarChild.isStartAnimationFun(true); //开启tab动效
				this.isShowVerifycode = false; //隐藏 获取二维码结构
			} else {
				// 显示 自定tab
				this.isShowVerifycode = true; //显示 获取二维码结构
			}
		},
	
		methods: {
			submitFun() {
				const that = this;
				if (that.userName == '' || that.userName == undefined) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的姓名哦！~'
					});
				} else if (!that.phonenumReg.test(that.phonenum)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的手机号！~'
					});
				} else if (!that.codeReg.test(that.verifycode)) {
					uni.showModal({
						title: '提示',
						content: '请输入正确的验证码！~'
					});
				} else {
					that.submitForm();
				}
			},
			submitForm() {
				const that = this;
				
				const userData = uni.getStorageSync('openid');
				const openid = userData.openid;
				// 统一 都定义 领取大奖 所需参数 扫码 和 列表 再领取
				const getPrizeSendData = getApp().globalData.getPrizeSendData;
				const sendParams = {
					openid: openid,
					// skukey: skukey,
					prizeVcode: getPrizeSendData.prizeVcode,
					username: this.userName,
					phonenum: this.phonenum,
					captcha: this.verifycode,
					idcard:'idcard' // 写死 必传参数
				};
				savePrize(sendParams).then(res => {
					console.log(res);
					if (res==1) {
						//  显示成功 提示
						this.isShowcCustomToast = true;
					}else if(res==4){
						// 备注
						const redirectToUrl = `../codeScanned/codeScanned?bizcode=7`;
						uni.navigateTo({
							url:redirectToUrl
						})
					}
				});
			},
			// 返回
			back() {
				if(this.pageSource && this.pageSource == 'getCash'){
					uni.switchTab({
						url:'/pages/index/index'
					})
				}else{
					uni.navigateBack(1);
				}
			},
			getyzm() {
				const that = this;
				if (that.sec > 0) {
					return false;
				}
				console.log(that.phonenum);
				if (!that.phonenumReg.test(that.phonenum)) {
					uni.showModal({
						title: '提示',
						content: '请填写正确的手机号！~',
						showCancel: false
					});
				} else {
					getCaptcha(that.phonenum)
						.then(res => {
							if (res.result.businessCode == 0) {
								that.sec = 60;
								that.timer();
							} else {
								uni.showModal({
									title: '提示',
									content: '验证码获取失败！请稍后再试并确认手机号是否输入正确'
								});
							}
						})
						.catch(err => {});
				}
			},
			timer() {
				let timer = null;
				let that = this;
				if (this.stop || this.sec <= 0) {
					this.sec = 0;
					return false;
				}
				this.sec -= 1;
				timer = setTimeout(() => {
					this.timer();
				}, 1000);
			},
			// 关闭 自定义toast 目前用作 提交信息成功后 提示
			updateCustomToast() {
				const that = this;
				that.isShowcCustomToast = false;
				that.submitFont = '您已提交'
				that.isGetPrize = true;
				that.isDisabled = true;
				that.isShowVerifycode = false; // 提交成功后 隐藏 提示语和 验证码
			},
			showCustomDialog(type){
				this.customDialogType = type ;
				this.customDialogIsShow = true ;
			},
			updateCustomDialogColse(){
				this.customDialogIsShow = false ;
			}
		}
	};
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	button {
		padding: 0;
	}

	button::after {
		border: none;
	}

	input {
		outline: none;
		border: none;
		list-style: none;
	}

	button[disabled] {
		color: #A87328 !important;
	}
	.strCode {
		// overflow: hidden;
		min-height: 100%;
		background: url($commonImg+'sucBg.png') no-repeat center;
		background-size: cover;
	}
 
	
	// 新
	.strCode-center {
		flex: 1;
		margin-top: 20rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		background: #fff;
		padding: 8rpx 44rpx 30rpx 44rpx;
		border-radius: 20rpx;
		position: relative;
		border: 7rpx #F7E3B5 solid;
	}
	
	.submitBox-input {
		color: #333;
	}
	
	// .submitBox button {
	// 	margin: 0;
	// 	color: #221596;
	// 	font-size: 30rpx;
	// 	background: #fff;
	// 	border: 2rpx solid #3c00a6;
	// }
	.submitBox-checkCode {
		// margin-top: 28rpx;
	}
	
	.submitBox-strcode {
		margin-bottom: 28rpx;
	}
	
	.submitBox input::-webkit-input-placeholder {
		color: #999999;
	}
	
	.submitBox-submit {
		width: 78%;
		margin-left: 11%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #814e05;
		margin-top: 54rpx;
		border-radius: 20rpx;
		background: linear-gradient(to top, rgba(255, 170, 11, 1), rgba(249, 211, 0, 1));
	}
	.submitBox-submit-dis {
		width: 78%;
		margin-left: 11%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #814e05;
		margin-top: 54rpx;
		border-radius: 20rpx;
		background: linear-gradient(to top,rgba(255, 204, 36, .5),rgba(255, 204, 36, .5));
	}
	.submitBox {
		.submitBox-list:not(:last-child) {
			// margin-bottom: 26rpx;
			border-bottom:1rpx solid #DEDEDE;
			height: 108rpx;
			line-height: 108rpx;
		}
	}
	.submitBox input {
		height: 108rpx;
		line-height: 108rpx;
		// padding-left: 32rpx;
		font-size: 28rpx;
		flex: 1;
	}
	.submitBox-label {
		width: 130rpx;
		margin-right: 20rpx;
		font-size: 32rpx;
		color: #333333;
		text-align: justify;
	}
	.submitBox .yamInput {
		flex: 1;
		margin-right: 20rpx;
	}
	.submitBox-button {
		width: 246rpx;
		margin: 0;
		color: #ED7500;
		font-size: 30rpx;
		border-left: 1rpx solid #CCCCCC;
		height: 68rpx;
		line-height: 68rpx;
		background-color: transparent;
		border-radius: 0;
	}
	.submitBox-mes{
		font-size: 26rpx;
		line-height: 42rpx;
		color: #333333;
		margin-top: 60rpx;
		text{
			color: #00853F;
		}
		.duihuanMes{
			margin-top: 48rpx;
			text-align: center;
			text{
				text-decoration:underline;
			}
		}
		.submitBox-mes-title{
			text{
				font-size: 28rpx;
				color: #333333;
				border-bottom: 7rpx solid #FFB90D;
			} 
		}
	}
	.strCode-footer{
		margin: 36rpx 38rpx;
		color: #777777;
		font-size: 24rpx;
		line-height: 36rpx;
		>view:not(:last-child){
			margin-bottom: 26rpx;
		}
	}
	
	// 自定义 toast
	.customToast {
		width: 74%;
		position: fixed;
		top: 50%;
		left: 13%;
		transform: translateY(-50%);
		background: #000000;
		opacity: .8;
		border-radius: 20rpx;
		.customToast-warp {
			margin: 84rpx 54rpx 40rpx 54rpx;
		}
	
		.customToast-title {
			color: #FFFFFF;
			font-size: 26rpx;
		}
	
		.customToast-confirm {
			margin-top: 50rpx;
			color: #FFB90D;
			font-size: 30rpx;
			text-align: center;
		}
	}
</style>

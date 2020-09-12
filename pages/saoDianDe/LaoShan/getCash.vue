<template>
	<!-- 崂山版 中出红包 -->
	<custom-template ctheight='1334' :ctbackground='ctbackground'>
		<view class="getCash">
			<!-- 累计金额 目前没有展示 不在本页面提现 -->
			<view class="mark" id="mark" v-if="isShowCumulative">
				<image :src="LaoShanImg+'sun.png?v=2.0'" class="sun"></image>
				<image :src="LaoShanImg+'star_1.png?v=2.0'" class="star1"></image>
				<image :src="LaoShanImg+'star_2.png?v=2.0'" class="star2"></image>
				<image :src="LaoShanImg+'star_3.png?v=2.0'" class="star3"></image>
				<view class="noticeMark">
					<view class="p1">累计金额</view>
					<view class="p2">￥<text id="tolMoney"></text>元</view>
				</view>
			</view>
			<!-- 提现到账通知 目前没有展示 不在本页面提现-->
			<view class="mask" id="wxmark" v-if="isShowWithdrawalSuc">
				<image :src="LaoShanImg+'l-logo.png'" class="logo" mode="widthFix"></image>
				<image :src="LaoShanImg+'l-wx-tip.png'" class="l-wx-tip" mode="widthFix"></image>
				<view class="tip-text">
					<view>亲，注意聊天消息里的【服务通知】</view>
					<view>看到这样的消息72小时内点开收钱！</view>
				</view>
				<view class="mask-btn" @click="goWinningRecord">
					<view class="ck mask-ck">我知道了</view>
				</view>
			</view>

			<!-- 红包展示 -->
			<view class="bg" v-else>
				<image :src="LaoShanImg+'l-logo.png'" class="logo" mode="widthFix"></image>
				
				<view class="unopened-bag" v-if="isOpenedCash">
					<view class="turntable-box">
						<image :src="LaoShanImg+'l-turntable.png'" class="turntable" alt="" mode="widthFix"></image>
						<image :src="LaoShanImg+'l-slogan.png'" class="t-slogan" alt="" mode="widthFix"></image>
					</view>
					<view class="bag bag-animation">
							<image :src="LaoShanImg+'l-bag-btn.png'" mode="widthFix"></image>
							<button class="open-btn" @click="openFun">立即领取</button>
					</view>
					<image :src="LaoShanImg+'l-glasses.png'" alt="" class="glass-logo" mode="widthFix"></image>
				</view>

				<view class="opened-bag" v-else>
					<image :src="LaoShanImg+'activity-rule.png'" class="activity-rule" id="activity-rule" mode="widthFix"></image>
					<view class="bag">
						<image :src="LaoShanImg+'l-bag-btn-open.png'" mode="widthFix"></image>
						<view class="notice">
							<!-- 19活动 -->
							<view class="day19" v-if="isDay19">
								<view class="dp1">恭喜您获得</view>
								<view class="dp2">“要酒日”大红包</view>
								<view class="dp3"><text>￥</text><text class="money">{{ currentMoney }}</text><text>元</text></view>
								<view class="dp4">本月“要酒日”扫到第<text class="day-num">{{ perMantissaNum }}</text>支</view>
							</view>

							<view v-else>
								<!-- 中奖显示金额 -->
								<view class="" v-if="!isOpened">
									<image style="display: none;" id="repscan" :src="LaoShanImg+'rep-scan.png'" mode="widthFix"></image>
									<view class="p1" id="title">{{ titleName }}</view>
									<view class="p2" v-show="isShowDomp2"><text id="span1">￥</text><text id="money" class="money">{{ currentMoney }}</text><text id="span2">元</text></view>
								</view>
								<!-- 已经扫过 -->
								<view class="" v-else>
									<view class="p3">您已扫过</view>
									<view class="p4">每瓶仅限扫码一次</view>
								</view>
							</view>

						</view>
						<view class="total-money" style="display: none;">您的账户余额<text class="allMoneyNum">{{ totalAccountMoney }}</text>元</view>
						<view class="repeat-tip">
							<text class="repeat-time"></text>
							<text class="repeat-money"></text>
						</view>
						<!-- <input type="button" :value="" id="btn" class="btnFont" @click="btnFontFun"> -->
						<button class="btnFont" @click="btnFontFun">{{ btnFont }}</button>
					</view>
					<view class="msg">
						<view>红包累计大于等于1元后可提现</view>
						<view>不足1元的红包将存入零钱包</view>
					</view>
				</view>

				<!-- 城市酒王小程序 -->
				<image :src="LaoShanImg+'icon_jw.png?v=1'" class="icon_jw" mode="widthFix" @click="jiuwangLogFun"></image>
				<view class="alert_jw" v-show="isShowJiuWangBox">
					<view class="close" @click="closeJiuWang"></view>
					<image :src="LaoShanImg+'alert_jw.png'" mode="widthFix"></image>
				</view>
				<!-- 活动广告页 暂无 之前版本 2019.5.5日并且dayScanNum<3 显示 -->
				<view class="active">
					<!-- <img src="img/logo.png" class="logo logo1"> -->
					<!-- <img src="/v/sdqp-common2.0/img/20190430.png" class="activeMain">
			        <img src="img/close.png" class="activeClose"> -->
				</view>
			</view>
		
		</view>
	</custom-template>
</template>
<!-- have read -->
<script>
	import {
		config
	} from '@/utils/api.js';
	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue';
	import {
		giveSpackTx,
		ifremeber
	} from '@/common/getData.js';
	import {
		analysisMobile,
		getCode,
		getOpenid,
		checkSession
	} from '@/common/getWxUserInfor.js';
	export default {
		name: 'getCash',
		components: {
			customTemplate
		},
		props: {},
		computed: {
			// 按钮文字
			btnFont() {
				/**
				 * 点击按钮 进行是否 关注公众号判断 
				 * 		没有 跳转引导关注公众号页面
				 * 		有跳转 我的红包 页面 
				 * */
				const that = this;
				let returnData = '';
				if (that.totalAccountMoney >= 1 && (that.bizcode != '11' && that.again != 'true')) {
					returnData = '立即提现';
				} else {
					if (that.bizcode == '11' || that.again == 'true') {
						returnData = '查看红包余额';
					} else {
						returnData = '存入我的零钱包';
					}
				}
				return returnData;
			},
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				LaoShanImg: config.staticUrl + 'LaoShanImg/',
				ctbackground: config.staticUrl + 'LaoShanImg/l-bg.png',
				gctAni: '',
				isWinningPrize: true,
				isShowWithdrawalSuc: false, //是否显示 提现成功
				isShowCumulative: false, //是否显示 累计金额
				
				isOpened: true,
				repeatTime: '',
				repeatMoney: '',
				titleName: '恭喜您获得',
				isDay19: false,
				isShowJiuWangBox: '', //是否显示 酒王弹窗

				currentMoney: '', //中奖金额
				totalAccountMoney: '', //累计金额
				openid: '',
				earnTime: '',
				bizcode: '',
				again: '',
				hbopenid: '', //红包openid
				APPID: '',
				flag: true, //提现标志
				PROJECT: 'sdqp-laoshan',

				perMantissaNum:'',
				scanCodeReply:'',
				
				isShowDomp2 : true,
				
				isOpenedCash:true ,// 是否显示 中出红包 true：先展示 动效 然后单击 立即领取 展出 红包
				
				
				isHasPhoneNumber: false, //是否 已获取手机号
				
				isGiveSpackTx: false, // 提现标识
			};
		},
		onLoad(options) {
			const { bizcode } = options;
			this.bizcode = bizcode;
			const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
			if (backStorage) {
				this.isHasPhoneNumber = true;
			} else {
				this.isHasPhoneNumber = false;
			}
			
			this.openid = this.openid ? this.openid : uni.getStorageSync('openid').openid;
			this.sortingParameters()
			this.init()
			
		},
		onShow() {
				if (this.isGiveSpackTx) {
					this.giveSpackTxFun();
				}
		},
		methods: {
			goWinningRecord(){
				uni.navigateTo({
					url:'/pages/saoDianDe/winningRecord/winningRecord'
				})
			},
			btnFontFun(){
				if(this.btnFont == '存入我的零钱包'){
					uni.navigateTo({
						url:'/pages/saoDianDe/winningRecord/winningRecord'
					})
				}else if(this.btnFont == '立即提现'){
					this.giveSpackTxFun()
				}
			},
			init() {
				// if (this.bizcode == '11' || again == 'true') {
				if (this.bizcode == '11') {
					this.isOpened = true; //是否 重复扫标识
					this.repeatTime = `您已于 ${this.earnTime} 扫过这瓶酒`
					this.repeatMoney = `并获得了 ${this.currentMoney} 元`
					
				} else {
					// $('.unopened-bag').show();
					this.isOpened = false; //是否 重复扫标识
					if (Number(this.currentMoney) == 0) {
						// 中出金额 0 
						
						// dom_p2.style.display = 'none';
						this.isShowDomp2 = false ;
						this.titleName = '你离红包只差一点点';

					} else if (this.scanCodeReply.perMantissaPrize && bizcode != 21) { //逢19开启
						// 19日 活动 
						const perMantissaNum = this.scanCodeReply.perMantissaPrize.perMantissaNum;
						// 缓存中提取perMantissaPrize.perMantissaNum
						this.perMantissaNum = perMantissaNum;
						this.isDay19 = true;
					}
				}
			},
			// 整理参数
			sortingParameters(){
				// 重复扫码
				const scanCodeReply = uni.getStorageSync('sweepQrcodeData').reply || {};
				const currentMoney = scanCodeReply.currentMoney || 0;
				// 从缓存中拿所需数据
				const earnTime = scanCodeReply.earnTime || '';
				const totalAccountMoney = scanCodeReply.totalAccountMoney || '';
				// 缓存中提取perMantissaPrize.perMantissaNum
				this.scanCodeReply = scanCodeReply;
				
				this.currentMoney = currentMoney;
				this.earnTime = earnTime;
				this.totalAccountMoney = totalAccountMoney;
				
			},
			lingqiFun() {
				this.gctAni = 'getCash-center-top-end';
			},
			openFun() {
				/**
				 * 隐藏 红包展示
				 * 显示 红包领取
				 * 显示 酒王 弹窗
				 * 弹窗组件
				 * */
				 this.isOpenedCash = false ;
			},
			// 点击 酒王logo 显示酒王弹窗
			jiuwangLogFun() {
				// 显示 酒王 弹窗  隐藏酒王logo
				this.isShowJiuWangBox = true;
			},
			// 关闭 酒王 弹窗
			closeJiuWang(){
				this.isShowJiuWangBox = false;
			},
			
			giveSpackTxFun() {
				console.log("我要提现了");
				ifremeber().then((res)=>{
					if(res == 1){
						// 已关注
						this.isGiveSpackTx = true; // 提现标识
						this.hbopenid = this.hbopenid ? this.hbopenid : uni.getStorageSync('hbopenid').hbopenid;
						
						if (this.hbopenid) {
							// 调用提现接口
							this.giveSpackTxRequest();
						} else {
							uni.navigateTo({
								url: '/pages/getOpenid/getOpenid?getIdType=hbopenid'
							})
						}
					}else{
						// 没有关注 引导关注 跳转到 推文页面
						
					}
				})
			},
			giveSpackTxRequest() {
				const that = this;
				giveSpackTx(that.openid, that.hbopenid).then(
					res => {
						const businessCode = res.businessCode;
						if (businessCode == 0) {
							// 提现成功
							// that.getCashIsShowMes = true;
							
							// const totalMoney = this.showData.totalMoney;
							// uni.navigateTo({
							// 	url:'/pages/saoDianDe/common/getCashSuc?totalMoney='+totalMoney
							// })
							this.isShowWithdrawalSuc = true ;
							
						} else if (businessCode == 5) {
							uni.showModal({
								title: '提示',
								content: res.msg
							});
						} else {
							// 提现失败 提示
							// 隐藏 红包收入 图片
							uni.showModal({
								title: '提示',
								content: res.msg
							});
						}
					},
					errCode => {
						if (errCode == '-1') {
							uni.showModal({
								title: '尊敬的用户',
								content: '系统升级中...'
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '呜呜，服务开了个小差，请稍后重试！'
							});
						}
					}
				);
			},
			
			// 获取手机号
			async getPhoneNumber(e) {
				const backDetail = e.detail;
				if (backDetail.errMsg.lastIndexOf('ok') != -1) {
					//成功getPhone
					const userData = uni.getStorageSync('userData');
					console.log('getPhoneNumbergetPhoneNumbergetPhoneNumber');
					console.log(userData);
					//解析手机号
					if (userData) {
						console.log('getPhoneNumbergetPhoneNumbergetPhoneNumber000000');
						// this.parsePhone(e) //解析手机号码
						const session_key = userData.uinfo.session_key;
						analysisMobile(session_key, backDetail).then(backData => {});
					} else {
						console.log('getPhoneNumbergetPhoneNumbergetPhoneNumber1111111');
						const backUserData = await this.getUserDataFun();
						const session_key = backUserData.session_key;
						analysisMobile(session_key, backDetail);
					}
				} else {
			
				}
				// 无论是否同意 获取手机号 都调用方法
				this.giveSpackTxFun();
			},
			
			// 验证缓存中 是否 存在用户信息（openid、sessiong_key）
			async getUserDataFun() {
				/**
				 * 
				 */
				let returnUserData = '';
				const that = this;
				//用户缓存信息
				const userData = uni.getStorageSync('userData');
				if (userData) {
					// 如果用户信息存在 判断 session 是否过期 0未过期 1已过期
					const checkSessionStatus = await checkSession();
					if (checkSessionStatus == 0) {
						returnUserData = userData.uinfo;
					} else {
						// 获取 小程序 code 请求接口换取 openid session_key
						const xcxCode = await getCode();
						// 拿小程序 code 换取 openid
						const backOpenidData = await getOpenid(xcxCode, 'sdqp');
						if (backOpenidData.uinfo) {
							returnUserData = backOpenidData.uinfo;
						}
					}
				} else {
					// 获取 小程序 code 请求接口换取 openid
					const xcxCode = await getCode();
					const backOpenidData = await getOpenid(xcxCode, 'sdqp');
					if (backOpenidData.uinfo) {
						returnUserData = backOpenidData.uinfo;
					}
				}
				return returnUserData;
			},
		}
	};
</script>

<style scoped lang="scss">
	button {
		border: none;

		&::after {
			border: none;
		}
	}

	image {
		display: block;
		margin: 0 auto;
	}

	/* 太阳旋转 */
	@-webkit-keyframes change {
		0% {
			transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
		}
	}

	/* 星星闪烁 */
	@-webkit-keyframes star {
		0% {
			opacity: 0;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	/* 淡出 */
	@-webkit-keyframes out {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}


	@-webkit-keyframes turn {
		0% {
			transform: rotate(60deg) scale(0.02) translateZ(0);
			-webkit-transform: rotate(60deg) scale(0.02) translateZ(0);
			opacity: 1;
		}

		17.5% {
			transform: rotate(60deg) scale(0.1) translateZ(0);
			-webkit-transform: rotate(60deg) scale(0.1) translateZ(0);
		}

		35% {
			transform: rotate(240deg) scale(1) translateZ(0);
			-webkit-transform: rotate(240deg)scale(1)translateZ(0);
		}

		41% {
			transform: rotate(300deg) scale(0.8) translateZ(0);
			-webkit-transform: rotate(300deg) scale(0.8) translateZ(0);
		}

		47% {
			transform: rotate(360deg) scale(1) translateZ(0);
			-webkit-transform: rotate(360deg) scale(1) translateZ(0);
			opacity: 1;
		}

		59% {
			transform: rotate(360deg) scale(1) translateZ(0);
			-webkit-transform: rotate(360deg) scale(1) translateZ(0);
			opacity: 1;
		}

		90% {
			transform: rotate(360deg) scale(1) translateZ(0);
			-webkit-transform: rotate(360deg) scale(1) translateZ(0);
			opacity: 1;
		}

		100% {
			transform: rotate(360deg) scale(1) translateZ(0);
			-webkit-transform: rotate(360deg) scale(1) translateZ(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes lslogan {
		0% {
			transform: scale(0.1) translateZ(0);
			-webkit-transform: scale(0.1) translateZ(0);
			opacity: 1;
		}

		13.5% {
			transform: scale(0.8) translateZ(0);
			-webkit-transform: scale(0.8) translateZ(0);
		}

		47% {
			transform: scale(0.8) translateZ(0);
			-webkit-transform: scale(0.8)translateZ(0);
		}

		53.5%,
		58% {
			transform: scale(1) translateZ(0);
			-webkit-transform: scale(1) translateZ(0);
			opacity: 1;
		}

		72%,
		100% {
			transform: scale(0.1) translateZ(0);
			-webkit-transform: scale(0.1) translateZ(0);
			opacity: 0;
		}
	}

	@-webkit-keyframes lbag {
		0% {
			transform: scale(0.1) translateZ(0);
			-webkit-transform: scale(0.1) translateZ(0);
			opacity: 0;
		}

		65% {
			transform: scale(0.1) translateZ(0);
			-webkit-transform: scale(0.1) translateZ(0);
			opacity: 0;
		}

		65.5% {
			transform: scale(0.1) translateZ(0);
			-webkit-transform: scale(0.1) translateZ(0);
			opacity: 1;
		}

		80% {
			transform: scale(1) translateZ(0);
			-webkit-transform: scale(1)translateZ(0);
			opacity: 1;
		}

		83% {
			transform: rotate(-7deg) translateZ(0);
			-webkit-transform: rotate(-7deg) translateZ(0);
			opacity: 1;
		}

		90% {
			transform: rotate(7deg) translateZ(0);
			-webkit-transform: rotate(7deg) translateZ(0);
			opacity: 1;
		}

		93% {
			transform: rotate(0deg) translateZ(0);
			-webkit-transform: rotate(0deg) translateZ(0);
			opacity: 1;
		}

		96% {
			transform: rotate(-7deg) translateZ(0);
			-webkit-transform: rotate(-7deg) translateZ(0);
			opacity: 1;
		}

		100% {
			transform: rotate(0deg) translateZ(0);
			-webkit-transform: rotate(0deg) translateZ(0);
			opacity: 1;
		}
	}

	@-webkit-keyframes lglass {

		0%,
		60% {
			opacity: 1;
		}

		61%,
		100% {
			opacity: 0;
		}
	}

	.getCash {
		height: 100%;
	}

	// logo
	.logo {
		width: 232rpx;
		position: absolute;
		top: 120rpx;
		left: 60rpx;
	}

	.turntable-box {
		width: 650rpx;
		height: 650rpx;
		position: absolute;
		top: 239rpx;
		left: 56rpx;
	}

	.turntable {
		width: 100%;
		height: 100%;
		opacity: 0;
		animation: turn 2.4s linear;
		-webkit-animation: turn 2.4s linear;
		transform-origin: 50% 50%;
		-webkit-transform-origin: 50% 50%;
	}

	.t-slogan {
		width: 636rpx;
		height: 328rpx;
		position: absolute;
		top: 184rpx;
		left: 20rpx;
		opacity: 0;
		animation: lslogan 2.4s linear;
		-webkit-animation: lslogan 2.4s linear;
		transform-origin: 50% 50%;
		-webkit-transform-origin: 50% 50%;
	}

	.glass-logo {
		width: 98rpx;
		position: absolute;
		right: 60rpx;
		top: 800rpx;
		opacity: 0;
		animation: lglass 2.4s linear;
		-webkit-animation: lglass 2.4s linear;
	}

	.bag.bag-animation {
		width: 100%;
		position: absolute;
		top: 268rpx;
		// left: 114rpx;
		animation: lbag 2.8s linear;
		-webkit-animation: lbag 2.8s linear;
		transform-origin: 50% 50%;
		-webkit-transform-origin: 50% 50%;

		image {
			width: 520rpx;
		}
	}

	.bag image {
		width: 100%;
		position: absolute;
		top: 0%;
		left: 0%;
	}

	.open-btn {
		width: 67%;
		height: 92rpx;
		position: absolute;
		bottom: 114rpx;
		left: 0;
		border: none;
		background: none;
		text-align: center;
		font-size: .7249rem
			/* 34/46.9 */
		;
		font-weight: 500;
		font-family: '微软雅黑';
		line-height: 92rpx;
		color: #9a4820;
		z-index: 1;
	}

	// 领取红包后的 展示
	.activity-rule {
		width: 170rpx
			/* 170/46.9 */
		;
		position: absolute;
		top: 120rpx
			/* 66/46.9 */
		;
		right: 0;
	}

	.bag {
		width: 520rpx
			/* 519/46.9 */
		;
		height: 637rpx
			/* 743/46.9 */
		;
		position: absolute;
		top: 340rpx
			/* 280/46.9 */
		;
		left: 50%
			/* 115/46.9 */
		;
		margin-left: -260rpx;

		image {
			width: 100%;
			position: absolute;
			top: 0%;
			left: 0%;
		}
	}

	.notice {
		width: 100%;
		height: 184rpx;
		position: absolute;
		top: 80rpx
			/* 84/46.9 */
		;
		left: 0;
		z-index: 50;
	}

	.is19 {
		height: 7rem;
		top: 0.4rem;
	}

	.p1,
	.p3 {
		text-align: center;
		width: 100%;
		font-size: 32rpx
			/* 32/46.9 */
		;
		font-family: '微软雅黑';
		color: #825617;
	}

	.p2,
	.p4 {
		text-align: center;
		width: 100%;
		font-size: 56rpx;
		font-family: '微软雅黑';
		font-weight: 600;
		color: #b36321;
		margin-top: 54rpx
			/* 55/46.9 */
		;
		font-weight: 500;
	}

	.repeat-tip {
		width: 100%;
		height: .9808rem
			/* 46/46.9 */
		;
		line-height: .9808rem
			/* 46/46.9 */
		;
		text-align: center;
		position: absolute;
		top: 10.661rem
			/* 500/46.9 */
		;
		color: #fff;
		font-size: .597rem
			/* 28/46.9 */
		;
		line-height: .6823rem
			/* 32/46.9 */
		;
		display: none;
	}

	.open-btn{
		width: 67%;
		height: 92rpx;
		position: absolute;
		bottom: 94rpx;
		left: 10rpx;
		border: none;
		text-align: center;
		font-size: 34rpx
			/* 34/46.9 */
		;
		font-weight: 500;
		font-family: '微软雅黑';
		line-height: 2rem;
		color: #9a4820;
		z-index: 1;
	}
.btnFont{
	width: 67%;
	height: 92rpx;
	position: absolute;
	bottom: -58rpx;
	background: none;
	left: 90rpx;
	border: none;
	text-align: center;
	font-size: 34rpx
		/* 34/46.9 */
	;
	font-weight: 500;
	font-family: '微软雅黑';
	line-height: 2rem;
	color: #9a4820;
	z-index: 1;
}
	// 山西酒王 logo
	.icon_jw {
		width: 20%;
		position: absolute;
		right: 6rpx;
		top: 182rpx;
		// visibility: hidden;
	}

	.msg {
		width: 75%;
		height: 15%;
		position: absolute;
		top: 1100rpx;
		left: 13%;
	}

	.msg view {
		width: 100%;
		line-height: .8529rem
			/* 40/46.9 */
		;
		text-align: center;
		font-size: 28rpx;
			/* 24/46.9 */
		;
		color: #9b4600;
	}

	.msg view:nth-of-type(1) {
		margin-top: .6397rem
			/* 30/46.9 */
		;
	}

	// 酒王 弹窗 
	.alert_jw {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 60;
		background: rgba(0, 0, 0, .8);
		justify-content: center;
		flex-direction: column;
		&>view {
			width: 80rpx;
			height: 80rpx;
			position: relative;
			bottom: -178rpx;
			margin: 0 auto;
			z-index: 1;
			right: -38%;
		}

		image {
			width: 80%;
			display: block;
			margin: 0 auto;
			margin-top: 100rpx;
			transform: translateX(4%);
		}
		
	}
	.mask{
		margin-top: 40%;
	}
	.mask-btn{
		margin: 0 auto;
		height: 100rpx;
		line-height: 100rpx;
		width: 50%;
		text-align: center;
		background: url($saoDianDe+'LaoShanImg/l-btn.png') no-repeat;
		background-size: 100% 100%;
		color: #9a4820;
		font-size: 34rpx;
	}
	.tip-text{
		text-align: center;
		color: #9a4820;
		font-size: 28rpx;
		margin: 40rpx;
	}
</style>

<template>
	<!-- 通用版 中出红包 -->
	<view class="">
		<custom-template ctheight='1334' :ctbackground='ctbackground'>
			<view class="getCash">
				<view class="getCash-center-top" :class="gctAni" @transitionend="transitionend">
					<!-- 中奖 奖品展示 红包或者大奖 根据businessCode区分 大奖（7）还是红包（0） -->
					<view class="winningPrize" v-if="isWinningPrize" :style="{ 'top':bizcode!=7?'508rpx':'328rpx'}">
						<!-- 中出 红包 -->
						<view class="winningPrize-getCashBox" v-if="bizcode == 0 || bizcode == 21">
							<view class="hongbao01">
								<block v-if="isDay19">
									<view class="" :style="{ 'bottom': hongbaoMes.styleBottom+'rpx' }">
										<view class="hongbao01-name1">{{ hongbaoMes.name1 }}</view>
										<view class="hongbao01-name2">{{ hongbaoMes.name2 }}</view>
										<view class="hongbao01-name3">{{ hongbaoMes.name3 }}</view>
									</view>
								</block>
								<block v-else>
									<view class="" :style="{ 'bottom': hongbaoMes.styleBottom+'rpx' }">{{ hongbaoMes.name }}</view>
								</block>
							</view>
							<view class="hongbao02">
								<!--  prizeType 0 现金 1 积分 2 积分+现金 -->
								<view class="currentMoney">
									<block v-if="prizeType == 0">
										￥<text>{{ currentMoney }}</text>
									</block>
									<block v-else-if="prizeType == 1">
										<text class="prizeType1-currentVpoints">{{ currentVpoints }} 积分</text>
									</block>
									<block v-else-if="prizeType == 2">
										￥<text class="prizeType2-currentMoney">{{ currentMoney }}</text>
										<view class="prizeType2-currentVpoints">{{ currentVpoints }} 积分</view>
									</block>
								</view>
							</view>
							<image :src="commonImg+'hongbao03.png'" class="hongbao03" mode="widthFix"></image>
							<image :src="commonImg+'jiudi.png'" class="jiudi" mode="widthFix"></image>
						</view>
						<!-- 中出 大奖 -->
						<view class="winningPrize-getPrizeBox" v-if="bizcode == 7">
							<!-- 大奖 中出  世界啤酒大奖礼盒1套-->
							<view class="winningPrize-getPrizeBox-center" v-if="prizeType == 'P' || prizeType == 'p'">
								<image :src="commonImg+'dajingLihe.png'" mode="widthFix"></image>
								<view class="winningPrize-getPrizeBox-mes">
									<view>恭喜您中 {{ isDay19?'“要酒日”':'' }} </view>
									<view>青岛啤酒2018</view>
									<view>世界啤酒大奖礼盒1套</view>
								</view>
							</view>
							<!-- 大奖 中出  冰墩墩-->
							<view class="winningPrize-getPrizeBox-center" v-else>
								<image :src="commonImg+'dajiangBing.png'" mode="widthFix"></image>
								<view class="winningPrize-getPrizeBox-mes">
									<view>恭喜您中，冬奥</view>
									<view>黄金冰墩墩吊坠1个</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 没有中奖 秒杀 所有异常同意显示 -->
					<view class="notWinningPrize" v-else>
						<!-- 没有中奖 -->
						<image :src="commonImg+'xiaoren.png'" class="xiaoren" mode="widthFix"></image>
						<view class="">
							您离红包只差一点点
						</view>
						<view class="">
							再喝一瓶试试看～
						</view>
					</view>
					<!-- 二重惊喜Logo -->
					<image v-if="!isOpenECJXMini" @click="openECJXMiniProgram" :src="commonImg+'erchongjingxi.png'" class="erchongjingxi" mode="widthFix"></image>
				</view>
				<view class="getCash-center-bot">
					<!-- <image :src="commonImg+'lijilingqu.png'"  mode="widthFix" @click="lingqiFun"></image> -->
					<block v-if="buttonObj.status==1">
						<!-- status==1 按钮 显示 立即提现 -->
						<view class="lijilingqu" @click="buttonFun(buttonObj.status)" v-if="isHasPhoneNumber">
							{{ buttonObj.name }}
						</view>
						<view v-else>
							<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="lijilingqu">
								{{ buttonObj.name }}
							</button>
						</view>
					</block>
					<block v-else>
						<view class="lijilingqu" @click="buttonFun(buttonObj.status)">
							{{ buttonObj.name }}
						</view>
					</block>

					<!-- 开启动画 熊猫、酒 -->
					<view class="getCash-center-bot-jiuBox" v-if="!isStart">
						<image :src="commonImg+'xiongmao.png'" class="xiongmao" mode="widthFix"></image>
						<image :src="commonImg+'jiu.png'" class="jiu" mode="widthFix"></image>
						<image :src="commonImg+'jiudi.png'" class="jiudi" mode="widthFix"></image>
					</view>

					<block v-else>
						<block v-if="bizcode ==0 || bizcode ==21">
							<block v-if="totalAccountMoney != 0">
								<view class="zhanghuMes">
									<view class="">
										您的账户余额为 <text> {{ totalAccountMoney }} 元</text>
									</view>
									<view class="">
										个人账户大于1元，可直接提现
									</view>
								</view>
							</block>
						</block>
						<block v-if="bizcode ==7 ">
							<view class="dajiangMes">
								温馨提示：点击“立即兑奖”填写兑奖信息吧
							</view>
						</block>
					</block>

				</view>
			</view>
		
		</custom-template>
		<!-- 跑马灯 -->
		<view class="textScrollBox" :style="{ 'top': (safeAreaTop*2 + 80) + 'rpx' }">
			<textScroll v-if='perMantissaEarnUser.length>0 && isDay19' :list='perMantissaEarnUser' />
		</view>
		<!-- 阶梯 -->
		<ladder_page :showLadder="scanLadderFlag" :ladderTxtTwo="ladderTxtTwo" :ladderTxtOne='ladderTxtOne' @ladderPagelose='ladderPagelose'></ladder_page>

	</view>
</template>
<!-- have read -->
<script>
	/**
	 * 
	 * 
	 * */
	import {
		config
	} from '@/utils/api.js';
	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue';
	import ladder_page from '@/components/ladder.vue'; // 阶梯弹窗
	import {
		giveSpackTx,
		ifremeber // 判断 是否关注 公众号 提现时 用作判断
	} from '@/common/getData.js'; // 提现 接口

	import {
		textScroll
	} from '@/components/screenTextScroll/screenTextScroll.vue'; // 跑马灯
	import {
		analysisMobile,
		getCode,
		getOpenid,
		checkSession,
		navigateToMiniProgram
	} from '@/common/getWxUserInfor.js';
	export default {
		name: 'getCash',
		components: {
			customTemplate,
			ladder_page,
			textScroll
		},
		props: {},

		computed: {
			// 按钮文字
			computedButtonObj() {
				/**
				 * 判断 按钮显示 
				 * 	红包 ：立即提现(中出金额大于最小提现金额时) 存入红包（中出金额小于最小提现金额时） 查看红包余额 重复扫码等）
				 *  大奖 ： 立即兑换
				 *  bizcode=21 金额+大奖类型 按钮显示文字 先按照红包的逻辑 然后 间隔 n秒 显示 大奖对应的 按钮（立即兑换）
				 * */
				const returnButtonObj = {};
				const that = this;
				if (that.bizcode == 0 || that.bizcode == 21) {
					if (that.totalAccountMoney >= 1 && (that.bizcode != '11')) {
						returnButtonObj.name = '立即提现';
						returnButtonObj.status = 1;
					} else {
						// if (that.bizcode == '11' || that.again == 'true') {
						// again 当前页面 定义  false
						if (that.bizcode == 11) {
							returnButtonObj.name = '查看红包余额';
							returnButtonObj.status = 2;
						} else if (that.totalAccountMoney == 0) {
							returnButtonObj.name = '我知道了';
							returnButtonObj.status = 3;
						} else {
							returnButtonObj.name = '存入我的零钱包';
							returnButtonObj.status = 3;
						}
					}
				} else if (that.bizcode == 7) {

					// 中出大奖
					returnButtonObj.name = '立即兑换';
					returnButtonObj.status = 7;
					// 区分 大奖 是 冰墩墩（P01）、礼盒(p) 

				}
				return returnButtonObj;
			}, 
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			safeAreaTop() {
				const userSystemInfo = uni.getStorageSync('userSystemInfo');
				let safeAreaTop = '30'
				if (userSystemInfo) {
					safeAreaTop = userSystemInfo.safeArea.top == 0 ? '30' : userSystemInfo.safeArea.top;
				} else {
					safeAreaTop = '30';
				}
				console.log('safeAreaTopsafeAreaTopsafeAreaTopsafeAreaTop');
				console.log(safeAreaTop);
				return safeAreaTop;
			}, 
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commonImg: config.staticUrl + 'CommonImg/',
				ctbackground: config.staticUrl + 'CommonImg/huanjinBg.jpg',
				gctAni: '',
				isWinningPrize: true,
				currentMoney: '', // 中出 金额
				currentVpoints: '', //中出积分
				earnTime: '',
				totalAccountMoney: '',
				isStart: false, //是否 开始动画
				buttonObj: {
					name: '立即领取',
					status: 0
				},
				isDay19: false, //  19日 活动标识
				hongbaoMes: {
					name: '-- 恭喜您获得 --',
					styleBottom: 140
				}, //红包描述文字
				perMantissaEarnUser: [], // 跑马灯 数组
				bizcode: '',
				scanLadderFlag: false, // 阶梯弹窗 是否有阶梯弹窗设置
				ladderIndex: 1, // 阶梯弹窗 次数
				ladderTxtOne: '', // 阶梯弹窗 titile
				ladderTxtTwo: '', // 阶梯弹窗 内容
				prizeType: '', // 奖品 类型 P:礼盒 P01:冰墩墩
				isHasPhoneNumber: false, //是否 已获取手机号
				isGiveSpackTx: false, // 提现标识
				isOpenECJXMini:false // 是否开启过二重惊喜 提现和提现成功页面都有二重惊喜入口
			};
		},
		onLoad(options) {
			console.log(options);
			const {
				bizcode
			} = options;
			this.sortingParameters(bizcode);
			this.init();
			console.log('onLoad');



		},
		onShow() {

			// const that = this;
			// if (that.openid) {
			// 	that.initData();
			// }
			if (this.isGiveSpackTx) {
				// isGiveSpackTx == true ? 读条 拿到  红包 openid
				// this.hbopenid = this.hbopenid ? this.hbopenid : uni.getStorageSync('hbopenid').hbopenid;
				// if (this.hbopenid && that.openid) {
				// 	// 调用提现接口
				// 	this.giveSpackTxRequest();
				// }
				this.giveSpackTxFun();
			}
			
			
		},
		methods: {
			buttonFun(status) {
				// 点击立即领取 展开红包
				console.log(status);
				if (status == 0) {
					this.gctAni = 'getCash-center-top-end';
					// 隐藏 熊猫 logo 、酒显示盒子
					this.isStart = true;
				} else if (status == 7 || status == 21) {
					// 中出 大奖 点击 立即兑换
					console.log('立即兑换')
					console.log(getApp().globalData.getPrizeSendData);
					const getPrizeSendData = getApp().globalData.getPrizeSendData; // 定义位置扫码入口
					const redirectToUrl = 
						`submitUserInformation?bizcode=${this.bizcode}&prizeType=${getPrizeSendData.prizeType}&prizeVcode=${getPrizeSendData.prizeVcode}&isDay19=${this.isDay19}&pageSource=getCash`
					uni.redirectTo({
						url: redirectToUrl
					})
				} else if (status == 1) {
					// 提现
					this.giveSpackTxFun();
					
				} else if (status == 3) {
					// 存入我的零钱包 我知道了 
					uni.redirectTo({
						url: '../winningRecord/winningRecord'
					})
				}
				// 判断是否有 阶梯弹窗
				this.isHasladderFun();
			},
			transitionend() {
				// 动效展示完成 判断 按钮对应文案
				const that = this;
				console.log('that.bizcode');
				console.log(that.bizcode);
				if (that.bizcode == 21) {
					// 先 显示金额 后显示 大奖
					setTimeout(() => {
						this.bizcode = 7;
						this.buttonObj = {
							name: '立即兑换',
							status: 21
						};
					}, 600)
				} else {
					this.buttonObj = this.computedButtonObj;
				}
			},
			init() {
				if (this.bizcode == 0 || this.bizcode == 21) {
					// if (Number(this.currentMoney) == 0) {
					// 	// 中出金额 0 
					// 	this.isWinningPrize = false;
					// } else if (this.scanCodeReply.perMantissaPrize && bizcode != 21) { //逢19开启
					// 	// 19日 活动 
					// 	const perMantissaNum = this.scanCodeReply.perMantissaPrize.perMantissaNum;
					// 	// 缓存中提取perMantissaPrize.perMantissaNum
					// 	this.perMantissaNum = perMantissaNum;
					// 	this.isDay19 = true;
					// 	// 如果是 19 日 显示 不同的 红包蒙层
					// }
					this.showCash();
				} else if (this.bizcode == 7) {

				}
			},
			// 整理参数
			sortingParameters(bizcode) {
				const that = this;
				// 重复扫码
				const scanCodeReply = uni.getStorageSync('sweepQrcodeData').reply || {};
				const currentMoney = scanCodeReply.currentMoney || 0;
				const currentVpoints = scanCodeReply.currentVpoints || 0;
				// 从缓存中拿所需数据
				const earnTime = scanCodeReply.earnTime || '';
				const totalAccountMoney = scanCodeReply.totalAccountMoney || '';
				this.scanCodeReply = scanCodeReply;
				this.currentMoney = Number(currentMoney) == 0 ? 0 : Number(currentMoney);
				this.currentVpoints = Number(currentVpoints) == 0 ? 0 : Number(currentVpoints);
				this.earnTime = earnTime;
				this.totalAccountMoney = totalAccountMoney;
				this.bizcode = bizcode || 0;
				this.prizeType = scanCodeReply.prizeType || ''; // 大奖 P：礼盒 P01:冰墩墩
				this.openid = that.openid ? that.openid : uni.getStorageSync('openid').openid;
				this.isOpenECJXMini = getApp().globalData.isOpenECJXMiniProgram || false ; 
				console.log('this.prizeTypethis.prizeTypethis.prizeType');
				console.log(this.prizeType);
				console.log(this.currentMoney);
				console.log(this.currentVpoints);

				// perMantissaPrize 19日 标识 对象
				const perMantissaPrize = scanCodeReply.perMantissaPrize || '';
				
				if (perMantissaPrize) {
					// this.perMantissaEarnUser = perMantissaPrize.perMantissaEarnUser; 
					this.getPerMantissaEarnUser(perMantissaPrize.perMantissaEarnUser); // 跑马灯 数组
					if (perMantissaPrize.perMantissaPrizeFlag == 1 && that.bizcode != 21) { //逢19红包
						that.hongbaoMes = {
							name1: '恭喜你获得',
							name2: '“要酒日”大红包',
							name3: '本月“要酒日”扫到第' + perMantissaPrize.perMantissaNum + '支',
							styleBottom: 48
						}
					} else {
						that.hongbaoMes = {
							name1: '恭喜客官本月“要酒日”',
							name2: '扫到第' + perMantissaPrize.perMantissaNum + '支',
							name3: '',
							styleBottom: 54
						}
					}
					console.log('hongbaoMeshongbaoMeshongbaoMeshongbaoMeshongbaoMes');
					console.log(that.hongbaoMes);
					that.isDay19 = true;
				} else {
					that.isDay19 = false;
				}

				const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
				if (backStorage || scanCodeReply.phonenum) {
					this.isHasPhoneNumber = true;
				} else {
					this.isHasPhoneNumber = false;
				}

			},
			// 显示 中出红包
			showCash() {
				// 显示 中出红包 信息
				if (Number(this.currentMoney) == 0 && Number(this.currentVpoints) == 0) {
					// 中出金额 0 
					this.isWinningPrize = false;
				} else if (this.scanCodeReply.perMantissaPrize && this.bizcode != 21) { //逢19开启
					// 19日 活动 
					const perMantissaNum = this.scanCodeReply.perMantissaPrize.perMantissaNum;
					// 缓存中提取perMantissaPrize.perMantissaNum
					this.perMantissaNum = perMantissaNum;
					// this.isDay19 = true;
					// 如果是 19 日 显示 不同的 红包蒙层
				}
			},
			// 阶梯 
			// 关闭阶梯 
			ladderPagelose(status) {
				this.scanLadderFlag = status;
			},
			isHasladderFun() {
				/** 判断是否有 阶梯弹窗
				 * scanLadderFlag == 1 含有阶梯弹窗  scanLadderNum == 次数
				 * **/
				const sweepQrcodeData = getApp().globalData.sweepQrcodeData;
				console.log('sweepQrcodeDatasweepQrcodeDatasweepQrcodeData');
				console.log(sweepQrcodeData);
				const scanLadderFlag = sweepQrcodeData.reply.scanLadderFlag || false;
				const scanLadderNum = sweepQrcodeData.reply.scanLadderNum || 0;
				this.scanLadderFlag = scanLadderFlag == 1 ? true : false;

				console.log(this.scanLadderFlag);
				console.log(scanLadderNum);
				switch (Number(scanLadderNum)) {
					case 1:
						this.ladderTxtOne = '健康\n步步高红包';
						this.ladderTxtTwo = '下一个更高';
						break;
					case 2:
						this.ladderTxtOne = '快乐\n步步高红包';
						this.ladderTxtTwo = '下一个更高';
						break;
					case 3:
						this.ladderTxtOne = '运气\n步步高红包';
						this.ladderTxtTwo = '下一个更高';
						break;
					case 4:
						this.ladderTxtOne = '福气\n步步高红包';
						this.ladderTxtTwo = '下一个更高';
						break;
					case 5:
						this.ladderTxtOne = '财气\n步步高红包';
						this.ladderTxtTwo = '下一个更高';
						break;
					case 6:
						this.ladderTxtOne = '青啤虽好\n莫贪杯';
						this.ladderTxtTwo = '明日再战';
						break;
					default:
						this.ladderTxtOne = '青啤虽好\n莫贪杯';
						this.ladderTxtTwo = '明日再战';
						break;
				}
			},
			getPerMantissaEarnUser(perMantissaEarnUser) {
				if (perMantissaEarnUser.length > 0) {
					perMantissaEarnUser.forEach((item) => {
						const nickName = item.nickName === undefined ? '...' : item.nickName;
						if (item.earnMoney) {
							item.showContent = '恭喜“' + nickName + '”扫到第' + item.prizeScanNum + '支，中得“要酒日”' + item.earnMoney + '元大红包';
						} else if (item.prizeName) {
							item.showContent = '恭喜“' + nickName + '”扫到第' + item.prizeScanNum + '支，中得“' + item.prizeName + '”礼盒一份';
						}
					})
					this.perMantissaEarnUser = perMantissaEarnUser;
				}
			},

			giveSpackTxFun() {
				console.log("我要提现了");
				ifremeber().then((res) => {
					if (res == 1) {
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
					} else {
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
							const totalMoney = this.totalAccountMoney;
							uni.navigateTo({
								url: '/pages/saoDianDe/common/getCashSuc?totalMoney=' + totalMoney
							})

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

			// 打开 二重惊喜小程序
			openECJXMiniProgram (){
				navigateToMiniProgram();
				this.isOpenECJXMini = true ;
			}
			

		}
	};
</script>

<style scoped lang="scss">
	image {
		display: block;
		margin: 0 auto;
	}

	.getCash {
		height: 100%;
	}

	.getCash-center-top {
		height: 486rpx;
		transition: all .3s linear;

		.erchongjingxi {
			width: 176rpx;
			position: absolute;
			top: 788rpx;
			right: 0;
		}
	}

	.getCash-center-top-end {
		height: 1060rpx;
		transition: all .3s linear;
	}

	.getCash-center-bot {
		height: 848rpx;
		text-align: center;
		position: relative;
		background: url($commonImg+'huanjinBotBg.png') no-repeat;
		background-size: 100%;
		padding-top: 30rpx;
		button {
			border: none;
		}
	}

	.getCash-center-bot-jiuBox {
		width: 612rpx;
		height: 432rpx;
		position: absolute;
		left: 50%;
		top: 240rpx;
		transform: translateX(-50%);
		position: relative;

		.xiongmao {
			position: absolute;
			top: -172rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.jiu {
			position: absolute;
			left: 50%;
			top: 0;
			transform: translateX(-50%);
			z-index: 30;
			width: 412rpx;
		}

		.jiudi {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 612rpx;
		}
	}

	.lijilingqu {
		width: 424rpx;
		height: 104rpx;
		margin: 0 auto;
		line-height: 104rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background: url($commonImg+'anniuBg.png') no-repeat;
		background-size: 100% 100%;
		border: none;
	}

	.xiongmao {
		width: 206rpx;
	}

	// 没有中奖 
	.notWinningPrize {
		width: 100%;
		position: absolute;
		top: 560rpx;
		left: 0;
		text-align: center;

		.xiaoren {
			margin: 0 auto;
			width: 220rpx;
		}

		&>view {
			color: #000000;
			font-weight: bold;
		}

		&>view:nth-child(2) {
			margin-top: 32rpx;
		}

		&>view:nth-child(3) {
			margin-top: 22rpx;
		}
	}

	// 中奖
	.winningPrize {
		width: 100%;
		position: absolute;
		left: 0;

		.winningPrize-getCashBox {
			width: 612rpx;
			height: 600rpx;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translateX(-50%);
			position: relative;

			.hongbao02 {
				width: 370rpx;
				height: 400rpx;
				position: absolute;
				bottom: 126rpx;
				left: 50%;
				transform: translateX(-50%);
				z-index: 40;
				background: url($commonImg+'hongbao02.png') no-repeat;
				background-size: 100% 100%;

				&>view {
					position: absolute;
					top: 24rpx;
					left: 50%;
					transform: translateX(-50%);
					color: #DF352F;
					font-size: 28rpx;
					text-align: center;
					width: 100%;
					text {
						font-size: 80rpx;
					}

					.prizeType2-currentMoney {
						font-size: 40rpx !important;
					}

					.prizeType2-currentVpoints {
						font-size: 36rpx !important;
						color: #B16622;
					}

					.prizeType1-currentVpoints {
						font-size: 38rpx !important;
						color: #B16622;
						margin-top: 10rpx;
						position: absolute;
						top: 0px;
						width: 100%;
						left: 0;
					}

				}
			}

			.hongbao03 {
				position: absolute;
				left: 50%;
				top: 0;
				transform: translateX(-50%);
				z-index: 30;
				margin-left: -42rpx;
				width: 508rpx;
			}

			.jiudi {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 612rpx;
			}

			.hongbao01 {
				position: absolute;
				left: 52%;
				transform: translateX(-50%);
				bottom: 64rpx;
				width: 524rpx;
				height: 568rpx;
				z-index: 50;
				background: url($commonImg+'hongbao01.png') no-repeat;
				background-size: 100% 100%;

				&>view {
					position: absolute;
					bottom: 140rpx;
					// left: 50%;
					// transform: translateX(-50%);
					width: 100%;
					text-align: center;
					color: #FBD3A1;
					font-size: 26rpx;
				}

				.hongbao01-name1,
				.hongbao01-name2 {
					font-size: 30rpx;
					color: #FADFBC;
				}

				.hongbao01-name2 {
					margin-bottom: 24rpx;
				}

				.hongbao01-name3 {
					font-size: 24rpx;
					color: #FADFBC;
				}

			}

		}
	}

	.zhanghuMes {
		margin-top: 20rpx;

		text {
			padding-left: 4rpx;
			color: #DF352F;
		}
	}

	// 大奖 开始
	.winningPrize-getPrizeBox-center {
		position: relative;

		image {
			width: 100%;
		}

		.winningPrize-getPrizeBox-mes {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			color: #DF0411;
			font-size: 40rpx;
			text-align: center;
		}

	}

	.dajiangMes {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #656565;
	}
	
	.textScrollBox{
		position: fixed;
		left: 0;
	}
</style>

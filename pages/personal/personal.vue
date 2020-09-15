<template>
	<view class="personalCenter flex-xn-ys" id="personalCenter">
		<view class="personalCenter-header" id="wr-center-top">
			<view class="personalCenter-userInfor-box" :style="{ 'padding-top': safeAreaTop*2 + 'rpx' }">
				<uni-nav-bar title="我的"></uni-nav-bar>
				<view class="pc-titleBox">
					<!-- 头部 展示 头像和昵称 -->
					<view class="pct-userInfor flex-xn-yc">
						<view class="pct-userInfor-userImg">
							<image v-if="isHasUserInfo" class="avatar" mode="widthFix" :src="userInfo.avatarUrl || personalCenterImg + 'shangchuantouxiang.png'"></image>
							<button v-else class="set" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
								上传头像
							</button>
						</view>
						<view class="">
							<view class="pct-userInfor-nickName">{{ nickNameSub }}</view>
							<view class="pct-userInfor-shuliang"> <text>累计饮酒：</text><text>{{ total }}</text><text>支</text> </view>
						</view>
					</view>
				</view>
				<view class="qiandao" @click="signIn">
					<text>签到</text>
				</view>
			</view>
			<!-- tab 显示 订单状态 -->
			<view class="personalCenter-tabs flex-xsb-yc">
				<block v-for="item in tabsArr" :key="item.id">
					<view class="flex-xc-yc-dirY" @click="listNav(item)">
						<image :src="item.icon" mode="widthFix"></image>
						<text> {{ item.name }} </text>
						<view class="showCenter" v-if="item.showCenter && item.showCenter>0">{{item.showCenter}}</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 列表 -->
		<scroll-view :style="{ height: scrollViewHeight + 'px',paddingBottom:'20rpx' }" scroll-y="true" class="wrc-listBox">
			<view class="pct-list-top-box pct-common">

				<view class="flex-xsb-yc pct-list " v-for="item in pctList" :key="item.id" @click="listNav(item)">
					<view class="flex-xn-yc pct-list-left">
						<image class="icon" :src="item.icon"></image>
						<text class="">{{ item.name }}</text>
					</view>
					<view class="pct-list-right flex-xR-yc">
						<image v-if="item.rightIcon" class="icon" :src="item.rightIcon"></image>
						<text v-if="item.showCenter">{{item.showCenter}}</text>
					</view>
				</view>

			</view>
			<view class="pct-list-top-box pct-common">
				<view class="flex-xsb-yc pct-list " v-for="item in pctListBot" :key="item.id" @click="listNav(item)">
					<view class="flex-xn-yc pct-list-left">
						<image class="icon" :src="item.icon"></image>
						<text class="">{{ item.name }}</text>
					</view>
					<view class="pct-list-right flex-xR-yc">
						<image v-if="item.rightIcon" class="icon" :src="item.rightIcon"></image>
						<text v-if="item.showCenter">{{item.showCenter}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	/**
	 * 列表优惠券 一期不限制
	 *  {
	 *		 id: 3,
	 *		 isCanClick: true,
	 *		 isShow: false,
	 *		 status: 1, // 1 跳转 路径 2 显示弹窗
	 *		 name: '优惠券',
	 *		 icon: config.staticUrl + 'personalCenter/iconyouhuiquan.png',
	 *		 rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
	 *		 navUrl: ''
	 * }, 
	 * 
	 * 列表 我的心愿单
	 *  {
	 *				id: 1,
	 *				isCanClick: true,
	 *				isShow: true,
	 *				status: 1, // 1 跳转 路径 2 显示弹窗
	 *				name: '我的心愿单',
	 *				icon: config.staticUrl + 'personalCenter/iconwodexiinyuandan.png',
	 *				rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
	 *				navUrl: '/pages/saoDianDe/winningRecord/winningRecord'
	 *			}, 
	 * 
	 * **/
	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getUserInfo
	} from '@/common/getWxUserInfor.js';
	import {
		queryAllGiftsList,
		queryUnExchangePrizeLstRequst
	} from '@/common/getData.js';
	import activityRule from '@/components/activityRule.vue';
	import {
		getUserDataFun,
		strSub,
		dateformatTemp,
		filterArr,
		getOpenidSD,
		getVjifenOpenid
	} from '@/common/basicsFun.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		giveSpackTxStatusArr
	} from '@/common/tipConfig.js'
	export default {
		name: 'personalCenter',
		components: {
			activityRule,
			uniNavBar
		},
		computed: {
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
			nickNameSub() {
				const initName = this.userInfo.nickName;
				const returnStr = strSub(initName, 14, 7, '...');
				return returnStr;
			}
		},
		data() {
			return {
				isStartAnimation: false,
				staticUrl: config.staticUrl,
				personalCenterImg: config.staticUrl + 'personalCenter/',
				openid: '',
				total: 0, //累计饮酒 
				pctList: [{
					id: 1,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '我的红包',
					icon: config.staticUrl + 'personalCenter/iconxinyuandan.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/saoDianDe/winningRecord/winningRecord'
				}, {
					id: 2,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '换购商品',
					icon: config.staticUrl + 'personalCenter/iconhuangou.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/saoDianDe/exchangeGoods/exchangeGoods'
				}, {
					id: 4,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '积分账单',
					icon: config.staticUrl + 'personalCenter/iconjifenzhangdan.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/scoreList/scoreList'
				}, {
					id: 5,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '我的实物奖',
					icon: config.staticUrl + 'personalCenter/iconwodeshiwujiang.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/saoDianDe/prizeList/prizeList'
				}, ],
				pctListBot: [{
					id: 21,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '积分抽奖',
					icon: config.staticUrl + 'personalCenter/iconjifenchoujiang.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/luckDrawList/luckDrawList'
				}, {
					id: 22,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '地址管理',
					icon: config.staticUrl + 'personalCenter/icondizhi.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/address/addressList'
				}, {
					id: 23,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '完善信息',
					icon: config.staticUrl + 'personalCenter/iconwanshanxinxi.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/userInfo/infoTask'
				}, {
					id: 24,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '关注公众号',
					icon: config.staticUrl + 'personalCenter/iconguanzhu.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/webview/attention'
				}, {
					id: 25,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '串码领奖',
					icon: config.staticUrl + 'personalCenter/iconchuanma.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: '/pages/saoDianDe/strCode/strCode'
				}, {
					id: 26,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '客服中心',
					icon: config.staticUrl + 'personalCenter/iconkufu.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: ''
				}, {
					id: 27,
					isCanClick: true,
					isShow: true,
					status: 1, // 1 跳转 路径 2 显示弹窗
					name: '积分活动规则',
					icon: config.staticUrl + 'personalCenter/iconjifen.png',
					rightIcon: config.staticUrl + 'personalCenter/iconRight.png',
					navUrl: ''
				}, ],
				tabsArr: [{
						id: 1,
						isCanClick: true,
						// isShow: false,
						status: 1, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '待付款',
						icon: config.staticUrl + 'personalCenter/icondaifukuan.png',
						navUrl: '/pages/order/order?type=4'
					},
					{
						id: 2,
						isCanClick: true,
						// isShow: false,
						status: 1, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '待发货',
						icon: config.staticUrl + 'personalCenter/icondaifahuo.png',
						navUrl: '/pages/order/order?type=0'
					},
					{
						id: 3,
						isCanClick: true,
						// isShow: false,
						status: 1, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '待收货',
						icon: config.staticUrl + 'personalCenter/icondaishouhuo.png',
						navUrl: '/pages/order/order?type=1'
					}, {
						id: 4,
						isCanClick: true,
						// isShow: false,
						status: 1, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '售后',
						icon: config.staticUrl + 'personalCenter/iconshouhou.png',
						navUrl: '/pages/order/order?type=5'
					}, {
						id: 5,
						isCanClick: true,
						// isShow: false,
						status: 1, // 1 跳转 路径 2 显示弹窗 3 立即提现
						name: '我的订单',
						icon: config.staticUrl + 'personalCenter/iconwode.png',
						navUrl: '/pages/order/order?type=3'
					},
				],
				userInfo: {
					avatarUrl: '',
					nickName: '昵称'
				}, //用户 信息 头像 昵称 

				isShowTixian: false, //是否展示 提现 当 totalMoney>0
				scrollViewHeight: '',
				isHasUserInfo: '' // 是否有用户 基本信息
			};
		},
		async onLoad() {
			// 获取用户信息 openid seesion_key
			const backGetUserDataFun = await getUserDataFun();
			const that = this;

			// 已授权的 进入回显头像
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					const userInfo = res.data;
					that.userInfo.avatarUrl = userInfo.avatarUrl;
					that.userInfo.nickName = userInfo.nickName;
					that.isHasUserInfo = true;
				},
				fail: function(res) {
					// 没有头像
					that.userInfo.avatarUrl = '';
					that.userInfo.nickName = '昵称';
					that.isHasUserInfo = false;
				}
			});

			getOpenidSD();

		},

		onShow() {
			// 获取展示 信息
			const that = this;
			that.openid = that.openid ? that.openid : uni.getStorageSync('openid').openid;
			if (that.openid) {
				// getUserBasics().then((res) => {
				// 	console.log('getUserBasics');
				// 	console.log(res);
				// 	this.sortingParameters(res);
				// });
				
				const that = this;
				queryAllGiftsList(that.openid, 1, 10).then(res => {
					if (res) {
						console.log('getUserBasics');
						console.log(res);
						this.sortingParameters(res);
					}
				});
				
			}

			that.vjifenOpenid = that.vjifenOpenid ? that.vjifenOpenid : uni.getStorageSync('vjfOpenid').vjfOpenid;
			console.log('that.vjifenOpenid');
			console.log(that.vjifenOpenid);
			if (that.vjifenOpenid) {
				// 获取换购商品数量 
				queryUnExchangePrizeLstRequst().then((res) => {
					console.log('queryUnExchangePrizeLstRequst')
					console.log(res)
					this.pctList[1].showCenter = res.prizeNum > 0 ? `${res.prizeNum}支待兑换` : ''; // 换购商品数量显示
					this.pctList.splice();
				});
			} else {
				// 没有 vjifenOpenid 读条获取
				getVjifenOpenid();
			}

			this.getScrollHeight();

		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			return {
				title: '皇冠丹麦曲奇',
				path: '/pages/personalCenter/personalCenter',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},

		methods: {

			signIn() {
				uni.navigateTo({
					url: '../sign/sign'
				})
			},

			sortingParameters(res) {
				// 整理参数
				this.tabsArr[0].showCenter = res.orderNonPaymentNum; //订单待付款数量
				this.tabsArr[1].showCenter = res.orderNonShipmentsNum; // 订单待发货数量
				this.tabsArr[2].showCenter = res.orderNonReceiveNum; // 订单待收货数量
				this.tabsArr.splice();
				this.pctList[0].showCenter = res.totalMoney > 0 ? `￥${res.totalMoney}元可提现` : ''; //账户余额(元) 
				//优惠券 this.pctList[2].showCenter = res.totalTicketNum > 0 ? `${res.totalTicketNum}张待使用` : ''; //优惠券总数量
				this.pctList[2].showCenter = res.totalVpoints > 0 ? `积分余额${res.totalVpoints}` : ''; //账户剩余积分
				this.pctList.splice();
				// total
				this.total = res.total;
			},
			/**
			 * 获取用户信息
			 */
			getUserInfoFn() {
				getUserInfo().then(res => {
					const that = this;
					that.userInfo.avatarUrl = res.userInfo.avatarUrl;
					that.userInfo.nickName = res.userInfo.nickName;
					this.isHasUserInfo = true;
				});
			},
			// 列表展示
			listNav(navData) {
				const getNavData = navData;
				const that = this;
				console.log(navData);
				if (getNavData.isCanClick) {
					if (getNavData.status == 1) {
						// 跳转
						uni.navigateTo({
							url: getNavData.navUrl
						});
					} else if (getNavData.status == 2) {

					} else if (getNavData.status == 3) {
						// 提现

					}
				}
			},
			// 跳转红包记录页面
			goWinningRecord() {
				uni.navigateTo({
					url: '../winningRecord/winningRecord'
				})
			},
			// 提现
			giveSpackTxFun() {
				const that = this;
				giveSpackTx().then(
					res => {
						const businessCode = res.businessCode;
						if (businessCode == 0) {
							// 提现成功
							uni.showToast({
								title: "提现成功！"
							})
							that.init(); //更新数据
						} else if (businessCode == 5) {
							uni.showModal({
								title: '提示',
								content: res.msg
							});
						} else {
							// 提现失败 提示
							// 隐藏 红包收入 图片
							const filterData = filterArr('businessCode', businessCode, giveSpackTxStatusArr)[0];
							uni.showModal({
								title: filterData.title,
								content: filterData.content
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
			// 获取 滚动 区域 高度
			getScrollHeight() {
				const that = this;
				wx.createSelectorQuery()
					.select('#personalCenter')
					.boundingClientRect()
					.select('#wr-center-top')
					.boundingClientRect()
					.exec(function(res) {
						const scrollViewHeight = parseFloat(res[0].height - res[1].height - 60).toFixed(2);
						// const scrollViewHeight = 480;
						console.log('createSelectorQuery');
						console.log(res);
						console.log(scrollViewHeight);
						that.scrollViewHeight = scrollViewHeight || 237;
					});
			}

		}
	};
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	button {
		background-color: transparent;
		height: 113rpx;
		padding: 0;
		line-height: 113rpx;

		&.kefuBtn {
			padding-right: 8rpx;
		}
	}

	.personalCenter {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #F7F7F7;
		// background: url($crownCookiesImg+'bg2.png') no-repeat center;
		// background-size: cover;
		// background-size:100% 100%;
	}

	.personalCenter-userInfor-box {
		background: url($saoDianDe+'/personalCenter/iconbg.png') no-repeat center;
		background-size: cover;
		padding-bottom: 40rpx;
		position: relative;

		.qiandao {
			position: absolute;
			bottom: 64rpx;
			right: 0;
			width: 164rpx;
			height: 72rpx;
			background: url($saoDianDe+'/personalCenter/iconqiandaobg.png?v=1.0') no-repeat;
			background-size: 100% 100%;
			color: #308034;
			font-size: 32rpx;
			line-height: 72rpx;
			text-align: center;

			text {
				margin-left: 62rpx;
			}
		}
	}

	.pc-TitleImg-box {
		height: 234rpx;
	}

	.pc-TitleImg {
		width: 80%;
		height: 234rpx;
		// margin-top: 128rpx;
	}

	.pct-common {
		margin: 0 30rpx 30rpx 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 0 28rpx;
	}

	.pct-userInfor {
		position: relative;
	}

	.pct-userInfor-userImg {
		width: 125rpx;
		height: 125rpx;
		border-radius: 128rpx;
		background: #f1f1f1;
		padding: 2rpx;
		margin: 0 28rpx 0 28rpx;
		border: 3rpx solid #FFFFFF;

		button,
		image {
			width: 100%;
			height: 100%;
			border-radius: 154rpx;
		}
	}

	.pct-userInfor-nickName {
		font-size: 26rpx;
		color: #DCF0DD;
		margin-bottom: 20rpx;
	}

	.pct-userInfor-shuliang {
		color: #FFFFFF;

		>text:nth-of-type(1) {
			font-size: 32rpx;
		}

		>text:nth-of-type(2) {
			font-size: 40rpx;
		}

		>text:nth-of-type(3) {
			font-size: 30rpx;
		}
	}

	.pct-tab {
		image {
			width: 40rpx;
		}

		>view {
			flex: 1;
			text-align: center;
			margin-bottom: 30rpx;

			.pct-tab-mes1 {
				font-size: 30rpx;
				color: #333333;

				text {
					font-size: 36rpx;
				}
			}

			.pct-tab-mes2 {
				font-size: 24rpx;
				color: #f20101;

				text {
					font-size: 36rpx;
				}
			}
		}
	}

	.pct-list {
		height: 100rpx;
		border-bottom: 1rpx solid #F3F3F3;

		.pct-list-left {
			.icon {
				width: 30rpx;
				height: 30rpx;
			}

			>text {
				color: #333333;
				font-size: 28rpx;
				margin-left: 20rpx;
			}
		}

		.pct-list-right {
			>text {
				color: #999999;
				font-size: 26rpx;
				margin-right: 20rpx;
			}

			.icon {
				width: 12rpx;
				height: 22rpx;
			}
		}
	}

	.shuxianBox {
		position: relative;

		.hongbaoIcon {
			height: 44rpx;
		}
	}

	.danmaiIcon {
		height: 44rpx;
	}

	.shuxian {
		width: 2rpx;
		height: 76rpx;
		background: #D0D0D0;
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.wrc-listBox {
		flex: 1;
	}

	.personalCenter-header {
		background: #FFFFFF;
		margin-bottom: 20rpx;
	}

	// 订单状态 

	.personalCenter-tabs {
		height: 164rpx;

		>view {
			flex: 1;
			position: relative;

			image {
				width: 48rpx;
				height: 48rpx;
			}

			text {
				font-size: 26rpx;
				color: #656565;
			}

			.showCenter {
				position: absolute;
				right: 26rpx;
				top: -23rpx;
				width: 34rpx;
				height: 34rpx;
				text-align: center;
				line-height: 34rpx;
				border-radius: 34rpx;
				color: #FF9F33;
				border: 2rpx solid #FF9F33;
				font-size: 24rpx;
			}

		}
	}

	.set {
		color: #999999;
		font-size: 24rpx;
		text-align: center;
		line-height: 128rpx;
	}
</style>

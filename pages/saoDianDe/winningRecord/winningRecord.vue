<template>
	<!-- 扫点得 中奖纪录 -->
	<view class="winningRecord flex-xn-ys">
		<uni-nav-bar :style="{ 'margin-top': safeAreaTop*2 + 'rpx' }" left-icon="back" @click-left="back" title="我的红包"></uni-nav-bar>
		<view class="wr-title-box">
			<view class="wr-title-box-center">
				<view class="wr-title-box-zhanghu flex-xn-yc">
					<image :src="commonImg+'hongbaoIcon.png'" mode="widthFix"></image>
					<view class="">账户余额：<text>{{ showData.totalMoney }}元 </text></view>
				</view>
				<view class="wr-title-box-lishijine  flex-xsb-yc">
					<view class="wr-title-box-lishijine-dongjie" @click="showFreezeMoneyRule">冻结金额：{{ showData.freezeMoney }}元 <image mode="widthFix" class="wr-title-box-lishijine-dongjie-guize" :src="commonImg+'wenhao.png'"></image></view>
					<view class="" v-once>已领金额：{{ showData.giftsMoney }}元</view>
				</view>
				<!-- <view class="tixian-box" @click="giveSpackTxFun">提现</view> -->

				<view @click.once="giveSpackTxFun" class="tixian-box" v-if="isHasPhoneNumber"> 提现 </view>
				<view class="" v-else>
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="tixian-box">
						提现
					</button>
				</view>

			</view>
			<!-- 第一期 不做 -->
			<!-- <view class="wr-title-box-mes">
				<view class="">温馨提示：</view>
				<view class="">1.红包从中出之日起180天内有效，超过有效期后将不能提现，</view>
				<view class="">请您尽快提现到微信钱包。</view>
				<view class="">2.已过期的红包在“已过期红包记录”里可查询。</view>
				<view class="">3.满0.3元可提现。</view>  
				<view class=""><image :src="commoniImg+'hongbaojilu.png'" mode="widthFix"></image></view>
			</view> -->
		</view>

		<view class="wr-center flex-xn-ys" id="wr-center">
			<view class="flex-xsb-yc wr-center-title" id="wr-center-title">
				<block v-for="(item,index) in tabArr" :key="item.id">
					<view class="" @click="tabSwitch(index)">
						<view :class="tabIsCur==index?'tabOn':''">{{ item.text }}</view>
					</view>
				</block>
			</view>
			<scroll-view v-if="isHasData" :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="wrc-listBox">
				<view class="wrc-listBox-list flex-xsb-yn" v-for="item in objList" :key="item.id">
					<view class="">
						<view class="wrc-listBox-list-mes">{{ item.giftsName ? item.giftsName : '扫码中奖' }}</view>
						<view class="wrc-listBox-list-time">{{ item.earnTime }}</view>
					</view>
					<view class="flex-xn-yc">
						<block v-if="item.prizeType=='P'">
							<view class="wrc-listBox-list-danmai">丹麦游一份</view>
						</block>
						<block v-else>
							<view class="wrc-listBox-list-price">¥<text>{{ item.earnMoney }}</text>元</view>
						</block>
					</view>
				</view>
				<view class="clickMore" @click="clickMore" v-show="moneyNext">
					点击加载更多
				</view>
				<view class="clickMore colorGrey" v-show="!moneyNext">
					加载完毕
				</view>
			</scroll-view>

			<block v-else>
				<view class="wrc-nodata flex-xc-yc-dirY">
					<!-- <image src="../../static/crownCookiesImg/zanwujilu.jpg" mode="widthFix"></image> -->
					<view class="">暂无中奖记录，再接再厉哦～</view>
				</view>
			</block>

		</view>
		
		<!-- 已兑换 商品 查看详情 弹窗详情显示 这期先不做 -->
		<view class="detailDialog" v-show="detailDialog">
			<view class="customDialog-mask" @click="closeCustomDialog"></view>
			<!-- 目前 用到 填写中奖 信息 -->
			<view class="customDialog-center">
				<view class="customDialog-warp">
					<image :src="commonImg+'dongjiejine.png'" mode="widthFix"></image> 
				</view>
				<view class="customDialog-close">
					<image @click="closeCustomDialog" :src="commonImg+'dialogClose.png'" mode="widthFix"></image>
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
		queryAllGiftsList,
		giveSpackTx,
		ifremeber
	} from '@/common/getData.js';
	import {
		getOpenidSD
	} from '@/common/basicsFun.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		analysisMobile,
		getCode,
		getOpenid,
		checkSession
	} from '@/common/getWxUserInfor.js';

	export default {
		name: 'winningRecord',
		components: {
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
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				commonImg: config.staticUrl + 'CommonImg/',
				showType: false,
				objList: [], //红包列表
				moneyNext: true,
				count: 10,
				currentPage: 1,
				scrollViewHeight: '', //滚动区域的高度
				isHasData: false,
				tabIsCur: 0,
				isGiveSpackTx: false, // 提现标识
				openid: "",
				hbopenid: "",
				tabArr: [{
					text: '未过期'
				}, {
					text: '已过期'
				}, ],
				isHasPhoneNumber: false, //是否 已获取手机号
				sendData: {
					count: 10, // 调用 接口 所需参数
					currentPage: 1, // 调用 接口 所需参数
					// searchFlag: 1, // 调用 接口 所需参数 
				},
				showData: {
					totalMoney: '', //账户余额
					freezeMoney: '', // 冻结 金额
					giftsMoney: '', // 已领金额
				},
				detailDialog:false, //冻结 金额 规则说明
				pageSource:''
			};
		},
		async onLoad(options) {
			const pageSource = options.pageSource || ''; 
			this.pageSource = pageSource ; // 页面来源 拆红包页（getCash） 返回 首页 页面 中心进入 返回 我的 页面
			const backStorage = uni.getStorageSync('userMobileData').phoneNumber;
			let phoneNumber = '';
			if(getApp().globalData.reply){
				phoneNumber  = getApp().globalData.reply.phoneNumber; // 如果 扫码接口返回 手机号 就不唤起 微信手机号授权
			}else{
				phoneNumber = '';
			}
			if (backStorage || phoneNumber) {
				this.isHasPhoneNumber = true;
			} else {
				this.isHasPhoneNumber = false;
			}

			getOpenidSD();

			const that = this;
			wx.createSelectorQuery()
				.select('#wr-center')
				.boundingClientRect()
				.select('#wr-center-title')
				.boundingClientRect()
				.exec(function(res) {
					const scrollViewHeight = parseFloat(res[0].height - res[1].height - 60).toFixed(2);
					console.log(res);
					console.log(scrollViewHeight);
					that.scrollViewHeight = scrollViewHeight;
				});
		},
		onShow() {

			const that = this;
			that.openid = that.openid ? that.openid : uni.getStorageSync('openid').openid;
			if (that.openid) {
				that.initData();
			}
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
			// 显示 冻结金额 
			showFreezeMoneyRule(){
				this.detailDialog = true;
			},
			// 关闭冻结 金额 
			closeCustomDialog(){
				this.detailDialog = false;
			},
			
			tabSwitch(index) {

				this.tabIsCur = index;
				if (index == 0) {
					// const searchFlag = parseInt(index) + 1;
					// this.sendData.searchFlag = searchFlag;
					this.prizeAry = [];
					this.sendData.currentPage = 1;
					this.initData()
				} else {
					// 第一期 过期红包 不开发 

					this.prizeAry = [];
					this.isHasData = false;

				}

			},
			initData() {
				const that = this;
				queryAllGiftsList(that.openid, that.currentPage, that.count).then(res => {
					console.log('queryExchangePrizeAllLst');
					console.log(res);
					console.log(res.objList.length);
					if (res && that.currentPage == 1) {
						this.showData = {
							totalMoney: Number(res.totalMoney).toFixed(2),
							freezeMoney: Number(res.freezeMoney).toFixed(2),
							giftsMoney: Number(res.giftsMoney).toFixed(2) //已领金额
						}
					}
					if (res.objList.length < 1) {
						that.isHasData = false;
					} else {
						that.isHasData = true;
					}
					console.log(that.isHasData);
					if (res && (!res.objList || res.objList.length < that.count)) {
						that.moneyNext = false;
					} else {
						that.moneyNext = true;
					}
					if (that.currentPage == 1) {
						that.objList = res.objList;
					} else {
						if (res.objList && res.objList.length > 0) {
							console.log(2222);
							that.objList = that.objList.concat(res.objList);
						}
					}
					console.log(that.currentPage);
					console.log(that.count);
					console.log(that.objList);
				});
			},
			clickMore() {
				const that = this;
				if (that.moneyNext) {
					that.currentPage++;
					that.initData();
				} else {
					uni.showToast({
						title: '没有更多了记录了',
						icon: 'none'
					});
				}
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
			// giveSpackTxFun() {
			// 	console.log("我要提现了");

			// 	this.isGiveSpackTx = true; // 提现标识
			// 	this.hbopenid = this.hbopenid ? this.hbopenid : uni.getStorageSync('hbopenid').hbopenid;
				
			// 	if (this.hbopenid) {
			// 		// 调用提现接口
			// 		this.giveSpackTxRequest();
			// 	} else {
			// 		uni.navigateTo({
			// 			url: '/pages/getOpenid/getOpenid?getIdType=hbopenid'
			// 		})
			// 	}
				
			// },
			
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
							
							const totalMoney = this.showData.totalMoney;
							uni.navigateTo({
								url:'/pages/saoDianDe/common/getCashSuc?totalMoney='+totalMoney
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
		}
	};
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}
	button{
		border-radius: 0 ;
	}
	.winningRecord {
		height: 100%;
		background: url($commonImg+'sucBg.png') no-repeat center;
		background-size: cover;
	}

	.wr-title-box {
		border-radius: 20rpx;
		margin: 0 30rpx 20rpx 30rpx;
		background: #fff;
		padding: 30rpx;
	}

	.wr-center {
		border-radius: 20rpx;
		flex: 1;
		margin: 0 30rpx 30rpx 30rpx;
		background: #fff;
		padding: 32rpx 0;
	}

	.wrc-listBox {
		flex: 1;
		width: auto;
		margin: 0 32rpx;
	}

	.wrc-listBox-list {
		padding: 20rpx 0;
		border-bottom: 2rpx solid #dedede;
	}

	.wrc-listBox-list-mes {
		margin-bottom: 16rpx;
		font-size: 32rpx;
		color: #333;
	}

	.wrc-listBox-list-time {
		font-size: 24rpx;
		color: #999999;
	}

	.wrc-listBox-list-price {
		font-size: 24rpx;
		color: #f10000;

		text {
			font-size: 36rpx;
		}
	}

	.wrc-listBox-list-danmai {
		font-size: 30rpx;
		color: #f10000;
	}

	.wrc-titleImg {
		width: 70%;
		margin-bottom: 20rpx;
	}

	.wrc-nodata {
		margin-top: 54%;
		transform: translateY(-50%);

		image {
			width: 100%;
		}

		view {
			font-size: 30rpx;
			color: #656565;
			margin-top: 40rpx;
		}
	}

	.clickMore {
		text-align: center;
		margin-top: 20rpx;
	}

	.colorGrey {
		color: #999999;
	}

	.wr-title-box-center {
		position: relative;

		// border-bottom: 1rpx dotted #2B8541; 第一期 不做 去除下边框
		.tixian-box {
			position: absolute;
			right: -30rpx;
			top: 0;
			width: 130rpx;
			height: 68rpx;
			line-height: 68rpx;
			background: linear-gradient(to right, #01B971, #7BD367);
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			border-bottom-left-radius: 34rpx;
			border-top-left-radius: 34rpx;
		}
	}

	.wr-title-box-zhanghu {
		image {
			width: 32rpx;
			margin-right: 24rpx;
		}

		&>view {
			font-size: 36rpx;
			color: #000000;

			text {
				color: #F14701;
			}
		}
	}

	.wr-title-box-lishijine {
		margin-top: 34rpx;
		// margin-bottom: 40rpx; 

		view {
			font-size: 26rpx;
		}

		view:nth-of-type(1) {
			color: #656565;
			margin-left: 60rpx;
		}

		view:nth-of-type(2) {
			color: #999999;
		}
	}

	.wr-title-box-mes {
		font-size: 18rpx;
		color: #999999;
		line-height: 26rpx;
		margin-top: 20rpx;
		position: relative;

		image {
			width: 240rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	.wr-center-title {
		border-bottom: 1rpx solid #EEEEEE;

		view {
			flex: 1;
			text-align: center;

			view {
				width: 50%;
				margin: 0 auto;
				padding-bottom: 20rpx;

				color: #333333;
			}
		}
	}

	.tabOn {
		border-bottom: 5rpx solid #65BD69;
		color: #65BD69;
	}
	
	// 已兑换商品 查看详情 s
	.customDialog-mask {
		width: 100%;
		height: 100%;
		background: #000;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		opacity: .6;
	}
	
	.customDialog-center {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 100;
		width: 80%;  
		transform: translate(-50%, -50%);
		image {
			width: 100%;
		}
	}
	.customDialog-close {
		width: 60rpx;
		position: absolute;
		top: -68rpx;
		right: -22rpx;
	
		image {
			width: 100%;
		}
	}
	.wr-title-box-lishijine-dongjie{
		position: relative;
		.wr-title-box-lishijine-dongjie-guize{
			width: 24rpx;
			position: absolute;
			right: -24rpx;
			top: -12rpx;
		}
	}
</style>

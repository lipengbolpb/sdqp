<template>
	<view class="wrap">
		<view class="wrap-header">
			<!-- 轮播 -->
			<swiper class="banner-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="false" :circular="true"
			 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" :indicator-color="bannerDotColor"
			 :indicator-active-color="bannerDotActiveColor">
				<swiper-item v-for="(item,index) in swiperListNew" :key="index" :class="cardCur==index?'cur':''">
					<view class="swiper-item">
						<image :src="item.url" :class="item.className" mode="widthFix" v-if="item.type=='image'" @tap="handleJumpEvent(item)"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="wrap-header-usermes flex-xn-yc">
				<view class="wrap-header-usermes-left flex-xn-yc">
					<!-- <image class="wrap-header-usermes-img" ></image> -->
					<view class="wrap-header-usermes-img">
						<image v-if="isHasUserInfo" class="avatar" mode="widthFix" :src="userInfo.avatarUrl || staticUrl + 'shangchuantouxiang.png'"></image>
						<button v-else class="set" open-type="getUserInfo" @getuserinfo="getUserInfoFn" withCredentials="true">
							上传头像
						</button>
					</view>
					<view class="">
						<view class="wrap-header-usermes-right flex-xR-yc">
							<text>{{ totalVpoints }}</text>
							<view class="">我的积分：</view>
						</view>
						<text class="nickName">{{userInfo.nickName}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="cneter">
			<view class="center-tabs flex-xn-yc">
				<view class="" @click="toMall">
					<image :src="indexUrl+'diandian.png'" class="diandian" mode="widthFix"></image>
					<text>积分</text><text>兑好物</text>
					<image :src="indexUrl+'jifenhaowu.png'" class="jifenleftImg"></image>
				</view>
				<view class="" @click="toScore">
					<image :src="indexUrl+'diandian.png'" class="diandian"></image>
					<text>积分</text><text>好礼</text>
					<image :src="indexUrl+'jifenhaoli.png'" class="jifenrightImg"></image>
				</view>
			</view>
			<!-- 大图推荐 -->
			<view class="center-bigImg-lists">
				<view class="center-bigImg-list" v-for="item in bigImgArr" :key="item.goodsId">
					<image :src="item.goodsBigUrl?goodsImgRoot+item.goodsBigUrl:''" class="center-bigImg-list-datu"></image>
					<view class="center-bigImg-list-center flex-xsb-yc">
						<view class="center-bigImg-list-center-left">
							<view class="goodsName">{{ item.goodsName}} </view>
							<view class="goodsMoney">市场价：{{ item.goodsMoney}} </view>
							<view :class="item.goodsStatus == 0 ? 'value' : 'valueOn'">
								<block v-if="item.realPay && item.realPay!=0">￥<text>{{item.realPay}}</text></block>
								<block v-if="item.realPay && item.realPay!=0 && item.realVpoints && item.realVpoints!=0"><text>+</text></block>
								<block v-if="item.realVpoints && item.realVpoints!=0"><text>{{item.realVpoints}}</text> 积分</block>
							</view>
						</view>
						<view class="btn">
							<!--    "goodsStatus":"商品状态：0正常，1暂停兑换，2下架", -->
							<block v-if="item.goodsStatus == 0">
								<image :src="indexUrl+'lijigoumai.png'" @click="toGoodsDetail(item.goodsId)"></image>
							</block>
							<block v-else>
								<text class="btn-mes" @click="toGoodsDetail(item.goodsId)">暂停兑换</text>
								<image :src="indexUrl+'wukucunbeijing.png'"></image>
							</block>
						</view>
					</view>
				</view>
			</view>
			<!-- 小图推荐 -->
			<view class="center-samllImg-lists">
				<view class="center-samllImg-list flex-xsb-yc" v-for="(item,index) in samllImgArr" v-if="index%2" :key="item.goodsId">
					<view class="center-samllImg-list-center-left" @click="toGoodsDetailLeft(index-1)">
						<view class="top-box">
							<image :src="goodsImgRoot+samllImgArr[index-1].showImgUrl"></image>
							<view class="center-samllImg-lists-mask" v-if="samllImgArr[index-1].goodsStatus != 0">暂停兑换</view>
						</view>
						<view class="bot-box">
							<view class="goodsName"> {{ samllImgArr[index-1].goodsShortName}} </view>
							<view class="goodsMoney"> {{ samllImgArr[index-1].goodsSpecification}} </view>
							<view :class="samllImgArr[index-1].goodsStatus == 0 ? 'value' : 'valueOn'">
								<block v-if="samllImgArr[index-1].realPay && samllImgArr[index-1].realPay!=0">￥<text>{{samllImgArr[index-1].realPay}}</text></block>
								<block v-if="samllImgArr[index-1].realPay && samllImgArr[index-1].realPay!=0 && samllImgArr[index-1].realVpoints && samllImgArr[index-1].realVpoints!=0"><text>+</text></block>
								<block v-if="samllImgArr[index-1].realVpoints && samllImgArr[index-1].realVpoints!=0"><text>{{samllImgArr[index-1].realVpoints}}</text>积分</block>
							</view>
						</view>
					</view>
					<view class="center-samllImg-list-center-right" @click="toGoodsDetail(item.goodsId)">
						<view class="top-box">
							<image :src="goodsImgRoot+item.showImgUrl"></image>
							<view class="center-samllImg-lists-mask" v-if="item.goodsStatus != 0">暂停兑换</view>
						</view>
						<view class="bot-box">
							<view class="goodsName"> {{ item.goodsShortName}} </view>
							<view class="goodsMoney"> {{ item.goodsSpecification}} </view>
							<view :class="item.goodsStatus == 0 ? 'value' : 'valueOn'">
								<block v-if="item.realPay && item.realPay!=0">￥ <text>{{item.realPay}}</text> </block>
								<block v-if="item.realPay && item.realPay!=0 && item.realVpoints && item.realVpoints!=0"><text>+</text></block>
								<block v-if="item.realVpoints && item.realVpoints!=0"><text>{{item.realVpoints}}</text> 积分</block>
							</view>
						</view>
					</view>
				</view>
				<block v-if="samllImgArrEnd.length>0">
					<view class="center-samllImg-list flex-xsb-yc" @click="toGoodsDetail(samllImgArrEnd[0].goodsId)">
						<view class="center-samllImg-list-center-left">
							<view class="top-box">
								<image :src="goodsImgRoot+samllImgArrEnd[0].showImgUrl"></image>
								<view class="center-samllImg-lists-mask" v-if="samllImgArrEnd[0].goodsStatus != 0">暂停兑换</view>
							</view>
							<view class="bot-box">
								<view class="goodsName"> {{ samllImgArrEnd[0].goodsShortName}} </view>
								<view class="goodsMoney"> {{ samllImgArrEnd[0].goodsSpecification}} </view>
								<view :class="samllImgArrEnd[0].goodsStatus == 0 ? 'value' : 'valueOn'">
									<block v-if="samllImgArrEnd[0].realPay && samllImgArrEnd[0].realPay!=0">￥ <text>{{samllImgArrEnd[0].realPay}}</text>
									</block>
									<block v-if="samllImgArrEnd[0].realPay && samllImgArrEnd[0].realPay!=0 && samllImgArrEnd[0].realVpoints && samllImgArrEnd[0].realVpoints!=0"><text>+</text></block>
									<block v-if="samllImgArrEnd[0].realVpoints && samllImgArrEnd[0].realVpoints!=0"> <text>{{samllImgArrEnd[0].realVpoints}}</text>积分</block>
								</view>
							</view>
						</view>
						<view class=""></view>
					</view>
				</block>
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
		filterArr,
		getUserDataFun,
		dateformat,
		getOpenidSD
	} from '@/common/basicsFun.js';
	import {
		customDialog
	} from '@/components/customDialog.vue';
	import {
		uniNavBar
	} from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		getShopGoodsRequst,
		getUserInfoRequst
	} from '@/common/getData.js';
	import SwiperMixin from '@/common/swiper-mixin.js'
	import {
		getUserInfo
	} from '@/common/getWxUserInfor.js';
	export default {
		name: 'index',
		mixins: [SwiperMixin],
		components: {
			customDialog,
			uniNavBar
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				indexUrl: config.staticUrl + 'index/',
				goodsImgRoot: config.goodsImgRoot,
				bigImgArr: [], // 大图推荐商品
				samllImgArr: [], // 小图推荐 
				samllImgArrEnd: [], // 小图推荐 
				swiperList: [],
				isHasUserInfo: '',
				openid: '',
				totalVpoints: 0, // 剩余 积分数 
				userInfo: {
					avatarUrl: '',
					nickName: '昵称'
				}, //用户 信息 头像 昵称 
			};
		},
		onLoad() {
			// 已授权的 进入回显头像
			const that = this;
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
			getOpenidSD(); //获取山东 openid
		},
		computed: {
			// 当窗口 高度 大于800 是 重新 计算 盒子的上边距
			isOpenAdaptation() {
				if (this.windowHeight > 700) {
					return true;
				} else {
					return false;
				}
			},
			swiperListNew: function() {
				const nowTimestamp = new Date().getTime();
				const arr = [];
				// 当前时间戳小于等于过期时间 才像新轮播数组中添加
				this.swiperList.forEach((itme) => {
					if (itme.expirationTime) {
						if (nowTimestamp <= new Date(itme.expirationTime).getTime()) {
							arr.push(itme)
						}
					} else {
						arr.push(itme)
					}
				})
				return arr
			},
		},
		onShow() {
			const that = this;
			that.openid = that.openid ? that.openid : uni.getStorageSync('openid').openid;
			if (that.openid) {
				that.init();
			}
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
				title: '青岛啤酒畅享山东',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'mall/shareImg.jpg?v=1'
			};
		},

		methods: {
			init() {
				const that = this;
				//商品展示类型：1首页商品大图，2首页商品小图，3积分好礼
				getShopGoodsRequst('1', 1, 100).then((res) => {
					console.log('getShopGoodsRequst');
					console.log(res);
					that.bigImgArr = res.reply;
				}); // 商品展示类型  当前页数 数量 
				// 获取 小图推荐 数据
				getShopGoodsRequst('2', 1, 100).then((res) => {
					console.log('getShopGoodsRequst2');
					console.log(res);
					const samllImgArr = res.reply;
					samllImgArr.forEach((item) => {
						// goodsUrl 返回多个 图片地址 用第一个
						item.showImgUrl = item.goodsUrl.split(',')[0];
					})
					if (samllImgArr.length % 2 == 0) {
						this.samllImgArr = samllImgArr;
					} else {
						this.samllImgArr = samllImgArr.slice(0, samllImgArr.length - 1);
						this.samllImgArrEnd = samllImgArr.slice(-1);
					}
				}); // 商品展示类型  当前页数 数量 
				// 获取轮播图列表
				this.querySwiperlist('1')
					.then(res => {
						console.log('-------------querySwiperlist------------------');
						console.log(res);
						const swiperList = []
						res && res.forEach((item, index) => {
							const curItem = Object.assign(item, {
								id: index,
								type: 'image',
								url: item.picUrl,
								className: 'home-' + (index + 1)
							})
							swiperList.push(curItem)
						})
						this.swiperList = swiperList
					});
				getUserInfoRequst().then((res) => {
					console.log('getUserInfoRequst');
					console.log(res);
					this.totalVpoints = Number(res.accountInfo.surplusVpoints) > 0 ? res.accountInfo.surplusVpoints : 0; //账户剩余积分
				});
			},

			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			handleJumpEvent(item) {

			},

			/**
			 * 获取用户信息
			 */
			getUserInfoFn() {
				getUserInfo().then(res => {
					const that = this;
					that.userInfo.avatarUrl = res.userInfo.avatarUrl;
					that.userInfo.nickName = res.userInfo.nickName;
					that.isHasUserInfo = true;
				});
			},
			//to商品详情
			toGoodsDetail(goodsId) {
				console.log('goodsId');
				console.log(goodsId);
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?id=' + goodsId + '&type='
				})
			},
			//to商品详情
			toGoodsDetailLeft(index) {
				console.log('index');
				console.log(index);
				const goodsId = this.samllImgArr[index].goodsId;
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?id=' + goodsId + '&type='
				})
			},
			// 跳转商城 定义参数
			toMall() {
				getApp().globalData.from = 'jfhw'; // 跳转到 指定 tab
				uni.switchTab({
					url: '/pages/mall/mall'
				})
			},
			// 跳转 积分 好礼 
			toScore() {
				uni.switchTab({
					url: '/pages/score/score'
				})
			},

		},

	};
</script>
<!-- <view class="container" style="background-image:url({{imgBaseUrl}}/bg.jpg) no-repeat;background-size:cover;"></view> -->
<style lang="scss" scoped>
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

	.wrap {
		background: #F6F6F6;
		min-height: 100%;
	}

	.banner-swiper {
		width: 100%;
		height: 740rpx;

		image {
			width: 100%;
		}
	}

	.wrap-header {
		position: relative;

		.wrap-header-usermes {
			width: 92%;
			height: 160rpx;
			background: #FFFFFF;
			border-radius: 20px;
			position: absolute;
			left: 4%;
			bottom: -26rpx;
			// bottom: -80rpx;

			.wrap-header-usermes-left {
				margin-left: 44rpx;

				.wrap-header-usermes-img {
					width: 125rpx;
					height: 125rpx;
					border: 3rpx solid #C9EBD1;
					border-radius: 128rpx;
					margin-right: 30rpx;
					background: #f1f1f1;

					// padding: 2rpx;
					button,
					image {
						width: 100%;
						height: 100%;
						border-radius: 154rpx;
					}
				}

				.nickName {
					color: #999999;
					font-size: 26rpx;
				}
			}

			.wrap-header-usermes-right {
				font-size: 32rpx;
				color: #333333;
				text-align: right;
				margin-right: 44rpx;

				>text {
					color: #F3AB00;
					font-size: 46rpx;
				}

				>view {
					color: #333333;
					font-size: 32rpx;
				}
			}
		}
	}

	.center-tabs {
		height: 206rpx;
		width: 92%;
		// margin-top: 100rpx;
		margin-top: 46rpx;
		margin-left: 4%;

		>view {
			height: 100%;
			flex: 1;
			background: #FFFFFF;
			border-radius: 8rpx;
			position: relative;

			.diandian {
				width: 30rpx;
				height: 30rpx;
				margin-top: 24rpx;
				margin-left: 24rpx;
				display: block;
			}

			.jifenleftImg {
				width: 76rpx;
				height: 104rpx;
				position: absolute;
				right: 34rpx;
				bottom: 20rpx;
			}

			.jifenrightImg {
				width: 148rpx;
				height: 114rpx;
				position: absolute;
				right: 10rpx;
				bottom: 12rpx;
			}

			>text {
				font-size: 30rpx;
				color: #333333;
			}

			>text:nth-of-type(1) {
				border-bottom: 6rpx solid #FCD048;
				margin-left: 44rpx;
				padding-bottom: 16rpx;
			}
		}

		>view:nth-of-type(1) {
			margin-right: 30rpx;
		}
	}

	.center-bigImg-lists {
		width: 92%;
		margin-left: 4%;
		margin-top: 20rpx;

		>view.center-bigImg-list {
			// height: 490rpx;
			position: relative;
			margin-bottom: 30rpx;
			background: #FFFFFF;
			border-radius: 8rpx;

			.center-bigImg-list-datu {
				width: 100%;
				height: 316rpx;
				display: block;
			}

			.center-bigImg-list-center {
				padding: 32rpx 12rpx 30rpx 30rpx;

				.goodsName {
					font-size: 30rpx;
					color: #000000;
					font-weight: bolder;
				}

				.goodsMoney {
					font-size: 24rpx;
					color: #999999;
					margin: 12rpx 0;
				}

				.value {
					font-size: 26rpx;
					color: #ED0000;
					font-weight: bold;

					>text {
						font-size: 34rpx;
					}
				}

				.valueOn {
					font-size: 26rpx;
					color: #999999;
					font-weight: bold;

					>text {
						font-size: 34rpx;
					}
				}

				.center-bigImg-list-center-left {
					flex: 1;
				}

				.btn {
					width: 230rpx;
					height: 86rpx;
					position: relative;

					image {
						width: 100%;
						height: 100%;
					}

					.btn-mes {
						width: 100%;
						line-height: 86rpx;
						font-size: 32rpx;
						color: #FFFFFF;
						position: absolute;
						left: 0;
						top: 0;
						text-align: center;
					}
				}
			}
		}
	}

	.center-samllImg-lists {
		width: 92%;
		margin-left: 4%;
		margin-top: 20rpx;
		padding-bottom: 30rpx;

		>view.center-samllImg-list {
			position: relative;
			margin-bottom: 20rpx;

			>view {
				flex: 1;
				background: #FFFFFF;
				border-radius: 20rpx;
				overflow: hidden;
			}

			.center-samllImg-list-center-left {
				margin-right: 20rpx;
			}

			.goodsName {
				font-size: 28rpx;
				color: #000000;
				font-weight: bolder;
			}

			.goodsMoney {
				font-size: 22rpx;
				color: #888888;
				margin: 16rpx 0;
			}

			.value {
				font-size: 24rpx;
				color: #ED0000;
				font-weight: bold;

				>text {
					font-size: 30rpx;
				}
			}

			.valueOn {
				font-size: 24rpx;
				color: #999999;
				font-weight: bold;

				>text {
					font-size: 30rpx;
				}
			}

			.bot-box {
				margin: 34rpx 26rpx;
			}
		}

		// 小图推荐
		.top-box {
			width: 100%;
			height: 288rpx;
			position: relative;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.center-samllImg-lists-mask {
			width: 210rpx;
			height: 210rpx;
			text-align: center;
			line-height: 210rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background: url($saoDianDe+'index/wukucunbeijing01.png') no-repeat;
			background-size: 100% 100%;
			color: #fff;
			font-size: 32rpx;
		}
	}

	.set {
		color: #999999;
		font-size: 24rpx;
		text-align: center;
		line-height: 128rpx;
	}
</style>

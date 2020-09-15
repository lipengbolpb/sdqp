<template>
	<!-- 扫码入口 处理判断区分  保留地址授权 -->
	<view class="page-template">
		<view class="page-template-wrap page-template-wrap-bg">
			<!-- 引导开启 位置授权 -->
			<wx-open-setting :wxOpenSettingIsShow="wxOpenSettingIsShow" :isStartAnimation="wxOpenSettingIsStartAnimation"
			 @WxOpenSettingColse="WxOpenSettingColse" @openSetting="wosOpenSetting"></wx-open-setting>
			<!-- 自定义 -->
			<custom-dialog ref="customDialogChild" @customDialogColse="updateCustomDialog" :customDialogIsShow="customDialogIsShow"
			 :customDialogType="customDialogType"></custom-dialog>
		</view>
	</view>
</template>

<script>
	/**
	 * 	扫码入口 
	 *     区分版本跳转不同版本，崂山版和金麦版本流程需要单独做，与公用样式不同。
	 * 	   不强制位置授权 （ 进入页面先判断用户是否同意授权 拒绝：弹出自定义位置引导）
	 * 	   		已经授权并且在缓存中能拿到 位置信息 直接调用扫码接口
	 *     		不同意授权引导授权 开启授权、不开启授权 在回调用调用扫码接口。关闭（点击关闭按钮、蒙层）调用扫码接口
	 */

	import {
		get,
		post,
		config
	} from '@/utils/api.js';
	import {
		getLocation,
		analysisMobile,
		checkSession,
		getCode,
		getOpenid,
		getSettingLocation
	} from '@/common/getWxUserInfor.js';
	import {
		sweepQrcode,
		sweepSeckill,
	} from '@/common/getData.js';
	import {
		judgeBusinessCode,
		judgeSeckillBusinessCode
	} from '@/common/basicsFun.js';
	import {
		wxOpenSetting
	} from '@/components/wx-open-setting/wx-open-setting.vue'; // 开启 位置 引导
	export default {
		name: 'activityEntrance',
		components: {
			wxOpenSetting
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				openid: '', // 
				isShowCustomLocation: false, // 是否展示 自定义 定位引导
				wxOpenSettingIsShow: false, // 是否展示 位置授权
				wxOpenSettingIsStartAnimation: false, // 位置授权 是否展示动画
				sweepstr: '',
				fromOpenSetting: false,
				isHasVjifenOpenid: true,
			};
		},
		onLoad(options) {
			const that = this;
			console.log('页面参数 options 176');
			console.log(options);
			
			// const sweepstrUrl = options.q;
			// this.sweepstr = sweepstrUrl;
			
			const sweepstrUrl = decodeURIComponent(options.q);
			
			getApp().globalData.sweepstr = sweepstrUrl; //目前用到 黑名单 填写信息 之后 回调本页 
			
			if (sweepstrUrl.indexOf('x.vjifen.com') != -1) {
				//测试二维码
				that.sweepstr = sweepstrUrl.split('VSD/')[1];
			} else if (sweepstrUrl.indexOf('VJ1.TV/') != -1) {
				that.sweepstr = sweepstrUrl.split('VSD/')[1];
			} else if (sweepstrUrl.indexOf('vj1.tv/') != -1) {
				that.sweepstr = sweepstrUrl.split('VSD/')[1];
			} else {
				that.sweepstr = '';
				return uni.showModal({
					title: '温馨提示',
					content: '请扫描正确的活动二维码~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					}
				});
			}
			this.getOpenidSD();
		},
		onReady() {


		},
		async onShow() {
			const that = this;
			that.openid = that.openid ? that.openid : uni.getStorageSync('openid').openid;

			console.log("页面 onshow");
			console.log(that.openid);

			if (that.openid && that.isHasVjifenOpenid) {
				console.log('this.getVjifenOpenid');
				that.getVjifenOpenid();
			}
			if (that.openid && that.isHasVjifenOpenid == false) {
				that.vjifenOpenid = that.vjifenOpenid ? that.vjifenOpenid : uni.getStorageSync('vjfOpenid').vjfOpenid;
			}
			that.vjifenOpenid = that.vjifenOpenid ? that.vjifenOpenid : uni.getStorageSync('vjfOpenid').vjfOpenid;

			if (that.openid && that.vjifenOpenid) {
				// 走扫码的逻辑 检测位置微信 调用接口
				this.checkUserLocation(true);
				console.log('走扫码的逻辑 检测位置微信 调用接口');
				console.log(that.openid);
				console.log(that.vjifenOpenid);
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
			}
			return {
				title: '青岛啤酒畅享山东',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},
		onHide() {

		},
		methods: {
			onload(options) {
				console.log(options);
				// if (qr.indexOf('MS_') != -1) {
				// 	getMS(); 秒杀 地址中带有 秒杀 调用秒杀接口
				// } else {
				// 	sweep();
				// }
				const that = this;
				// 微信扫一扫进入页面会把参数放到options.q上不可修改q变量
				const sweepstrUrl = decodeURIComponent(options.q);
				if (sweepstrUrl.indexOf('xt.vjifen.com') != -1) {
					//测试二维码
					if (sweepstrUrl.indexOf('/LN/') != -1) {
						//测试的微信直接打开小程序
						that.sweepstr = sweepstrUrl.split('LN/')[1];
					} else {
						that.sweepstr = sweepstrUrl.split('v=')[1];
					}
				} else if (sweepstrUrl.indexOf('VJ1.TV/') != -1) {
					that.sweepstr = sweepstrUrl.split('QQ/')[1];
				} else if (sweepstrUrl.indexOf('vj1.tv/') != -1) {
					that.sweepstr = sweepstrUrl.split('QQ/')[1];
				} else {
					that.sweepstr = '';
					return uni.showModal({
						title: '温馨提示',
						content: '请扫描正确的活动二维码~',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '../index/index'
								});
							}
						}
					});
				}
			},
			// 页面初始化
			init() {
				const that = this;

				if (getApp().globalData.isInitsweepstr == 'true') {
					// 走扫码的逻辑 检测位置微信 调用接口
					that.checkUserLocation(true);
				} else {
					return false;
				}

			},
			// 验证缓存中 是否 存在用户位置
			async checkUserLocation(status = false) {
				/**
				 * 获从缓存中  获取 用户位置 信息
				 * 有 直接调用 接口
				 * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
				 * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
				 * 		 1 :  一般不会存在 缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
				 * 		 2 :  继续 调用微信授权
				 */
				const that = this;
				const LocationStatus = await getSettingLocation();
				uni.getStorage({
					key: 'userLocation',
					success(res) {
						const userLocation = res.data;
						// 调用接口
						if (userLocation.longitude) {
							// that.getSweepQrcode(userLocation.longitude, userLocation.latitude, that.sweepstr, status);

							that.sweepTypeFun(userLocation.longitude, userLocation.latitude);
						} else {
							// that.getSweepQrcode('', '', that.sweepstr, status);

							that.sweepTypeFun();
						}

					},
					fail(err) {
						if (LocationStatus == 0) {
							// 弹出自定义 位置引导弹窗
							that.wxOpenSettingIsShow = true;
						} else {
							// 弹出 获取位置
							getLocation().then((...res) => {
								const [status, locationData] = Array.from(res[0]);
								// 调用接口
								if (status == 0) {
									// that.getSweepQrcode(locationData.longitude, locationData.latitude, that.sweepstr);
									that.sweepTypeFun(locationData.longitude, locationData.latitude);
								} else {
									// that.getSweepQrcode('', '', that.sweepstr);
									that.sweepTypeFun();
								}
							});
						}
					}
				});
			},
			// 验证缓存中 是否 存在用户信息（openid、sessiong_key）
			async getUserDataFun() {
				/**
				 * 获从缓存中  获取 用户信息（openid，session_key） 信息
				 * 存在
				 * 		验证session（checkSessionStatus） 是否过期
				 * 			未过期 直接调用 返回 用户信息
				 * 			过期   直接调用 重新调用获取小程序 code （getCode）拿到code 获取用户信息（getOpenid）
				 * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
				 * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
				 * 		 1 :  一般不会存在 缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
				 * 		 2 :  继续 调用微信授权
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
						const backOpenidData = await getOpenid(xcxCode, 'hgqq');
						if (backOpenidData.uinfo) {
							returnUserData = backOpenidData.uinfo;
						}
					}
				} else {
					// 获取 小程序 code 请求接口换取 openid
					const xcxCode = await getCode();
					const backOpenidData = await getOpenid(xcxCode, 'hgqq');
					if (backOpenidData.uinfo) {
						returnUserData = backOpenidData.uinfo;
					}
				}
				return returnUserData;
			},
			// 打开微信 位置授权页面
			wosOpenSetting() {
				//设置里打开授权地理位置
				// this.againClick = true;
				uni.openSetting({
					complete: res => {
						console.log('我是设置里打开授权地理位置');
						// 统一在onshow执行地址位置判断
						// this.getLocation();
						// return false
						const that = this;
						that.wxOpenSettingIsShow = false;
						// 开启本页面 动效
						if (this.isStartAnimation) {
							this.resetInitAnimation();
							this.startInitAnimation();
						}
						// 关闭了 也要继续往下走
						// 继续调用 接口
						that.fromOpenSetting = true;

						that.aecChuanImg = '';
						that.aecCrownCookiesImg = '';
						that.aecBaifenbai = '';

						setTimeout(() => {
							that.aecChuanImg = 'aec-chuanImg';
							that.aecCrownCookiesImg = 'aec-crownCookiesImg';
							that.aecBaifenbai = 'aec-baifenbai-end';
						}, 10)

					}
				});
			},
			// 关闭 授权位置
			WxOpenSettingColse(data) {
				const that = this;
				that.wxOpenSettingIsShow = false;
				// 关闭了 也要继续往下走
				// 继续调用 接口
				that.sweepTypeFun();
			},
			// 获取手机号
			async getPhoneNumber(e) {
				const backDetail = e.detail;
				if (backDetail.errMsg.lastIndexOf('ok') != -1) {
					//成功getPhone
					const userData = uni.getStorageSync('userData');
					//解析手机号
					if (userData.uinfo.session_key) {
						// this.parsePhone(e) //解析手机号码
						const session_key = userData.uinfo.session_key;
						analysisMobile(session_key, backDetail).then(backData => {});
					} else {
						const backUserData = await that.getUserDataFun();
						const session_key = backUserData.session_key;
						analysisMobile(session_key, backDetail);
					}
				} else {

				}
				// 无论是否同意 获取手机号 都调用方法
				this.luckDrawFun();
			},
			//获取 扫码接口 返回信息 并处理
			getSweepQrcode(longitude = '00', latitude = '00', sweepstr = '', status = false) {
				console.log('getSweepQrcodegetSweepQrcodegetSweepQrcodegetSweepQrcode');
				const that = this;
				var sendParams = {
					openid: that.openid,
					vjifenOpenid: that.vjifenOpenid,
					sweepstr: sweepstr,
					longitude: longitude, //"经度"
					latitude: latitude, //"纬度"
					nickname: '',
					headimgurl: ''
				};
				// 调用扫码接口
				sweepQrcode(sendParams)
					.then(res => {
						console.log(sendParams);
						return judgeBusinessCode(res);
					})
					.then(
						res => {
							console.log('我是 返回处理 01');
							console.log(res);
							uni.redirectTo({
								url: res
							});
							
						},
						err => {
							// 跳转 首页
							uni.switchTab({
								url: err
							});
						}
					);
			},
			//获取 秒杀 返回信息 并处理
			getSweepSeckill(longitude = '00', latitude = '00', sweepstr = '', status = false) {
				console.log('getSweepQrcodegetSweepQrcodegetSweepQrcodegetSweepQrcode');
				// switch (qr.slice(3, 4)) { // 不同奖品 区分不同 活动规则 
				// 				case '1':
				// 					sessionStorage.Ms_prizeType = '1';
				// 					break;
				// 				case '2':
				// 					sessionStorage.Ms_prizeType = '2';
				// 					break;
				// 				case '3':
				// 					sessionStorage.Ms_prizeType = '3';
				// 					break;
				// 				default:
				// 					sessionStorage.Ms_prizeType = '1';
				// 					break;
				// 			}
				const that = this;
				var sendParams = {
					openid: that.openid,
					vjifenOpenid: that.vjifenOpenid,
					sweepstr: sweepstr,
					longitude: longitude, //"经度"
					latitude: latitude, //"纬度"
					nickname: '',
					headimgurl: ''
				};
				// 调用扫码接口
				sweepSeckill(sendParams)
					.then(res => {
						console.log('我是秒杀返回 数据');
						console.log(sendParams);
						return judgeSeckillBusinessCode(res);
					})
					.then(
						res => {
							console.log('我是 返回处理 ');
							console.log(res);
							uni.redirectTo({
								url: res
							});
						},
						err => {
							// 跳转 首页
							uni.switchTab({
								url: err
							});
						}
					);
			},
			sweepTypeFun(longitude = '', latitude = '') {
				// 判断 扫码类型 秒杀 还是 正常扫码
				if (this.sweepstr.indexOf('MS_') != -1) {
					this.getSweepSeckill(longitude, latitude, this.sweepstr);
				} else {
					this.getSweepQrcode(longitude, latitude, this.sweepstr);
				}
			},
			getOpenidSD() {
				const storageOpenid = uni.getStorageSync('openid');
				console.log('getOpenidSD');
				console.log(storageOpenid);
				if (storageOpenid) {
					return storageOpenid;
				} else {
					uni.navigateTo({
						url: '/pages/getOpenid/getOpenid?getIdType=openid'
					})
				}
			},
			getVjifenOpenid() {
				const storageOpenid = uni.getStorageSync('vjfOpenid');
				console.log('vjfOpenid');
				console.log(storageOpenid);
				this.isHasVjifenOpenid = false;
				if (storageOpenid) {
					return storageOpenid;
				} else {
					uni.navigateTo({
						url: '/pages/getOpenid/getOpenid?getIdType=vjfOpenid'
					})
				}
			},

		}
	};
</script>
<style scoped lang="scss">
	.page-template-wrap-bg {
		// background: url($crownCookiesImg+'crownCookiesImgBgBig.jpg') no-repeat center;
		// background-size: cover;
	}
</style>

// 所有接口请求存放
import {
	requestGet,
	requestPost,
	config
} from '@/utils/api.js';

// 扫码接口
function sweepQrcode(sendParams) {
	uni.showLoading({
		title: '加载中'
	});
	return new Promise((resolve, reject) => {
		if (sendParams.openid == '') {
			sendParams.openid = uni.getStorageSync("userData").uinfo.openid;
		}

		if (uni.getStorageSync('userInfo')) {
			sendParams.nickname = uni.getStorageSync('userInfo').nickName;
			sendParams.headimgurl = uni.getStorageSync('userInfo').avatarUrl;
		} else {
			sendParams.nickname = '';
			sendParams.headimgurl = '';
		}

		console.log("backParams");
		console.log(sendParams);
		requestPost('/sweep/sweepQrcode', sendParams).then((backParams) => {
			uni.hideLoading();
			// const [e, r] = backParams;
			console.log(backParams);
			if (backParams) {
				uni.setStorage({
					key: 'sweepQrcodeData',
					data: backParams
				})

				getApp().globalData.sweepQrcodeData = backParams;
				getApp().globalData.result = backParams.result ;
				getApp().globalData.businessCode = backParams.businessCode ;
				getApp().globalData.reply = backParams.reply ;
				
				const backData = backParams.result;
				if (backParams.result.code == 0) {
					if (resolve) {
						resolve(backParams);
					}
				} else {
					uni.showModal({
						title: '扫码接口提示',
						content: '系统开了个小差',
						showCancel: false,
						complete: res => {
							if (res.confirm) {
								uni.switchTab({
									url: '../index/index'
								})
							}
						}
					})
				}
			} else {
				uni.showModal({
					title: '扫码接口提示',
					content: '系统繁忙',
					showCancel: false,
					complete: res => {
						if (res.confirm) {
							uni.switchTab({
								url: '../index/index'
							})
						}
					}
				})
			}
		});
	})
}
// 秒杀接口
function sweepSeckill(sendParams) {
	uni.showLoading({
		title: '加载中'
	});
	return new Promise((resolve, reject) => {
		// if (sendParams.openid == '') {
		// 	sendParams.openid = uni.getStorageSync("userData").uinfo.openid;
		// }
		console.log("backParams");
		console.log(sendParams);
		requestPost('/vpoints/seckill/sweepQrcode', sendParams).then((backParams) => {
			uni.hideLoading();
			console.log(backParams);
			if (backParams) {
				if (backParams.businessCode != 0) {
					// 因为 秒杀目前 只有中 红包 或者 提示 您离红包只差一点点  
					// 当 businessCode ！=0 都认为是 异常情况 提示 您离红包只差一点点 走 抽中 红包 并且中奖 金额为零的 逻辑 新增 所需字段
					backParams.reply = {
						'currentMoney': 0,
						'earnTime': '',
						'totalAccountMoney': '',
						'scanLadderFlag': 0 // 阶梯所需参数
					}
					backParams.result.businessCode = 0;
					backParams.result.mytype = backParams.businessCode // 存储原始 businessCode
				}
				uni.setStorage({
					key: 'sweepQrcodeData',
					data: backParams
				})
				getApp().globalData.sweepQrcodeData = backParams;
				const backData = backParams.result;
				if (backParams.result.code == 0) {
					if (resolve) {
						resolve(backParams);
					}
				} else {
					uni.showModal({
						title: '扫码接口提示',
						content: '系统开了个小差',
						showCancel: false,
						complete: res => {
							if (res.confirm) {
								uni.switchTab({
									url: '../index/index'
								})
							}
						}
					})
				}
			} else {
				uni.showModal({
					title: '扫码接口提示',
					content: '系统繁忙',
					showCancel: false,
					complete: res => {
						if (res.confirm) {
							uni.switchTab({
								url: '../index/index'
							})
						}
					}
				})
			}

		});
	})
}

// 获取验证码
function getCaptcha(phonenum) {
	uni.showLoading({
		title: '获取中'
	});
	return new Promise((reslove, reject) => {
		const sendParams = {
			phonenum: phonenum,
			sendtype: '1',
		}
		requestPost('/user/getCaptcha', sendParams).then((backParams) => {
			uni.hideLoading();
			reslove(backParams);
		});
		// url: 'https://mapi.vjifen.com/vjifenInterface/user/getCaptcha',
	});
}

// 黑名单 提交
function updateUserInfoMobile(openid, phonenum, captcha) {
	uni.showLoading({
		title: '提交中',
	})
	return new Promise((reslove, reject) => {
		const sendParams = {
			"openid": openid,
			"phonenum": phonenum,
			"captcha": captcha,
		}
		requestPost('/user/updateUserInfoMobile', sendParams).then((backParams) => {
			uni.hideLoading();
			reslove(backParams);
		});
		// url: 'https://mapi.vjifen.com/vjifenInterface/user/getCaptcha',
	});
}

// 中 大奖 填写个人信息
function savePrize(sendParams) {
	uni.showLoading({
		title: '提交中',
	})
	return new Promise((reslove, reject) => {
		requestPost('/user/savePrize', sendParams).then((res) => {
			uni.hideLoading();
			// let [e,r] =res
			console.log(res);
			if (res) {
				const resultData = res.result;
				if (resultData.code == 0) {
					if (resultData.businessCode == 0) { //提交成功
						// 提交成功 then 处理后续逻辑
						reslove(1);
					} else if (resultData.businessCode == 4) {
						reslove(4);
					} else {
						uni.showModal({
							title: "提示",
							content: resultData.msg ? resultData.msg : '系统开了个小差',
							showCancel: false
						})
					}
				} else {
					uni.showModal({
						title: "提示",
						content: resultData.msg ? resultData.msg : '系统开了个小差',
						showCancel: false
					})
				}
			} else {
				console.log(e)
				uni.showModal({
					title: "提示",
					content: '系统繁忙',
					showCancel: false
				})
			}
		});
	})
}

// 个人中心 获取展示数据
function queryUserHomePage() {
	const userData = uni.getStorageSync('userData');
	const openid = userData.uinfo.openid;
	var params = {
		openid: openid,
		hbopenid: ''
	};
	const promise = new Promise((reslove, reject) => {
		requestPost('/turnaroundDraw/queryUserHomePage', params).then((jo) => {
			console.log('queryUserHomePage');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		}, (err) => {
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

// 我的红包 列表 
function queryAllGiftsList(openid, currentPage, count,searchFlag=1) {
	// const userData = uni.getStorageSync('openid');
	// console.log(userData);
	// const openid = userData.openid;
	const params = {
		openid: openid,
		hbopenid: '',
		currentPage: currentPage,
		count: count,
		searchFlag:searchFlag
	};
	uni.showLoading({
		title: '加载中',
	})
	const promise = new Promise((reslove, reject) => {
		requestPost('/gifts/queryAllGiftsList', params).then((jo) => {
			setTimeout(function() {
				uni.hideLoading();
			}, 300)
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo.reply)
				} else {
					reslove(false)
				}
			} else {
				uni.showModal({
					title: '提示',
					content: jo.result.msg
				});
			}
		})
	})
	return promise;
}

// 换购列表 
function queryExchangePrizeAllLst(currentPage, count, searchFlag) {
	const userData = uni.getStorageSync('vjfOpenid');
	const vjfOpenid = userData.vjfOpenid;
	const ExchangePrizeAllLst_PORT = '/consumer/queryExchangePrizeAllLst'; // 我的换购 待兑换 已过期
	const ExchangePrizeAllLstUsed_PORT = '/consumer/queryExchangedPrizeLst'; // 我的换购 已兑换
	let sendUrl = searchFlag == 2 ? ExchangePrizeAllLstUsed_PORT : ExchangePrizeAllLst_PORT;
	const params = {
		"companyKey": config.companyKey,
		"vjifenOpenid": vjfOpenid,
		"projectServerName": 'shandongagt',
		"currentPage": currentPage,
		"count": count,
		"searchFlag": searchFlag // 默认全部，1未兑换，2已兑换，3已过期
	};
	uni.showLoading({
		title: '加载中',
	})
	const promise = new Promise((reslove, reject) => {
		requestPost(sendUrl, params, config.yylg).then((jo) => {

			setTimeout(function() {
				uni.hideLoading();
			}, 300)
			if (jo.result.code == 0) {
				// if (jo.result.businessCode == 0) {
				// 	reslove(jo.reply)
				// } else {
				// 	reslove(false)
				// }
				reslove(jo.reply);
			} else {
				uni.showModal({
					title: '提示',
					content: jo.result.msg
				});
			}

		})
	})
	return promise;
}

// 奖品列表 
function queryPrizeList(currentPage, count, useStatus) {
	const userData = uni.getStorageSync('openid');
	const openid = userData.openid;
	const sendUrl = '/gifts/queryPrizeList'; // 奖品列表 
	const params = {
		"openid": openid,
		"currentPage": currentPage,
		"count": count,
		"useStatus": useStatus //0 待领取 1 已领取 2 已过期
	};
	uni.showLoading({
		title: '加载中',
	})
	const promise = new Promise((reslove, reject) => {
		requestPost(sendUrl, params, ).then((jo) => {

			setTimeout(function() {
				uni.hideLoading();
			}, 300)
			if (jo.result.code == 0) {
				// if (jo.result.businessCode == 0) {
				// 	reslove(jo.reply)
				// } else {
				// 	reslove(false)
				// }
				reslove(jo.reply);
			} else {
				uni.showModal({
					title: '提示',
					content: jo.result.msg
				});
			}

		})
	})
	return promise;
}

// 输入串码 是 验证 用户 状态
function getFailCount() {
	const userData = uni.getStorageSync('userData');
	const openid = userData.uinfo.openid;
	const sendParams = {
		"openid": openid, // this.$store.state.openid
	};
	return new Promise((reslove, reject) => {
		requestPost('/sweep/getFailCount', sendParams).then((res) => {
			const backRes = res.result;
			if (backRes.code === '0') {
				switch (backRes.businessCode) {
					case '0':
						//只输入验证码
						reslove(false);
						break;
					case '1': // 1 - 程序异常,
						uni.showModal({
							title: '尊敬的用户',
							content: '呜呜，系统开了个小差，请稍后重试！',
						})
						break;
					case '2': // 2 - 需要验证码
						// 手机号 + 验证码 输入
						reslove(true);
						break;
					case '3': // 3 - 错误超过6次  //只输入串码  不用输入 手机号验证码
						reslove(false);
						break;
					default:
						uni.showModal({
							title: '未知返回码',
							content: backRes.businessCode + backRes.msg
						})
				}
			} else {
				uni.showModal({
					title: '尊敬的用户',
					content: '呜呜，系统开了个小差，请稍后重试！',
				})
			}
		})
	})
}

// 输入串码 领取串码
function serialCode(sendParams) {
	return new Promise((resolve, reject) => {
		if (sendParams.openid == '') {
			sendParams.openid = uni.getStorageSync("userData").uinfo.openid;
		}
		if (uni.getStorageSync('userInfo')) {
			sendParams.nickname = uni.getStorageSync('userInfo').nickName;
			sendParams.headimgurl = uni.getStorageSync('userInfo').avatarUrl;
		} else {
			sendParams.nickname = '';
			sendParams.headimgurl = '';
		}
		requestPost('/sweep/serialCode', sendParams).then((backParams) => {
			// const [e, r] = backParams;
			console.log("backParams");
			console.log(backParams);
			if (backParams) {
				uni.setStorage({
					key: 'sweepQrcodeData',
					data: backParams
				})
				// 存储标识 是 扫码：1 还是  串码：2  
				// 
				uni.setStorage({
					key: 'codeType',
					data: 2
				})
				const backData = backParams.result;
				if (backParams.result.code == 0) {
					if (resolve) {
						resolve(backParams);
					}
				} else {
					uni.showModal({
						title: '尊敬的用户',
						content: '呜呜，系统开了个小差，请稍后重试！'
					})
				}
			} else {
				uni.showModal({
					title: '尊敬的用户',
					content: '呜呜，系统开了个小差，请稍后重试！'
				})
			}
		});
	})
}

// 提现 
function giveSpackTx(openid, hbopenid) { //提现
	// 	uni.showLoading({
	// 		title: '提现中...',
	// 	}) 
	return new Promise((resolve, reject) => {
		// const userData = uni.getStorageSync('openid');
		// const openid = userData.openid;

		const userMobileData = uni.getStorageSync('userMobileData') || '';
		const phoneNumber = userMobileData.phoneNumber || '';

		const sendParams = {
			"openid": openid,
			"hbopenid": hbopenid,
			"phoneNumber": phoneNumber,
		}
		console.log("giveSpackTx giveSpackTxgiveSpackTxgiveSpackTx");
		console.log(sendParams);
		requestPost('/gifts/getGiftspack', sendParams).then((backParams) => {
			uni.hideLoading();
			// const [e, r] = backParams;
			console.log("giveSpackTx giveSpackTxgiveSpackTxgiveSpackTx");
			console.log(backParams);
			const backResult = backParams.result;
			if (backResult.code == '0') {
				// 				if(backResult.businessCode==5){
				// 					uni.showModal({
				// 						title: '提示',
				// 						content: backResult.msg,
				// 					})
				// 				} else {
				// 					resolve(backResult.businessCode);
				// 				}
				resolve(backResult);
			} else if (backResult.code == '-1') {
				reject(backResult.code);
			} else { // code!='0' 服务失败
				reject(backResult.code);
			}
		});
	})
}

// 判断 是否关注 公众号 提现时 用作判断 
function ifremeber() {
	return new Promise((resolve, reject) => {
		const userData = uni.getStorageSync('openid');
		const openid = userData.openid;
		uni.request({
			url: config.wxUrl + '/wx3/uinfo2?openid=' + openid + '&appid=' + config.appid,
			method: 'GET',
			complete: (res) => {
				console.log('关注', res)
				if (res.data.subscribe == 1) { //已关注
					resolve(1);
				} else { //未关注
					resolve(0);
				}
			}
		})

	})
}

// 获取首页 展示商品 
function getShopGoodsRequst(goodShowFlag,currentPage,count){
	const userData = uni.getStorageSync('openid');
	const openid = userData.openid;
	var params = {
		currentPage: currentPage,
		count: count,
		goodShowFlag:goodShowFlag ,//商品展示类型：1首页商品大图，2首页商品小图，3积分好礼
		// saleNumOrderType:0 // 自定义 排序 
	};
	const promise = new Promise((reslove, reject) => {
		requestPost('/vpoints/vpointsShop/getShopGoods', params).then((jo) => {
			console.log('getShopGoodsgetShopGoodsgetShopGoodsgetShopGoodsgetShopGoods');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		}, (err) => {
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

// 订单管理 积分抽奖列表
function getExchangeRecordRequst(queryType,currentPage,count){
	const userData = uni.getStorageSync('openid');
	const openid = userData.openid;
	var params = {
		openid:openid,
		currentPage: currentPage,
		count: count,
		queryType:queryType,	//否	string	1.积分商城订单(默认)，2.河北现金支付订单，3.游戏记录
	};
	const promise = new Promise((reslove, reject) => {
		requestPost('/vpoints/vpointsExchange/getExchangeRecord', params).then((jo) => {
			console.log('getShopGoodsgetShopGoodsgetShopGoodsgetShopGoodsgetShopGoods');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		}, (err) => {
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

// 个人中心 获取 换购商品 数量
function queryUnExchangePrizeLstRequst(queryType,currentPage,count){
	const userData = uni.getStorageSync('vjfOpenid');
	const vjfOpenid = userData.vjfOpenid;
	var params = {
		vjifenOpenid:vjfOpenid,
		currentPage: currentPage,
		count: count,
		companyKey:config.companyKey,	//否	string	1.积分商城订单(默认)，2.河北现金支付订单，3.游戏记录
	};
	const promise = new Promise((reslove, reject) => {
		requestPost('/consumer/queryUnExchangePrizeLst', params ,config.yylg).then((jo) => {
			console.log('getShopGoodsgetShopGoodsgetShopGoodsgetShopGoodsgetShopGoods');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo.reply)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		}, (err) => {
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

// 首页查询用户信息 
function getUserInfoRequst(){
	const userData = uni.getStorageSync('openid');
	const openid = userData.openid;
	var params = {
		openid:openid,
		};
	const promise = new Promise((reslove, reject) => {
		requestPost('/user/userInfo', params).then((jo) => {
			console.log('userInfo');
			console.log(jo);
			if (jo.result.code == 0) {
				if (jo.result.businessCode == 0) {
					reslove(jo.reply)
				} else {
					reslove()
				}
			} else {
				// uni.showModal({
				// 	title: '提示',
				// 	content: jo.result.msg
				// });
			}
		}, (err) => {
			console.log('queryUserHomePage');
			console.log(err);
		})
	})
	return promise;
}

export {
	sweepQrcode,
	getCaptcha,
	updateUserInfoMobile,
	savePrize,
	queryUserHomePage,
	queryAllGiftsList,
	getFailCount,
	serialCode,
	giveSpackTx, // 提现
	queryExchangePrizeAllLst, // 查询 我的换购
	queryPrizeList, // 查询奖品列表
	sweepSeckill, // 扫码秒杀
	ifremeber, //是否关注公众号
	getShopGoodsRequst,  //获取首页 商品列表
	getExchangeRecordRequst, // 我的 - 积分抽奖列表 
	queryUnExchangePrizeLstRequst,  // 我的 - 获取换购商品数量用作展示 
	getUserInfoRequst // 首页 查询 用户信息
}

import {
	checkSession,
	getCode,
	getOpenid
} from '@/common/getWxUserInfor.js';
// 验证身份证号码
const idcardValidate = (idds) => {
	let weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
	let reg2 = /^[1-9][0-9xX]{17}$/;
	let sum = 0,
		mod = 0,
		ymd = [];
	if (reg2.test(idds)) {
		for (let i = 0; i < 17; ++i) {
			sum += parseInt(idds[i], 10) * weight[i];
			if (i > 5 && i < 14) ymd.push(idds[i]);
		}
		mod = sum % 11;
		return validate[mod] === idds[17].toUpperCase() && reg2.test(idds);
	} else {
		return reg2.test(idds);
	}
}

// 获取地理位置信息
function getCityInfo() {
	return new Promise((resolve, reject) => {
		wx.getLocation({
			success: (data) => {
				var url = 'http://api.map.baidu.com/geocoder?location=纬度,经度&output=输出格式类型&key=用户密钥'
				var latitude = data.latitude,
					longitude = data.longitude;
				wx.request({
					url: 'https://api.map.baidu.com/geocoder',
					method: 'GET',
					dataType: 'json',
					data: {
						key: '4ATeuGLwAt08UunArKywQ1KyYalvpdi8',
						location: latitude + ',' + longitude,
						output: 'json'
					},
					success: (data) => {
						resolve(data.data.result);
					},
					fail: (err) => {
						reject(err);
					}
				})
			},
			fail: (error) => {
				reject(error);
			}
		})
	})
}

/**
 * 扫码 businessCode 区分跳转不同的 页面
 */
function judgeBusinessCode(data) {
	return new Promise((resolve, reject) => {
		console.log('judgeBusinessCode');
		console.log(data);
		const result = data.result;
		const reply = data.reply;
		const replyTime = data.replyTime;
		const businessCode = data.result.businessCode;
		// const businessCode = 0 ; 

		// 获取版本名称
		let activityVersion = getActivityVersion(reply.activityVersion) || '';
		console.log('-----');
		console.log(activityVersion);
		if (businessCode == 0) { // 扫码成功 红包
			let redirectToUrl = '';
			if (activityVersion == 'LaoShan') {
				redirectToUrl = `/pages/saoDianDe/LaoShan/getCash?bizcode=${businessCode}`
			} else if (activityVersion == 'JinMai') {
				getApp().globalData.lxCompanyKey = reply.lxCompanyKey || '';
				getApp().globalData.ticketCode = reply.ticketInfo.ticketCode || '';
				redirectToUrl = `/pages/saoDianDe/JinMai/disc?bizcode=${businessCode}&prizeType=${reply.prizeType}`
			} else {
				// 通用版本
				redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=${businessCode}`
			}
			resolve(redirectToUrl);
		} else if (businessCode == 11 || businessCode == 2 || businessCode == 15) { // 11：本人重复扫码  2||15：这个二维码已被扫
			let redirectToUrl = '';

			// getApp().globalData.openQrcode = false

			if (activityVersion == 'LaoShan') {
				redirectToUrl = `/pages/saoDianDe/LaoShan/abnormal?bizcode=${businessCode}`
			} else if (activityVersion == 'JinMai') {
				redirectToUrl = `/pages/saoDianDe/JinMai/abnormal?bizcode=${businessCode}`
			} else {
				// 通用版本
				redirectToUrl = `/pages/saoDianDe/common/codeScanned?bizcode=${businessCode}`
			}
			resolve(redirectToUrl);

		} else if (businessCode == 7) { //大奖
			// let redirectToUrl = '';
			// // if (reply.username || result.msg == '重复扫码') { //已填写 或者重复扫码 直接显示 已领取 信息
			// if (reply.username) { //已填写 或者重复扫码 直接显示 已领取 信息
			// 	redirectToUrl = `../submitUserInformation/submitUserInformation?bizcode=${businessCode}&isGetPrize=true`;
			// } else {
			// 	if(reply.checkPrizeRecord){
			// 		const expireTime = reply.checkPrizeRecord.expireTime;
			// 		const expireTimeStatus = dateformatTemp(replyTime,expireTime); //返回 false 说明 当前小于活动截止时间 可以正常扫码 如果true说明当前时间大于截止时间不能扫码 跳转至二维码被扫
			// 		console.log('判断大奖是否到期');
			// 		console.log(expireTime);
			// 		console.log(expireTimeStatus);
			// 		if(expireTimeStatus){
			// 			redirectToUrl = `../codeScanned/codeScanned?bizcode=${businessCode}`
			// 		}else{
			// 			// redirectToUrl = `../getPrize/getPrize?bizcode=${businessCode}&isGetPrize=false`;
			// 			// 修改原因 中出大奖 也要 走点击抽奖按钮 和 弹出 红包一样
			// 			redirectToUrl = businessCode;
			// 		}
			// 	}else{
			// 			redirectToUrl = businessCode;
			// 	}
			// }
			// resolve(redirectToUrl); 

			// 金麦版本 没有大奖 
			let redirectToUrl = '';
			if (activityVersion == 'LaoShan') {
				redirectToUrl = `/pages/saoDianDe/LaoShan/getCash?bizcode=${businessCode}`
			} else {

				// 通用版本
				// 定义 领取 大奖 所需参数  
				getApp().globalData.getPrizeSendData = {
					prizeVcode: reply.prizeVcode,
					prizeType: reply.prizeType
				}

				if (reply.username) { //已填写 或者重复扫码 直接显示 已领取 信息

					const isDay19 = reply.perMantissaPrize ? true : false;
					redirectToUrl =
						`/pages/saoDianDe/common/submitUserInformation?bizcode=${businessCode}&prizeType=${reply.prizeType}&prizeVcode=${reply.prizeVcode}&isDay19=${isDay19}&pageSource=getCash&isGetPrize=true`

				} else {
					redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=${businessCode}`
				}
			}
			console.log(redirectToUrl);
			resolve(redirectToUrl);
		} else if (businessCode == 12 || businessCode == 13) { //可疑 黑名单
			// 12 可疑用户展示出入手机号 13 静态页面 提示
			const redirectToUrl = `/pages/saoDianDe/blackList/blackList?bizcode=${businessCode}`
			resolve(redirectToUrl);
		} else if (businessCode == 24) {
			// 金麦版本 中出 苏打水
			let redirectToUrl = '';
			if (activityVersion == 'JinMai') {
				redirectToUrl = `/pages/saoDianDe/JinMai/disc?bizcode=${businessCode}`
			}
			resolve(redirectToUrl);
		} else if (businessCode == 21) {
			console.log(212121);

			// 中出 金额 + 大奖 类型  或者 19日
			let redirectToUrl = '';
			if (reply.exchangeChannel == '5') { //皮尔森——要酒日大奖
				// 通用版本
				// 定义 领取 大奖 所需参数  
				getApp().globalData.getPrizeSendData = {
					prizeVcode: reply.prizeVcode,
					prizeType: reply.prizeType
				}
				redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=7`
			} else {
				if (activityVersion == 'LaoShan') {
					redirectToUrl = `/pages/saoDianDe/LaoShan/abnormal?bizcode=${businessCode}`
				} else {
					// 通用版本
					// 定义 领取 大奖 所需参数  
					getApp().globalData.getPrizeSendData = {
						prizeVcode: reply.prizeVcode,
						prizeType: reply.prizeType
					}
					redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=${businessCode}`
				}
			}
			resolve(redirectToUrl);
		} else if (businessCode == 30) {
			// 大奖核销
			const redirectToUrl = `/pages/saoDianDe/verification/verification`;
			resolve(redirectToUrl);
		} else { //其他异常
			// businessCode 1 : 这个二维码不存在
			// businessCode 2 || 15  : 这个二维码已被扫
			// businessCode 3 : 这个二维码已过期
			// businessCode 4 : 活动未开始
			// businessCode 5 : 活动已截止
			// businessCode 6 : 系统繁忙
			// businessCode 19 : 漏码
			// businessCode 23 : 扫码次数已达上限
			// businessCode -1 : 系统升级中
			uni.setStorage({
				key: 'businessCode',
				data: businessCode
			})
			let redirectToUrl = '';
			if (activityVersion == 'LaoShan') {
				redirectToUrl = `/pages/saoDianDe/LaoShan/abnormal?bizcode=${businessCode}`
			} else if (activityVersion == 'JinMai') {
				redirectToUrl = `/pages/saoDianDe/JinMai/abnormal?bizcode=${businessCode}`
			} else {
				// 通用版本
				redirectToUrl = `/pages/saoDianDe/common/abnormal?bizcode=${businessCode}`
			}
			resolve(redirectToUrl);

		}
	})
}

/**
 * 秒杀 处理返回数据 
 */
function judgeSeckillBusinessCode(data) {
	return new Promise((resolve, reject) => {
		console.log('judgeSeckillBusinessCode');
		console.log(data);
		const result = data.result;
		const reply = data.reply;
		const replyTime = data.replyTime;
		const businessCode = data.result.businessCode;

		if (businessCode == 0) { // 扫码成功 红包
			// 通用版本
			const redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=${businessCode}`
			resolve(redirectToUrl);
		} else { //其他异常
			// businessCode 1 : 这个二维码不存在
			// businessCode 2 || 15  : 这个二维码已被扫
			// businessCode 3 : 这个二维码已过期
			// businessCode 4 : 活动未开始
			// businessCode 5 : 活动已截止
			// businessCode 6 : 系统繁忙
			// businessCode 19 : 漏码
			// businessCode 23 : 扫码次数已达上限
			// businessCode -1 : 系统升级中
			// uni.setStorage({
			// 	key: 'businessCode',
			// 	data: businessCode
			// })
			// 通用版本
			const redirectToUrl = `/pages/saoDianDe/common/getCash?bizcode=${businessCode}`
			resolve(redirectToUrl);
		}
	})
}

/**
 * 判断版本
 * 崂山版本
 * 金麦版本
 * 通用版本
 * */
function getActivityVersion(activityVersion) {
	console.log('activityVersion');
	console.log(activityVersion)
	let returnActName = '';
	if (activityVersion == 9) {
		// 崂山版本
		returnActName = 'LaoShan';
	} else if (activityVersion == 10) {
		// 金麦版本
		returnActName = 'JinMai';
	} else {
		// 通用版本
		returnActName = 'common';
	}
	// 定义全局 变量接收 版本名称
	getApp().globalData.activityVersion = returnActName;
	return returnActName;
}


/**
 * 输入串码  businessCode  区分跳转不同的 页面
 */
function judgeBusinessStrCode(data) {
	return new Promise((resolve, reject) => {
		console.log('judgeBusinessCode');
		console.log(data);
		const result = data.result;
		const reply = data.reply;
		const replyTime = data.replyTime;
		const businessCode = data.result.businessCode;
		// const businessCode = 0;
		console.log('businessCodebusinessCodebusinessCodebusinessCode');
		console.log(businessCode);
		if (businessCode == 0) { // 扫码成功 红包
			const redirectToUrl = `../activityEntrance/activityEntrance?bizcode=${businessCode}&codeType=2`
			resolve(redirectToUrl);
		} else if (businessCode == 11) { // 重复扫 码
			const redirectToUrl = `../codeScanned/codeScanned?bizcode=${businessCode}`
			resolve(redirectToUrl);
		} else if (businessCode == 7 || businessCode == 21) { //大奖 
			let redirectToUrl = '';
			// if (reply.username || result.msg == '重复扫码') { //已填写 或者重复扫码 直接显示 已领取 信息
			if (reply.username) { //已填写 或者重复扫码 直接显示 已领取 信息
				redirectToUrl = `../submitUserInformation/submitUserInformation?bizcode=${businessCode}&isGetPrize=true`;
			} else {
				if (reply.checkPrizeRecord) {
					const expireTime = reply.checkPrizeRecord.expireTime;
					const expireTimeStatus = dateformatTemp(replyTime, expireTime); //返回 false 说明 当前小于活动截止时间 可以正常扫码 如果true说明当前时间大于截止时间不能扫码 跳转至二维码被扫
					console.log('判断大奖是否到期');
					console.log(expireTime);
					console.log(expireTimeStatus);
					if (expireTimeStatus) {
						redirectToUrl = `../codeScanned/codeScanned?bizcode=${businessCode}`
					} else {
						redirectToUrl = `../getPrize/getPrize?bizcode=${businessCode}&isGetPrize=false`;
					}
				} else {
					redirectToUrl = `../getPrize/getPrize?bizcode=${businessCode}&isGetPrize=false`;
				}
			}
			resolve(redirectToUrl);
		} else if (businessCode == 12 || businessCode == 13) { //可疑 黑名单
			// 12 展示出入手机号 13 静态页面 提示
			const redirectToUrl = `../blackList/blackList?bizcode=${businessCode}`
			resolve(redirectToUrl);
		} else { //其他异常
			// businessCode 1 : 这个二维码不存在
			// businessCode 2 || 15  : 这个二维码已被扫
			// businessCode 3 : 这个二维码已过期
			// businessCode 4 : 活动未开始
			// businessCode 5 : 活动已截止
			// businessCode 6 : 系统繁忙
			// businessCode 19 : 漏码
			// businessCode 23 : 扫码次数已达上限
			// businessCode -1 : 系统升级中

			// uni.setStorage({
			// 	key: 'businessCode',
			// 	data: businessCode
			// })

			reject(result);
			// if (businessCode == 2) {
			// 	uni.showModal({
			// 		title: '这个串码已被扫',
			// 		content: `扫码时间: ${ reply.earnTime } 再扫一瓶试试看~~`,
			// 	})
			// } else if (businessCode == 4) {
			// 	uni.showModal({
			// 		title: '活动未开始',
			// 		content: "亲再等等哦",
			// 	})
			// } else {
			// 	reject(businessCode);
			// }
		}
	})
}

/**
 * 筛选数组对象
 * 单个条件筛选：
 */
function filterArr(keyName, val, arr) {
	return arr.filter(item => item[keyName] === val);
}

function strlen(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		//单字节加1 
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
			len++;
		} else {
			len += 2;
		}
	}
	return len;
}

function strSub(str, charCodeAtNum, showLength, replaceCharacter) {
	const curLen = strlen(str);
	console.log("strSub");
	console.log(curLen);
	let returnStr = '';
	if (curLen > charCodeAtNum) {
		returnStr = str.substring(0, showLength) + replaceCharacter;
	} else {
		returnStr = str;
	}
	return returnStr;
}
// 验证缓存中 是否 存在用户信息（openid、sessiong_key）
// *
//  * 获从缓存中  获取 用户信息（openid，session_key） 信息
//  * 存在
//  * 		验证session（checkSessionStatus） 是否过期
//  * 			未过期 直接调用 返回 用户信息
//  * 			过期   直接调用 重新调用获取小程序 code （getCode）拿到code 获取用户信息（getOpenid）
//  * 没有 调用（）   验证用户位置授权状态 2未操作 1已经授权  0拒绝授权
//  * 		 0 ： 弹出自定义引导，引导用户 开启位置授权（openSetting）
//  * 		 1 :  一般不会存在 缓存中没有数据 然后 已经授权 如果存在还是调用 微信授权
//  * 		 2 :  继续 调用微信授权
// 
async function getUserDataFun() {
	let returnUserData = '';
	const that = this;
	//用户缓存信息
	const userData = uni.getStorageSync('userData');
	if (userData) {
		// 如果用户信息存在 判断 session 是否过期 0未过期 1已过期
		const checkSessionStatus = await checkSession();
		if (checkSessionStatus == 0) {
			console.log('checkSessionStatus---');
			returnUserData = userData.uinfo;
		} else {
			// 获取 小程序 code 请求接口换取 openid session_key 
			returnUserData = await userCodeExchangeOpenid();
		}
	} else {
		// 获取 小程序 code 请求接口换取 openid
		returnUserData = await userCodeExchangeOpenid();
	}
	return returnUserData;
}
// 获取 小程序 code 请求接口换取 openid
async function userCodeExchangeOpenid() {
	let backData = '';
	// 获取 小程序 code 请求接口换取 openid
	const xcxCode = await getCode();
	const backOpenidData = await getOpenid(xcxCode, 'sdqp');
	console.log('backOpenidData--------' + backOpenidData);
	console.log(backOpenidData);
	if (backOpenidData.uinfo) {
		console.log('checkSessionStatus2---');
		backData = backOpenidData.uinfo;
	} else {
		backData = '';
	}
	return backData;
}

// 时间判断 判断但前时间 与 某个时间比较
const dateformat = function(date1) {
	console.log('dataTimesTamp');
	const dateEnd = date1.replace(/-/g, "/").substring(0, 19);
	const curTimesTamp = new Date().getTime();
	const dataTimesTamp = new Date(dateEnd).getTime();
	let backStatus = '';
	if (curTimesTamp > dataTimesTamp) {
		backStatus = true;
	} else {
		backStatus = false;
	}
	return backStatus;
}

// 时间判断 判断但前时间 与 某个时间比较
const dateformatTemp = function(temp, date1) {
	console.log('dateformatTempdateformatTempdateformatTemp');
	console.log(temp);
	console.log(date1);
	const dateEnd = date1.replace(/-/g, "/").substring(0, 19);
	const curTimesTamp = new Date().getTime();
	const dataTimesTamp = new Date(dateEnd).getTime();
	let backStatus = '';
	if (temp > dataTimesTamp) {
		backStatus = true;
	} else {
		backStatus = false;
	}
	return backStatus;
}
// 获取 openid
function getOpenidSD() {
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
}
// 获取 vjifenOpenid
function getVjifenOpenid() {
	const storageOpenid = uni.getStorageSync('vjfOpenid');
	console.log('vjfOpenid');
	console.log(storageOpenid);
	// this.isHasVjifenOpenid = false;
	if (storageOpenid) {
		return storageOpenid;
	} else {
		uni.navigateTo({
			url: '/pages/getOpenid/getOpenid?getIdType=vjfOpenid'
		})
	}
}
export {
	judgeBusinessCode,
	filterArr,
	getUserDataFun,
	judgeBusinessStrCode,
	idcardValidate,
	strlen,
	strSub,
	dateformat,
	dateformatTemp,
	judgeSeckillBusinessCode,
	getOpenidSD,
	getVjifenOpenid
}

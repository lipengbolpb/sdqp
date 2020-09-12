// var host = 'https://douban.uieee.com/v2/movie';
// var host = 'https://douban.uubake.com/v2/movie';
var isOnline = false ;  //  true         
var config = {};
if (isOnline) {          
	config = {
		mallImgUrl: 'https://xcxsite.vjifen.com/v/shanDongImgs/mall/',
		goodsImgRoot: 'http://img.vjifen.com:8000/images/vma/', //积分商城图片
		staticUrl: 'https://xcxsite.vjifen.com/v/shanDongImgs/',
		vjfAppid:'wxe2a3ba29612c0e0e',
		qrUrl: 'HTTP://VJ1.TV',
		hxqrUrl: 'HTTP://VJ1.TV/LN/',
		wxUrl: 'https://x.vjifen.com',
		requestUrl:'https://mapi.vjifen.com/vjifenInterface',
		sgUrl:'https://xcxact.vjifen.com',
		appid: 'wx9c6255f9c646909f',
		payAppid: 'wxa42a20606316e2e9',
		yylg:'https://yylg.vjifen.com/DBTLXInterface',
		envVersion:'release' // 跳转 小程序的 版本   //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
	}
} else {
	config = {
		mallImgUrl: 'https://xcxsite.vjifen.com/v/shanDongImgs/mall/',
		goodsImgRoot: 'http://img.vjifen.com:8000/images/vma/', //积分商城图片
		staticUrl: 'https://xcxsite.vjifen.com/v/shanDongImgs/',
		vjfAppid:'wx1ce2ca65ccc5aa5e', //v积分 appId 
		qrUrl: 'http://xt.vjifen.com',
		hxqrUrl: 'http://xt.vjifen.com/LN/',
		wxUrl: 'https://xt.vjifen.com',
		requestUrl: 'https://vtt.vjifen.com/vjifenInterface',
		sgUrl:'https://xcxact.vjifen.com',
		appid: 'wx1ce2ca65ccc5aa5e',
		payAppid: 'wx459ee9aa61f38da3',
		yylg:'https://jxqp.vjifen.com:444/DBTLXInterface',
		appid: 'wx1ce2ca65ccc5aa5e', //OLC 开头
		payAppid: 'wx459ee9aa61f38da3', //OJM 开头
		envVersion:'trial' // 跳转 小程序的 版本
	}
}

export {
	config
}

function request(url, method, data = {},baseUrl=config.requestUrl) {
	return new Promise((resolve, reject) => {
		data.projectServerName = 'shandongagt';
		uni.request({
			url: baseUrl + url,
			method: method,
			data: data,
			header: {
				'Content-Type': 'application/json',
			},
			success: (result) => {
				resolve(result.data);
			},
			fail: (error) => {
				reject(error);
			}
		})
	})
}

export function requestGet(url, data = {},baseUrl) {
	return request(url, 'GET', data,baseUrl);
}
export function requestPost(url, data = {},baseUrl) {
	return request(url, 'POST', data,baseUrl);
}

// 验证身份证号码
const idcardValidate = (idds) => {
  let weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let reg2 = /^[1-9][0-9xX]{17}$/;
  let sum = 0, mod = 0, ymd = [];
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
export {
	idcardValidate
}

export function getCityInfo() {
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

import {
	requestPost
} from '../utils/api.js'
export default {
	data() {
		return {
			sw_swiperList: []
		}
	},
	methods: {
		async querySwiperlist(adType) {
			const {longitude, latitude} = await this.sw_getLocation()
			const data = {}
			data.longitude = longitude
			data.latitude = latitude			
			data.projectServerName = 'liaoning'
			data.adType = adType
			
			const res = await requestPost('/adPub/adInfo', data)
			console.log(res);
			const {result, reply} = res
			if (result.code === '0' && reply && reply.length) {
				return reply
			} else {
				return null
			}
		},

		handleSwiperlist(swiperList, classBase) {
			const list = swiperList.map((item, index) =>{
				item.className = 'adType_' + classBase + (index+1)
			})
			return list
		},
		
		handleJumpEvent(target) {			
			const {jumpTyp: jumpType, jumpUrl, picJumpUrl} = target
			if(jumpType == '1') { // 跳转webview h5
				uni.navigateTo({
					url: `/pages/module/webview?target=${jumpUrl}`
				});
			} else if(jumpType == '2') { // 跳转一个已有图片的页面
				uni.navigateTo({
					url: `/pages/module/imgWrap?target=${jumpUrl||picJumpUrl}`
				});
			} else if(jumpType == '3') { //跳转小程序内页面
				uni.navigateTo({url: jumpUrl});		
			} else {
				return
			}
		},
		// 获取地理位置(先判断是否授权了,授权了就去获取, 没有就不获取)
		sw_getLocation() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					complete: res => {
						console.log(res)
						if (res.authSetting && res.authSetting['scope.userLocation'] == true) {
							uni.getLocation({
								type: 'wgs84',
								complete: res => {
									console.log('-------getLocation------');						
									console.log(res);				
									resolve(res)
								},
							})
							console.log('after this.getLocation');
						} else {
							resolve({
								"longitude": "",
								"latitude": "",
							})
						}
						
					},
				})
			})
			
		},
	},

}

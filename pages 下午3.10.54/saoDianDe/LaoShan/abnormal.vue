<template>
	<!-- 崂山版本 异常显示 页面 -->
	<custom-template ctheight='1334' :ctbackground='ctbackground'>
		<view class="abnormal">
			<image :src="LaoShanImg+'l-logo.png'" class="jinmaiLogo" mode="widthFix"></image>
			<view class="abnormalBox">
				<view class="fail-text">{{ title }}</view>
				<view class="sub-text" v-if="message">{{ message }}</view>
				<view class="sub-text2" v-if="message2">{{ message2 }}</view>
			</view>
			<image :src="LaoShanImg+'l-glass2.png'" class="l-glass2" mode="widthFix"></image>
		</view>
	</custom-template>
</template>

<script>
	/**
	 * businessCode
	 * 		1 - 该积分码不存在",
	 * 		2 - 该积分码已经被使用过,
	 * 		3 - 积分码已过期,
	 * 		4 - 活动未开始,
	 * 		5 - 活动已结束,
	 * 		6 - 积分码异常   (通常为服务器报错)
	 * earnTime 需要展示字段
	 */

	import {
		config
	} from '@/utils/api.js';

	import {
		customTemplate
	} from '@/components/custom-template/custom-template.vue';
	import {
		filterArr
	} from '@/common/basicsFun.js';
	export default {
		name: 'abnormal',
		components: {
			customTemplate
		},
		data() {
			return {
				staticUrl: config.staticUrl,
				
				LaoShanImg: config.staticUrl + 'LaoShanImg/',
				ctbackground: config.staticUrl + 'LaoShanImg/l-bg.png',
				
				ruleUrl: '',
				title: '',
				message: '',
				message2: '',
				abnormalStatusArr: [{
					id: 1,
					businessCode: '1',
					title: '二维码不存在',
					message: '',
					message2: ''
				}, {
					id: 2,
					businessCode: '2',
					title: '这个二维码已被扫',
					message: '扫码时间: ',
					message2: '再扫一瓶试试看'
				}, {
					id: 3,
					businessCode: '3',
					title: '这个二维码已过期',
					message: '',
					message2: ''
				}, {
					id: 4,
					businessCode: '4',
					title: '活动未开始',
					message: '心急喝不了好啤酒，再等等哦',
					message2: ''
				}, {
					id: 5,
					businessCode: '5',
					title: '活动已截止',
					message: '好酒不等人，下次早点来哦',
					message2: ''
				}, {
					id: 6,
					businessCode: '6',
					title: '二维码异常',
					message: '',
					message2: ''
				}, {
					id: 7,
					businessCode: '11',
					title: '这个二维码您已扫过',
					message: '扫码时间: ',
					message2: '再来一瓶吧'
				}, {
					id: 8,
					businessCode: '-1',
					title: '系统升级',
					message: '稍安勿躁，敬请关注',
					message2: ''
				}, ],
				bizcode:''
			};
		},
		onLoad(options) {
			const { bizcode } = options;
			this.bizcode = bizcode || '';
			this.init( this.bizcode );
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
			}
			return {
				title: '皇冠丹麦曲奇',
				path: '/pages/index/index',
				imageUrl: this.staticUrl + 'fenxiangImg.png'
			};
		},
		methods: {
			init(businessCode) {
				const filterData = filterArr('businessCode', businessCode, this.abnormalStatusArr)[0];
				console.log(filterData);
				if (filterData) {
					const {
						title,
						message,
						message2
					} = filterData;
					this.title = title;
					this.message2 = message2;
					console.log(this.message2);
					if(businessCode==2 || businessCode == 11){
						this.message = message+this.earnTime();
					}else{
						this.message = message;
					}
				}
			},
			earnTime() {
				const that = this;
				const backSweepQrcodeData = uni.getStorageSync('sweepQrcodeData');
				console.log(backSweepQrcodeData.reply.earnTime);
				return backSweepQrcodeData.reply.earnTime || '';
			},
		}
	};
</script>
<style scoped lang="scss">
	.yindaoGuanzhu {}

	image {
		width: 100%;
		display: block;
	}

	// 关注
	.jinmaiLogo {
		width: 200rpx;
		margin-top: 168rpx;
		margin-left: 30rpx;
	}

	.jinmairenwu {
		width: 80%;
		position: absolute;
		left: 10%;
		bottom: 5%;
		z-index: 20;
	}

	.jinmaibiaoyu {
		width: 80%;
		position: absolute;
		left: 10%;
		bottom: 2%;
		z-index: 20;
	}

	.fail-text {
		width: 100%;
		text-align: center;
		font-size: 48rpx
			/* 64/46.9 */
		;
		font-weight: bold;
		color: #333
	}

	.sub-text,
	.sub-text2 {
		width: 100%;
		text-align: center;
		font-size: 32rpx
			/* 30/46.9 */
		;
		color: #333;
	}
	
	.l-glass2{
		width: 580rpx;
		margin: 0 auto;
		margin-top: 30rpx;
	}
	.abnormalBox{
		margin: 150rpx 26rpx 60rpx 26rpx;
	}
	.fail-text {
	    width: 100%;
	    height: 70rpx /* 70/46.9 */;
	    line-height: 70rpx /* 70/46.9 */;
	    text-align: center;
	    font-size: 64rpx /* 64/46.9 */;
	    font-weight: bold;
	    color: #6f3200;
	}
	.sub-text, .sub-text2 {
	    width: 100%;
	    height: 70rpx/* 70/46.9 */;
	    line-height: 70rpx /* 70/46.9 */;
	    text-align: center;
	    font-size: 30rpx /* 30/46.9 */;
	    color: #6f3200;
	}
	.sub-text2 {
	    top: 9.4243rem /* 442/46.9 */;
	}
</style>

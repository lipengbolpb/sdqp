<template>
	<view class="scorePage">
		<view class="score">
			<view class="coin">
				<image :src="imgUrl + 'coin.png' " mode="widthFix"></image>
			</view>
			<view class="total">
				积分余额： {{restVpoints|toThousands }}
			</view>
			<view class="bill" @click="toBillList">
				积分账单>
			</view>
		</view>
		
		<view class="part">
			<view class="cj block">
				<view class="title">
					<view class="titxt">人气抽奖</view>
				</view>
				<image class="cjImg" :src="imgUrl + 'cj.png' " mode="widthFix"></image>
			</view>
			
			<view class="task block">
				<view class="title">
					<view class="titxt">积分任务</view>
				</view>
				<view class="taskList">
					<view class="li">
						<view class="taskname">
							<view class="item">绑定手机号送积分</view>
							<view class="jifen">+{{tasks.phoneNumberVpoints}}积分</view>
						</view>
						<view class="getBtn" v-if="tasks.phoneNumberStatus == 1" @click="toCarry('phone')">去完成</view>
						<view class="getBtn" v-if="tasks.phoneNumberStatus == 2" @click="toGet(1)">待领取</view>
						<view class="getBtn getOver" v-if="tasks.phoneNumberStatus == 3">已完成</view>
					</view>
					
					<view class="li">    
						<view class="taskname">
							<view class="item">首次关注公众号送积分</view>
							<view class="jifen">+{{tasks.subscribeVpoints}}积分</view>
						</view>
						<view class="getBtn"  v-if="tasks.subscribeStatus == 1" @click="toCarry('subscribe')">去完成</view>
						<view class="getBtn"  v-if="tasks.subscribeStatus == 2" @click="toGet(3)">待领取</view>
						<view class="getBtn getOver" v-if="tasks.subscribeStatus == 3">已完成</view>
					</view>
					
					<view class="li">
						<view class="taskname">
							<view class="item">完善个人信息送积分</view>
							<view class="jifen">+{{tasks.userInfoVpoints}}积分</view>
						</view>
						<view class="getBtn"  v-if="tasks.userInfoStatus == 1" @click="toCarry('userInfo')">去完成</view>
						<view class="getBtn"  v-if="tasks.userInfoStatus == 2" @click="toGet(2)">待领取</view>
						<view class="getBtn getOver" v-if="tasks.userInfoStatus == 3">已完成</view>
					</view>
					
					<view class="li">
						<view class="taskname">
							<view class="item">每日签到送积分</view>
							<!-- <view class="jifen">+50积分</view> -->
						</view>
						<view class="getBtn" @click="toSign">去完成</view>
					</view>
					
				</view>
			</view>
			<!-- 分享得积分 -->
			<view class="shareBox" v-if="sharePicUrl != '' "  @click="showShareTip = true">
				<image class="share" :src="goodsImgRoot + sharePicUrl" mode="widthFix"></image>
			</view>
			              
			<view class="recommend block"  v-if="goodsList.length > 0 ">
				<view class="title">
					<view class="titxt">积分兑好物</view>
					<view class="titxt more" @click="toMall">更多好物></view>
				</view>
				
				<view class="items">
					<view class="item-list"  v-for="(list, idx) in goodsList" :key="idx"  @click="toDetail(list.goodsId)" >
						<view class="proImg">
							<image  :src="goodsImgRoot+list.goodsUrl.split(',')[0]" mode="widthFix" class="" ></image>
						</view>
						<view class="proInfo">
							<view class="proName">{{list.goodsShortName}}</view>
							<view class="unit">
								<view v-if="list.goodsSpecification">
									{{list.goodsSpecification}}{{list.goodsUnitName}}
								</view>
							</view>
							<view class="normalPrice">市场价：{{list.goodsMoney}}元</view>
							<view class="price">
								<text v-if="list.realPay != 0 "><text class="danwei">¥</text>{{(list.realPay/100)|toThousands}}</text>
								<text v-if="list.realPay != 0 && list.realVpoints != 0">+</text>
								<text v-if="list.realVpoints != 0">{{list.realVpoints|toThousands}}<text class="danwei">积分</text></text>
						    </view>
						</view>
						<view class="exchangeBtn">去兑换</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 提示弹框 -->
		<view class="toast" v-show="getScore">
		    <view class="toastBox">
				<view class="img">
					<image  :src="imgUrl + 'bigCoin.png?v=1' " mode="widthFix" class="coinL" ></image>
				</view>
				<view class="text">积分领取成功</view>
				<view class="text">本次获得<text class="point">{{earnVpoints}}积分</text></view>
			</view>
		</view>
		
		<!-- 分享提示 -->
		<view class="toast shareShadow" v-show="showShareTip">
		    <view class="shareTipBox">
				<view class="img">
					<image  :src="imgUrl +  'shareTit.png' " mode="widthFix" class="title" ></image>
				</view>
				<image :src="imgUrl + 'shareCover.png' " mode="widthFix" class="coverImg"></image>
				<view class="text tit">友情提示：</view>
				<view class="text">1、好友点击分享的小程序后才能获得积分</view>
				<view class="text">2、同一好友每天只计一次 </view>
				<view class="text">3、每天最多可得五次活动积分</view>
				<button class="btnshare" open-type="share">分享小程序</button>
				<!-- <view class="btnshare" @click="shareForjf">分享小程序</view> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	import {requestGet,requestPost,config} from '@/utils/api.js';
	export default {
		data(){
			return{
				imgUrl:config.mallImgUrl,
				restVpoints:'0',
				goodsImgRoot: config.goodsImgRoot,
				requestUrl: config.requestUrl,
				totalScore:'0',
				getScore:false,//获得的积分数
				showShareTip:false,
				
				sharePicUrl:'', //分享广告图
				tasks:'',  //任务列表
				earnVpoints:'',
				
				currentPage:'1',
				count:'3',
				goodsList:[],
			}
		},
		onShow(){
			this.getRestVpoints(); // 获取剩余积分
			this.getTask();
			this.getgoods()
		},
		methods:{
			onShareAppMessage:function(res) {
			  　　// 设置菜单中的转发按钮触发转发事件时的转发内容
			  　　var shareObj = {
			  　　　　title: "参与赚积分兑好物活动", // 默认是小程序的名称(可以写slogan等)
			  　　　　path: '/pages/index/index',   // 默认是当前页面，必须是以‘/’开头的完整路径
			  　　　　imageUrl: this.imgUrl + 'shareImg.jpg?v=1',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			       　complete: (res) => {
					    console.log(res)
			         }
			  　　};
			  　 // 来自页面内的按钮的转发
				 if(res.from === 'button') {
				   // 此处可以修改 shareObj 中的内容
				   shareObj.path = '/pages/index/index?form='+ 'share' + '&openid='+ getApp().globalData.openid;
				 } else if (res.from === 'menu'){
				    //console.log('右上角菜单转发按钮');
				 }
				 this.showShareTip = false;
			  　　// 返回shareObj
			  　　return shareObj;  
			},
			toMall(){
				uni.switchTab({
					url:'../mall/mall'
				})
			},
			toDetail(id){
				uni.navigateTo({
					url:'../goodsDetail/goodsDetail?id=' + id // + '&type=' + this.categoryParent
				})
			},
			async toGet(taskType){ // 领取积分
				var params = {
					"openid": getApp().globalData.openid,
					"taskType":taskType
				};
				var jo = await requestPost('/task/earnTaskVpoints',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							this.earnVpoints = jo.reply.earnVpoints; //任务完后领取的积分
							this.getScore = true;//展示得到积分数
							
							
							this.restVpoints = this.restVpoints + this.earnVpoints; //实时更新积分余额
							let timer = null;
							
							timer = setTimeout(() => {
								this.getScore = false;//展示得到积分数
								this.earnVpoints = 0;
							}, 2000)
                            //按钮置灰
							if(taskType == 1){
								this.tasks.phoneNumberStatus = 3
							} else if (taskType == 2){
								this.tasks.userInfoStatus = 3
							} else if (taskType == 3){
								this.tasks.subscribeStatus = 3
							}
						}
					} else {
						uni.showModal({
						  title: '提示',
						  content: jo.result.msg,   
						})
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
			async getTask() {
				var params = {
					"openid": getApp().globalData.openid
				};
				var jo = await requestPost('/task/queryTaskRecord',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							this.sharePicUrl = jo.reply.sharePicUrl; //分享广告图
							this.tasks = jo.reply.taskInfo;  //任务列表
						}
					} else {
						uni.showModal({
						  title: '提示',
						  content: jo.result.msg,   
						})
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
			toCarry(page){
				if(page == 'phone'){
					uni.navigateTo({
						url:'../userInfo/giveTel'
					})
				} else if(page == 'subscribe'){ //webview公众号页面
					uni.navigateTo({
						url:'../webview/attention?from='+'jfgz'
					})
				} else if(page == 'userInfo'){
					uni.navigateTo({
						url:'../userInfo/writeInfo'
					})
				}
			},
			async getgoods() {
				var params = {
					"currentPage": this.currentPage,
					"count":this.count,
					'payType':'1', // 1 积分
					'saleNumOrderType':0,
				};
				var jo = await requestPost('/vpoints/vpointsShop/getShopGoods',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {                    
						if(jo.reply){
							this.goodsList = jo.reply;
						}
					} else {
						uni.showModal({
						  title: '提示',
						  content: jo.result.msg,   
						})
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
			toSign(){ // 去签到
				uni.navigateTo({ 
					url:'../sign/sign'
				})
			},
			async getRestVpoints() {
				var params = {
					"openid": getApp().globalData.openid
				};
				var jo = await requestPost('/user/userInfo',params);
				console.log(jo); // reply result replyTime
				if(jo.result.code == 0){
					if (jo.result.businessCode == 0) {
						if(jo.reply){
							this.restVpoints = jo.reply.accountInfo.surplusVpoints; //剩余积分
						}
					} else {
						uni.showModal({
						  title: '提示',
						  content: jo.result.msg,   
						})
					}
				} else {
					uni.showModal({
					  title: '提示',
					  content: jo.result.msg,            
					})
				}
			},
			toBillList(){
				uni.navigateTo({
					url:'../scoreList/scoreList'
				})
			}
		}
	}
	
</script>

<style lang="scss">
	.scorePage{
		background-color: #F8F8F8;
	}
	.block{
		background-color: #fff;
		border-radius: 20rpx;
		padding:0 24rpx;
	}
	.score {
		width: 100%;
		height: 70rpx;
		background: #FFEED2;
		display: flex;
		line-height: 70rpx;
		.coin {
			flex-basis: 20%;
			flex-shrink: 1;
			text-align: center;
			image {
				width: 66rpx;
				vertical-align: bottom;
			}
		}

		.total {
			flex-basis: 50%;
			flex-shrink: 5;
			font-size: 28rpx;
			font-weight: 500;
			color: #9A6005;
			text-align: left;
		}

		.bill {
			flex-basis: 30%;
			flex-shrink: 4;
			font-size: 26rpx;
			font-weight: 400;
			color: #050505;
			text-align: center;
		}
	}
	.part{
		padding:24rpx;
		.title{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			border-bottom: 1rpx solid #F3F3F3;
			.titxt{
				font-size:32rpx;
				font-weight:500;
				color:#333333;
				line-height:70rpx;
				&.more{
					font-size:24rpx;
					font-weight:400;
					color:#666;
				}
			}
		}
		.cj{
			margin-bottom: 26rpx;
			padding-bottom: 20rpx;
			.cjImg{
				width: 646rpx;
			}
		}
		
		.task{
			margin-bottom: 26rpx;
			.taskList{
				padding: 42rpx 0  0;
				.li{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					height: 110rpx;
					.taskname{
						.item{
							font-size:28rpx;
							font-weight:400;
							color:#333;
							line-height:46rpx;
						}
						.jifen{
							font-size:22rpx;
							font-weight:500;
							color:#FF2D29;
						}
					}
					.getBtn{
						width:140rpx;
						height:62rpx;
						background:#FABA01;
						border-radius:31rpx;
						font-size:26rpx;
						font-weight:400;
						color:#000;
						line-height:62rpx;
						text-align: center;
						&.getOver{
							background:#EDEDED;
							color:#999;
						}
					}
				}
			}
		}
		.shareBox{
			height: 172rpx;
			.share{
				// width: 702rpx;
				width: 100%;
			}
		}
		
		.recommend{
			margin-top: 26rpx;
			.items{
				.item-list {
					padding-top:32rpx;
					display: flex;
					height: 225rpx;
					border-bottom: 1rpx solid #F3F3F3;
					&:nth-last-child(1){
						border-bottom:none;
					}
					.proImg{
						flex-shrink:1;
						width: 170rpx;
						height: 170rpx;
						border:2rpx solid #e5e5e5;
						border-radius:10rpx;
						position: relative;
						image{
							width: 134rpx;
							position: relative;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}
					.proInfo{
						width:50%;
						flex-shrink:2;
						padding-left: 20rpx;
						.proName{
							// width:200rpx;
							// width:460rpx;
							width: 140%;
							font-size:28rpx;
							font-weight:500;
							color:#333;
							// white-space:nowrap;
							// overflow:hidden;
							// text-overflow:ellipsis;
						}
						.unit{
							font-size:22rpx;
							color:#999;
							margin:14rpx 0 0;
							display: inline-block;
							max-width: 200rpx;
							white-space:nowrap;
							overflow:hidden;
							text-overflow:ellipsis;
							// height: 36rpx;
							view{
								border:1px solid #CACACA;
								border-radius:6rpx;
								padding: 0rpx 12rpx;
							}
						}
						.normalPrice{
							font-size:22rpx;
							color:#999;
						}
						.price{
							font-size:28rpx;
							font-weight:500;
							color:#FF4514;
							.danwei{
								font-size:22rpx;
							}
						}
					}
					.exchangeBtn{
						width:160rpx;
						height:62rpx;
						background:#FABA01;
						border-radius:31rpx;
						font-size:26rpx;
						font-weight:400;
						color:#000;
						line-height:62rpx;
						text-align: center;
						margin-top: 16%;
					}
				}
			}
		}
	}
    .toast{
	   position: fixed;
	   top: 0;
	   right: 0;
	   bottom: 0;
	   left: 0;
	   // background: rgba(0, 0, 0, .5);
	   text-align: center;
	   white-space: nowrap;
	   z-index: 99;
       &:after {
		 content: "";
		 display: inline-block;
		 height: 100%;
		 vertical-align: middle;
       }
	   .toastBox{ //得到积分
		   width:475rpx;
		   height:270rpx;
		   background:#fff;
		   border:3rpx solid #4EB435;
		   border-radius:20rpx; 
		   display: inline-block;
		   vertical-align: middle;
		   background-color: #fff;
		   text-align: center;
		   white-space: normal;
		   .img{
			   padding-top:8%;
			   image{
				   width: 185rpx;
			   }
		   }
		   .text{
			   font-size:28rpx;
			   font-weight:400;
			   color:#333;
			   line-height:42rpx;
			   .point{
				   color:#FF2D29;
			   }
		   }
	   }
	   &.shareShadow{
		   background: rgba(0,0,0,.6);
	   }
	   .shareTipBox{ //分享提示
		   border-radius: 10rpx;
		   background:#fff;
		   display: inline-block;
		   vertical-align: middle;
		   text-align: center;
		   white-space: normal;
		   padding:30rpx 48rpx 20rpx;
		   .img{
			   margin-bottom: 20rpx;
			   .title{
				   width: 369rpx;
			   }
		   }
		   .coverImg{
			   width:563rpx;
			   margin-bottom: 24rpx;
		   }
		   .text{
			   text-align: left;
			   font-size: 24rpx;
			   font-weight: 400;
			   color: #656565;
			   line-height: 32rpx;
			   &.tit{
				   font-weight: 500;
				   color: #656565;
				   padding-bottom: 10rpx;
			   }
		   }
		   .btnshare{
			   width: 420rpx;
			   height: 80rpx;
			   line-height: 80rpx;
			   background: #65BD6A;
			   border-radius: 10rpx;
			   font-size: 30rpx;
			   color: #FFF;
			   margin: 34rpx auto 0;
		   }
	   }
	   
	}
</style>

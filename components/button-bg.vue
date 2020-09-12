<template>
	<view>
		<button @click="confirm" v-if="size=='big'" class="big" :style="{'color':color,'background':bgColor=='gradient'?linearGradient:bgColor=='disabled'?disabledColor:bgColor=='allow'?allowColor:bgColor}" :disabled="disabled">{{btn}}</button>
		
		<button @click="confirm" v-else-if="size=='largeGreen'" class="largeGreen" :style="{'color':color,'background':bgColor=='gradient'?linearGradient:bgColor=='disabled'?disabledColor:bgColor=='allow'?allowColor:bgColor}" :disabled="disabled">{{btn}}</button>
	    <button @click="confirm" v-else-if="size=='largeWhite'" class="largeWhite"  :disabled="disabled">{{btn}}</button>
		
		<button @click="confirm" v-else-if="size" class="small" :style="{'width':width,'color':color,'background':bgColor=='gradient'?linearGradient:bgColor=='disabled'?disabledColor:bgColor}"  :disabled="disabled">{{btn}}</button>
		<button @click="confirm" v-else class="big">{{btn}}</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				linearGradient:'linear-gradient(to right,#e68f02,#ee320d)',
				disabledColor:'linear-gradient(to right bottom,#9f9f9f,#d1d1d1)',
				allowColor:'linear-gradient(to right bottom,#e8db0d,#e88e0d)',
			};
		},
		props:{
			btn:{
				type:String,
				default:'我收下了'
			},
			size:{
				type:String,
				default:''
			},
			width:{
				type:String,
				default:'280rpx'
			},
			bgColor:{
				type:String,
				default:'#4eac6d'
			},
			color:{
				type:String,
				default:'#ffffff'
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			confirm(e){
				this.$emit('confirm',e)
			}
		}
	}
</script>

<style scoped lang="scss">
	.big{
		width: 415rpx;
		height: 84rpx;
		border-radius: 40rpx;
		background: linear-gradient(to bottom right,#e8db0d,#e88e0d);
		color: #540200;
		font-size: 33rpx;
		line-height: 84rpx;
		font-weight: bold;
	}
	.small{
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 32rpx;
	}
	.largeGreen{
		width: 587rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #57BE6F;
		border-radius: 20rpx;
		font-size: 30rpx;
		color: #FFF;
	}
	.largeWhite{
		width: 587rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #FFF;
		border: 3rpx solid #4EAC6D;
		border-radius: 20rpx;
		font-size: 30rpx;
		color: #333;
	}
</style>

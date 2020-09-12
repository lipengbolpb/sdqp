
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import config from '@/utils/api.js';

const store = new Vuex.Store({  
    state: {  // 定义常量
		openScan:true,
		userInfo:{},
		isIPX:false,
		qr:'',
		qrcode:'',
		provinceCode:'',
		xcxopenid:'',
		session_key:'',
		openid:'',
		hbopenid:'',
		sweepData:'',
		phoneNumber:'',
		
		telNum:'',
		
        login: false,  
        token: '',  
        avatarUrl: '',  
        userName: '' ,
		cart:'',
		orderInfo:{
			allPrice:0,
			discount:.3,
			shopName:'名称',
			dishName:[]
		},
		todos: [
		  { id: 1, text: '...', done: true },
		  { id: 2, text: '...', done: false }
		]
    },  
	
    mutations: {  
		getUserInfo(state,data){
			state.userInfo = data
		},
		userPhone(state,data){
		    state.phoneNumber = data;
		},
	    getOpenid(state,data){
		    state.openid = data;
		},
		getHbopenid(state,data){
			state.hbopenid = data;
		},
		xcxopenid(state,data){
			state.xcxopenid = data;
		},
		session_key(state,data){
			state.session_key = data;
		},
		getQr(state,data){
			state.qr = data;
		},
		getQrcode(state,data){
			state.qrcode = data;
		},
		getProvinceCode(state,data){
			state.provinceCode = data;
		},
		isIPX(state,data){
			state.isIPX = data;
		},
		getTelNum(state,data){
		    state.telNum = data;
		},
		
        login(state, provider) {  
            console.log(state)  
            console.log(provider)  
            state.login = true;  
            state.token = provider.token;  
            state.userName = provider.userName;  
            state.avatarUrl = provider.avatarUrl;  
        },  
        logout(state) {  
            state.login = false;  
            state.token = '';  
            state.userName = '';  
            state.avatarUrl = '';  
        },
		
		sweepQr(state,sweep){
			state.sweepData = sweep
		},
		COMMITORDER(state,data){
			state.orderInfo = order
		},  
		addCart(state,data){
		    state.cart = data;
		},
		updateOpenScan(state,data){
			state.openScan = data
		}
    },
	actions: {
		sweepResult({commit},data){
			commit('sweepQr',data)
		},
		commitOrder({commit},data){
			commit('COMMITORDER',data)
		},

		getXcxOpenid() { //获取小程序openid
			return new Promise((resolve, reject) => {
				uni.getStorage({
					key: 'xcxOpenid'
				}).then(res => {
					let [e, r] = res;
					if (r) {
						uni.checkSession({
							success() {
								resolve(r.data)
							},
							fail() {
								return uni.login()
							}
						})
					} else {
						return uni.login()
					}
				}).then(res => {
					if (res) {
						let [e, r] = res;
						if (r) {
							uni.request({
								url: 'https://xcxact.vjifen.com/api/getOpenid',
								method: 'POST',
								data: {
									code: r.code,
									provinceCode: 'sdqp'
								},
								complete: res => {
									console.log(res)
									resolve(res.data.data.uinfo)
								}
							});
						}
					}
				})
			})
		 
		},
		getOpenid() {
			return uni.getStorage({
				key: 'openid'
			})
		},
		getHbOpenid(store, appid) {
			let k = 'hbopenid_';
			if (appid) {
				k += appid;
			} else {
				k += config.payAppid
			}
			console.log(k)
			return uni.getStorage({
				key: k
			})
		}
	},
		
	getters:{
	  doneTodos: state => {
	     return state.todos.filter(todo => todo.done)
	  },
	  doneTodosCount:(state,getters) => {
		  return getters.doneTodos.length
	  }
	}
})  


export default store
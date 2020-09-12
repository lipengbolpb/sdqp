import Vue from 'vue'
import App from './App'
//挂载Vuex
// 在uni-app中愉快地使用vuex
import store from './store'  
import filter from './filter';

for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
        const element = filter[key]
        Vue.filter(key, element)
    }
}

Vue.prototype.$store = store     

Vue.config.productionTip = false


// Vue.prototype.$bus = new Vue();
// vue.$bus.emit()

App.mpType = 'app'

const app = new Vue({
    ...App,  
	store   //挂载
})
app.$mount()

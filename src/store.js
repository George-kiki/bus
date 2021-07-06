import Vue from 'vue';
import Vuex from 'vuex';
import $api from './config/api';
import $face from './config/interface';

const state = {
	userInfo:{	// 用户
		name:'',
		token:'',
		secret:''
	},
	padding:{	// 分页
		size:[10,20,50,100]
	},
	list:{	// 列表
		stopType:[]	// 停靠站类型
	},
	map:{
		center:[114.059628,22.543659]
	}
}
const mutations = {
	/**
	 * 更新用户信息
	 * @param {Object} state [仓库数据]
	 */
	updateUser(state) {
		Object.assign(state.userInfo,JSON.parse(window.localStorage.getItem('userInfo') || "{}"));
	},
	/**
	 * 更新类型列表
	 * @param {Object} state [仓库数据]
	 * @param {Boolean} data [数据]
	 */
	updateListType(state,data) {
		if(data.type == "allDictionary") {  // 所有字典
			Object.entries(data.list).map(val => { val.push(val[0].replace(/\_(\S{1})/g,(str,e) => e.toUpperCase()));return val; }).forEach(val => {
				state.list[val[2]] = val[1];
			});
		} else {
			state.list[(() => {
				switch(data.type) {
					case "street":  // 街道
						return 'street';
				}
			})()] = data.list;
		}
	}
}
const actions = {
	/**
	 * 获取类型列表
	 * @param {Object} store [仓库对象]
	 * @param {Object} operation [操作{type:'请求的字典',isForce:'是否强制刷新',haveDataForce:'是否有数据才强制刷新'}]
	 */
	getListType(store,operation) {
		let requestUrl,	// 请求地址(有默认值)
		param = {
			itemCode:operation.type
		}

		if(operation == void 0 || !~Object.prototype.toString.call(operation).indexOf("Object")) {return;}
		// isForce和haveDataForce不能同时存在
		if(operation.isForce != void 0 && operation.haveDataForce != void 0) {return;}

		/**
		 * operation.isForce为false
		 * 则进行是否需要请求数据的判断
		 */
		if(!operation.isForce && operation.type != 'allDictionary') {
			let temp = store.state.list[(() => {
				switch(operation.type) {
					case "street":  // 街道
						return 'street';
				}
			})()];
			// 如果类型列表已经有数据，则不再请求数据
			if(temp.length && !operation.haveDataForce) {
				// 如果operation存在callback则调用
				operation.callback && operation.callback(temp);
				return;
			}
		} else if(!operation.type) {
			// type必须有值
			return;
		}

		switch(operation.type) {
			case "street":  // 街镇
				requestUrl = $face.BASE.findStreetListByType;
				param = {};
			break;
			case "allDictionary":   // 所有字典
				requestUrl = $face.BASE.basis.findAllDictionary;
				param = {};
			break;
		}

		$api.post(requestUrl,param,data => {
			// 更新类型列表
			store.commit("updateListType",{
				type:operation.type,
				list:data
			});
			// 如果operation存在callback则调用
			operation.callback && operation.callback(data);
		});
	}
}
const getters = {
}
Vue.use(Vuex)
export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters
});

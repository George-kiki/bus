/**
 * Created by ZXW on 2018/2/26.
 */
import {message} from 'ant-design-vue'
import router from '@/router'
import MD5 from "md5.js";
import $face from '../config/interface'
import JSEncrypt from 'jsencrypt'
import $store from '../store'
import moment from 'moment';

// 引用axios
var axios = require('axios')

const VERSION = "1.0.0",  // 版本号
nonVerified = [$face.BASE.doLogin,$face.BASE.getAuthCode];	// 非校验地址（单独用变量存储，避免每次请求都创建一个新的变量）
// 公钥
let publicKey = '';
// 配置API接口地址
let root = 'http://120.24.97.111:12105'; // 测试环境
let fileRoot = "http://39.108.133.158:19105"; // 模板文件

// 给全局Date增加format函数
Date.prototype.format = function(fmt) {
  var o = {
     "M+" : this.getMonth()+1,                 //月份
     "d+" : this.getDate(),                    //日
     "h+" : this.getHours(),                   //小时
     "m+" : this.getMinutes(),                 //分
     "s+" : this.getSeconds(),                 //秒
     "q+" : Math.floor((this.getMonth()+3)/3), //季度
     "S"  : this.getMilliseconds()             //毫秒
 }
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt;
}
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/**
 * 获取本地图片路径
 * @param {File} file [文件]
 */
function getWindowUrl(file) {
  let url = '';
  if (window.createObjectURL!=undefined) {
      url = window.createObjectURL(file) ;
  } else if (window.URL!=undefined) {
      url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL!=undefined) {
      url = window.webkitURL.createObjectURL(file) ;
  }
  return url;
}

/**
 * 数据加密
 * @param {Object} str [需要加密的数据]
 * @return {String} str [加密后的字符串]
 */
function encrypt(str) {
  let jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(publicKey);
  return jsencrypt.encrypt(str);
}

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  switch(response.data.code) {
    case '545': // 登录失效
      message.destroy();
      window.localStorage.clear();
      message.error(response.data.message,1,() => {
        router.push({
          name: 'login',
          params:{
              isReload:true
          }
        });
      });
    break;
    default:
      return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/**
 * md5加密
 * @param {String|Object} message [需要加密的数据]
 * @returns {String}
 */
function mdEncrypt(message) {
	/*message为Object时，可能有值
	* {
	*	params:参数,
	*   method:请求方式
	*   timestamp:时间戳
	*   url:请求地址
	* }
	*/

	if(~Object.prototype.toString.call(message).indexOf("String")) {
		// 如果message为字符串则直接返回加密后的数据
		return new MD5().update(message).digest('hex');
	} else {	// 如果是Object，则处理后返回加密
		// 路径参数需要根据key排序升序 md5(请求路径+timestamp=*&+路径参数+json参数+sercet)

		// 获取地址后面的参数并排序
		let url = message.url.split("?"),
		temp = url[1] || '',
		params = message.params,
		tempJson = {},
		sortTemp = [];

		if(temp) {
			// 把key排序
			temp.split("&").forEach(val => {
				let keyValue = val.split("=");
				sortTemp.push(keyValue[0]);
				tempJson[keyValue[0]] = keyValue[1] || '';
			});
			sortTemp.sort();
			temp = Array.from(sortTemp,val => {
				return `${val}=${tempJson[val]}`;
			}).join("&");
		}
		// 格式化params
		if(params) {
			tempJson = {};
			sortTemp = [];

			for (let en in params) {
				sortTemp.push(en);
			}
			sortTemp.sort();
			sortTemp.forEach(val => {
				tempJson[val] = params[val];
			});
			params = JSON.stringify(params).substr(0,500);
		} else {
			params = JSON.stringify({});
		}
		// 如果是GET和FILE请求并且请求参数为{}，则不传入请求参数
		if((message.method == "GET" || message.method == "FILE") && params == "{}") {
			params = ''
		}
		return new MD5().update(encodeURI(`${url[0]}&Token=${$store.state.userInfo.token}&Timestamp=${message.timestamp}&${temp}${params}${$store.state.userInfo.secret}`)).digest('hex');
	}
}

/**
 * 执行接口处理函数
 * @param {Axios} request [请求的对象]
 * @param {Function} success [请求成功之后的回调函数]
 * @param {Function} failure [请求失败之后的回调函数]
 * @param {Function} complete [请求完毕回调函数]
 */
function carriedApiAxios(request,success, failure,complete) {
  request.then(function (res) {
    if(res.data.code == '200') {
      success(res.data.content || res.data);
    } else {
      message.error(res.data.message);
      failure && failure(res);
    }
    complete && complete();
  })
  .catch(function (err) {
    if(err.isAxiosError) {
      message.error('请求失败，请检查网络!')
      failure && failure();
    } else if (err.message.indexOf('timeout') !== -1) {
      message.error('请求超时,请重试!')
    }
    complete && complete();
  })
}

/**
 * 接口处理函数
 * @param {String} method [方法]
 * @param {String} url [请求地址]
 * @param {String} params [参数]
 */
function apiAxios (method, url, params) {
  if (params) {
    params = filterNull(params)
  }
  return axios(Object.assign({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    timeout: 10000,
    withCredentials: true
  },(() => {
		// 获取个人信息，登录不做处理
		if(nonVerified.find(val => {
			return val == url;
		})) {
			return {}
		} else {
			let timestamp = Date.now();
			return {
				headers:{
					NameCre:encodeURI(window.localStorage.getItem("NameCre") || ''),
					PassCre:window.localStorage.getItem("PassCre") || '',
					Token:$store.state.userInfo.token,
					Secret:$store.state.userInfo.secret,
					Timestamp:timestamp,
					Version:VERSION,
					Sign:mdEncrypt({
						method,
						url,
						params,
						timestamp
					})
				}
			}
		}
	})()))
}

// 返回在vue模板中的调用接口
export default {
  root,fileRoot,encrypt,getWindowUrl,mdEncrypt,
  get: function (url, params, success, failure,complete,isCarried = true) {
    if(isCarried) {
      carriedApiAxios(apiAxios('GET', url, params), success, failure,complete);
    } else {
      return apiAxios('GET', url, params);
    }
  },
  post: function (url, params, success, failure,complete,isCarried = true) {
    if(isCarried) {
      carriedApiAxios(apiAxios('POST', url, params), success, failure,complete);
    } else {
      return apiAxios('POST', url, params);
    }
  },
  batchAxios(axiosAll, success, failure,complete) {
    axios.all(axiosAll.map(val => {
      return val.method == 'post'?this.post(val.url,val.params,null,null,null,false):this.get(val.url,val.params,null,null,null,false);
    })).then((resolve,reject) => {
      if(resolve.find(val => val.data.code != '200')) {
        message.error("请求失败");
        failure && failure(res);
      } else {
        success(resolve.map(val => {
          return val.data.content || val.data;
        }));
      }
      complete && complete();
    }).catch(err => {
      if(err.isAxiosError) {
        message.error('请求失败，请检查网络!')
        failure && failure();
      } else if (err.message.indexOf('timeout') !== -1) {
        message.error('请求超时,请重试!')
      }
      complete && complete();
    })
  },
	/**
	 * 初始化附件
	 * @param {String} fileList [附件数组]
	 */
	initAnnex:function(fileList) {
		return fileList?fileList.split("|").map(val => {
			let temp = val.split("*");
			return {
				name:temp[1],
				url:temp[0]
			}
		}):[];
	},
	/**
	 * 下载附件
	 * @param {String} url [附件地址]
	 */
	downLoadFile(url) {
		window.open(url,"_blank");
	},
  /**
   * 根据列表获取标签名
   * @param {Array} list [列表]
   * @param {String} val [值]
   * @returns 
   */
	getDictionaryLabel: function (list,val) {
		if (!val) return ''
		val = val.toString()
		if(~val.indexOf(",")) {
			let temp = val.split(",");
			return temp.map(value => {
				return list.find(item => {
					return item.value == value;
				}).label;
			}).join(",");
		} else {
			let cur = list.find((item) => {
				return item.value == val
			})
			if (cur) return cur.label
			else return ''
		}
	},
  /**
   * 获取服务器时间
   * @param {Function} success [成功回调函数]
   * @param {Function} fail [失败回调函数]
   */
  getServerTime:function(success,fail) {
    this.post($face.ROSTER.list.getServerDate,{
    },date => {
      success && success(new moment(date,"YYYY-MM-DD HH:mm:ss"));
    },err => {
      fail && fail(err);
    });
  },
  /**
   * 下载文件
   * @param {String} href [文件地址]
   * @param {String} fileName [文件名称]
   */
  blobToExcel:function(href,fileName) {
    var downloadElement = document.createElement('a');
    downloadElement.href = href;
    downloadElement.download = `${fileName || '文件'}.xlsx`; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  }
}

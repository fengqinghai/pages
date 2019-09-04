import axios from 'axios';
import Qs from 'qs';//用于表单提交数据格式
//以下是新加
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

let env = process.env.NODE_ENV;
let root = '';
let loading;

if (env === 'development') {
    console.log("api");
} else if (env === 'production') {
    console.log("pro");
    root = '';
} else {
    throw '请检查process.env.NODE_ENV的值，是否符合这些值之一：development，production';
}

Date.prototype.format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds() //秒 
    };
    if (!fmt) {
        fmt = 'yyyy-MM-dd HH:mm:ss';
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key];
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim();
        } else if (toType(o[key]) === 'date') {
            o[key] = (o[key].format());
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key]);
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key]);
        }
    }
    return o;
}

function apiAxios(method, url, params, success, failure, authFail) {
    console.log('url:' + url);
    if (params) {
        params = filterNull(params);
    }

    var base = "";
    if (url.indexOf(".html") != -1) {
        base = "";
    } else {
        base = root;
    }


    //请求拦截(必须放在配置axios前面)
    axios.interceptors.request.use(config=>{
        console.log("请求拦截");
        config.headers['X-Token'] = 'token';//假数据
        return config;
    },error=>{
        // 请求错误回调
        console.log(error) // for debug
    });
    //响应拦截(必须放在配置axios前面)
    axios.interceptors.response.use(response=>{
        console.log("响应拦截")
        return response;
    },error=>{
        console.log(error);
    })

    //配置axios
    axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
        },
        transformRequest: [function(data) {//在请求之前对data传参进行格式转换
            loading= layer.load(2, {//请求未成功时出现loading页 ,3代表一中效果
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
            data = Qs.stringify(data);
            return data;
        }],
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' || method === 'DELETE' ? params : null,
        params: method === 'GET' ? params : null,
        baseURL: base,
        withCredentials: true,//跨域请求时发送cookie
        timeout: 5000, //过期时间
    }).then(function (res) {
        if (res.status >= 200 && res.status <= 210 ) {
            if (success) {
                success(res);
                layer.close(loading);//关闭loading效果
            }
        } else {
            //不走
            // window.alert('error: ' + JSON.stringify(res.data));
        }
    }).catch(function (err) {
        console.log(err)
        if(failure){
            failure();
        }
        // let res = err.response;
        // if (err && res) {
        //     console.log(res.status);
        //     if (res.status == 504) {
        //         // alert.eduToast("服务器连接失败!请检查您的网络或服务器!!",2000);
        //         return;
        //     } else if (res.status == 401) {
        //         console.log('------------------:status'+res.status);
        //         console.log('------------------:authFail'+authFail);
        //     }
        //     if (failure) {
        //         failure(res);
        //     } else {
        //         // alert.eduToast(res.data,2000);
        //     }
        // } else {
        //     if(authFail){
        //         // localStorage.setItem('login', '');
        //     }else{
        //         console.log(err);
        //     }
        // }
    });
    
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params, success, failure,authFail) {
        return apiAxios('GET', url, params, success, failure,authFail);
    },
    post: function (url, params, success, failure) {
        return apiAxios('POST', url, params, success, failure);
    },
    put: function (url, params, success, failure) {
        return apiAxios('PUT', url, params, success, failure);
    },
    delete: function (url, params, success, failure) {
        return apiAxios('DELETE', url, params, success, failure);
    },
    initHeader: function () {
        console.log('------------------:initHeader');
    }
};


/**
 * Created by ZXW on 2018/2/28.
 */
/***********************  基础  ***********************/
const BASE = {
    basis:{
        oneUpload:"/api/file/oneUpload",    // 上传文件
        findAllDictionary:"/api/msSysDict/findAllDictionary"    // 获取所有字典
    },
    login:{
        getAuthCode:"/api/msTenantUser/getAuthCode",    // 获取登录验证码
        doLogin:"/api/msTenantUser/doLogin" // 登录
    }
}

/***********************  车辆管理  ***********************/
const VEHICLE = {
}

/***********************  司机管理  ***********************/
const DRIVER = {
}

export default {
    BASE,VEHICLE,DRIVER
}

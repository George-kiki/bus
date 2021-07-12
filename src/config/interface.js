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

/***********************  组织机构  ***********************/
const ORGANIZATION = {
    list:{
        delete:"/api/msTenantOffice/delete",    // 删除
        detailOfficeCountList:"/api/msTenantOffice/detailOfficeCountList",  // 获取某个组织下级车辆，司机，业务员统计表 {id:''}
        getTenantOfficeTree:"/api/msTenantOffice/getTenantOfficeTree",  // 获取机构树结构
        save:"/api/msTenantOffice/save",    // 新增机构
        update:"/api/msTenantOffice/update" // 修改机构信息
    }
}

/***********************  车辆管理  ***********************/
const VEHICLE = {
    list:{  // 列表
        findListPage:"/api/msTenantVehicleInfo/findListPage",   // 查询列表信息 {}
        enableOrDisable:"/api/msTenantVehicleInfo/enableOrDisable" // 启用或禁用车辆
    },
    editVehicle:{   // 车辆编辑
        detailById:"/api/msTenantVehicleInfo/detailById", // 查看车辆详情信息?id=
        save:"/api/msTenantVehicleInfo/save",    // 保存车辆信息
        update:"/api/msTenantVehicleInfo/update" // 修改车辆信息
    },
    typeList:{  // 车型
        detail:"/api/msTenantVehicleType/detail",   // 查看车型信息?id=
        findPage:"/api/msTenantVehicleType/findPage", // 查询车型信息表分页列表
        save:"/api/msTenantVehicleType/save",   // 保存车型信息
        update:"/api/msTenantVehicleType/update"    // 修改车型信息
    }
}

/***********************  司机管理  ***********************/
const DRIVER = {
    list:{  // 列表
        findListPage:"/api/msTenantDriver/findListPage",    // 查询列表信息 {name:'',page:'',rows:''}
        enableOrDisable:"/api/msTenantDriver/enableOrDisable",   // 启用或禁用
        deleteTenantDriver:"/api/msTenantDriver/deleteTenantDriver" // 删除
    },
    edit:{  // 编辑
        saveOrUpdateMsTenantDriver:"/api/msTenantDriver/saveOrUpdateMsTenantDriver",    // 保存或修改
        detailById:"/api/msTenantDriver/detailById"    // 查看详情?id=
    }
}
/***********************  业务员管理  ***********************/
const SALESMAN = {
    list: {
        findListPage: "/api/msTenantSalesman/findListPage"
    },
    edit: {
        save: "/api/msTenantSalesman/save",
        update: "/api/msTenantSalesman/update",
        detailId: "/api/msTenantSalesman/detailById"
    }
}
const YARDMAN = {
    list: {
        findListPage: "/api/msTenantDispatch/findPage"
    },
    edit: {
        save: "/api/msTenantDispatch/save",
        update: "/api/msTenantDispatch/update",
        detailId: "/api/msTenantDispatch/detail"
    }
}
const SITE = {
    list: {
        findListPage: "/api/msTenantStation/findPage"
    },
    edit: {
        save: "/api/msTenantStation/save",
        update: "/api/msTenantStation/update",
        detailId: "/api/msTenantStation/detail"
    }
}
export default {
    BASE, ORGANIZATION, VEHICLE, DRIVER, SALESMAN, YARDMAN, SITE
}

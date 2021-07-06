// 全加载模块，当前模块数量较少，采用全加载方式

/**
 * $tabs功能    push:跳转  close:关闭  TABS标签页常量
 * push参数列表()
 * Object:{
 *  name:'tab名称',
 *  model:'模块名称',
 *  belong:'隶属左侧哪个菜单',
 *  sign:'唯一标识',
 *  params:'传递的参数‘'
 * }
 */
// 信息管理
import basisOrganization from '@/pages/basis/organization';   // 组织机构
import basisVehicleList from '@/pages/basis/vehicleList';   // 车辆列表
import basisVehicleTypeList from '@/pages/basis/vehicleTypeList';   // 车型列表
import basisDriverList from '@/pages/basis/driverList'; // 司机列表
import basisEditVehicle from '@/pages/basis/editVehicle';   // 编辑车辆
import basisEditDriver from '@/pages/basis/editDriver'; // 编辑司机

const TABS = {
    /***************************** 信息管理 *****************************/
    basisOrganization,  // 组织机构
    basisVehicleList,   // 车辆列表
    basisVehicleTypeList,   // 车型列表
    basisDriverList,    // 司机列表
    basisEditVehicle,   // 编辑车辆
    basisEditDriver // 编辑司机
};
export default {
    TABS,
    /**
     * 跳转页面
     */
    push:() => {},
    params:null // 传递的参数
};

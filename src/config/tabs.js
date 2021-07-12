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
import basisDriver from '@/pages/basis/driver'; // 司机管理
import basisEditDriver from '@/pages/basis/editDriver'; // 编辑司机
import basisVehicle from '@/pages/basis/vehicle';   // 车辆管理
import basisEditVehicle from '@/pages/basis/editVehicle';   // 编辑车辆
import basisVehicleRecordList from '@/pages/basis/vehicleRecord'; // 行车记录
import basisVehiclePath from '@/pages/basis/vehiclePath'; // 行车轨迹
import basisSalesman from '@/pages/basis/salesman'; // 业务员管理
import basisEditSalesman from '@/pages/basis/editSalesman'; // 编辑业务员
import basisTenantStationList from '@/pages/basis/tenantStation'; // 站场列表
import basisYardmanList from '@/pages/basis/yardman'; // 调度员列表
import basisEditYardman from '@/pages/basis/editYardman'; // 编辑调度员
import basisEditSite from '@/pages/basis/editSite'; // 编辑站场
import basisSalesmanOrderDetail from '@/pages/basis/salesmanOrderDetail'; // 业务员订单详情

const TABS = {
    /***************************** 信息管理 *****************************/
    basisOrganization,  // 组织机构
    basisDriver,    // 司机管理
    basisEditDriver, // 编辑司机
    basisVehicle,   // 车辆管理
    basisEditVehicle,   // 编辑车辆
    basisVehicleRecordList, // 行车记录
    basisVehiclePath, // 行车轨迹
    basisSalesman, // 业务员管理
    basisEditSalesman, // 编辑业务员
    basisTenantStationList, // 站场列表
    basisEditSite, // 编辑站场
    basisYardmanList, // 调度员列表
    basisEditYardman, // 编辑调度员
    basisSalesmanOrderDetail // 业务员订单详情
};

export default {
    TABS,
    /**
     * 跳转页面
     */
    push:() => {},
    params:null // 传递的参数
};

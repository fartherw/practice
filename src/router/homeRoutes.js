const homeRoutes = [{
    path: '',
    redirect: '/home/introduce'
}, {
    path: "/home/introduce",
    name: "/home/introduce",
    meta: {
        title: "系统介绍",
        role: "PMC001",
        icon: "el-icon-data-line",
        submenu1: true,
    },
    component: () => import("@/views/Dashboard/Introduce.vue"),
}, {
    path: "/home/controlpanel",
    name: "/home/controlpanel",
    meta: {
        title: "Dashboard",
        role: "PMC001",
        icon: "el-icon-odometer",
        submenu1: true,
    },
    component: () => import("@/views/Dashboard/ControlPanel.vue"),
}, {
    path: "/home/add",
    name: "/home/add",
    meta: {
        title: "添加商品",
        role: "PMC001",
        icon: "el-icon-plus",
        submenu1: true,
    },
    component: () => import("@/views/Dashboard/Add.vue"),
}, {
    path: "/home/classification",
    name: "/home/classification",
    meta: {
        title: "分类管理",
        role: "PMF200",
        icon: "el-icon-tickets",
        submenu3: true,
    },
    component: () => import("@/views/model/ClassiFication.vue"),
}, {
    path: "/home/classification/level2",
    name: "/home/classification/level2",
    meta: {
        title: "分类二级管理",
        icon: "el-icon-tickets",
        categoryLevel: 2,
    },
    component: () => import("@/views/model/ClassiFication2.vue"),
}, {
    path: "/home/classification/level3",
    name: "/home/classification/level3",
    meta: {
        title: "分类三级管理",
        icon: "el-icon-tickets",
        categoryLevel: 3,
    },
    component: () => import("@/views/model/ClassiFication3.vue"),
}, {
    path: "/home/goodsmanager",
    name: "/home/goodsmanager",
    meta: {
        title: "商品管理",
        role: "PMG300",
        icon: "el-icon-shopping-cart-full",
        submenu3: true,
    },
    component: () => import("@/views/model/GoodsManager.vue"),
}, {
    path: "/home/membermanager",
    name: "/home/membermanager",
    meta: {
        title: "会员管理",
        role: "PMM400",
        icon: "el-icon-user",
        submenu3: true,
    },
    component: () => import("@/views/model/MemberManager.vue"),
}, {
    path: "/home/ordermanager",
    name: "/home/ordermanager",
    meta: {
        title: "订单管理",
        role: "PMR500",
        icon: "el-icon-s-order",
        submenu3: true,
    },
    component: () => import("@/views/model/OrderManager.vue"),
}, {
    path: "/home/order_detail",
    name: "/home/order_detail",
    meta: {
        title: "订单详情",
        role: "PMR500",
        orderInfo: true,
        icon: "el-icon-tickets",
    },
    component: () => import("@/views/model/Order_detail.vue"),
}, {
    path: "/home/bannersetting",
    name: "/home/bannersetting",
    meta: {
        title: "轮播图设置",
        role: "PMH100",
        icon: "el-icon-picture-outline",
        submenu: true,
    },
    component: () => import("@/views/Home/BannerSetting.vue"),
}, {
    path: "/home/goodssetting",
    name: "/home/goodssetting",
    meta: {
        title: "热销商品设置",
        role: "PMH100",
        icon: "el-icon-star-on",
        submenu: true,
    },
    component: () => import("@/views/Home/GoodsSetting.vue"),
}, {
    path: "/home/productsetting",
    name: "/home/productsetting",
    meta: {
        title: "新品上线设置",
        role: "PMH100",
        icon: "el-icon-position",
        submenu: true,
    },
    component: () => import("@/views/Home/ProductSetting.vue"),
}, {
    path: "/home/recommendsetting",
    name: "/home/recommendsetting",
    meta: {
        title: "为你推荐设置",
        role: "PMH100",
        icon: "el-icon-thumb",
        submenu: true,
    },
    component: () => import("@/views/Home/RecommendSetting.vue"),
}, {
    path: "/home/account",
    name: "/home/account",
    meta: {
        title: "修改密码",
        role: "PMH100",
        icon: "el-icon-lock",
        submenu2: true,
    },
    component: () => import("@/views/system/Account.vue"),
}]

export default homeRoutes;

/* 
 /home/controlpanel   控制面板
     /home/classification   分类管理
     /home/classification/level2 分类二级管理
     /home/classification/level3 分类三级管理
     /home/goodsmanager   商品管理
     /home/membermanager   会员管理
     /home/ordermanager   订单管理
     /home/bannersetting   轮播图设置
     /home/goodssetting   热销商品设置
    /home/productsetting   新品上线设置
    /home/recommendsetting   为你推荐设置
以上地址都不成立   404组件
*/
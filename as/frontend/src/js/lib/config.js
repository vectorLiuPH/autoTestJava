var comConf = {
    tipTime: 3000,//常规提示信息显示时间
    shortTipTime:2000,//较短提示信息显示时间
    md5Salt:'americanschool@2016',//密码盐值，登录注册等所有使用到密码的地方都要使用md5(password + comConf.md5Salt);
    captchaTime:60,//验证码按钮隔多长时间可以点击
    topNavActive:{//头部导航添加active的配置,在common.js会用到
        homePage:['/','','index.html'],//首页
        course:[],//国际课程
        studyTour:[],//美国游学
        game:[],//美国赛事
        read:[]//关于过我们
    },
    defaultHeadPhoto:'../../../images/logo.png'//默认头像
};

//线上
var Api = {
    login:'/rest/tologin',//登录
    getUserInfo:'/rest/user/detail',//获取当前登录用户的信息
    register:'/rest/regist',//注册
    captcha:'/rest/captcha',//图片验证码 注意html页面中也有此接口，修改时需要修改html文件
    sendSecurityCode:'/rest/sendSecurityCode',//发送邮箱或手机验证码
    checkUserExis:'/rest/userExisted',//判断用户是否存在
    forgetPass:'/rest/resetPass',//忘记密码
    resetPass:'/rest/user/resetPass',//重置密码
    logout:'/rest/user/logout',//退出登录
    bindPhone:'/rest/user/bindPhone',//绑定手机号
    bindMail:'/rest/user/bindEmail',//绑定邮箱
    getAreaInfo:'/rest/areas',//获取区域信息
    getSchool:'/rest/schools',//获取学校
    getGrade:'/rest/grades',//获取年级信息
    getClass:'/rest/classes',//获取班级信息
    saveUserInfo:'/rest/user/update',//保存用户信息
    uploadPhoto:'/rest/user/uploadPhoto'//上传头像
};

//美国大赛相关接口地址
var AmApi = {
    register:'/rest/americanrace/user/joinrace',//比赛报名
    getHomepageInfo:'/rest/americanrace/main/info',//获取大赛首页信息
    getTopTen:'/rest/americanrace/main/topten',//获取某地区某赛段在某个赛区top10信息
    getDynamicInfo:'/rest/americanrace/main/events',//获取某个赛区动态信息
    getDynamicList:'/rest/americanrace/events/list',//获取动态信息列表
    getDynamicArticle:'/rest/americanrace/events/detail'//获取动态信息
}

(function(){
	var topBar = {
		userWrapper:$('.j_user_template'),
		init:function(){//初始化
			this.bindEvent();
			this.renderUserInfo();
			/*this.createActiveNav();*/
			
		},
		bindEvent:function(){//绑定事件
			var _this = this;
			this.userWrapper.on('click','.j_login_btn',function(){
				userDialog.showLoginDialog();
			});

			this.userWrapper.on('click','.j_reg_btn',function(){
				userDialog.showRegDialog();
			});

			this.userWrapper.on('click','.quit',function(e){
				_this.quitLogin(e);
			});

			
		},
		renderUserInfo:function(){//渲染用户信息部分
			/*store.set('userInfo',{
				isLogin:true,
				nickName:'nickName',
				avatar:''
			});*/
			var userInfo = store.get('userInfo');
			var _this = this;
			var bt = baidu.template;
			var zData = {
				isLogin:false
			};
			if (userInfo) {
				$.ajax({
					type:'get',
					url:Api.getUserInfo,
					async: false,//同步请求,放置后面要用到该数据
					data:{
						_:(new Date()).getTime()
					},
					opt:{
						loginDialog:false//如果想后台传回err.api.not_login时不弹出弹出框，则传此值过去
					},
					success:function(res){//页面刷新时如果localStorage有userInfo则发请求获取用户信息，同步用户登录状态
						if (res.state) {
							if (res.data) {
								var data = userDialog.initUserInfo(res.data);
									store.set('userInfo',data);
								var loginHtml = bt('loginHeaderTemplate',data);
									_this.userWrapper.html(loginHtml);
							};
						}else{
								store.remove("userInfo");
							var loginHtml = bt('loginHeaderTemplate',zData);
								_this.userWrapper.html(loginHtml);
						}
					}
				});

				/*var bt = baidu.template;
				var html = baidu.template('loginHeaderTemplate',userInfo);
				_this.userWrapper.html(html);*/
			}else{
				var html = bt('loginHeaderTemplate',zData);
				this.userWrapper.html(html);
			}
		},
		quitLogin:function(e){//退出登录
			e.preventDefault();
			userDialog.exitLogin();
		},
		/*createActiveNav:function(){
            var pathname = window.location.pathname;
            var page = pathname.substring(pathname.lastIndexOf('/')+1)
            var homePage = comConf.topNavActive.homePage;
            var course = comConf.topNavActive.course;
            var studyTour = comConf.topNavActive.studyTour;
            var game = comConf.topNavActive.game;
            var read = comConf.topNavActive.read;
                if (this.contains(homePage,page)) {
                    $('.homePage').addClass('active');
                }else if(this.contains(course,page)){
                    $('.course').addClass('active');
                }else if(this.contains(studyTour,page)){
                    $('.studyTour').addClass('active');
                }else if(this.contains(game,page)){
                    $('.game').addClass('active');
                }else if(this.contains(read,page)){
                    $('.aboutAs').addClass('active');
                }
        },*/
        contains:function(arr,element){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == element) {
                    return true;
                }
            }
            return false;
        }
	}

	topBar.init();
})();
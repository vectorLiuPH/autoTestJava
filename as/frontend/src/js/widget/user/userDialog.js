/**
 * author:chenjiajun
 * [通用登录、注册、忘记密码 通用方法]
 * 共包含：
 * 1.登录(userDialog.showLoginDialog())、注册(userDialog.showRegDialog())、忘记密码弹出框(userDialog.showforgetDialog())
 *   均可以传两个参数,succsFun成功后的回调函数、errorFun 失败后的回调函数
 * 2.退出登录(userDialog.exitLogin())
 	 验证码按钮倒计时(userDialog.get_code_time(obj) obj表示显示倒计时时间的按钮)
 	 刷新验证码(userDialog.refreshCaptha(obj) obj表示图片对象)
 	 用户信息格式话(userDialog.initUserInfo(data) data表示用户信息，一个对象，格式是后台统一传回的格式)
 */

var userDialog = {};

(function(){
	/**
	 * [showLoginDialog 登录弹出框 通用方法]
	 * @type {[type]}
	 */
	var LoginDialog = null;
	function showLoginDialog(succsFun,errorFun){
		var loginForm = $('#loginForm');
		var captchaUrl = Api.captcha + '?_=' + (new Date()).getTime();
		var loginValiCodeImg = $('#loginValiCodeImg');
		var loginBtn = $('#loginBtn');
		loginForm.trigger('reset');//每次打开前重置表单
		refreshCaptha(loginValiCodeImg);
		if (!LoginDialog) {
			LoginDialog = new DIALOG({
				title: 'American School',
	        	content: $('#loginDialog'),
	        	width: '351px',
	        	className: 'loginDialog'
			});
			$.validate();

			loginValiCodeImg.click(function(){//点击图片重新获取验证码
				refreshCaptha(loginValiCodeImg);
			});

			loginForm.submit(function(e){//请求登录
				e.preventDefault();

				if (loginBtn.hasClass('disabled')) {
					return;
				};

				if (loginForm.isValid()) {
					var validCodeNode = $('#loginValiCode');
					var account = $.trim($('#loginAccount').val());
					var password = md5($.trim($('#loginPass').val()) + comConf.md5Salt);
					var valiCode = $.trim($('#loginValiCode').val());
					var data = {
						"account":account,
						"password":password,
						"validCode":valiCode
					}

					loginBtn.addClass('disabled');
					$.ajax({
						url:Api.login,
						data:JSON.stringify(data),
						success:function(res){
							if (res.state) {
								var data = res.data;
									data = initUserInfo(data);
									store.set("userInfo",data);
								var bt = baidu.template;
								var html = baidu.template('loginHeaderTemplate',data);
									$('.j_user_template').html(html);
									LoginDialog.close();
									Tip('您已成功登陆','success',comConf.tipTime);
								if (succsFun && typeof succsFun == 'function') {
									succsFun(res);
								};
								
							}else{
								var msg = res.msg && res.msg != "" ? res.msg : "登陆失败！";
								Tip(msg,'error',comConf.tipTime);
								validCodeNode.val('');
								refreshCaptha(loginValiCodeImg);
								if (errorFun && typeof errorFun == 'function') {
									errorFun(res);
								};
							}
							loginBtn.removeClass('disabled');
						},
						error:function(){
							loginBtn.removeClass('disabled')
						}
					});

				};
			});

			$('.register-btn').click(function(){
				if (LoginDialog) {
					LoginDialog.close();
				};
				showRegDialog();
			});

			$('.forget-btn').click(function(){
				if (LoginDialog) {
					LoginDialog.close();
				};
				showforgetDialog();
			});
		};
		
		LoginDialog.open();
	}

	userDialog.showLoginDialog = showLoginDialog;


	/**
	 * [showRegDialog 注册弹出框 通用方法]
	 * @type {[type]}
	 */

	var regDialog = null;
	function showRegDialog(succsFun,errorFun){
		var regForm = $('#regForm');
		var regValiCodeImg = $('#regValiCodeImg');
		var regBtn = $('#regBtn');
			regForm.trigger('reset');//每次打开前重置表单
			refreshCaptha(regValiCodeImg);

		if (!regDialog) {
			regDialog = new DIALOG({
				title: 'American School',
	        	content: $('#regDialog'),
	        	width: '381px',
	        	className: 'regDialog'
			});
			$.validate();

			regForm.submit(function(e){//提交注册请求
				e.preventDefault();
				if (regBtn.hasClass('disabled')) {
					return;
				};
				if (regForm.isValid()) {
					var accountNode = $('#regAccount');
					var account = $.trim(accountNode.val());
					var password = md5($.trim($('#regPass').val()) + comConf.md5Salt);
					var valiCode = $.trim($('#regValiCode').val());
					var nickname = $.trim($('#regNickname').val());

					var accountIsExis = checkUserExis(account);
						if (accountIsExis) {
							accountNode.css({
								"border-color":"red"
							});
							accountNode.parent().append('<small class="help-block error">手机号或邮箱已存在！</small>');
							return;
						}

					var data = {
						"account":account,
						"password":password,
						"validCode":valiCode,
						"nickname":nickname
					}
					console.log('data');
					regBtn.addClass('disabled');
					$.ajax({
						url:Api.register,
						data:JSON.stringify(data),    
						success:function(res){
							regBtn.removeClass('disabled');
							if (res.state) {
								regDialog.close();
								Tip('注册成功！','success',comConf.tipTime);
								var data = res.data;
									data = initUserInfo(data);
									store.set("userInfo",data);
								var bt = baidu.template;
								var html = baidu.template('loginHeaderTemplate',data);
									$('.j_user_template').html(html);
								if (succsFun && succsFun == 'function') {
									succsFun(res);
								};
								window.location.href = '/user/ucenter.html';
							}else{
								var msg = res.msg && res.msg != "" ? res.msg : "注册失败";
								Tip(msg,'error',comConf.tipTime);
								if (errorFun && errorFun == 'function') {
									errorFun(res)
								};
							}
						},
						error:function(){
							regBtn.removeClass('disabled');
						}
					});
				};
			});

			regValiCodeImg.click(function(){//点击图片重新获取验证码
				refreshCaptha(regValiCodeImg);
			});

			$('#regAccount,#regValidCodePic').blur(function(){//检验发送验证码按钮是否为disabled
				var accountNode = $('#regAccount');
				var regValidCodePicNode = $('#regValidCodePic');
				var Btn = $('#regValiCodeBtn');
				var account = accountNode.val();
				var regValidCodePic = regValidCodePicNode.val();
				var accountReg = accountNode.attr('data-validation-regexp');
				var regValidCodePicReg = regValidCodePicNode.attr('data-validation-regexp');
				var accountIsExis = false;

					if (account.match(accountReg)) {
						accountIsExis = checkUserExis(account);
						if (accountIsExis) {
							accountNode.css({
								"border-color":"red"
							});
							accountNode.parent().append('<small class="help-block error">手机号或邮箱已存在！</small>');
							return;
						}
					};
				if (Btn.hasClass('isSending')) {
					return;
				};

				if (account.match(accountReg) && regValidCodePic.match(regValidCodePicReg) && !accountIsExis) {
					Btn.removeClass('disabled');
				}else{
					Btn.addClass('disabled');
				}
			});

			$('#regValiCodeBtn').click(function(){//发送邮件或手机验证码
				var accountNode = $('#regAccount');
				var regValidCodePicNode = $('#regValidCodePic');
				var Btn = $('#regValiCodeBtn');
				var account = accountNode.val();
				var regValidCodePic = regValidCodePicNode.val();
					if (Btn.hasClass('disabled')) {
						return;
					};

					var data = {
						account:account,
						validCodePic:regValidCodePic
					}

					Btn.addClass('disabled').addClass('isSending');

					$.ajax({
						url:Api.sendSecurityCode,
						data:data,
						contentType:'application/x-www-form-urlencoded',
						success:function(res){
							if (res.state) {
								wait = comConf.captchaTime;
								userDialog.wait = comConf.captchaTime;
								get_code_time(Btn);
							}else{
								refreshCaptha(regValiCodeImg);
								regValidCodePicNode.val('');
								Btn.removeClass('isSending');
								Tip(res.msg,'error',comConf.tipTime);
							}
						},
						error:function(){
							Btn.removeClass('isSending');
						}
					});
			});

		};
		
		regDialog.open();
	}

	userDialog.showRegDialog = showRegDialog;

	/**
	 * [showforgetDialog 忘记密码弹出框 通用方法]
	 * @type {[type]}
	 */

	var forgetDialog = null;
	function showforgetDialog(succsFun,errorFun){
		var forgetForm = $('#forgetForm');
		var forgetBtn = $('#forgetBtn');
		var forgetValiCodeImg = $('#forgetValiCodeImg');
			refreshCaptha(forgetValiCodeImg);
			forgetForm.trigger('reset');//每次打开前重置表单

		if (!forgetDialog) {
			forgetDialog = new DIALOG({
				title: 'American School',
	        	content: $('#forgetDialog'),
	        	width: '381px',
	        	className: 'forgetDialog'
			});
			$.validate();

			forgetForm.submit(function(e){//提交重置密码表单
				e.preventDefault();
				if (forgetBtn.hasClass('disabled')) {
					return;
				};
				if (forgetForm.isValid()) {
					var forgetAccountNode = $('#forgetAccount');
					var account = $.trim(forgetAccountNode.val());
					var newPass = md5($.trim($('#forgetPass').val()) + comConf.md5Salt);
					var valiCode = $.trim($('#forgetValiCode').val());
					var accountIsExis = checkUserExis(account);
						if (!accountIsExis) {
							forgetAccountNode.css({
								"border-color":"red"
							});
							forgetAccountNode.parent().append('<small class="help-block error">手机号或邮箱不存在！</small>');
							return;
						}
					var data = {
						"account":account,
						"newPass":newPass,
						"securityCode":valiCode,
					}
					forgetBtn.addClass('disabled');

					$.ajax({
						url:Api.forgetPass,
						data:JSON.stringify(data),
						success:function(res){
							forgetBtn.removeClass('disabled');
							if (res.state) {
								Tip('密码重置成功，请登录!','success',comConf.tipTime);
								forgetDialog.close();
								showLoginDialog();
								if (succsFun && succsFun == 'function') {
									succsFun(res);
								}
							}else{
								var msg = res.msg && res.msg != "" ? res.msg : "重置密码失败";
								Tip(msg,'error',comConf.tipTime);
								if (errorFun && errorFun == 'function') {
									errorFun(res)
								};
							}
						},
						error:function(){
							forgetBtn.removeClass('disabled');
						}
					});
				};
			});

			forgetValiCodeImg.click(function(){//点击图片重新获取验证码
				refreshCaptha(forgetValiCodeImg);
			});

			$('#forgetAccount,#forgetValidCodePic').blur(function(){//检验发送验证码按钮是否为disabled
				var forgetAccountNode = $('#forgetAccount');
				var forgetValidCodePicNode = $('#forgetValidCodePic');
				var Btn = $('#forgetValiCodeBtn');
				var account = forgetAccountNode.val();
				var forgetValidCodePic = forgetValidCodePicNode.val();
				var accountReg = forgetAccountNode.attr('data-validation-regexp');
				var forgetValidCodePicReg = forgetValidCodePicNode.attr('data-validation-regexp');
				var accountIsExis = false;
					if (account.match(accountReg)) {
						accountIsExis = checkUserExis(account);
						if (!accountIsExis) {
							forgetAccountNode.css({
								"border-color":"red"
							});
							forgetAccountNode.parent().append('<small class="help-block error">手机号或邮箱不存在！</small>');
							return;
						}
					};
				

				if (Btn.hasClass('isSending')) {
					return;
				};

				if (account.match(accountReg) && forgetValidCodePic.match(forgetValidCodePicReg) && accountIsExis) {
					Btn.removeClass('disabled');
				}else{
					Btn.addClass('disabled');
				}
			});

			$('#forgetValiCodeBtn').click(function(){//发送邮件或手机验证码
				var accountNode = $('#forgetAccount');
				var forgetValidCodePicNode = $('#forgetValidCodePic');
				var Btn = $('#forgetValiCodeBtn');
				var account = accountNode.val();
				var forgetValidCodePic = forgetValidCodePicNode.val();
					if (Btn.hasClass('disabled')) {
						return;
					};

					var data = {
						account:account,
						validCodePic:forgetValidCodePic
					}

					Btn.addClass('disabled').addClass('isSending');

					$.ajax({
						url:Api.sendSecurityCode,
						data:data,
						contentType:'application/x-www-form-urlencoded',
						success:function(res){
							if (res.state) {
								userDialog.wait = comConf.captchaTime;
								get_code_time(Btn);
							}else{
								refreshCaptha(forgetValiCodeImg);
								forgetValidCodePicNode.val('');
								Btn.removeClass('isSending');
								Tip(res.msg,'error',comConf.tipTime);
							}
						},
						error:function(){
							Btn.removeClass('isSending');
						}
					});
			});



		};
		
		forgetDialog.open();
	}

	userDialog.showforgetDialog = showforgetDialog;

	/**
	*退出登录
	**/

	function exitLogin(){
		window.confirm('确定退出登录！',function(){
			$.post(Api.logout,function(res){
				if (res.state) {
					Tip('成功退出登录！','success',comConf.tipTime);
					store.remove("userInfo");
					window.location.reload();
				}else{
					Tip(res.msg,'error',comConf.tipTime);
				}
			},'json');
		});
		
	}

	userDialog.exitLogin = exitLogin;


	/**
	*检查用户是否存在
	**/
	function checkUserExis(account){
		var data = {
			account:account
		}
		var isExis = false;
		$.ajax({
			url:Api.checkUserExis,
			data:data,
			contentType:'application/x-www-form-urlencoded',
			async: false,//同步请求
			success:function(res){
				if (res.state) {
					isExis = true;
				}else{
					isExis = false;
				}
			}
		});

		return isExis;
	}

	userDialog.checkUserExis = checkUserExis;


	userDialog.wait = comConf.captchaTime;
	function get_code_time(o) {//获取验证码按钮倒计时显示
        if (userDialog.wait == 0) {
        	$(o).removeClass("disabled").removeClass('isSending');
            o.val("重新获取验证码");
        } else {
            userDialog.wait--;
            $(o).addClass("disabled").addClass('isSending');
            o.val("(" + userDialog.wait + ")秒后重新获取");
            setTimeout(function() {
                get_code_time(o)
            }, 1000)
        }
    }

    userDialog.get_code_time = get_code_time;

    function refreshCaptha(obj){//刷新图片验证码
    	var captchaUrl = Api.captcha + '?_=' + (new Date()).getTime();
    	obj.attr('src',captchaUrl);
    }

    userDialog.refreshCaptha = refreshCaptha;

    function initUserInfo(data){//处理用户信息
    	data['isLogin'] = true;
    	for(key in data){
    		if (!data[key]) {
    			data[key] = '';
    		};
    	}
    	if (data.birthday == '') {
    		data['birthdayText'] = ''
    	}else{
    		data['birthdayText'] = COM.formateDate(data.birthday);
    		console.log(data['birthdayText']);
    	}
    	if (data.avatar == '') {
    		data.avatar = comConf.defaultHeadPhoto;
    	};
    	if (!data.areaId) {
    		data.areaId = '';
    	};
    	if (!data.schoolId) {
    		data.schoolId = '';
    	};
    	if (!data.gradeId) {
    		data.gradeId = '';
    	};
    	if (!data.classId) {
    		data.classId = '';
    	};
    	return data;
    }

    userDialog.initUserInfo = initUserInfo;

})();



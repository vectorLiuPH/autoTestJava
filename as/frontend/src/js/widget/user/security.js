(function(){
	var security = {
		$resetPass:$('.j_reset_pass'),
		$setPhone:$('.j_set_phone'),
		$setMail:$('.j_set_mail'),
		init:function(){
			this.bindEvent();
			$.placeholder.ini();
		},
		bindEvent:function(){
			var _this = this;

			this.$resetPass.click(function(e){
				e.preventDefault();
				_this.resesPass();
			});

			this.$setPhone.click(function(e){
				e.preventDefault();
				_this.bindPhone();
			});

			this.$setMail.click(function(e){
				e.preventDefault();
				_this.bindMail();
			});
		},
		resesPass:function(){//重置密码
			userDialog.showforgetDialog();
			/*var _this = this;
			var resetForm = $('#resetForm');
			var resetBtn = $('#resetBtn');
			var resetValiCodeImg = $('#resetValiCodeImg');
				userDialog.refreshCaptha(resetValiCodeImg);
				resetForm.trigger('reset');//每次打开前重置表单

			if (!_this.resetPassDialog) {
				_this.resetPassDialog = new DIALOG({
					title: '重置密码',
		        	content: $('#resetPassDialog'),
		        	width: '381px',
		        	className: 'forgetDialog'
				});
				$.validate();

				resetForm.submit(function(e){//提交重置密码表单
					e.preventDefault();
					if (resetBtn.hasClass('disabled')) {
						return;
					};
					if (resetForm.isValid()) {
						var oldPass = md5($.trim($('#resetOldPass').val()) + comConf.md5Salt);
						var newPass = md5($.trim($('#resetNewPass').val()) + comConf.md5Salt);
						var securityCode = $.trim($('#resetValiCode').val());
						var data = {
							"oldPass":oldPass,
							"newPass":newPass,
							"securityCode":securityCode,
						}
						resetBtn.addClass('disabled');

						$.ajax({
							url:Api.resetPass,
							data:JSON.stringify(data),
							success:function(res){
								resetBtn.removeClass('disabled');
								if (res.state) {
									Tip('密码重置成功!','success',comConf.tipTime);
									_this.resetPassDialog.close();
									$.post(Api.logout,function(res){
										if (res.state) {
											//Tip('成功退出登录！','success',comConf.tipTime);
											store.remove("userInfo");
											window.location.reload();
										}else{
											//Tip(res.msg,'error',comConf.tipTime);
										}
									},'json');
								}else{
									var msg = res.msg && res.msg != "" ? res.msg : "重置密码失败";
									Tip(msg,'error',comConf.tipTime);
								}
							},
							error:function(){
								resetBtn.removeClass('disabled');
							}
						});
					};
				});

				resetValiCodeImg.click(function(){//点击图片重新获取验证码
					userDialog.refreshCaptha(resetValiCodeImg);
				});

				$('#resetAccount,#resetValidCodePic').blur(function(){//检验发送验证码按钮是否为disabled
					var resetAccountNode = $('#resetAccount');
					var resetValidCodePicNode = $('#resetValidCodePic');
					var Btn = $('#resetValiCodeBtn');
					var account = resetAccountNode.val();
					var resetValidCodePic = resetValidCodePicNode.val();
					var accountReg = resetAccountNode.attr('data-validation-regexp');
					var resetValidCodePicReg = resetValidCodePicNode.attr('data-validation-regexp');

					if (Btn.hasClass('isSending')) {
						return;
					};

					if (account.match(accountReg) && resetValidCodePic.match(resetValidCodePicReg)) {
						Btn.removeClass('disabled');
					}else{
						Btn.addClass('disabled');
					}
				});

				$('#resetValiCodeBtn').click(function(){//发送邮件或手机验证码
					var accountNode = $('#resetAccount');
					var resetValidCodePicNode = $('#resetValidCodePic');
					var Btn = $('#resetValiCodeBtn');
					var account = accountNode.val();
					var resetValidCodePic = resetValidCodePicNode.val();
						if (Btn.hasClass('disabled')) {
							return;
						};

						var data = {
							account:account,
							validCodePic:resetValidCodePic
						}

						Btn.addClass('disabled').addClass('isSending');

						$.ajax({
							url:Api.sendSecurityCode,
							data:data,
							contentType:'application/x-www-form-urlencoded',
							success:function(res){
								if (res.state) {
									userDialog.wait = comConf.captchaTime;
									userDialog.get_code_time(Btn);
								}else{
									userDialog.refreshCaptha(resetValiCodeImg);
									resetValidCodePicNode.val('');
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
			
			_this.resetPassDialog.open();*/
		},
		bindPhone:function(){//绑定手机号
			var _this = this;
			var bindPhoneForm = $('#bindPhoneForm');
			var bindPhoneBtn = $('#bindPhoneBtn');
			var bindPhoneValiCodeImg = $('#bindPhoneValiCodeImg');
				userDialog.refreshCaptha(bindPhoneValiCodeImg);
				bindPhoneForm.trigger('reset');//每次打开前重置表单

			if (!_this.bindPhoneDialog) {
				_this.bindPhoneDialog = new DIALOG({
					title: '绑定/修改手机号',
		        	content: $('#bindPhoneDialog'),
		        	width: '381px',
		        	className: 'forgetDialog'
				});
				$.validate();

				bindPhoneForm.submit(function(e){//提交重置密码表单
					e.preventDefault();
					if (bindPhoneBtn.hasClass('disabled')) {
						return;
					};
					if (bindPhoneForm.isValid()) {
						var phoneNumber = $.trim($('#bindPhone').val());
						var securityCode = $.trim($('#bindPhoneValiCode').val());
						var data = {
							phoneNumber:phoneNumber,
							securityCode:securityCode,
						}
						bindPhoneBtn.addClass('disabled');

						$.ajax({
							url:Api.bindPhone,
							contentType:'application/x-www-form-urlencoded',
							data:data,
							success:function(res){
								bindPhoneBtn.removeClass('disabled');
								if (res.state) {
									Tip('手机号绑定成功！','success',comConf.tipTime);
									_this.bindPhoneDialog.close();
								}else{
									var msg = res.msg && res.msg != "" ? res.msg : "手机号绑定失败！";
									Tip(msg,'error',comConf.tipTime);
								}
							},
							error:function(){
								bindPhoneBtn.removeClass('disabled');
							}
						});
					};
				});

				bindPhoneValiCodeImg.click(function(){//点击图片重新获取验证码
					userDialog.refreshCaptha(bindPhoneValiCodeImg);
				});

				$('#bindPhone,#bindPhoneValidCodePic').blur(function(){//检验发送验证码按钮是否为disabled
					var bindPhoneNode = $('#bindPhone');
					var bindPhoneValidCodePicNode = $('#bindPhoneValidCodePic');
					var Btn = $('#bindPhoneValiCodeBtn');
					var phone = bindPhoneNode.val();
					var phoneValidCodePic = bindPhoneValidCodePicNode.val();
					var bindPhoneReg = bindPhoneNode.attr('data-validation-regexp');
					var bindPhoneValidCodePicReg = bindPhoneValidCodePicNode.attr('data-validation-regexp');

					if (Btn.hasClass('isSending')) {
						return;
					};

					if (phone.match(bindPhoneReg) && phoneValidCodePic.match(bindPhoneValidCodePicReg)) {
						Btn.removeClass('disabled');
					}else{
						Btn.addClass('disabled');
					}
				});

				$('#bindPhoneValiCodeBtn').click(function(){//发送邮件或手机验证码
					var accountNode = $('#bindPhone');
					var ValidCodePicNode = $('#bindPhoneValidCodePic');
					var Btn = $('#bindPhoneValiCodeBtn');
					var account = accountNode.val();
					var ValidCodePic = ValidCodePicNode.val();
						if (Btn.hasClass('disabled')) {
							return;
						};

						var data = {
							account:account,
							validCodePic:ValidCodePic
						}

						Btn.addClass('disabled').addClass('isSending');

						$.ajax({
							url:Api.sendSecurityCode,
							data:data,
							contentType:'application/x-www-form-urlencoded',
							success:function(res){
								if (res.state) {
									userDialog.wait = comConf.captchaTime;
									userDialog.get_code_time(Btn);
								}else{
									userDialog.refreshCaptha(bindPhoneValiCodeImg);
									ValidCodePicNode.val('');
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
			
			_this.bindPhoneDialog.open();
		},
		bindMail:function(){//绑定邮箱
			var _this = this;
			var bindMailForm = $('#bindMailForm');
			var bindMailBtn = $('#bindMailBtn');
			var bindMailValiCodeImg = $('#bindMailValiCodeImg');
				userDialog.refreshCaptha(bindMailValiCodeImg);
				bindMailForm.trigger('reset');//每次打开前重置表单

			if (!_this.bindMailDialog) {
				_this.bindMailDialog = new DIALOG({
					title: '绑定/修改邮箱',
		        	content: $('#bindMailDialog'),
		        	width: '381px',
		        	className: 'forgetDialog'
				});
				$.validate();

				bindMailForm.submit(function(e){//提交重置密码表单
					e.preventDefault();
					if (bindMailBtn.hasClass('disabled')) {
						return;
					};
					if (bindMailForm.isValid()) {
						var emailAddress = $.trim($('#bindMail').val());
						var securityCode = $.trim($('#bindMailValiCode').val());
						var data = {
							emailAddress:emailAddress,
							securityCode:securityCode
						}
						bindMailBtn.addClass('disabled');

						$.ajax({
							url:Api.bindMail,
							data:data,
							contentType:'application/x-www-form-urlencoded',
							success:function(res){
								bindMailBtn.removeClass('disabled');
								if (res.state) {
									Tip('邮箱绑定成功！','success',comConf.tipTime);
									_this.bindMailDialog.close();
								}else{
									var msg = res.msg && res.msg != "" ? res.msg : "邮箱绑定失败！";
									Tip(msg,'error',comConf.tipTime);
								}
							},
							error:function(){
								bindMailBtn.removeClass('disabled');
							}
						});
					};
				});

				bindMailValiCodeImg.click(function(){//点击图片重新获取验证码
					userDialog.refreshCaptha(bindMailValiCodeImg);
				});

				$('#bindMailBtn,#bindMailValidCodePic').blur(function(){//检验发送验证码按钮是否为disabled
					var bindMailNode = $('#bindMail');
					var bindMailValidCodePicNode = $('#bindMailValidCodePic');
					var Btn = $('#bindMailValiCodeBtn');
					var bindMail = bindMailNode.val();
					var bindMailValidCodePic = bindMailValidCodePicNode.val();
					var bindMailReg = bindMailNode.attr('data-validation-regexp');
					var bindMailValidCodePicReg = bindMailValidCodePicNode.attr('data-validation-regexp');

					if (Btn.hasClass('isSending')) {
						return;
					};

					if (bindMail.match(bindMailReg) && bindMailValidCodePic.match(bindMailValidCodePicReg)) {
						Btn.removeClass('disabled');
					}else{
						Btn.addClass('disabled');
					}
				});

				$('#bindMailValiCodeBtn').click(function(){//发送邮件或手机验证码
					var bindMailNode = $('#bindMail');
					var bindMailValidCodePicNode = $('#bindMailValidCodePic');
					var Btn = $('#bindMailValiCodeBtn');
					var account = bindMailNode.val();
					var bindMailValidCodePic = bindMailValidCodePicNode.val();
						if (Btn.hasClass('disabled')) {
							return;
						};

						var data = {
							account:account,
							validCodePic:bindMailValidCodePic
						}

						Btn.addClass('disabled').addClass('isSending');

						$.ajax({
							url:Api.sendSecurityCode,
							data:data,
							contentType:'application/x-www-form-urlencoded',
							success:function(res){
								if (res.state) {
									userDialog.wait = comConf.captchaTime;
									userDialog.get_code_time(Btn);
								}else{
									userDialog.refreshCaptha(bindMailValiCodeImg);
									bindMailValidCodePicNode.val('');
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
			
			_this.bindMailDialog.open();
		}

	}

	security.init();
})();
(function(){
	var ucenter = {
		$content:$('.personalContent'),
		init:function(){
            this.getUserDeatail();
            this.bindEvent();
            this.areaInfo = this.getAreaInfo();//初始化的时候先去请求地区信息
		},
        getUserDeatail:function(){
            this.userInfo = store.get('userInfo');
            if (this.userInfo) {
                var data = this.userInfo;
                var bt = baidu.template;
                var html = baidu.template('lookupUserInfo',data);
                this.$content.html(html);
            }
        },
		createDatePicker:function(){//实例化日历插件
			$('.birthday').datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose:true,
                minView:2
            });
		},
        bindEvent:function(){//绑定事件
            var _this = this;
            this.$content.on('click','.mh-photo',function(e){//利用事件代理，绑定显示图片上传弹出框
                e.preventDefault();
                _this.showImgDialog();
            });

            this.$content.on('click','.j_modify_userinfo',function(e){//绑定显示修改页面
                e.preventDefault();
                _this.showEditUserInfo(e);
            });

            this.$content.on('click','.j_save_userinfo',function(e){//保存用户信息
                e.preventDefault();
                _this.saveUserInfo(e);
            });

            this.$content.on('change','#areaNode',function(e){//地区改变
                e.preventDefault();
                _this.changeArea(e);
            });

            this.$content.on('change','#schoolNode',function(e){//学校改变
                e.preventDefault();
                _this.changeSchool(e);
            });

            this.$content.on('change','#gradeNode',function(e){//年级改变
                e.preventDefault();
                _this.changeGrade(e);
            });

        },
        changeArea:function(){//地区改变，获取学校，设置学校为默认，清空年级和班级
            var areaNode = $('#areaNode');
            var schoolNode = $('#schoolNode');
            var gradeNode = $('#gradeNode');
            var classNode = $('#classNode');
            var areaId = areaNode.val();
            var schoolHtml = '';
                if (!areaId || areaId == '') {
                     schoolHtml = '<option value="">请选择学校</option>'
                }else{
                    var schools = this.getSchools(areaId);
                        if (schools && schools.length > 0) {
                            schoolHtml = '<option value="">请选择学校</option>';

                            for(var i = 0;i<schools.length ;i++){
                                schoolHtml += '<option value="'+schools[i].schoolId+'">'+schools[i].schoolName+'</option>';
                            }
                        }else{
                            schoolHtml = '<option value="">请选择学校</option>'
                        }
                }
                schoolNode.html(schoolHtml);
                gradeNode.html('<option value="">请选择年级</option>');
                classNode.html('<option value="">请选择班级</option>');
        },
        changeSchool:function(){//学校改变，获取年级，设置年级为默认，清空班级
            var areaNode = $('#areaNode');
            var schoolNode = $('#schoolNode');
            var gradeNode = $('#gradeNode');
            var classNode = $('#classNode');
            var areaId = areaNode.val();
            var schoolId = schoolNode.val();
            var gardeHtml = '';
                if (!schoolId || schoolId == '') {
                     gardeHtml = '<option value="">请选择年级</option>'
                }else{
                    if (areaId && areaId != '' && schoolId && schoolId != '') {
                        var gardes = this.getGrades(areaId,schoolId);
                        if (gardes && gardes.length > 0) {
                            gardeHtml = '<option value="">请选择年级</option>';

                            for(var i = 0;i<gardes.length ;i++){
                                gardeHtml += '<option value="'+gardes[i].gradeId+'">'+gardes[i].gradeName+'</option>';
                            }
                        }else{
                            gardeHtml = '<option value="">请选择年级</option>'
                        }
                    }
                    
                }
                gradeNode.html(gardeHtml);
                classNode.html('<option value="">请选择班级</option>');
        },
        changeGrade:function(){//年级改变，获取班级，设置班级为默认
            var areaNode = $('#areaNode');
            var schoolNode = $('#schoolNode');
            var gradeNode = $('#gradeNode');
            var classNode = $('#classNode');
            var areaId = areaNode.val();
            var schoolId = schoolNode.val();
            var gradeId = gradeNode.val();
            var classHtml = '';
                if (!gradeId || gradeId == '') {
                    classHtml = '<option value="">请选择班级</option>'
                }else{

                    if (areaId && areaId != '' && schoolId && schoolId != '' && gradeId && gradeId !='') {
                        var classes = this.getClasss(areaId,schoolId,gradeId);
                        if (classes && classes.length > 0) {
                            classHtml = '<option value="">请选择班级</option>';

                            for(var i = 0;i<classes.length ;i++){
                                classHtml += '<option value="'+classes[i].classId+'">'+classes[i].className+'</option>';
                            }
                        }else{
                            classHtml = '<option value="">请选择班级</option>'
                        }
                    }
                    
                }
                classNode.html(classHtml);
        },
        showEditUserInfo:function(e){//渲染修改页面
            e.preventDefault();
            var bt = baidu.template;
            if (!this.areaInfo) {
                this.areaInfo = this.getAreaInfo();
            }
            this.userInfo['areaInfo'] = this.areaInfo;//传入地区信息
            this.userInfo['schools'] = null;
            this.userInfo['grades'] = null;
            this.userInfo['classes'] = null;

            this.renderEditUserInfo(this.userInfo);//预先渲染一次，放置后面请求过慢

            try{
                if (this.userInfo.areaId) {//如果用户保存了地区信息，则请求当前地区下的学校
                    var schools = this.getSchools(this.userInfo.areaId);
                    this.userInfo['schools'] = schools;//传入学校信息

                    if (this.userInfo.schoolId) {//如果用户选择了学校信息，则请求该学校有哪些年级
                        var grades = this.getGrades(this.userInfo.areaId,this.userInfo.schoolId);
                        this.userInfo['grades'] = grades;//传入年级信息
                    }

                    if (this.userInfo.gradeId) {//如果用户选择了年级信息，则请求该年级有哪些班级
                        var classes = this.getClasss(this.userInfo.areaId,this.userInfo.schoolId,this.userInfo.gradeId);
                        this.userInfo['classes'] = classes;//传入班级信息
                    }

                }
                
            }catch(e){}
            
            this.renderEditUserInfo(this.userInfo);//获取到学校等信息后重新渲染
        },
        saveUserInfo:function(){//保存用户信息
            var Btn = $('.j_save_userinfo');
                if (Btn.hasClass('disabled')) {
                    return;
                }
            var form = $('#editForm');
            var nickNameNode = $('#nickName');
            var nickName = $.trim(nickNameNode.val());
            var avatar = $('#avatar').val();
            var signature = $('#signature').val();
            var trueName = $('#trueName').val();
            var birthday = $('#birthday').val();
                if(birthday && birthday != ""){
                    birthday = (new Date(birthday)).getTime();
                }
            var gender = $('.j_sex:checked').val();
            var guardianName = $('#guardianName').val();
            var guardianSocialId = $('#guardianSocialId').val();
            var guardianRelationshipToUser = $.trim($('#guardianRelationshipToUser').val());
            var address = $.trim($('#address').val());
            var areaNode = $('#areaNode');
            var schoolNode = $('#schoolNode');
            var gradeNode = $('#gradeNode');
            var classNode = $('#classNode');
            var areaVal = areaNode.val();
            var schoolVal = schoolNode.val();
            var gradeVal = gradeNode.val();
            var classVal = classNode.val();
                if (!form.isValid()) {
                    return;
                }

                if (!nickName || nickName == '') {
                    Tip('昵称不能为空！','warning',comConf.tipTime);
                    return;
                }

                if(areaVal == "" || classVal =="" || gradeVal == "" || schoolVal == ""){
                    if (!(classVal == "" &&  gradeVal == "" && schoolVal == "" && areaVal == "")){
                        Tip('学校、年级、班级必须同时选择，不能只选择其中部分！','warning',comConf.tipTime);
                        return;
                    }
                }

            var data = {
                    "nickName":nickName,
                    "avatar":avatar,
                    "signature":signature,
                    "trueName":trueName,
                    "birthday":birthday,
                    "gender":gender,
                    "guardianName":guardianName,
                    "guardianSocialId":guardianSocialId,
                    "guardianRelationshipToUser":guardianRelationshipToUser,
                    "address":address,
                    "classId":classVal
                }

                Btn.addClass('disabled');

                $.ajax({
                    url:Api.saveUserInfo,
                    data:JSON.stringify(data),
                    success:function(res){
                        
                        if (res.state) {
                            Tip('用户信息保存成功!','success',comConf.shortTipTime);
                            setTimeout(function(){
                                Btn.removeClass('disabled');
                               // window.location.reload();
                            },comConf.shortTipTime);
                        }else{
                            Btn.removeClass('disabled');
                            var msg = res.msg && res.msg.length > 0? res.msg : '用户信息保存失败!';
                            Tip(msg,'error',comConf.shortTipTime);
                        }
                    },
                    error:function(){
                        Btn.removeClass('disabled');
                    }
                });

        },
        renderEditUserInfo:function(data){//渲染编辑用户信息页面
            html = baidu.template('editUserInfo',data);//获取到学校等信息后重新渲染
            this.$content.html(html);
            this.createDatePicker();
            $.validate();
            $.placeholder.ini();
        },
        getAreaInfo:function(){//获取区域信息
            var areaList = null;
            $.ajax({
                url:Api.getAreaInfo,
                async: false,//同步请求
                success:function(res){
                    if (res.state) {
                        areaList =  res.areaList;
                    }
                }
            });

            return areaList;
        },
        getSchools:function(areaId){//获取学校信息
            var postData = {
                    areaId:areaId
                    }
            var schools = null;
                $.ajax({
                    url:Api.getSchool,
                    data:postData,
                    contentType:'application/x-www-form-urlencoded',
                    async: false,//同步请求
                    success:function(res){
                        if (res.state) {
                            schools = res.schoolList;
                        }
                    }
                });
            return schools;
        },
        getGrades:function(areaId,schoolId){//获取年级信息
            var postData = {
                    areaId:areaId,
                    schoolId:schoolId
                    }
            var gardes = null;
                $.ajax({
                    url:Api.getGrade,
                    data:postData,
                    contentType:'application/x-www-form-urlencoded',
                    async: false,//同步请求
                    success:function(res){
                        if (res.state) {
                            gardes = res.gradeList;
                        }
                    }
                });
            return gardes;
        },
        getClasss:function(areaId,schoolId,gradeId){//获取班级信息
            var postData = {
                    "gradeId":gradeId,
                    "areaId":areaId,
                    "schoolId":schoolId
                    }
            var classes = null;
                $.ajax({
                    url:Api.getClass,
                    data:postData,
                    contentType:'application/x-www-form-urlencoded',
                    async: false,//同步请求
                    success:function(res){
                        if (res.state) {
                            classes = res.classList;
                        }
                    }
                });
            return classes;
        },
		creatImageClipper:function(){//实例化上传图片的插件
            var _this = this;
            var imageClipper = new ImageClipper({
                            container: $('.dialog-wrapper .imagewrapper')[0], //上传界面的容器，原生dom
                            width: '410px', //flash的宽度
                            height: '300px', //flash的高度
                            ratio: 1, //长宽比。默认为1。若为浮点数则会根据此比例裁剪图片。若不需要按比例裁剪，请设置为0
                            flashUrl: __uri('/src/js/lib/imageClipper.swf?v=0728'), //上传flash的地址
                            resourceUrl: __uri('../../images/imageClipper'), //flash包含的按钮、光标等静态文件的放置路径
                            uploadUrl: Api.uploadPhoto, //上传路径
                            uploadSize: '130*130', //上传到服务器的图片的尺寸，若不指定，将直接上传裁剪后的图片区域
                            file: 'userphoto', //上传的字段名，默认为file
                            isPreview: true, //是否显示预览图
                            previewSize: '85*85', //显示哪些尺寸的预览图
                            defaultPreview: '' //默认显示的预览图
                        });
                this.imageDialog = new DIALOG({
                    title: '上传图片',
                    width:'450px',
                    content: $('.dialog-wrapper'),
                });

            $('.j_UpLoadBtn').click(function(e){
                imageClipper.submit();
            });

            imageClipper.bind('complete',function(evt, response){
                //console.log('上传成功');
                //console.log('上传成功，服务器返回内容：', response);
                if (response.response.state) {
                    var url = response.response.avatarPath;
                    $('.photo,.head-photo,.login-after .img').attr('src',url);
                    $('.photo-input').val(url);
                    _this.imageDialog.close();
                    Tip("修改头像成功！",'success',comConf.tipTime);
                }else{
                    var msg = response.response.message ?response.response.message:"上传失败";
                    Tip(msg,'error',comConf.tipTime);
                }

            });

            imageClipper.bind('error',function(evt, data){
                //以下这段应放在成功部分
                var msg = data.errorMessage?data.errorMessage:"图片上传失败!";
                Tip(msg,'error',comConf.tipTime);

            });
        },
        showImgDialog:function(){//显示上传图片弹出框
            if (!this.imageDialog) {
                this.creatImageClipper();
            }
            this.imageDialog.open();
        }
	}
	ucenter.init();
})();
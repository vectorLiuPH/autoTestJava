/**
 * author:chenjiajun
 * description:
 *  对用户信息侧边栏的统一处理
 *  (1)判断侧边栏哪部分该展开，该对那个li设置active,此实现是通过页面名称判断的，因此需要判断页面名称，新加页面需增加此配置
 *  (2)通过在localStorage中获取用户信息，然后设置用户头像、昵称、个人信息
 *  (3)判断是否登录，未登录弹出弹出框
 */

(function(){
    var sideBar = {
        $menuUl:$('.ul-menu'),
        $content:$('.personalContent'),
        init:function(){
            this.setMenuActive();
            this.bindEvent();
            this.setUserInfo();
        },
        bindEvent:function(){
            var _this = this;
            this.$menuUl.on('click','.li-menu',function(e){
                _this.toggleMenu(e);
            });
        },
        toggleMenu:function(e){
            this.$menuUl.find('.li-menu').removeClass('active');
            var target =  $(e.currentTarget);
                target.addClass('active').children('ul').toggle(500);
        },
        setMenuActive:function(){
            var pathname = window.location.pathname;
            var page = pathname.substring(pathname.lastIndexOf('/')+1);
            var $myCenter = $('#myCenter');
                if (page == 'ucenter.html') {
                    $myCenter.addClass('active').children('ul').show();
                    $('#ucenter').addClass('active');
                }else if(page == 'security.html'){
                    $myCenter.addClass('active').children('ul').show();
                    $('#security').addClass('active');
                }
        },
        setUserInfo:function(){
            var userInfo = store.get('userInfo');
                if (userInfo) {
                    try{
                        $('.head-photo').attr('src',userInfo.avatar);
                        $('.personalName').html(userInfo.nickName);
                        $('.personalSaying').html(userInfo.signature);
                    }catch(e){

                    }
                }else{
                    this.$content.html('<p class="no-login"><span class="icon-attention-circled"></span>您还未登录，该部分信息需登录后才能操作！</p>');
                    userDialog.showLoginDialog(function(){
                        window.location.reload();
                    });
                }
        }
    }
    sideBar.init();
})();


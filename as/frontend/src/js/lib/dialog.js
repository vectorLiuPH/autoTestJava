var DIALOG = null;
;(function(){
    /**
     * @Class Dialog
     * @Desc 对话框模块
     * 可以用j_dlg_close来标记关闭按钮
     * ui-dialog-bd代表容器主体，具有20px的margin
     * ui-dialog-btn代表btn的容器，具有20px的padding和灰色背景。这个容器里的所有.button类都有右边距15px
     * */
    function Dialog(options){
        this._options = $.extend(true, {
            title: '',
            content: '',
            beforeClose: null,
            closeBtn: true,
            className: '',
            cache: true, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
            width: '40%' //窗口宽度，默认为40%
        }, options);

        this._init();
    }

    $.extend(Dialog.prototype, {
        _init: function(){
            this._build();
            this._bindEvent();
        },
        /**
         * 创建对话框html
         * */
        _build: function(){
            var options = this._options;
            var style = 'width: ' + options.width;
            var html = '<div class="reveal-modal ui-dialog ' + options.className + '" style="' + style + '">' +
                (options.title ? '<div class="ui-dialog-tit yahei">' + options.title + '</div>' : '');
            if(options.closeBtn){
                html += '<a class="reveal-modal-close j_dlg_close">&#215;</a>' +
                    '</div>';
            }
            this.$root = $(html).appendTo(document.body);
            this.$root.append($(options.content || ''));
            this.mask = $('<div class="reveal-modal-bg"></div>').appendTo(document.body);
        },
        _bindEvent: function(){
            var _this = this;
            var options = this._options;
            this.$root.on('click', '.j_dlg_close', function(e){
                e.preventDefault();
                //beforeClose执行结果为false,说明关闭时间被阻止了
                if(options.beforeClose && options.beforeClose.apply(_this) === false){
                    return false;
                }
                _this.close();
                if(options.onclose){
                    options.onclose.apply(this);
                }
            }).on('click', '.j_dlg_ok', function(){

            });
        },
        /**
         * 打开对话框
         * */
        open: function(){
            this.$root.css({
                'margin-left': -(this.$root.width() / 2)
            });
            this.$root.animate({
                top:'100px'
            },500);
            this.mask.show();
        },
        /**
         * 关闭对话框
         * */
        close: function(){
            this.$root.animate({
                top:'-1000px'
            },500);
            if(this._options.cache === false){ //设置不缓存
                this.$root.remove();
                this.mask.remove();
            }else{
                this.mask.hide();
            }

        },
        /**
         * 设置标题
         * */
        setTitle: function(title){
            this.$root.find('.ui-dialog-tit').html(title);
        },
        /**
         * 设置内容
         * */
        setContent: function(content){
            this.$root.find('.ui-dialog-bd').html(content);
        }
    });

    window.confirm = function(message, ok, cancel){
        var content = '<div class="ui-dialog-bd">' + message + '</div>';
        content += '<div class="dialog-footer"><button class="btn j_ok" href="#">确定</button><button class="btn j_cancel" href="#">取消</button></div>';
        var confirmDialog = new DIALOG({
            className: 'ui-dialog-confirm',
            width: '450px',
            content: content,
            cache: false,
            closeBtn: false
        });
        confirmDialog.$root.on('click', '.btn', function(e){
            e.preventDefault();
            var $target = $(this);
            if($target.hasClass('j_ok')){
                ok && ok.call(this);
            }else{
                cancel && cancel.call(this);
            }
            confirmDialog.close();
        });
        confirmDialog.open();
    }

    DIALOG = Dialog;
})();
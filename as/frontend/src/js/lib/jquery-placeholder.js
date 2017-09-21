/**
 * Created with JetBrains WebStorm.
 * Author: Shiming
 * Date: 2013-03-14
 * Time: 23:38:23
 * version: 0.1.3
 * create this jQuery plugin for ie6,7,8 to fix placeholder attribute
 * 使用方法：
 * 在要用到的页面js中写
 *  jQuery(function($){$.placeholder.ini();});
 *  或者$.placeholder.ini();
 */
(function($){
    var Placeholder,
        inputHolder = 'placeholder' in document.createElement('input'),
        textareaHolder = 'placeholder' in document.createElement('textarea');
    Placeholder = {
        ini:function () {
            if (inputHolder && textareaHolder) {
                return false;
            }
            this.el = $(':text[placeholder],:password[placeholder],textarea[placeholder]');
            this.setHolders();
        },
        setHolders: function(obj){
            var el = obj ? $(obj) : this.el;
            if (el && el.val() == '') {
                var self = this;
                el.each(function() {
                    var input = $(this);
                    var parent = input.parent();
                    var parentPosition = parent.css('position');
                    parent.css('position', parentPosition || 'relative');

                    var span = $('<label />');
                    span.text( input.attr('placeholder') );
                    span.css({
                        color: '#999',
                        fontSize: input.css('fontSize'),
                        fontFamily: input.css('fontFamily'),
                        fontWeight: input.css('fontWeight'),
                        position: 'absolute',
                        top: input.position().top + parseInt(input.css('margin-top')) + parseInt(input.css('padding-top')),
                        left: input.position().left + parseInt(input.css('margin-left')) + parseInt(input.css('padding-left')),
                        width:input.width(),
                        height: input.height(),
                        lineHeight: input.height() + 'px',
                        textIndent: input.css('textIndent'),
                        paddingLeft: input.css('borderLeftWidth'),
                        paddingTop: input.css('borderTopWidth'),
                        paddingRight: input.css('borderRightWidth'),
                        paddingBottom: input.css('borderBottomWidth'),
                        display: 'inline',
                        overflow: 'hidden'
                    });
                    if (!input.attr('id')) {
                        input.attr('id', self.guid());
                    }
                    span.attr('for', input.attr('id'));
                    input.after(span);
                    self.setListen(this, span);
                })
            }
        },
        setListen : function(el, holder) {
            if (!inputHolder || !textareaHolder) {
                el = $(el);
                el.bind('keydown', function(e){
                        if (el.val() != '') {
                            holder.hide(0);
                        } else if ( /[a-zA-Z0-9`~!@#\$%\^&\*\(\)_+-=\[\]\{\};:'"\|\\,.\/\?<>]/.test(String.fromCharCode(e.keyCode)) ) {
                            holder.hide(0);
                        } else {
                            holder.show(0);
                        }
                });
                el.bind('keyup', function(e){
                        if (el.val() != '') {
                            holder.hide(0);
                        } else {
                            holder.show(0);
                        }

                });
                el.bind('blur', function(e){
                    if (el.val() != '') {
                        holder.hide(0);
                    } else {
                        holder.show(0);
                    }

                })
            }
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16| 0,
                    v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }).toUpperCase();
        }
    }

    $.fn.placeholder = function () {
        if (inputHolder && textareaHolder) {
            return this;
        }
        Placeholder.setListen(this);
        return this;
    }

    $.placeholder = Placeholder;

})(jQuery);

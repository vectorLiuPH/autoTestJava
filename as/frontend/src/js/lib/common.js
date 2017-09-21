var COM = {};
(function(){
    //实现比较，可以传给arr.sort(COM.compare(a,b))函数进行排序
    COM.compare = function (order,sortBy){
            var ordAlpah = (order == 'asc') ? '>' : '<' ;
            return new Function('a','b','return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
        }

    //截取规定长度的字符，在后面添加...
    COM.displayPart = function(data,maxLen){
        displayLength = maxLen || 100;
        if(!data){
            return "";
        }
        data = data.replace(/(\s*)/g,"");
        var result ="";
        var count = 0;

        for (var i = 0; i < displayLength; i++) {
            var _char = data.charAt(i);
            if (count >= displayLength) {
              break;
            }
            if (/[^x00-xff]/.test(_char)) {
              count++; //双字节字符，//[u4e00-u9fa5]中文
            }

            result += _char;
            count++;
        }
        if (result.length < data.length) {
            result += "...";
        }

        return result;
    }

    //获取地址中的参数
    COM.GetRequest = function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    COM.formateDate = function(second){//匹配时间
        var date = new Date(second);
        var year = date.getFullYear();
        var month = date.getMonth()+1;//获取当前月份的日期
        if(month<10){
            month = "0"+month;
        }
        var day = date.getDate();
        if(day<10){
            day = "0"+day;
        }

        return year+"-"+month+"-"+day;
    }

    COM.formateDateTime = function(second){//匹配时间
        var date = new Date(second);
        var year = date.getFullYear();
        var month = date.getMonth()+1;//获取当前月份的日期
        if(month<10){
            month = "0"+month;
        }
        var day = date.getDate();
        if(day<10){
            day = "0"+day;
        }
        var hour = date.getHours();
        if(hour <10){
            hour = "0"+hour;
        }
        var minute = date.getMinutes();
        if(minute <10){
            minute = "0"+minute;
        }
        var second = date.getSeconds();
        if(second <10){
            second = "0"+second;
        }
        return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    }



    //ajax请求的通用处理
    $.ajaxSetup({
        /*cache: false,*/
        dataType: 'json',
        type: "post",
        contentType:"application/json",
/*        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },*/
        // @tofishes, add unok status tip
        statusCode: {
            /*404:function(){
                window.location.href="/404.html";
            },
            500: function() {
                window.location.href="/404.html";
            },
            503: function() {
                window.location.href="/404.html";
            },
            504: function() {
                window.location.href="/404.html";
            },
            403: function() {
                window.location.href="/404.html";
            }*/
        }
    });


    /* 防止ajax重复请求过滤器 */
    // @tofishes
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        var args = originalOptions;
        var _url = args.url || location.href;
        var data = args.data || {};
        //参数名+url做唯一判定
        var xhrId = [_url];
        for (var key in data) {
            xhrId.push(key);
        }
        xhrId = xhrId.join('');

        // var cacheXhr = window[xhrId];
        // if (cacheXhr && cacheXhr.readyState != 4) {
        //     cacheXhr.abort();
        // }
        // window[xhrId] = jqXHR;
       /* if (options.url.search(/^http|^api/) === -1) {
            options.url = 'api/' + options.url;
            options.url = options.url;
            //return false;
        }*/

        function reportErr(status) {
            if (document.location.host != 'www.kmsocial.cn') {
                return;
            }
            $.get('/kk.php', {
                f: options.url,
                requestStatus: status
            });
        }

        options.success = function() {
            if (!arguments[0] && options.url.indexOf('/kk.php') == -1) {
                reportErr('closed');
                return;
            }
            // @tofishes 暂时对 -99 需要登录做个处理
            // 从isOK方法中移出到这里，防止被customErr过滤掉
            var data = arguments[0];
            if (!options.customErr) { //如果自定义错误提示为true，跳过默认拦截
                if (data && !data.state) {
                    msg = data.msg || '未知错误！';
                    // sysTip.auto(msg, 2000);
                    //return false;
                }
            }

            var isShowLogin = true;

            if (originalOptions.opt && !originalOptions.opt.loginDialog) {
                isShowLogin = false;
            }

            if (isShowLogin && data && !data.state && data.code === 'err.api.not_login') {              
                store.remove("userInfo");
                userDialog.showLoginDialog();
                originalOptions.success && originalOptions.success.apply(options.context || this, arguments);
                return;
            }

            originalOptions.success && originalOptions.success.apply(options.context || this, arguments);
        };
        options.error = function(jqXHR, textStatus, errorThrown) {
            reportErr(textStatus);
        };
    });
})();

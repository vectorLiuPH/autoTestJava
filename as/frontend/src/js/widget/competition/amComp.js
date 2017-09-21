//定义全局变量，存放当前的赛段，赛区的id,显示的年级
var global_competitionStageId = null;
var global_competitionAreaId = null;
var global_competitionGradeId = null;
//首次加载页面时，进行的AJAX请求和渲染
(function(){
    $.ajax({
        url:AmApi.getHomepageInfo,
        type:"GET",
        dataType: "json",
        complete:function(res,textStatus,jqXHR){ //parseerror的情况，error的状态不能捕获
            if(textStatus != 'success') {
                alert('请求首页信息时，发生'+textStatus);
            }
        },
        error:function(){
            alert('请求首页信息失败');
        },
        success:function(res){

//赋值给全局变量,供其他js文件使用
            global_competitionStageId = res.data.phaseId;
            global_competitionAreaId = res.data.raceSections[0].sectionId;
            global_competitionGradeId = res.data.raceGroups[0].groupId;
//---------------------------------倒计时的函数-------------------------------------------
               // 倒计时的函数
            function GetRTime(){
                var NowTime = new Date();
                var EndTime = new Date(res.data.endTime); //后台传过来的时间
                var t =EndTime.getTime() - NowTime.getTime();
                var day=Math.floor(t/1000/60/60/24);
                var hour=Math.floor(t/1000/60/60%24);
                var minute=Math.floor(t/1000/60%60);
                var second=Math.floor(t/1000%60);

                $(".day0").html("<span>"+parseInt(day/10)+"</span>");
                $(".day1").html("<span>"+(day%10)+"</span>");
                $(".hour0").html("<span>"+parseInt(hour/10)+"</span>");
                $(".hour1").html("<span>"+(hour%10)+"</span>");
                $(".minute0").html("<span>"+parseInt(minute/10)+"</span>");
                $(".minute1").html("<span>"+(minute%10)+"</span>");
                $(".second0").html("<span>"+parseInt(second/10)+"</span>");
                $(".second1").html("<span>"+(second%10)+"</span>");
            }
            setInterval(GetRTime,500);

//---------------------------------生成赛区的下拉框------------------------------------------------
            //单独从后台返回的数据中，取出下拉框需要的数据
            var infoForDropbox = {}
            infoForDropbox['competitionArea'] = res.data.raceSections;

            var bt=baidu.template;
            var html1=bt('dropBox_template',infoForDropbox);
            $('.comp-info').html(html1);

//--------------------------------------根据赛区的年级数生成tab标签-------------------------------------------------------------------
            //有的地区可能有3个标签，有的有4个
            var infoForGradeTab = {}
            infoForGradeTab['competitionGrade']=res.data.raceGroups;

            var bt = baidu.template;
            var html1_1 = bt('tabGrade_template',infoForGradeTab);
            $('ul.grade-ul').html(html1_1);
            $('li.grade-li').addClass('hide-grade');
            $('li.grade-li:first-child').removeClass('hide-grade').addClass('active-grade');


//------------------------------------用赛区的id去获取大赛的动态信息-也就是首页左边的部分（博文）--------------------------------------------
            var areaId = res.data.raceSections[0].sectionId;
            var number = 10; //默认显示10条信息
            var areaName = res.data.raceSections[0].sectionName;

            var data = {
                "sectionId":areaId,
                "number":number
            }

            $.ajax({
                    url:AmApi.getDynamicInfo,
                    data:data,
                    contentType:'application/x-www-form-urlencoded',
                    complete:function(res, textStatus, jqXHR){
                        if(textStatus != 'success'){
                            alert('请求大赛动态信息时，发生'+textStatus);
                        }
                    },
                    error:function(){
                        alert('请求大赛动态信息失败');
                    },
                    success:function(res){
                        //用获取的结果渲染页面
                        //从后台返回的数据中，提取需要的数据
                        var infoForDynamicArticle = {}
                        infoForDynamicArticle['areaName']=areaName;
                        infoForDynamicArticle['data']=res.data;
                        infoForDynamicArticle['readMore']='/competition/intro.html';

                        var bt = baidu.template;
                        var html2=bt('dynamicArticle_template',infoForDynamicArticle);
                        $('li.aboutReading').html(html2);
                    }
                });
//--------------------------------------获取某地区某赛段在某个赛区top10信息------------------------------------------
            var sendInfoTopTen = {};
            sendInfoTopTen['phaseId']=res.data.phaseId;
            sendInfoTopTen['groupId']=res.data.raceGroups[0].groupId;
            sendInfoTopTen['sectionId']=res.data.raceSections[0].sectionId;

            $.ajax({
                //url:AmApi.getTopTen,该接口暂时没有开放
                url:'/json/22.json',
                data:JSON.stringify(sendInfoTopTen),
                type:'GET',
                contentType:'application/x-www-form-urlencoded',
                complete:function(res, textStatus, jqXHR){
                    if(textStatus != 'success'){
                        alert('请求赛区前10强学生时，发生'+textStatus);
                    }
                },
                error:function(){
                    alert('请求赛区前10强学生失败');
                },
                success:function(res){
                //获取返回的数据渲染页面，先放在变量中
                    var infoForTopTen = {}
                    //switch(res.Data.competitionPhase) {
                    //    case 'round 1':
                    //        infoForTopTen['competitionPhase']= '初赛';
                    //        break;
                    //    case 'round 2':
                    //        infoForTopTen['competitionPhase']='复赛';
                    //        break;
                    //    case 'round 3':
                    //        infoForTopTen['competitionPhase']= '半决赛';
                    //        break;
                    //    case 'round 4':
                    //        infoForTopTen['competitionPhase']='决赛';
                    //        break;
                    //    default:
                    //        alert('比赛阶段出错');
                    //}
                    infoForTopTen['competitionPhase'] = res.Data.phaseName;
                    infoForTopTen['TopStudentList']=res.Data.TopStudentList;

                    var bt=baidu.template;
                    var html3 = bt('topTen_template',infoForTopTen);
                    $('li.aboutScore').html(html3);
                }
            });
//----------------------------------获取动态信息列表(官网首页中间的部分)-----------------------------------------
            var sendToDynamicList = {};
            sendToDynamicList['pageSize']=10;
            sendToDynamicList['pageIndex']=0;//注意数据是从第0页开始的
            sendToDynamicList['sectionId']=global_competitionAreaId;
            //sendToDynamicList['stageId']=global_competitionStageId;
            //sendToDynamicList['gradeId']=global_competitionGradeId;

            $.ajax({
                url:AmApi.getDynamicList,
                data:sendToDynamicList,
                contentType:'application/x-www-form-urlencoded',
                complete:function(res, textStatus, jqXHR){
                    if(textStatus != 'success'){
                        alert('请求动态信息列表时，发生'+textStatus);
                    }
                },
                    error:function(){
                        alert('请求动态信息列表失败');
                    },
                    success:function(res){
                        var infoForDynamicList = {}
                        infoForDynamicList['data']=res.data.items;
                        infoForDynamicList['readMore']='/competition/dynamiclist.html';
                        var bt = baidu.template;
                        var html4 = bt('dynamicList_template',infoForDynamicList);
                        $('li.aboutDynamic').html(html4);
                    }
            });
        }
    });

})();

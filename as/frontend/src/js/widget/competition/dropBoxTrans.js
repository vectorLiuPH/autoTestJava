//下拉框绑定的函数，实现下拉框变化时
//1，赛区的标签变化
//2，重新发起AJAX请求，更新动态信息（年级的li标签，对应的三部分信息）
(function(){
    $('div.dropBox_template').on('change','select.choose-region',function(){

        //-----------------------------更新赛区详情的标题-------------------------------------
        var areaName = $(this).find('option:selected').text().trim();
        $('h1.comp-title-h1').text(areaName+'赛区详情');
        global_competitionAreaId = $(this).find('option:selected').val();//更新全局变量--赛区

//---------------------------------------更新赛区详情-----------------------------------------------------
        //---------------------更新年级的标签，有的地区可能有4个年级段，有的有三个-------------------------------
        //通过和请求首页相同的接口，来获取当前的年级数
        $.ajax({
            url:AmApi.getHomepageInfo,
            type:"GET",
            dataType: "json",
            complete:function(res,textStatus,jqXHR){
                if(textStatus != 'success') {
                    alert('获取赛区信息时发生'+textStatus);
                }
            },
            error:function(){
                alert('请求赛区信息失败【下拉框】');
            },
            success:function(res){
                var infoForGradeTab = {}
                infoForGradeTab['competitionGrade']=res.data.raceGroups;

                var bt = baidu.template;
                var html1_1 = bt('tabGrade_template',infoForGradeTab);
                $('ul.grade-ul').html(html1_1);
                $('li.grade-li').addClass('hide-grade');
                $('li.grade-li:first-child').removeClass('hide-grade').addClass('active-grade');

                //更新维护的全局变量：阶段，年级
                global_competitionStageId = res.data.phaseId;
                global_competitionGradeId = res.data.raceGroups[0].groupId;
            }
        });

        //---------------------用赛区的id去获取大赛的动态信息-也就是首页左边的部分（博文）-------------------------------
        var areaId = global_competitionAreaId;
        var number = 10; //默认显示10条信息

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
                    alert('请求赛区博文时，发生'+textStatus);
                }
            },
            error:function(){
                alert('请求赛区博文失败【下拉框】');
            },
            success:function(res){
                //用获取的结果渲染页面
                //从后台返回的数据中，提取需要的数据
                if(res.data==null){
                    $('li.aboutReading').html("no data");
                    return;
                }
                var infoForDynamicArticle = {}
                infoForDynamicArticle['areaName']=areaName;
                infoForDynamicArticle['data']=res.data;

                var bt = baidu.template;
                var html2=bt('dynamicArticle_template',infoForDynamicArticle);
                $('li.aboutReading').html(html2);
            }
        });

        //----------------------------------获取动态信息列表(官网首页中间的部分)-----------------------------------------
        var sendToDynamicList = {};
        sendToDynamicList['pageSize']=10;
        sendToDynamicList['pageIndex']=0;
        //sendToDynamicList['stageId']=global_competitionStageId;
        //sendToDynamicList['gradeId']=global_competitionGradeId;
        sendToDynamicList['sectionId']=global_competitionAreaId;

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
                alert('请求动态信息列表失败【下拉框】');
            },
            success:function(res){
                var infoForDynamicList = {}
                infoForDynamicList['data']=res.data.items;
                var bt = baidu.template;
                var html4 = bt('dynamicList_template',infoForDynamicList);
                $('li.aboutDynamic').html(html4);
            }
        });

        //--------------------------------------获取某地区某赛段在某个赛区top10信息------------------------------------------
        var sendInfoTopTen = {};
        sendInfoTopTen['phaseId']=global_competitionStageId;
        sendInfoTopTen['groupId']=global_competitionGradeId;
        sendInfoTopTen['sectionId']=global_competitionAreaId;

        $.ajax({
            //url:AmApi.getTopTen,
            url:'/json/26.json',
            data:JSON.stringify(sendInfoTopTen),
            type:'GET',
            contentType:'application/x-www-form-urlencoded',
            complete:function(res, textStatus, jqXHR){
                if(textStatus != 'success'){
                    alert('请求赛区前10强学生信息时，发生'+textStatus);
                }
            },
            error:function(){
                alert('请求赛区前10强学生信息失败');
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
                infoForTopTen['competitionPhase']=res.Data.phaseName;
                infoForTopTen['TopStudentList']=res.Data.TopStudentList;
                //global_competitionStageId = res.data.competitionPhase;//更新全局变量，比赛阶段ID（可能前端储存的id，后台已经更新了

                var bt=baidu.template;
                var html3 = bt('topTen_template',infoForTopTen);
                $('li.aboutScore').html(html3);
            }
        });

    });
})();
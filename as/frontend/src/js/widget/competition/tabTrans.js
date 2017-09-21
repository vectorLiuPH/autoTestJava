//标签切换的函数---实现切换标签时，重新对top10的信息发起ajax请求
(function(){
    $('ul.grade-ul').on('click','li.grade-li',function(){
        //标签颜色更改
        $('li.grade-li').removeClass('active-grade').addClass('hide-grade');
        $(this).removeClass('hide-grade').addClass('active-grade');

        //发起AJAX请求，重新获取大赛的信息
        //-----------------------------只更新top10信息(右边)---------------------------------
        var infoFotTabTrans = {}
        infoFotTabTrans['competitionSectionId']= global_competitionStageId;
        infoFotTabTrans['grade'] = $(this).attr('data-comp-id');
        global_competitionGradeId = $(this).attr('data-comp-id'); //更新全局变量--年级
        infoFotTabTrans['areaId'] = global_competitionAreaId;
        //alert(JSON.stringify(infoFotTabTrans));

        $.ajax({
            //url:AmApi.getHomepageInfo,
            url:'/json/29.json',
            data:JSON.stringify(infoFotTabTrans),
            type:'GET',
            contentType:'application/x-www-form-urlencoded',
            complete:function(res, textStatus, jqXHR){
                if(textStatus != 'success'){
                    alert('切换tab标签时,发生'+textStatus);
                }
            },
            error:function(){
                alert('请求tab标签切换失败');
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
                //global_competitionStageId = res.Data.competitionPhase;//更新全局变量，比赛阶段ID（可能前端储存的id，后台已经更新了）
                infoForTopTen['TopStudentList']=res.Data.TopStudentList;

                var bt=baidu.template;
                var html3 = bt('topTen_template',infoForTopTen);
                $('li.aboutScore').html(html3);
            }
        });

    });

})();
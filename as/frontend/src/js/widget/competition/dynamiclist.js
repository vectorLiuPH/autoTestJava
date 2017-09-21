(function(){
	var dynamiclist = {
		$selectForm:$('.select-form'),
		$listWrapper: $('.list-wrapper'),
		$pageWrapper:$('.page-wrapper'),
		pageSize:8,
		init:function(){
			this.bt = baidu.template;
			this.getAreaAndGroupInfo();
			this.bindEvent();
		},
		bindEvent:function(){
			var _this = this;
			this.$selectForm.on('change','.j_area',function(e){
				_this.changeArae();
			});

			/*this.$selectForm.on('change','.j_group',function(e){
				_this.changeGroup();
			});*/
		},
		getAreaAndGroupInfo:function(){
			var _this = this;
			$.ajax({
				type:'get',
				url:AmApi.getHomepageInfo,
				success:function(res){
					var html = _this.bt('select',res.data);
						_this.$selectForm.html(html);
						getList(0,_this.pageSize,'全部赛区');
				}
			})
		},
		changeArae:function(){
			var $areaChecked = $('.j_area option:checked');
			var areaId = $areaChecked.val();
			var areaName = $areaChecked.text();
				/*if (!areaId || areaId == "") {
					$('.j_group').val('');
				};*/
			/*var $groupChecked = $('.j_group option:checked');
			var groupId = $groupChecked.val();
			var groupName = $groupChecked.text();*/
				getList(0,this.pageSize,areaName,areaId);
		}
		/*changeGroup:function(){
			var $areaChecked = $('.j_area option:checked');
			var areaId = $areaChecked.val();
			var areaName = $areaChecked.text();
				if (!areaId || areaId == "") {
					Tip('请先选择赛区！','warning',comConf.tipTime);
					return;
				};
			var $groupChecked = $('.j_group option:checked');
			var groupId = $groupChecked.val();
			var groupName = $groupChecked.text();
				getList(1,this.pageSize,areaName,groupName,areaId,groupId);
		}*/
		
	}

	dynamiclist.init();
})();

function getList(pageNo,pageSize,areaName,areaId){//去除groupId,groupName
	var data = {
		sectionId:areaId || '',
		pageSize:pageSize,
		pageIndex:pageNo
	}

	var bt = baidu.template;
	var $listWrapper = $('.list-wrapper');
	var $pageWrapper = $('.page-wrapper');

	$.ajax({
		data:data,
		url:AmApi.getDynamicList,
		contentType:'application/x-www-form-urlencoded',
		success:function(res){
			var data = res.data;
			var item = data && data.items ? data.items : [];
			if (item.length >0) {
				$(item).each(function(index, el) {
					item[index]["formateDate"] = COM.formateDate(Number(el.eventDate));
				});
				var renderData = {
					"list":item,
					"areaName":areaName
					/*"groupName":groupName*/
				}
				var html = bt('item',renderData);
				$listWrapper.html(html);

				var pageHtml = GetPagesHtml(data.actualPageIndex + 1,data.totalRowCount,pageSize,'javascript:getList(#page# - 1,'+pageSize+',\''+areaName+'\','+areaId+')');
				$pageWrapper.html(pageHtml);
			}else{
				$listWrapper.html('<p class="no-data">对不起，暂无数据！</p>');
			}
		}
	});
}
function tabsControl(given){
	var obj = this;
	
	given.find('a.pseudo').click(function(){
		var thisElement = $(this);
		var parent = thisElement.closest('td.new-tabs-group');
		
		parent.find('span.new-tabs-folded').hide();
		parent.find('span.new-tabs-detailed').show();
		
		obj.render();
	});
	
	obj.solveDrawBorder = function(struct,element){
		if(struct.thisElement=='group'){
			switch(struct.prevElement){
				case 'none':
				case 'group':
						element.find('.new-tabs-separator.left').hide();
						element.find('.new-tabs-separator.right').show();
					break;
				case 'detail':
						element.find('.new-tabs-separator.left').show();
						element.find('.new-tabs-separator.right').show();
					break;
			}
		}
	}
	
	obj.render = function(){
		var collection = given.find('.new-tabs-folded');
		var struct = {prevElement:'none',thisElement:'none'}
		collection.each(function(){
			var thisElement = $(this);
			if(thisElement.css('display')=='none'){
				struct.thisElement='detail';
			}else{
				struct.thisElement='group';
			}
			obj.solveDrawBorder(struct,thisElement);
			struct.prevElement = struct.thisElement;
		});
		$(collection[collection.length-1]).find('.new-tabs-separator.right').hide();
		$(collection[collection.length-1]).append('<span style="display:inline-block;height:58px;width:1px;vertical-align:top"></span>');
	}
	
	//init
	obj.render();
	
}
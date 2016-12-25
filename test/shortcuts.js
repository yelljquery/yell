jQuery(function(){
	jQuery(document).keydown(shortcuts);
});

// @description Шорткаты
function shortcuts(event){
	
	if (!document.getElementById) return;
	if (window.event) event = window.event;
	
	if (event.ctrlKey && event.keyCode==81){
		LangTranslateFactory.get_instance().switch_lang();
	}
	
	if (event.altKey && event.keyCode==76){
		LangTranslateFactory.get_instance().switch_lang();
	}
}





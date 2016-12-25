$(document).ready(function () {
	new smileyLoaderType();
});


var smileyLoaderType=function(isAjax){
	var _class=this;
	this.loading=false;
	this.timer=0;
	this.str='';
	this.pos=0;


	var $a = $('.header a.smiley');
	if (!$a.length) {
		return false;
	}
	this.element=$a;
	$a.click(function () {
		_class.load(true);
		return false;
	});

	var element = this.element;

	if (isAjax){
		var url = 'http://www.tema.ru' + document.location.pathname.toString();
		element.data('url', url).attr('data-url', url);
	}

	this._startLoadingIndicator=function(){
		var str=element.data('loader');
		if(!this.timer && str !== undefined){
			var pos=0;
			this.timer=setInterval(function(){
				element.text(';-' + str.charAt((pos++)%str.length));
			},200);
		}
	};

	this._stopLoadingIndicator=function(){
		if(this.timer){
			clearInterval(this.timer);
		}
	};

	this._buildContent=function(html, show){
		var content=$('<div id="smile-result"></div>').html(html).hide();
		var toggle_content = function(){
			content.toggle();
			if (content.is(':visible')) {
				$(document).bind('mousedown.closeSmiley', function (e) {
					var target = $(e.target);
					if (!target.closest('#smile-result').length && !target.is(element)) {
						toggle_content();
					}
				});
			} else {
				$(document).unbind('mousedown.closeSmiley');
			}
			return false;
		};
		var close=$('<a class="close">Закрыть</a>').click(toggle_content).appendTo(content);
		$('body').append(content);
		if(show){
			toggle_content();
		}
		element.unbind('click').click(toggle_content);
	};

	this.load=function(show){
		if(!this.loading){
			this.loading=true;
			_class._startLoadingIndicator();
			$.ajax({
				url: '/svalka/smiley/',
				cache: false,
				dataType: 'text',
				traditional : true,
				data : { url: element.data('url') },
				success: function(html){
					if(html.trim() === ''){
						element.removeClass('showed');
						element.html(element.data('smiley-sad'));
						_class._buildContent('<p class="smiley-sad">' + element.data('smiley-sad') + '</p>', show);
					} else {
						element.addClass('showed');
						element.html(element.data('smiley-happy'));
						_class._buildContent(html, show);
					}
				},
				error: function(html){
					//element.remove();
					element.removeClass('showed');
				},
				complete: function(){
					_class._stopLoadingIndicator();
					this.loading=false;
				}
			});
		}
	};

	// автозагрузка
	if (element.data('auto-load') || isAjax){
		this.load();
	}
};
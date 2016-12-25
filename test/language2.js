//console.log('file');
var LangTranslate = new function() {
	function a() {
		//return null !== document.URL.match(/\/eng\//)
		if (document.location.pathname.toString().indexOf('/eng/') == 0) {
			return true;
		}
		return false;
	}

	function b() {
		"" == l ? (l = a() ? "en" : "ru", e(l)) : e(l)
	}

	function c(a) {
		var b = "";
		for (index in m)
			if (m[index] != a)
				for (tag in n) b += d(tag, m[index], "none");
			else
				for (tag in n) b += d(tag, a, n[tag]);
		return b
	}

	function d(a, b, c) {
		return a + '[lang="' + b + '"]{display:' + c + "}"
	}

	function e(b) {
		if (!this.historyInit) {
			//console.log('replace', document.location.pathname.toString());
			var uri =
			history.replaceState({o:'tema'}, document.title, document.location.toString());
			this.lastState = document.location.pathname.toString();
			//history.pushState({o:'tema_start'}, document.title, document.location.pathname.toString());
		}{
			//if (b == 'en' && document.location.toString().indexOf('/eng/') == -1) {
			//	return false;
			//}
		}

		if (this.lastTime){
			var _m = new Date().getTime() - this.lastTime;
			//console.log(_m);
		}
		this.lastTime = new Date().getTime();

		//console.log('change', b, document.location.pathname.toString());

		var d = b; - 1 === m.indexOf(d) && (d = a() ? m[1] : m[0]), o.html(c(d));
		var e = jQuery("title").not("title[lang]"),
			g = jQuery('title[lang="' + d + '"]').text();
		"" != g && e.text(g), jQuery("body").trigger("lang:change", d), document.cookie = "tema_lang=" + d + "; path=/; expires=Mon, 01-Jan-2020 00:00:00 GMT", f(d), l = d;
		var h = window.location.pathname.toString();
		var res = h.replace(/\/eng/, "");
		//res = ("en" === l ? "/eng" : "") + res + ("" !== window.location.hash ? window.location.hash : "");
		if (b == 'en'){
			res = '/eng' + res;
		}

		res += ("" !== window.location.hash ? window.location.hash : "")

		if (h != res) {
			//console.log('add', res);
			this.lastState = res;
			history.pushState({o:'tema'}, document.title, res);
		}
		//	window.setTimeout(function () {
		var that = this;
			if(!this.historyInit) {
				this.historyInit = true;
				window.addEventListener('popstate', function (e) {
					if (e && e.state) {
						if (e.state.o == 'tema') {
							//console.log('state', e.target.location.pathname.toString());
							if (e.target.location.pathname.toString() != that.lastState) {
								LangTranslateFactory.get_instance().switch_lang();
							} else {
								//console.log('CANCEL', that.lastState, '==', e.target.location.pathname.toString());
							}
						}
						if (e.state.o == 'tema_start') {
							//console.log('stat tema_start!', document.location.pathname.toString());
							document.location = document.location.pathname.toString();
						}
						that.lastState = e.target.location.pathname.toString();
					}
				}, false);
				//window.onpopstate = function (e) {
				//};
			}
		//	}, 500);
		//}
	}

	function f(a) {
		var b = 0 != jQuery("link#PrevLink").length;
		if (b) {
			var c = "link" + a,
				d = jQuery(c),
				e = 0 != d.length;
			e ? g(d.filter('[rel="prev"]').attr("href"), d.filter('[rel="next"]').attr("href")) : g("", "")
		}
	}

	function g(a, b) {
		jQuery('link[rel="prev"]').attr("href", a), jQuery('link[rel="next"]').attr("href", b)
	}

	function h() {
		var a = m.indexOf(l);
		return a + 1 == m.length ? m[0] : m[a + 1]
	}

	function i() {
		var a = h();
		e(a);
	}

	function j(a, c, d) {
		return k ? k : (l = a, m = c, n = d, o = jQuery("#localization"), p = /tema_lang=(\w+)/, b(), k = this, void 0)
	}
	var k, l, m, n, o, p;
	//console.log('finit');
	return j.prototype.switch_lang = i, j
};
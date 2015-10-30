// IE checker
function gkIsIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
//
var page_loaded = false;
// animations
var elementsToAnimate = [];
//
window.addEvent('load', function() {
	setTimeout(function() {
		if(document.id('gkTopBar')) {
			document.id('gkTopBar').addClass('active');
		}
	}, 500);
	//
	page_loaded = true;
	// smooth anchor scrolling
	new SmoothScroll(); 
	// style area
	if(document.id('gkStyleArea')){
		document.id('gkStyleArea').getElements('a').each(function(element,i){
			element.addEvent('click',function(e){
	            e.stop();
				changeStyle(i+1);
			});
		});
	}
	// font-size switcher
	if(document.id('gkTools') && document.id('gkMainbody')) {
		var current_fs = 100;
		var content_fx = new Fx.Tween(document.id('gkMainbody'), { property: 'font-size', unit: '%', duration: 200 }).set(100);
		document.id('gkToolsInc').addEvent('click', function(e){ 
			e.stop(); 
			if(current_fs < 150) { 
				content_fx.start(current_fs + 10); 
				current_fs += 10; 
			} 
		});
		document.id('gkToolsReset').addEvent('click', function(e){ 
			e.stop(); 
			content_fx.start(100); 
			current_fs = 100; 
		});
		document.id('gkToolsDec').addEvent('click', function(e){ 
			e.stop(); 
			if(current_fs > 70) { 
				content_fx.start(current_fs - 10); 
				current_fs -= 10; 
			} 
		});
	}
	// K2 font-size switcher fix
	if(document.id('fontIncrease') && document.getElement('.itemIntroText')) {
		document.id('fontIncrease').addEvent('click', function() {
			document.getElement('.itemIntroText').set('class', 'itemIntroText largerFontSize');
		});
		
		document.id('fontDecrease').addEvent('click', function() {
			document.getElement('.itemIntroText').set('class', 'itemIntroText smallerFontSize');
		});
	}
	// login popup
	if(document.id('gkPopupLogin')) {
		var popup_overlay = document.id('gkPopupOverlay');
		popup_overlay.setStyles({'display': 'block', 'opacity': '0'});
		popup_overlay.fade('out');

		var opened_popup = null;
		var popup_login = null;
		var popup_login_h = null;
		var popup_login_fx = null;
		var popup_cart = null;
		var popup_cart_h = null;
		var popup_cart_fx = null;

		if(document.id('gkPopupLogin') && document.id('gkLogin')) {
			popup_login = document.id('gkPopupLogin');
			popup_login_fx = new Fx.Morph(popup_login, {duration:500, transition: Fx.Transitions.Circ.easeInOut}).set({'opacity': 0, 'margin-top': -50 }); 
			document.id('gkLogin').addEvent('click', function(e) {
				new Event(e).stop();
				popup_login.setStyle('display', 'block');
				popup_overlay.setStyle('height', document.body.getScrollSize().y);
				popup_overlay.fade(0.45);

				setTimeout(function() {
					popup_login_fx.start({'opacity': 1, 'margin-top': 0});
					opened_popup = 'login';
					popup_login.addClass('gk3Danim');
				}, 450);

				(function() {
					if(document.id('modlgn-username')) {
						document.id('modlgn-username').focus();
					}
				}).delay(600);
			});
		}

		popup_overlay.addEvent('click', function() {
			if(opened_popup == 'login')	{
				popup_overlay.fade('out');
				popup_login.removeClass('gk3Danim');
				popup_login_fx.start({
					'opacity' : 0,
					'margin-top' : -50
				});
				setTimeout(function() {
					popup_login.setStyle('display', 'none');
				}, 450);
			}	
		});
	}
	// create the list of elements to animate	
	document.getElements('.gkColorPriceTable .gkLink a').each(function(element, i) {
		gkAddClass(element, 'loaded', i);
	});
	
	document.getElements('.gkIcons').each(function(element, i) {
		elementsToAnimate.push(['queue_anim', element, element.getPosition().y, '.gkIcon']);
	});
	
	document.getElements('.gkPoints').each(function(element, i) {
		elementsToAnimate.push(['queue_anim', element, element.getPosition().y, 'li']);
	});
	
	document.getElements('.gkTestimonials').each(function(element, i) {
		elementsToAnimate.push(['queue_anim', element, element.getPosition().y, 'div div']);
	});
});
//
window.addEvent('scroll', function() {
	// menu animation
	if(page_loaded && document.getElement('body').hasClass('imageBg') && !document.id('aside-menu')) {
		// if menu is not displayed now
		if(window.getScroll().y > document.id('gkHeader').getSize().y && !document.id('gkMenuWrap').hasClass('active')) {
			document.id('gkTopBar').inject(document.id('gkMenuWrap'), 'inside');
			document.id('gkHeaderNav').inject(document.id('gkMenuWrap'), 'inside');
			document.id('gkHeader').setProperty('class', 'gkNoMenu');
			document.id('gkHeader').getElement('div').setStyle('display', 'none');
			document.id('gkMenuWrap').setProperty('class', 'active');
		}
		//
		if(window.getScroll().y <= document.id('gkHeader').getSize().y && document.id('gkMenuWrap').hasClass('active')) {
			document.id('gkHeader').getElement('div').setStyle('display', 'block');
			document.id('gkTopBar').inject(document.id('gkBg'), 'top');
			document.id('gkHeaderNav').inject(document.id('gkHeader').getElement('div'), 'top');
			document.id('gkHeader').setProperty('class', '');
			document.id('gkMenuWrap').setProperty('class', '');
		}
	}
	// animate all right sliders
	if(elementsToAnimate.length > 0) {		
		// get the necessary values and positions
		var currentPosition = window.getScroll().y;
		var windowHeight = window.getSize().y;
		// iterate throught the elements to animate
		if(elementsToAnimate.length) {
			for(var i = 0; i < elementsToAnimate.length; i++) {
				if(elementsToAnimate[i][2] < currentPosition + (windowHeight / 1.5)) {
					// create a handle to the element
					var element = elementsToAnimate[i][1];
					// check the animation type
					if(elementsToAnimate[i][0] == 'animation') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						gkAddClass(element, 'loaded', false);
						// clean the array element
						elementsToAnimate[i] = null;
					}
					// if there is a queue animation
					else if(elementsToAnimate[i][0] == 'queue_anim') {
						//console.log('(XXX)' + elementsToAnimate[i][2]);
						element.getElements(elementsToAnimate[i][3]).each(function(item, j) {
							gkAddClass(item, 'loaded', j);
						});
						// clean the array element
						elementsToAnimate[i] = null;
					}
				}
			}
			// clean the array
			elementsToAnimate = elementsToAnimate.clean();
		}
	}
});
//
function gkAddClass(element, cssclass, i) {
	var delay = element.getProperty('data-delay');

	if(!delay) {
		delay = (i !== false) ? i * 100 : 0;
	}

	setTimeout(function() {
		element.addClass(cssclass);
	}, delay);
}
//
window.addEvent('domready', function() {
	if(!document.id('aside-menu')) {
		//
		var menuwrap = new Element('div', {
			'id': 'gkMenuWrap'
		});
		//
		menuwrap.inject(document.getElement('body'), 'bottom');
		
		//
		if(!document.getElement('body').hasClass('imageBg')) {
			//
			document.id('gkTopBar').inject(document.id('gkMenuWrap'), 'inside');
			document.id('gkHeaderNav').inject(document.id('gkMenuWrap'), 'inside');
			document.id('gkHeader').setProperty('class', 'gkNoMenu');
			document.id('gkHeader').getElement('div').setStyle('display', 'none');
			document.id('gkMenuWrap').setProperty('class', 'active');	
		}
	}
	//
	// some touch devices hacks
	//

	// FAQ
	if(document.getElement('.faq') && document.getElement('.faq').hasClass('item-page')) {
		document.getElement('.faq').getElements('h3').each(function(header) {
			header.addEvent('click', function() {
				if(header.hasClass('active')) {
					document.getElement('.faq').getElements('h3').removeClass('active');
				} else {
					document.getElement('.faq').getElements('h3').removeClass('active');
					header.addClass('active');
				}
			});
		});
	}

	// hack modal boxes ;)
	document.getElements('a.modal').each(function(link) {
		// register start event
		var lasttouch = [];
		// here
		link.addEvent('touchstart', function() {
			lasttouch = [link, new Date().getTime()];
		});
		// and then
		link.addEvent('touchend', function() {
			// compare if the touch was short ;)
			if(lasttouch[0] == link && Math.abs(lasttouch[1] - new Date().getTime()) < 500) {
				window.location = link.getProperty('href');
			}
		});
	});
	
	// Big select element
	if(!gkIsIE() || gkIsIE() >= 10) {
		document.getElements('.gkBigSelect').each(function(item) {
			var wrap = new Element('div.gkBigSelect').wraps(item);
			wrap.set('html', wrap.get('html') + '<span></span>');
			var initial = item.getSelected().getProperty('value');
			
			if(initial !== null) {
				wrap.getElement('span').set('text', initial);
			}
			
			var items = item.getElements('option');
			var items_output = '';
			
			items.each(function(option, i) {
				items_output += '<li data-value="'+option.getProperty('value')+'">'+option.innerHTML+'</li>';
			});
			
			items_output = '<ul>' + items_output + '</ul>';
			wrap.set('html', wrap.get('html') + items_output);
			
			var selector = wrap.getElement('select');
			wrap.getElements('li').each(function(opt) {
				opt.addEvent('click', function() {				
					selector.getElements('option').each(function(option) {
					   option.selected = opt.get('data-value') == option.getProperty('value');
					});
					
					wrap.getElement('span').set('text', opt.innerHTML);
				});
			});
			
			wrap.addEvent('click', function() {
				if(wrap.hasClass('active')) {
					setTimeout(function() {
						wrap.getElement('ul').setStyle('display', 'none');
					}, 350);
				} else {
					wrap.getElement('ul').setStyle('display', 'block');
				}
				
				setTimeout(function() {
					wrap.toggleClass('active');
				}, 50);
			});
			
			item.removeClass('gkBigSelect');
		});
	}
});
// function to set cookie
function setCookie(c_name, value, expire) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expire);
	document.cookie=c_name+ "=" +escape(value) + ((expire==null) ? "" : ";expires=" + exdate.toUTCString());
}
// Function to change styles
function changeStyle(style){
	var file1 = $GK_TMPL_URL+'/css/style'+style+'.css';
	var file2 = $GK_TMPL_URL+'/css/typography/typography.style'+style+'.css';
	new Asset.css(file1);
	new Asset.css(file2);
	Cookie.write('gk_cloudhost_j25_style', style, { duration:365, path: '/' });
}

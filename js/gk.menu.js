window.addEvent('domready', function() {
    // Classic menu
    if(document.id('gkExtraMenu') && !document.id('aside-menu')) {
        // fix for the iOS devices     
        document.getElements('#gkExtraMenu ul li span').each(function(el) {
            el.setProperty('onmouseover', '');
        });

        document.getElements('#gkExtraMenu ul li a').each(function(el) {
            el.setProperty('onmouseover', '');

            if(el.getParent().hasClass('haschild') && document.getElement('body').getProperty('data-tablet') != null) {
                el.addEvent('click', function(e) {
                    if(el.retrieve("dblclick", 0) === 0) {
                        e.stop();
                        el.store("dblclick", new Date().getTime());
                    } else {
                    	if(el.getParent().getElements('div.childcontent')[0].getStyle('overflow') == 'visible') {
                    		window.location = el.getProperty('href');
                    	}
                        var now = new Date().getTime();
                        if(now - el.retrieve("dblclick", 0) < 500) {
                            window.location = el.getProperty('href');
                        } else {
                            e.stop();
                            el.store("dblclick", new Date().getTime());
                        }
                    }
                });
            }
        });

        var base = document.id('gkExtraMenu');

        if($GKMenu && ($GKMenu.height || $GKMenu.width)) {     
            var gk_selector = 'li.haschild';
            base.getElements(gk_selector).each(function(el){     
                if(el.getElement('.childcontent')) {
                    var content = el.getElement('.childcontent');
                    var prevh = content.getSize().y;
                    var prevw = content.getSize().x;

                    var fxStart = { 'height' : $GKMenu.height ? 0 : prevh, 'width' : $GKMenu.width ? 0 : prevw, 'opacity' : 0 };
                    var fxEnd = { 'height' : prevh, 'width' : prevw, 'opacity' : 1 };

                    var fx = new Fx.Morph(content, {
                        duration: $GKMenu.duration,
                        link: 'cancel',
                        onComplete: function() {
                            if(content.getSize().y == 0){
                                content.setStyle('overflow', 'hidden');
                            } else if(content.getSize().y - prevh < 30 && content.getSize().y - prevh >= 0) {
                                content.setStyle('overflow', 'visible');
                            }
                        }
                    });

                    fx.set(fxStart);
                    content.setStyles({'left' : 'auto', 'overflow' : 'hidden' });

                    el.addEvents({
                        'mouseenter': function(){
                            var content = el.getElement('.childcontent');

                            if(content.getProperty('data-base-margin') != null) {
                                content.setStyle('margin-left', content.getProperty('data-base-margin') + "px");
                            }

                            var pos = content.getCoordinates();
                            var winWidth = window.getCoordinates().width;
                            var winScroll = window.getScroll().x;

                            if(pos.left + prevw > (winWidth + winScroll)) {
                                var diff = (winWidth + winScroll) - (pos.left + prevw) - 5;
                                var base = content.getStyle('margin-left').toInt();
                                var margin = base + diff;

                                if(base > 0) {
                                    margin = -prevw + 10;  
                                }
                                content.setStyle('margin-left', margin + "px");

                                if(content.getProperty('data-base-margin') == null) {
                                    content.setProperty('data-base-margin', base);
                                }
                            }

                            fx.start(fxEnd);
                        },

                        'mouseleave': function(){
                            content.setStyle('overflow', 'hidden');
                            fx.start(fxStart);
                        }
                    });
                }
            });
        }
    }
    // Aside menu
    if(document.id('aside-menu')) {
    	var staticToggler = document.id('static-aside-menu-toggler');
    	
    	document.id('aside-menu-toggler').addEvent('click', function() {
    		gkOpenAsideMenu();
    	});
    	
    	staticToggler.addEvent('click', function() {
    		gkOpenAsideMenu();
    	});
    	
    	document.id('close-menu').addEvent('click', function() {
    		document.id('close-menu').toggleClass('menu-open');
    		document.id('gkBg').toggleClass('menu-open');
    		document.id('aside-menu').toggleClass('menu-open');
    	});
    	
    	window.addEvent('scroll', function(e) {
    		var pos = window.getScroll().y;
    		
    		if(pos > 240 && !staticToggler.hasClass('active')) {
    			staticToggler.addClass('active');	
    		} else if(pos < 240 && staticToggler.hasClass('active')) {
    			staticToggler.removeClass('active');
    		}
    	});
    }
    // detect android browser
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1 && !window.chrome;
    
    if(isAndroid) {
    	document.body.addClass('android-stock-browser')
    }
    // Android stock browser fix for the aside menu
    if(document.getElement('body').hasClass('android-stock-browser') && document.id('aside-menu')) {
    	document.id('static-aside-menu-toggler').addEvent('click', function() {
    		window.scrollTo(0, 0);
    	});
    	// menu dimensions
    	var asideMenu = document.id('aside-menu');
    	var menuHeight = document.id('aside-menu').getSize().y;
    	//
    	window.addEvent('scroll', function(e) {
    		if(asideMenu.hasClass('menu-open')) {
	    		// get the necessary values and positions
	    		var currentPosition = window.getScroll().y;
	    		var windowHeight = window.getSize().y;

    			// compare the values
	    		if(currentPosition > menuHeight - windowHeight) {
	    			document.id('close-menu').fireEvent('click');
	    		}
    		}
    	});
    }
}); 

function gkOpenAsideMenu() {
	document.id('gkBg').toggleClass('menu-open');
	document.id('aside-menu').toggleClass('menu-open');

	if(!document.id('close-menu').hasClass('menu-open')) {
		setTimeout(function() {
			document.id('close-menu').toggleClass('menu-open');
		}, 300);
	} else {
		document.id('close-menu').removeClass('menu-open');
	}
}
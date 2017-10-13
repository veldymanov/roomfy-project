//------------------------------------------
//	Sales Special Touchslider
//-------------------------------------------
var touchslider = {
	log: function(msg) {
//		var p = document.getElementById('log');
//		p.innerHTML = p.innerHTML + "<br>" + msg;
	},
		
	createSlidePanel: function(/*string*/ gridid, /*int*/ cellWidth, /*int*/ padding) {
		var padding = padding || 0;
		var x = padding/2;
				
		$(gridid).each(function() {
			//<div class="touch-box">	
			$(this).parent().css({ 
				margin: '0 auto',
				overflow: 'hidden'
			});
				
			//<ul class='touch-list js-touch-list'> === gridid
			$(this).css({	
				'left': '0px',		
				'list-style-type': "none",
				'margin': '0',
				'padding': '0',
				'position': 'relative'
			});
				
			//<li class='offer-item js-offer-item'>
			$(this).children('.js-touch-list-item').each(function() {
				$(this).css({
					'height': '95%',
					'left': x + 'px',
					'position': 'absolute',
				//	'top': padding + 'px',
					'width': cellWidth + 'px'					
				});

				x += cellWidth + padding;
			});
			/*
			   Many of the mobile browsers resize the screen and therefore
			   don't give accurate information about the size of the window.
			   We need to save this information so we can use it later when
			   we're sliding the grid.
			 */
			touchslider.width = x;
			touchslider.colWidth = cellWidth + padding;
			touchslider.padding = padding;
				
			try {
				//Touch events check
				document.createEvent('TouchEvent');
					
				//Make our panel respondto all of the touch events.
				touchslider.makeTouchable(gridid);
			} catch (e) {
				// Then we aren't on a device that supports touch
			} finally {
				//Starting Touch Area Size
				touchslider.touchAreaSize(gridid);
					
				//Resizing Touch Area Size
				$(window).resize(function(){ touchslider.touchAreaSize(gridid) });
					
				//Sliding by click
				$('.js-prev').on('click', function(){ touchslider.prevClick(gridid) });
				$('.js-next').on('click', function(){ touchslider.nextClick(gridid) });
			}
		});			
	},
				
	prevClick: function(gridid){ //to left
		var left = this.getLeft($(gridid));
		var maxDelta = this.width - parseInt($(gridid).parent().width(), 10);
		
		if ( (left % this.colWidth) === 0) { //No click during sliding
			left -=  this.colWidth;
		
			if (Math.abs(left) <= Math.abs(maxDelta)) {
				this.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	nextClick: function(gridid){ //to right
		var left = this.getLeft($(gridid));
		
		if ( (left % this.colWidth) === 0) { //No click during sliding
			left +=  this.colWidth;
	
			if(left <= 0){
				this.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	// Fit Touch Area to Elements Quantity
	touchAreaSize: function(gridid){
		$(gridid).parent().each( function(){ 
				var touchAreaWidth100 = parseInt($(this).css({width: '100%'}).css('width'), 10);
				var elNumber = parseInt(touchAreaWidth100 / touchslider.colWidth, 10);
				
				var touchAreaWidth = elNumber * touchslider.colWidth;
				
				$(this).css({ 
					width: touchAreaWidth 
				});
			});	
	},
		
	makeTouchable: function(/*string*/ gridid) {
		 $(gridid).each(function() {
			this.ontouchstart = function(e) {
				touchslider.touchStart($(this), e);
			};
				
			this.ontouchmove = function(e) {
				touchslider.touchMove($(this), e);
			};		
				
			this.ontouchend = function(e) {
				touchslider.touchEnd($(this), e);
			};
		});
	},		

	/**
	 * When the touch starts we add our sliding class a record a few
	 * variables about where the touch started.  We also record the
	 * start time so we can do momentum.
	 */
	touchStart: function(/*JQuery*/ elem, /*event*/ e) {
		 elem.css({
			'-ms-transition': 'left 0s',
			'-moz-transition': 'left 0s',
			'-o-transition': 'left 0s',
			'transition': 'left 0s'
		 });
			 
		this.startX = e.targetTouches[0].clientX;
		this.startY = e.targetTouches[0].clientY;
		this.slider = 0; 							// Starting sliding position
		this.startLeft = this.getLeft(elem);
		this.touchStartTime = new Date().getTime();
	},
		
	/**
	 * While they are actively dragging we just need to adjust the
	 * position of the grid using the place they started and the
	 * amount they've moved.
	 */
	touchMove: function(/*JQuery*/ elem, /*event*/ e) {
		var deltaX = e.targetTouches[0].clientX - this.startX;
		var deltaY = e.targetTouches[0].clientY - this.startY;
		
		if (( (this.slider === 0 ) ) &&
			( Math.abs(deltaY) > Math.abs(deltaX)) ) {		
			
			//Default sliding			
			this.slider = -1; 							//Default sliding position
			
		} else if (this.slider != -1) {		
			//this sliding
			e.preventDefault();
			this.slider = 1; 							//this sliding position
			
			var left = deltaX + this.startLeft;
			
			elem.css({
				left: left + 'px'
			});
			 
			if (this.startX > e.targetTouches[0].clientX) {
				//Sliding to the left
				this.slidingLeft = true;
			} else {
				// Sliding to the right
				this.slidingLeft = false;
			}
		}
	},	
		
	/**
	 * When the touch ends we need to adjust the grid for momentum
	 * and to snap to the grid.  We also need to make sure they
	 * didn't drag farther than the end of the list in either
	 * direction.
	 */
	touchEnd: function(/*JQuery*/ elem, /*event*/ e) {
		if (this.getLeft(elem) > 0) {
			// This means they dragged to the right past the first item
			this.doSlide(elem, 0, '1s');
		 
			this.startX = null;
		} else if ( Math.abs(this.getLeft(elem))  > ( this.width - elem.parent().width() )) {
			// This means they dragged to the left past the last item
			this.doSlide(elem, '-' + (this.width - elem.parent().width()), '1s');
			 
			this.startX = null;
		} else {
			/*
				This means they were just dragging within the bounds of the grid
				and we just need to handle the momentum and snap to the grid.
			*/
			this.slideMomentum(elem, e);
		}
	},
		
	/**
	 * A little helper to parse off the 'px' at the end of the left
	 * CSS attribute and parse it as a number.
	 */
	getLeft: function(/*JQuery*/ elem) {
		 return parseInt(elem.css('left'), 10);  //.substring(0, elem.css('left').length - 2), 10);
	},

	doSlide: function(/*jQuery*/ elem, /*int*/ x, /*string*/ duration) { 
		elem.css({
			left: x + 'px',
			'-ms-transition': 'left ' + duration,
			'-moz-transition': 'left ' + duration,
			'-o-transition': 'left ' + duration,
			'-webkit-transition': 'left ' + duration,
			'transition': 'left ' + duration
		 });
			 
		if (x === 0) {
			$('.js-next').removeClass('is-active');
			$('.js-prev').addClass('is-active');
		} else if (Math.abs(x) === this.width - parseInt(elem.parent().width(), 10) - parseInt(this.padding/2, 10)){
			$('.js-prev').removeClass('is-active');
			$('.js-next').addClass('is-active');
		} else {
			$('.js-prev').addClass('is-active');
			$('.js-next').addClass('is-active');
		}
	},	
		
	/**
	 * If the user drags their finger really fast we want to push 
	 * the slider a little farther since they were pushing a large 
	 * amount. 
	*/
	slideMomentum: function(/*jQuery*/ elem, /*event*/ e) {
		var slideAdjust = (new Date().getTime() - this.touchStartTime) * 65;
		var left = this.getLeft(elem);
			 
		/*
		We calculate the momentum by taking the amount of time they were sliding
		and comparing it to the distance they slide.  If they slide a small distance
		quickly or a large distance slowly then they have almost no momentum.
		If they slide a long distance fast then they have a lot of momentum.
		*/
			 
		var changeX = 12000 * (Math.abs(this.startLeft) - Math.abs(left));
			 
		slideAdjust = Math.round(changeX / slideAdjust);
			 
		var newLeft = left + slideAdjust;
			 
		/*
		 * We need to calculate the closest column so we can figure out
		 * where to snap the grid to.
		 */
		var t = newLeft % this.colWidth;
			 
		if ((Math.abs(t)) > ((this.colWidth / 2))) {
			/*
			* Show the next cell
			*/
			newLeft -= (this.colWidth - Math.abs(t));
		} else {
			/*
			 * Stay on the current cell
			 */
			newLeft -= t;
		}
			 
		if (this.slidingLeft) {
			var maxLeft = parseInt('-' + (this.width - elem.parent().width()), 10);
			/*
			 * Sliding to the left
			*/
			this.doSlide(elem, Math.max(maxLeft, newLeft), '0.5s');
		} else {
			/*
			 * Sliding to the right
			 */
			this.doSlide(elem, Math.min(0, newLeft), '0.5s');
		}
			 
		this.startX = null;
	}
};	


jQuery(document).ready(function(){
   	//------------------------------------------
	//	Initialize touchslider
	//-------------------------------------------
	touchslider.createSlidePanel('.js-touch-list', 366, 30);


   	//------------------------------------------
	//	Keyframes Slide Up listener
	//-------------------------------------------
	var $slide_up_parent = inWindow('.slide-up-parent');
	$slide_up_parent.find('.slide-up').addClass('active');

	// Show text on scroll
	$(window).scroll(function () {
		var $slide_up_parent = inWindow('.slide-up-parent');
		$slide_up_parent.find('.slide-up').addClass('active');
	});

	// Find elements shown on screen
	function inWindow(s){
		var scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height(),
			currentEls = $(s),
			result = [];
		
		currentEls.each(function(){
			var el = $(this);
			var offset = el.offset();
			if(scrollTop <= offset.top && (offset.top + el.height() - 100) < (scrollTop + windowHeight))
				result.push(this);
		});
		
	  	return $(result);
	}

});

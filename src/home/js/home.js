//-------------------------------------------------------------------------------------------------------
//	Touchslider
//-------------------------------------------------------------------------------------------------------
var touchslider = {
	log: function(msg) {
		var p = document.getElementById('log');
		p.innerHTML = p.innerHTML + "<br>" + msg;
	},
		
	createSlidePanel: function(/*string*/ gridid, /*int*/ cellWidth, /*int*/ padding) {
		var el = document.querySelector(gridid);
		var padding = padding || 0;
		var x = padding/2;				

		//<div class="js-touch-box">
		el.parentElement.style.cssText = "margin: 0 auto; overflow: hidden;";
			
		//<ul class='js-touch-list'> === gridid
		el.style.cssText = "left: 0px; list-style-type: none; margin: 0; padding: 0; position: relative;"; 
			
		//<li class='js-touch-list-item'>
		var touchListItems = el.querySelectorAll('.js-touch-list-item');
		for(let i = 0; i < touchListItems.length; i++){
			touchListItems[i].style.cssText = "height: 95%; position:absolute;";
			touchListItems[i].style.left = x + "px";
			touchListItems[i].style.width = cellWidth + "px";
			x += cellWidth + padding;			
		}
		/*
		   We need to save this information so we can use it later when
		   we're sliding the grid.
		 */
		touchslider.width = x;
		touchslider.padding = padding;
		touchslider.colWidth = cellWidth + padding;
			
		try {
			//Touch events check
			document.createEvent('TouchEvent');
				
			//Make our panel respond to all of the touch events.
			touchslider.makeTouchable(el);
		} catch (e) {
			// Then we aren't on a device that supports touch
		} finally {
			//Starting Touch Area Size
			touchslider.touchAreaSize(el);
				
			//Resizing Touch Area Size
			window.addEventListener('resize', function() {
				touchslider.touchAreaSize(el);
			})

			/*	
				Sliding by click
			*/
			touchslider.prevBtn = el.parentElement.querySelector('.js-prev');
			touchslider.nextBtn = el.parentElement.querySelector('.js-next');

			touchslider.prevBtn.addEventListener('click', function(){ 
				touchslider.prevClick(el); 
			});
			touchslider.nextBtn.addEventListener('click', function(){ 
				touchslider.nextClick(el); 
			});
			//Activate managing buttons/arrows
			touchslider.doSlide(el, 0, '0s');
		}		
	},
				
	prevClick: function(el){ //to left
		var left = parseInt(el.style.left, 10);
		var maxDelta = this.width - el.parentElement.offsetWidth;
		
		//No click during sliding
		if ( (left % this.colWidth) === 0) { 
			left -=  this.colWidth;
		
			if (Math.abs(left) <= Math.abs(maxDelta)) {
				this.doSlide(el, left, '0.5s');
			} 
		}
	},
		
	nextClick: function(el){ //to right
		var left = parseInt(el.style.left, 10);
		
		//No click during sliding
		if ( (left % this.colWidth) === 0) { 
			left +=  this.colWidth;
	
			if(left <= 0){
				this.doSlide(el, left, '0.5s');
			} 
		}
	},
		
	// Fit Touch Area to Elements Quantity
	touchAreaSize: function(/*element*/el){			
		el.parentElement.style.width = '100%';
		var touchAreaWidth100 = el.parentElement.offsetWidth;
		var elNumber = Math.floor( touchAreaWidth100 / touchslider.colWidth);			
		var touchAreaWidth = elNumber * touchslider.colWidth;
		
		el.parentElement.style.width = touchAreaWidth + 'px';

		//Used below
		touchslider.hiddenWidth = touchslider.width - touchAreaWidth;
	},
		
	makeTouchable: function(/*element*/ el) {
		el.addEventListener('touchstart', function(e) { touchslider.touchStart(this, e); }, false);	
		el.addEventListener('touchmove', function(e) { touchslider.touchMove(this, e); }, false);			
		el.addEventListener('touchend', function(e) { touchslider.touchEnd(this, e); }, false);	
	},		

	/**
	 * When the touch starts we add our sliding class a record a few
	 * variables about where the touch started.  We also record the
	 * start time so we can do momentum.
	 */
	touchStart: function(/*element*/ el, /*event*/ e) {
		el.style.transition = 'left 0s';

		this.startX = e.targetTouches[0].clientX;
		this.startY = e.targetTouches[0].clientY;
		this.slider = 0; 							// Starting sliding position
		this.startLeft = parseInt(el.style.left, 10);
		this.touchStartTime = new Date().getTime();
	},
		
	/**
	 * While they are actively dragging we just need to adjust the
	 * position of the grid using the place they started and the
	 * amount they've moved.
	 */
	touchMove: function(/*element*/ el, /*event*/ e) {
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
			el.style.left = left + 'px';
			 
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
	touchEnd: function(/*element*/ el, /*event*/ e) {
		if ( parseInt(el.style.left, 10) > 0) {
			// This means they dragged to the right past the first item
			this.doSlide(el, 0, '1s');

			this.startX = null;
		} else if ( Math.abs( parseInt(el.style.left, 10) )  > this.hiddenWidth ) {
			// This means they dragged to the left past the last item
			this.doSlide(el, (-this.hiddenWidth + this.padding / 2), '1s');
			 
			this.startX = null;
		} else {
			/*
				This means they were just dragging within the bounds of the grid
				and we just need to handle the momentum and snap to the grid.
			*/
			this.slideMomentum(el, e);
		}
	},

	doSlide: function(/*element*/ el, /*int*/ x, /*string*/ duration) { 
		el.style.left = x + 'px';
		el.style.transition = 'left ' + duration;
			 
		//next, prev buttons activity
		if (x === 0) {
			this.nextBtn.classList.remove('is-active');
			if ( Math.abs(x) < (this.hiddenWidth - this.padding/2) ) {
				this.prevBtn.classList.add('is-active');
			}
		} else if ( Math.abs(x) >=  (this.hiddenWidth - this.padding/2) ){
			this.prevBtn.classList.remove('is-active');
			this.nextBtn.classList.add('is-active');
		} else {
			this.prevBtn.classList.add('is-active');
			this.nextBtn.classList.add('is-active');
		}
	},	
		
	/**
	 * If the user drags their finger really fast we want to push 
	 * the slider a little farther since they were pushing a large 
	 * amount. 
	*/
	slideMomentum: function(/*element*/ el, /*event*/ e) {
		var slideAdjust = (new Date().getTime() - this.touchStartTime) * 65;
		var left = parseInt(el.style.left, 10);
			 
		/*
		 * We calculate the momentum by taking the amount of time they were sliding
		 * and comparing it to the distance they slide.  If they slide a small distance
		 * quickly or a large distance slowly then they have almost no momentum.
		 * If they slide a long distance fast then they have a lot of momentum.
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
			//Show the next cell
			newLeft -= (this.colWidth - Math.abs(t));
		} else {
			//Stay on the current cell
			newLeft -= t;
		}
			 
		if (this.slidingLeft) {
			var maxLeft = -this.hiddenWidth;
			//Sliding to the left
			this.doSlide(el, Math.max(maxLeft, newLeft), '0.5s');
		} else {
			//Sliding to the right
			this.doSlide(el, Math.min(0, newLeft), '0.5s');
		}
			 
		this.startX = null;
	}
};	
//----------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------
// Lazy Load SlideUp
//----------------------------------------------------------------------------------------------------------
var lazyLoad = {
	slideUpSetUp: function (/*string*/ elemSelector, /*Slide height, int*/ slideDelta) {
		var elems = document.querySelectorAll(elemSelector); 
		var slideDelta = slideDelta; 
		var slideUp = lazyLoad.inWindow(elems, slideDelta);	

		if (slideUp.length > 0) {
			for(let i = 0; i < slideUp.length; i++){
				slideUp[i].classList.add('active');
			}
		}

		window.addEventListener('scroll', function () {
			var slideUp = lazyLoad.inWindow(elems, slideDelta);
			if (slideUp.length > 0) {
				for(let i = 0; i < slideUp.length; i++){
					slideUp[i].classList.add('active');
				}
			}
		});		
	},

	inWindow: function (elems, slideDelta) {
		var scrollTop = window.scrollY,
			windowHeight =  window.innerHeight,
			currentEls = elems,
			result = [];
		for(let i = 0; i < currentEls.length; i++){
			if( scrollTop <= currentEls[i].offsetTop && 
				((currentEls[i].offsetTop - slideDelta) + currentEls[i].offsetHeight) < (scrollTop + windowHeight) )
				result.push(currentEls[i]);
		}
		
	  	return result;
	}
}


document.addEventListener("DOMContentLoaded", function(event) {
	//	Initialize touchslider
	touchslider.createSlidePanel('.js-touch-list', 366, 16);

	//	Keyframes, Lazy Load Slide Up listener
	lazyLoad.slideUpSetUp('.js-slide-up', 400);	

	//**********************************
	//Dropdown-Menu
	//**********************************
	//Open Dropdown-Menu
	document.querySelector('.js-choice').addEventListener('click', function(e){
		e.stopPropagation();
		document.querySelector('.js-dropdown').classList.toggle('active');
	}, false);
	//Close Dropdown-Menu
	window.addEventListener('click', function(e){
		document.querySelector('.js-dropdown').classList.remove('active');
	});
	//Add selected value to input
	var dropDownMenuItems = document.querySelectorAll('.js-dropdown-menu-item');
	for(let i = 0; i < dropDownMenuItems.length; i++){
		dropDownMenuItems[i].addEventListener('click', function(){
			document.querySelector('#choice').value = this.querySelector('a').innerHTML;
		});		
	}

});
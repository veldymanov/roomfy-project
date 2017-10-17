"use strict";var touchslider={log:function(t){var e=document.getElementById("log");e.innerHTML=e.innerHTML+"<br>"+t},createSlidePanel:function(t,e,i){var s=document.querySelector(t),n=(i=i||0)/2;s.parentElement.style.cssText="margin: 0 auto; overflow: hidden;",s.style.cssText="left: 0px; list-style-type: none; margin: 0; padding: 0; position: relative;",s.querySelectorAll(".js-touch-list-item").forEach(function(t){t.style.cssText="height: 95%; left: "+n+"px; position:absolute; width: "+e+"px;",n+=e+i}),touchslider.width=n,touchslider.padding=i,touchslider.colWidth=e+i;try{document.createEvent("TouchEvent"),touchslider.makeTouchable(s)}catch(t){}finally{touchslider.touchAreaSize(s),window.addEventListener("resize",function(){touchslider.touchAreaSize(s)}),touchslider.prevBtn=s.parentElement.querySelector(".js-prev"),touchslider.nextBtn=s.parentElement.querySelector(".js-next"),touchslider.prevBtn.addEventListener("click",function(){touchslider.prevClick(s)}),touchslider.nextBtn.addEventListener("click",function(){touchslider.nextClick(s)}),touchslider.doSlide(s,0,"0s")}},prevClick:function(t){var e=parseInt(t.style.left,10),i=this.width-t.parentElement.offsetWidth;e%this.colWidth==0&&(e-=this.colWidth,Math.abs(e)<=Math.abs(i)&&this.doSlide(t,e,"0.5s"))},nextClick:function(t){var e=parseInt(t.style.left,10);e%this.colWidth==0&&(e+=this.colWidth)<=0&&this.doSlide(t,e,"0.5s")},touchAreaSize:function(t){t.parentElement.style.width="100%";var e=t.parentElement.offsetWidth,i=Math.floor(e/touchslider.colWidth)*touchslider.colWidth;t.parentElement.style.width=i+"px",touchslider.hiddenWidth=touchslider.width-i},makeTouchable:function(t){t.addEventListener("touchstart",function(t){touchslider.touchStart(this,t)},!1),t.addEventListener("touchmove",function(t){touchslider.touchMove(this,t)},!1),t.addEventListener("touchend",function(t){touchslider.touchEnd(this,t)},!1)},touchStart:function(t,e){t.style.transition="left 0s",this.startX=e.targetTouches[0].clientX,this.startY=e.targetTouches[0].clientY,this.slider=0,this.startLeft=parseInt(t.style.left,10),this.touchStartTime=(new Date).getTime()},touchMove:function(t,e){var i=e.targetTouches[0].clientX-this.startX,s=e.targetTouches[0].clientY-this.startY;if(0===this.slider&&Math.abs(s)>Math.abs(i))this.slider=-1;else if(-1!=this.slider){e.preventDefault(),this.slider=1;var n=i+this.startLeft;t.style.left=n+"px",this.startX>e.targetTouches[0].clientX?this.slidingLeft=!0:this.slidingLeft=!1}},touchEnd:function(t,e){parseInt(t.style.left,10)>0?(this.doSlide(t,0,"1s"),this.startX=null):Math.abs(parseInt(t.style.left,10))>this.hiddenWidth?(this.doSlide(t,-this.hiddenWidth+this.padding/2,"1s"),this.startX=null):this.slideMomentum(t,e)},doSlide:function(t,e,i){t.style.left=e+"px",t.style.transition="left "+i,0===e?(this.nextBtn.classList.remove("is-active"),Math.abs(e)<this.hiddenWidth-this.padding/2&&this.prevBtn.classList.add("is-active")):Math.abs(e)>=this.hiddenWidth-this.padding/2?(this.prevBtn.classList.remove("is-active"),this.nextBtn.classList.add("is-active")):(this.prevBtn.classList.add("is-active"),this.nextBtn.classList.add("is-active"))},slideMomentum:function(t,e){var i=65*((new Date).getTime()-this.touchStartTime),s=parseInt(t.style.left,10),n=12e3*(Math.abs(this.startLeft)-Math.abs(s)),o=s+(i=Math.round(n/i)),d=o%this.colWidth;if(Math.abs(d)>this.colWidth/2?o-=this.colWidth-Math.abs(d):o-=d,this.slidingLeft){var l=-this.hiddenWidth;this.doSlide(t,Math.max(l,o),"0.5s")}else this.doSlide(t,Math.min(0,o),"0.5s");this.startX=null}},lazyLoad={slideUpSetUp:function(t,e){var i=document.querySelectorAll(t),e=e,s=lazyLoad.inWindow(i,e);s.length>0&&s.forEach(function(t){t.classList.add("active")}),window.addEventListener("scroll",function(){var t=lazyLoad.inWindow(i,e);t.length>0&&t.forEach(function(t){t.classList.add("active")})})},inWindow:function(t,e){var i=window.scrollY,s=window.innerHeight,n=[];return t.forEach(function(t){i<=t.offsetTop&&t.offsetTop-e+t.offsetHeight<i+s&&n.push(t)}),n}};document.addEventListener("DOMContentLoaded",function(t){touchslider.createSlidePanel(".js-touch-list",366,16),lazyLoad.slideUpSetUp(".js-slide-up",400),document.querySelector(".js-choiceBtn").addEventListener("click",function(t){t.stopPropagation(),document.querySelector(".js-dropdown").classList.toggle("active")},!1),window.addEventListener("click",function(t){document.querySelector(".js-dropdown").classList.remove("active")})});
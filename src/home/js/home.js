jQuery(document).ready(function(){
    $('p a').css({'background-color': '#ccc'});
});

////////////////////////////////////////////////////////////////////////////////////////////////
//Register Service Worker
////////////////////////////////////////////////////////////////////////////////////////////////
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js')
		.then( reg => console.log('Service Worker registration succeeded. Scope is ' + reg.scope) )
		.catch( error => console.log('Registration failed' + error) )
}
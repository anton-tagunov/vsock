// Define a new module. This time we declare a dependency on
// the ngResource module, so we can work with the Etsy API

var app = angular.module("switchableGrid", ['ngResource']);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

// Create and register the new etsy service
app.factory('etsy', function($resource){
	return {
		fetchGoods: function(callback){

			// The ngResource module gives us the $resource service. It makes working with
			// AJAX easy.

			var api = $resource('https://openapi.etsy.com/v2/shops/vsocks/listings/active.js',{
				api_key: 'poptvcbpp9zmj8mlh6m6kcjd',
                includes: 'Images',
				callback: 'JSON_CALLBACK'
			},{
				// This creates an action which we've chosen to name "fetch". It issues
				// an JSONP request to the URL of the resource. JSONP requires that the
				// callback=JSON_CALLBACK part is added to the URL.

				fetch:{method: 'jsonp'}
			});
			api.fetch(function(response){
				// Call the supplied callback function
				callback(response.results);

			});
		}
	}

});

// The controller. Notice that I've included our etsy service which we
// defined below. It will be available inside the function automatically.

function SwitchableGridController($scope, etsy){

	// Default layout of the app. Clicking the buttons in the toolbar
	// changes this value.

	$scope.layout = 'grid';

	$scope.pics = [];

	// Use the etsy service and fetch a list of the popular pics
	etsy.fetchGoods(function(goods){

		// Assigning the pics array will cause the view
		// to be automatically redrawn by Angular.
		var im = goods.map(function(item) {
			return item;
		});
		$scope.pics = im;
		console.log(im);
	});

}

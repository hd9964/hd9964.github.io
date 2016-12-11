
var Yike = angular.module('Yike', ['ngRoute', 'Controllers', 'Directives']);

// 配置路由
Yike.config(['$routeProvider', function ($routeProvider) {

	$routeProvider.when('/today', {
		templateUrl: './views/today.html',
		controller: 'TodayController'
	})
	.when('/older', {
		templateUrl: './views/older.html',
		controller: 'OlderController'
	})
	.when('/hot', {
		templateUrl: './views/author.html',
		controller: 'HotController'
	})
	.otherwise({
		redirectTo: '/today'
	})

}]);

// 直接运行根作用域 
// 目的添加全局属性或方法
Yike.run(['$rootScope', function ($rootScope) {

	$rootScope.collapsed = false;

	$rootScope.toggle = function () {
		// 切换导航菜单
		$rootScope.collapsed = !$rootScope.collapsed;

		// 
		var navs = document.querySelectorAll('.navs dd');

		if($rootScope.collapsed) {
			// 显示

			angular.forEach(navs, function (val, key) {

				val.style.transitionDuration = 0.3 * key + 's';

				val.style.transitionDelay = '0.3s';

				val.style.transform = 'translate(0)';

			});

		} else {
			// 隐藏

			var len = navs.length - 1; // 5;
			angular.forEach(navs, function (val, key) {

				// len - key;
				navs[len - key].style.transitionDuration = key * 0.3 + 's';
				navs[len - key].style.transform = 'translate(-100%)';
				navs[len - key].style.transitionDelay = '0';

			});
		}
	}

}]);

// Yike.controller('DemoController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
// }]);

var Yike = angular.module('Yike', ['ngRoute']);

// 配置路由
Yike.config(['$routeProvider', function ($routeProvider) {

	$routeProvider.when('/', {
		templateUrl: './views/today.html'
	})
	.when('/older', {
		templateUrl: './views/older.html'
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

// 处理导航
Yike.controller('NavsController', ['$scope', function($scope) {
	$scope.navs = [
		{link: '#/', text: '今日一刻', icon: 'icon-home'},
		{link: '#/', text: '往期内容', icon: 'icon-file-empty'},
		{link: '#/', text: '热门作者', icon: 'icon-pencil'},
		{link: '#/', text: '栏目浏览', icon: 'icon-menu'},
		{link: '#/', text: '我的喜欢', icon: 'icon-heart'},
		{link: '#/', text: '设置', icon: 'icon-cog'},
	];
}])

// Yike.controller('DemoController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
// }])
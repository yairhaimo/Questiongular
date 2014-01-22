(function() {
		var app = angular.module('questiongular', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'firebase', 'ngSanitize', 'xeditable']);


		app.config(['$stateProvider', '$urlRouterProvider',
			function($stateProvider, $urlRouterProvider) {
				$urlRouterProvider.otherwise('/');

				$stateProvider
					.state('root', {
						abstract: true,
						url: '/',
						templateUrl: 'app/partials/master.html',
						controller: 'MasterController'
							// ,
							// 'content@': {
							// 	templateUrl: 'app/partials/home.html',
							// 	controller: 'HomeController'
							// }

					})
				.state('root.search', {
					url: '',
					templateUrl: 'app/partials/search.html',
					controller: 'SearchController'
				})
				.state('root.topic', {
					url: '^/topic/:id',
					templateUrl: 'app/partials/topic.html',
					controller: 'TopicController',
					resolve: {
						topic: function($stateParams, Topics, $sce) {
							return Topics[$stateParams.id];;
						}
					}
				})
				.state('root.add', {
					url: '^/add',
					templateUrl: 'app/partials/add.html',
					controller: 'AddController'

				})
				.state('root.getstarted', {
					url: '^/getstarted',
					templateUrl: 'app/partials/getstarted.html',
					controller: 'GetStartedController'

				});
		}]);


	app.constant('appurl', 'https://questiongular.firebaseio.com')

	app.run(['$rootScope', '$window', 'editableOptions', '$state',
		function($rootScope, $window, editableOptions, $state) {
			$rootScope.navigateTo = function(url) {
				$window.location.href = url;
			};
			editableOptions.theme = 'bs3';
			$rootScope.$state = $state;
		}
	]);


	app.factory('Topics', ['$firebase', 'appurl',
		function($firebase, appurl) {
			var postsurl = appurl +'/posts/';
			var ref = new Firebase(postsurl);

			return $firebase(ref);
		}
	]);

	app.factory('Auth', ['$firebaseSimpleLogin', 'appurl', function($firebaseSimpleLogin, appurl){
		var ref = new Firebase(appurl);
      	return $firebaseSimpleLogin(ref);
	}]);

	app.controller('MasterController', ['$scope', 'Auth',
		function($scope, Auth) {
      		$scope.auth = Auth;
		}
	]);

	app.controller('SearchController', ['$scope', 'Topics',
		function($scope, Topics) {
			// $scope.searchresults = Topics.getAll();
			$scope.searchresults = Topics;
			$scope.SEARCHLIMIT = 10;
		}
	]);


	app.controller('TopicController', ['$scope', 'topic',
		function($scope, topic) {
			$scope.topic = topic;
		}
	]);

	app.controller('AddController', ['$scope', 'Topics', 'Auth', '$state',
		function($scope, Topics, Auth, $state) {
			$scope.topic = {
				links: [],
				timestamp: new Date(),
				content: 'Topic Content',
				addedby: Auth.user.username
			};

			$scope.addLink = function() {
				var icon = figureIcon();
				$scope.topic.links.push({
					href: $scope.addedlink.href,
					icon: icon
				});
			};


			$scope.saveTopic = function() {
				var re = new RegExp('\n', 'g');
				$scope.topic.content = $scope.topic.content.replace(re, '<br/>');
				Topics.$add($scope.topic);
				$state.go('root.search');
//				$state.go('root.topic', {id:topicid});
				//Topics.$save();
			}

			function figureIcon() {
				var _icon;
				if ($scope.addedlink.href.indexOf('stackoverflow.com') > -1) {
					_icon = "http://www.skrenta.com/images/stackoverflow.jpg";
				} else if ($scope.addedlink.href.indexOf('angularjs.org') > -1) {
					_icon = "http://www.chromein.com/public/crx/ighdmehidhipcmcojjgiloacoafjmpfk/icon.png";
				} else if ($scope.addedlink.href.indexOf('plnkr.co') > -1) {
					_icon = "http://plnkr.co/img/plunker.png";
				}

				return _icon;
			}

		}
	]);

	app.controller('GetStartedController', ['$scope', 
		function($scope) {
		}
	]);

}());
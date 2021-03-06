'use strict';

/**
 * @ngdoc function
 * @name stockManApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stockManApp
 */
angular.module('stockManApp')
  .controller('MainCtrl', function ($scope, $location, WatchlistService, LoginService) {
    //populate watchlists
    $scope.watchlists = WatchlistService.query();
    $scope.user = LoginService;
    //Using $location.path() function as a $watch expression
    $scope.$watch( function() {
        return $location.path();
    }, function(path) {
        if (_.contains(path, 'watchlist')) {
            $scope.activeView = 'watchlist';
        } else {
            $scope.activeView = 'dashboard';
        }
        
    }
        
    );
  });

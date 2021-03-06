'use strict';

/**
 * @ngdoc directive
 * @name stockManApp.directive:stkWatchlistPanel
 * @description
 * # stkWatchlistPanel
 */
angular.module('stockManApp')
    .directive('stkWatchlistPanel', function ($location, $modal, $routeParams, WatchlistService) {
        return {
            templateUrl: 'views/templates/watchlist-panel.html',
            restrict: 'E',
            link: function ($scope) {
                // [2] Initialize variables
                $scope.watchlist = {};
                var addListModal = $modal({
                    scope: $scope,
                    templateUrl: 'views/templates/addlist-modal.html',
                    show: false
                });
                // [3] Bind model from service to this scope
                $scope.watchlists = WatchlistService.query();
                // [4] Display addlist modal
                $scope.showModal = function () {
                    addListModal.$promise.then(addListModal.show);
                };
                // [5] Create a new list from fields in modal
                $scope.createList = function () {
                    WatchlistService.save($scope.watchlist);
                    addListModal.hide();
                    $scope.watchlist = {};
                };
                // [6] Delete desired list and redirect to home
                $scope.deleteList = function (list) {
                    WatchlistService.remove(list);
                    $location.path('/');
                };
                //[7]  Get current selected list item 
                $scope.currentList = $routeParams.listId;
                //[8] route to selected item view
                $scope.gotoList = function (listId) {
                    $location.path('watchlist/' + listId);
                };
            }
        };
    });

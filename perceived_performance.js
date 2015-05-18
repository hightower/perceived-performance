(function () {
    "use strict";

    angular.module("perceived-performance", []);

    angular.module("perceived-performance").service("performanceTimer", function () {
        this.startTime = undefined;
        this.reset = function () {
            this.startTime = (new Date).getTime();
        };
        return this;
    });

    angular.module("perceived-performance").directive("performance", function () {
        return {
            restrict: "A",
            scope: {
                performance: "@",
                performanceUrl: "@"
            },
            controller: ["$scope", "$http", "$state", "performanceTimer", function ($scope, $http, $state, performanceTimer) {
                var divs = [];
                var initialLoad = true;

                this.done = function (scopeId) {
                    var index = divs.indexOf(scopeId);
                    if (index >= 0) divs.splice(index, 1);

                    if (index >= 0 && divs.length == 0) {
                        var finishTime = (new Date).getTime() - performanceTimer.startTime;
                        var initial = undefined
                        if (window.performance && initialLoad) {
                            initial = window.performance.timing.domComplete - window.performance.timing.fetchStart;
                        }
                        $http.post($scope.performanceUrl, {content: finishTime, initial: initial, name: $scope.performance || $state.current.name});
                    }
                    initialLoad = false;
                };

                this.register = function (scopeId) {
                    divs.push(scopeId);
                };

                return this;
            }]
        }
    });

    angular.module("perceived-performance").directive("performanceLoaded", ["$timeout", function ($timeout) {
        return {
            restrict: "A",
            require: "^performance",
            link: function (scope, _, attrs, ctrl) {
                ctrl.register(scope.$id);
                var unwatchLoaded = scope.$watch(attrs.performanceLoaded, function (newValue, oldValue) {
                    if (newValue) {
                        scope.$evalAsync(function () {
                            ctrl.done(scope.$id);
                        });
                        unwatchLoaded();
                    }
                });
            }
        }
    }]);
})();

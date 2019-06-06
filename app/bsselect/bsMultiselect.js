var app = angular.module('myApp', []);
app.controller('myController', function($scope) {
    $scope.items = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6'];
    $scope.itemModel = ['item 1', 'item 2', 'item 3', 'item 4'];
});
app.directive('bsSelect', function() {

    return {
        restrict: 'E',
        require: '^ngModel',
        scope: {
            items: '=',
            textField: '@',
            valueField: '@',
            ngModel: '='
        },
        template: `<div class="btn-group">
        <span class="btn button-label btn-info">{{currentItemLabel}}{{itemSelected}}</span>
        <button class="btn btn-info dropdown-toggle" data-toggle="dropdown">
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" style="max-height:300px;overflow-y:scroll">
            <li ng-repeat="item in items" ng-click="cancelClose($event)" ng-class="{red: hover,blue:setCheckboxChecked(item)}" ng-mouseenter="hover = true" ng-mouseleave="hover = false">
                <div class="input-group">
                    <input type="checkbox" ng-checked="setCheckboxChecked(item)" ng-click="selectVal(item,$index)">
                    <a href="" tabindex="-1"> {{item}}</a>
                </div>
            </li>
        </ul>
    </div>`,
        link: function(scope, element, attrs, ngModelCtrl) {
            //added a watch to update the text of the multiselect
            scope.$watch('ngModel', function(v) {
                scope.setLabel();
            }, true);
            //

            var modelIsValid = false;
            var selectedItemIsValid = false;

            scope.checkModelValidity = function(items) {
                if (typeof(items) == "undefined" || !items) return false;
                if (items.length < 1) return false;
                return true;
            };
            modelIsValid = scope.checkModelValidity(scope.ngModel);
            scope.setFormValidity = function() {
                if (typeof(attrs.required) != "undefined") {
                    return modelIsValid; //modelIsValid must be set before we setFormValidity
                }
                return true;
            };
            ngModelCtrl.$setValidity('noItemsSet!', scope.setFormValidity());
            scope.checkSelectedItemValidity = function(item) {
                if (!item) return false;
                if (!item) return false;
                if (!item.trim()) return false;
                return true;
            };

            scope.getItemName = function(item) {
                return item;
            };


            scope.setLabel = function() {
                if (typeof(scope.ngModel) == "undefined" || !scope.ngModel || scope.ngModel.length < 1) {

                    scope.currentItemLabel = attrs.defaultText;

                } else {
                    var allItemsString = '';
                    var selectedItemsCount = scope.ngModel.length;
                    scope.itemSelected = scope.ngModel;
                    if (selectedItemsCount < 3) {
                        angular.forEach(scope.ngModel, function(item) {
                            allItemsString += item + ', ';
                        });
                    } else {
                        allItemsString = selectedItemsCount + " selected!";
                    }
                    scope.currentItemLabel = allItemsString;
                }
            };
            scope.setLabel();
            scope.setCheckboxChecked = function(_item) {
                var found = false;
                angular.forEach(scope.ngModel, function(item) {
                    if (!found) {
                        if (_item === item) {
                            found = true;
                        }
                    }
                });
                return found;
            };
            scope.selectVal = function(_item) {
                var found = false;
                if (typeof(scope.ngModel) != "undefined" && scope.ngModel) {
                    for (var i = 0; i < scope.ngModel.length; i++) {
                        if (!found) {
                            if (_item === scope.ngModel[i]) {
                                found = true;
                                var index = scope.ngModel.indexOf(scope.ngModel[i]);
                                scope.ngModel.splice(index, 1);
                            }
                        }
                    }
                } else {
                    scope.ngModel = [];
                }
                if (!found) {
                    scope.ngModel.push(_item);
                }
                modelIsValid = scope.checkModelValidity(scope.ngModel);
                selectedItemIsValid = scope.checkSelectedItemValidity(_item);
                ngModelCtrl.$setValidity('noItemsSet!', scope.setFormValidity() && selectedItemIsValid);
                scope.setLabel();
                ngModelCtrl.$setViewValue(scope.ngModel);
            };

            scope.cancelClose = function($event) {
                $event.stopPropagation();
            };
        }
    };
});
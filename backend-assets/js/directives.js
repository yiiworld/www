angular.module('directives', [])

  .directive('ngDatePicker', DatePicker)
  .directive('ngDatetimePicker', DatetimePicker)
  .directive('ngScrollPane', ['$window', '$timeout', ScrollPane]);

function DatePicker() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      dateStart: '=ngDateStart'
    },
    link: function (scope, element, attrs, ngModelCtrl) {
      element.datetimepicker({
        format: 'dd.mm.yyyy',
        autoclose: true,
        weekStart: 1,
        minView: 'month'
      });

      scope.$watch('dateStart', function (val) {
        element.datetimepicker(
          'setStartDate',
          typeof val === 'undefined'
            ? null
            : val.substr(0, 10)
        );
      });
    }
  };
}

function DatetimePicker() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      dateStart: '=ngDateStart'
    },
    link: function (scope, element, attrs, ngModelCtrl) {
      element.datetimepicker({
        format: 'dd.mm.yyyy hh:ii',
        autoclose: true,
        weekStart: 1
      });

      scope.$watch('dateStart', function (val) {
        element.datetimepicker(
          'setStartDate',
          typeof val === 'undefined'
            ? null
            : val.substr(0, 10)
        );
      });
    }
  };
}

function ScrollPane($window, $timeout) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div class="scroll-pane"><div ng-transclude></div></div>',
    link: function ($scope, $elem, $attrs) {
      var config = {
        mouseWheelSpeed: 80,
        horizontalGutter: 0,
        verticalGutter: 0
      };

      var $$window = angular.element($window);

      if (typeof $attrs.id === 'undefined') {
        $attrs.id = 'scroll-pane-' + parseInt(Math.random() * 10000000);
        $attrs.$$element.attr('id', $attrs.id);
      }

      if (typeof $attrs.ngScrollPane !== 'undefined') {
        config = angular.extend({}, config, $scope.$eval($attrs.ngScrollPane));
      }

      var fn = function () {
        var $pane = jQuery('#' + $attrs.id);

        if ($attrs.scrollFitToWindow) {
          var offset = parseInt($scope.$eval($attrs.scrollFitToWindow));
          offset = isNaN(offset) ? 0 : offset;
          $pane.height(angular.element($window).height() + offset);
        }

        $pane.jScrollPane(config);

        $scope.pane = $pane.data('jsp');

        $$window.trigger('resize');
      };

      if (typeof $attrs.scrollTimeout === 'string') {
        $timeout(fn, $scope.$eval($attrs.scrollTimeout));
      } else {
        fn();
      }

      $scope.$on('scrollpane-scroll-to', function (event, id, selector) {
        if (id === $attrs.id && $scope.pane) {
          $scope.pane.scrollToElement(jQuery('#' + id + ' ' + selector), false, true);
        }
      });

      $scope.$on('scrollpane-reinit', function (event, id) {
        if (id === $attrs.id && $scope.pane) {
          return $scope.$apply(function () {
            $scope.pane.reinitialise();

            return fn();
          });
        }
      });

      $scope.$on('scrollpane-reinit-all', function (event) {
        if ($scope.pane) {
          $timeout(function () {
            $scope.pane.reinitialise();

            return fn();
          });
        }
      });

      $$window.on('resize', function () {
        if ($scope.pane) {
          var $pane = angular.element('#' + $attrs.id),
            $content = $pane.find('.jspPane'),
            content_height = $content.height(),
            window_height = $$window.height() - angular.element('.main-header').height();

          if (content_height > window_height) {
            $pane.height(window_height);
          } else {
            $pane.height(content_height);
          }

          $scope.pane.reinitialise();
        }
      });

      return $scope;
    }
  };
}
(function(ionic) {

  // Get transform origin poly
  var d = document.createElement('div');
  var transformKeys = ['webkitTransformOrigin', 'transform-origin', '-webkit-transform-origin', 'webkit-transform-origin',
              '-moz-transform-origin', 'moz-transform-origin', 'MozTransformOrigin', 'mozTransformOrigin'];

  var TRANSFORM_ORIGIN = 'webkitTransformOrigin';
  for(var i = 0; i < transformKeys.length; i++) {
    if(d.style[transformKeys[i]] !== undefined) {
      TRANSFORM_ORIGIN = transformKeys[i];
      break;
    }
  }

  var transitionKeys = ['webkitTransition', 'transition', '-webkit-transition', 'webkit-transition',
              '-moz-transition', 'moz-transition', 'MozTransition', 'mozTransition'];
  var TRANSITION = 'webkitTransition';
  for(var i = 0; i < transitionKeys.length; i++) {
    if(d.style[transitionKeys[i]] !== undefined) {
      TRANSITION = transitionKeys[i];
      break;
    }
  }

  var SwipeableCardController = ionic.controllers.ViewController.inherit({
    initialize: function(opts) {
      this.cards = [];

      var ratio = window.innerWidth / window.innerHeight;

      this.maxWidth = window.innerWidth - (opts.cardGutterWidth || 0);
      this.maxHeight = opts.height || 300;
      this.cardGutterWidth = opts.cardGutterWidth || 10;
      this.cardPopInDuration = opts.cardPopInDuration || 400;
      this.cardAnimation = opts.cardAnimation || 'pop-in';
    },
    /**
     * Push a new card onto the stack.
     */
    pushCard: function(card) {
      var self = this;

      this.cards.push(card);
      this.beforeCardShow(card);

      card.transitionIn(this.cardAnimation);
      setTimeout(function() {
        card.disableTransition(self.cardAnimation);
      }, this.cardPopInDuration + 100);
    },
    /**
     * Set up a new card before it shows.
     */
    beforeCardShow: function() {
      var nextCard = this.cards[this.cards.length-1];
      if(!nextCard) return;

      // Calculate the top left of a default card, as a translated pos
      var topLeft = window.innerHeight / 2 - this.maxHeight/2;
      // console.log(window.innerHeight, this.maxHeight);

      var cardOffset = Math.min(this.cards.length, 3) * 5;

      // Move each card 5 pixels down to give a nice stacking effect (max of 3 stacked)
      nextCard.setPopInDuration(this.cardPopInDuration);
      nextCard.setZIndex(this.cards.length);
    },
    /**
     * Pop a card from the stack
     */
    popCard: function(animate) {
      var card = this.cards.pop();
      if(animate) {
        card.swipe();
      }
      return card;
    }
  });

  var SwipeableCardView = ionic.views.View.inherit({
    /**
     * Initialize a card with the given options.
     */
    initialize: function(opts) {
      opts = ionic.extend({
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;

      this.startX = this.startY = this.x = this.y = 0;

      this.bindEvents();
    },

    /**
     * Set the X position of the card.
     */
    setX: function(x) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px,' + this.y + 'px, 0)';
      this.x = x;
      this.startX = x;
    },

    /**
     * Set the Y position of the card.
     */
    setY: function(y) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px,' + y + 'px, 0)';
      this.y = y;
      this.startY = y;
    },

    /**
     * Set the Z-Index of the card
     */
    setZIndex: function(index) {
      this.el.style.zIndex = index;
    },

    /**
     * Set the width of the card
     */
    setWidth: function(width) {
      this.el.style.width = width + 'px';
    },

    /**
     * Set the height of the card
     */
    setHeight: function(height) {
      this.el.style.height = height + 'px';
    },

    /**
     * Set the duration to run the pop-in animation
     */
    setPopInDuration: function(duration) {
      this.cardPopInDuration = duration;
    },

    /**
     * Transition in the card with the given animation class
     */
    transitionIn: function(animationClass) {
      var self = this;

      this.el.style.display = 'block';
      setTimeout(function() {
        self.el.classList.remove(animationClass + '-start');
      }, 100);
    },

    /**
     * Disable transitions on the card (for when dragging)
     */
    disableTransition: function(animationClass) {
      this.el.classList.remove(animationClass);
    },

    /**
     * Swipe a card out programtically
     */
    swipeRight: function() {
      this.transitionOut(true);
    },
    swipeLeft: function() {
      this.transitionOut(false);
    },

    /**
     * Fly the card out or animate back into resting position.
     */
    transitionOut: function(right) {
      var self = this;
        var rotateTo = (this.rotationAngle + (this.rotationDirection * 0.6)) || (Math.random() * 0.4);
        var duration = this.rotationAngle ? 0.2 : 0.5;
        this.el.style[TRANSITION] = '-webkit-transform '+duration+'s ease-in-out';
        this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (right ? '-':'')+(window.innerHeight * 1.5) + 'px ,' + this.y + 'px, 0) rotate(' + rotateTo + 'rad)';
        !right && this.onSwipeLeft && this.onSwipeLeft();
        right && this.onSwipeRight && this.onSwipeRight();

        // Trigger destroy after card has swiped out
        setTimeout(function() {
          self.onDestroy && self.onDestroy();
        }, 200);
    },

    /**
     * Fly the card out or animate back into resting position.
     */
    transitionBack: function() {
      var self = this;
      var duration = this.rotationAngle ? 0.2 : 0.5;
      this.el.style[TRANSITION] = '-webkit-transform '+duration+'s ease-in-out';
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.startX + 'px ,' + this.y + 'px, 0)';

      // Trigger destroy after card has swiped out
      setTimeout(function() {
        // this.el.style[TRANSITION] = 'none';
      }, 200);
    },

    /**
     * Bind drag events on the card.
     */
    bindEvents: function() {
      var self = this;
      ionic.onGesture('dragstart', function(e) {
        var cx = window.innerWidth / 2;
        if(e.gesture.touches[0].pageX < cx) {

          self._transformOriginRight();
        } else {
          self._transformOriginLeft();
        }
        ionic.requestAnimationFrame(function() { self._doDragStart(e); });
      }, this.el);

      ionic.onGesture('drag', function(e) {
        ionic.requestAnimationFrame(function() { self._doDrag(e); });
      }, this.el);

      ionic.onGesture('dragend', function(e) {
        ionic.requestAnimationFrame(function() { self._doDragEnd(e); });
      }, this.el);
    },

    // Rotate anchored to the left of the screen
    _transformOriginLeft: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'left center';
      this.rotationDirection = 1;
    },

    _transformOriginRight: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'right center';
      this.rotationDirection = -1;
    },

    _doDragStart: function(e) {
      var width = this.el.offsetWidth;
      var point = window.innerWidth / 2 + this.rotationDirection * (width / 2);
      var distance = Math.abs(point - e.gesture.touches[0].pageX);// - window.innerWidth/2);
      // console.log(distance);

      this.touchDistance = distance * 10;

      // console.log('Touch distance', this.touchDistance);//this.touchDistance, width);
    },

    _doDrag: function(e) {
      var o = e.gesture.deltaX / 3;

      /* 
       *  This will display TRUE or FALSE based on card swype movement
       *
      element_right = this.el.getElementsByClassName('direction-right')[0];
      element_left = this.el.getElementsByClassName('direction-left')[0];
      if (o > 0) {
        if (element_right.style.display === '' || element_right.style.display === 'none') {
          element_right.style.display = 'block';
          element_left.style.display = 'none';
        }
      } else {
        if (element_left.style.display === '' || element_left.style.display === 'none') {
          element_left.style.display = 'block';
          element_right.style.display = 'none';
        }
      }
      */ 

      this.rotationAngle = Math.atan(o/this.touchDistance) * this.rotationDirection;

      this.x = this.startX + (e.gesture.deltaX * 0.4);

      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px, ' + this.y  + 'px, 0) rotate(' + (this.rotationAngle || 0) + 'rad)';
    },
    _doDragEnd: function(e) {
      if(Math.abs(this.x - this.startX) < 15) {
        // this.el.getElementsByClassName('direction-left')[0].style.display = 'none';
        // this.el.getElementsByClassName('direction-right')[0].style.display = 'none';
        this.transitionBack(e);
      } else {
        this.transitionOut(this.x < 0);
      }
    }
  });


  angular.module('ionic.contrib.ui.cards', ['ionic'])

  .directive('swipeCard', ['$timeout', 'Settings', function($timeout, Settings) {
    return {
      restrict: 'E',
      template: '<div class="swipe-card" ng-transclude></div>',
      require: '^swipeCards',
      replace: true,
      transclude: true,
      scope: {
        onSwipeLeft: '&',
        onSwipeRight: '&',
        onDestroy: '&'
      },
      compile: function(element, attr) {
        return function($scope, $element, $attr, swipeCards) {
          var el = $element[0];
          var numberOfWords = $scope.$parent.card.name.split(' ').length;
          var question_time = (numberOfWords / Settings.time_to_read) * 60;

          var swipeableCard = new SwipeableCardView({
            el: el,
            onSwipeLeft: function() {
              $timeout(function() {
                $scope.onSwipeLeft();
              });
            },
            onSwipeRight: function() {
              $timeout(function() {
                $scope.onSwipeRight();
              });
            },
            onDestroy: function() {
              $timeout(function() {
                $scope.onDestroy();
              });
            },
          });
          $scope.$parent.swipeCard = swipeableCard;

          swipeCards.pushCard(swipeableCard);

        };
      }
    };
  }])

  .directive('swipeCards', ['$rootScope', function($rootScope) {
    return {
      restrict: 'E',
      template: '<div class="swipe-cards" ng-transclude></div>',
      replace: true,
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var swipeController = new SwipeableCardController({
        });

        $rootScope.$on('swipeCard.pop', function(isAnimated) {
          swipeController.popCard(isAnimated);
        });

        return swipeController;
      }
    };
  }])

  .factory('$ionicSwipeCardDelegate', ['$rootScope', function($rootScope) {
    return {
      popCard: function($scope, isAnimated) {
        $rootScope.$emit('swipeCard.pop', isAnimated);
      },
      getSwipebleCard: function($scope) {
        return $scope.$parent.swipeCard;
      }
    };
  }]);

})(window.ionic);

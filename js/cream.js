(function(root, factory) {
  // Set up Backbone appropriately for the environment.
  if (typeof exports !== 'undefined') {
    // Node/CommonJS, no need for jQuery in that case.
    return factory(root, exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports'], function(exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      return factory(root, {});
    });
  } else {
    // Browser globals
    root.Cream = factory(root, {});
  }
}(this, function(root) {
    if (!document.querySelectorAll) {
        document.querySelectorAll = function(selector) {
            var styleTag = document.documentElement.firstChild.createElement('STYLE');
            document.head.appendChild(styleTag);
            document.__qsaels = [];

            styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
            return document.__qsaels;
        };
    }

    function Cream(el) {

        return new function(el) {
            var elem = document.querySelectorAll(el),
                newTings = document.addEventListener !== undefined;

            this.events = {
                'click': 'click',
                'hover': 'mouseover'
            };

            this.on = function(eventArr, cbArr) {
                for(var i = 0; i < eventArr.length; i++) {
                    for(var j = 0; j < elem.length; j++) {
                        if(newTings) {
                            elem[j].addEventListener(eventArr[i], cbArr[i]);
                        } else {
                            elem[j].attachEvent('on'+eventArr[i], cbArr[i]);
                        }
                    }
                }

                return this;
            };

            this.trigger = function(event) {
                var ev;
                if(newTings) {
                    ev = document.createEvent('HTMLEvents');
                    ev.initEvent(event, true, true);
                } else {
                    ev = document.createEventObject();
                    ev.eventType = event;
                }

                ev.eventName = event;
                ev.memo = {};

                for(var j = 0; j < elem.length; j++) {
                    if(newTings) {
                        elem[j].dispatchEvent(ev);
                    } else {
                        elem[j].fireEvent('on'+ event, ev);
                    }
                }

                return this;
            };
        }(el);
    }

    return Cream;

}));
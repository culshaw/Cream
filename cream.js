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

    return new function() {
        var elem = document.querySelectorAll(el),
            newTings = document.addEventListener !== undefined;

        this.handles = {};

        this.on = function(eventArr, cbArr) {
            for(var i = 0; i < eventArr.length; i++) {
                for(var j = 0; j < elem.length; j++) {
                    if(newTings) {
                        elem[j].addEventListener(eventArr[i], cbArr[i], false);
                    } else {
                        elem[j].attachEvent('on'+eventArr[i], cbArr[i]);
                    }
                    this.handles[elem[j]+'-'+eventArr[i]] = cbArr[i];
                }
            }

            return this;
        };

        this.off = function(eventArr) {
            for(var i = 0; i < eventArr.length; i++) {
                for(var j = 0; j < elem.length; j++) {
                    if(this.handles[elem[j]+'-'+eventArr[i]]) {
                        if(newTings) {
                            elem[j].removeEventListener(eventArr[i], this.handles[elem[j]+'-'+eventArr[i]], false);
                        } else {
                            elem[j].detachEvent('on'+eventArr[i], this.handles[elem[j]+'-'+eventArr[i]], false);
                        }

                        // delete this.handles[elem[j]+'-'+eventArr[i]].
                    }
                }
            }            
        }

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
    };
}

var log = function(line) {
    var logger = document.getElementById('log');

    logger.innerHTML = logger.innerHTML + "\r\n"+ '> '+ line;
}

var click = Cream('#click').on(['click', 'sample'], [function(ev) {
    log('click');
}, function() {
    log('fired sample');

    var buttonSample = this;

    buttonSample.innerHTML = 'Boom';

    setTimeout(function() {
        buttonSample.innerHTML = 'Click';
    }, 2000);
}]);

Cream('#hover').on(['mouseenter', 'mouseout', 'click'], [function(ev) {
    log('mouseenter');
    this.innerHTML = 'Click to fire custom event';
}, function(ev) {
    log('mouseout');
}, function(ev) {

    this.innerHTML = 'Hover';

    click.trigger('sample');

    //click.off(['sample']);
}]);
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
    };
}

var click = new Cream('#click'),
    hover = new Cream('#hover');

click.on(['click', 'sample'], [function(ev) {
    console.log('click');
}, function() { console.log('fired sample'); }]);

hover.on(['mouseenter', 'mouseout', 'click'], [function(ev) {
    console.log('mouseenter');
}, function(ev) {
    console.log('mouseout');
}, function(ev) {
    click.trigger('sample');
}]);
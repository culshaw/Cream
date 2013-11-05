require(['cream'], function(Cream) {

    var click = Cream('#click').on(['click', 'sample'], [function(ev) {
        console.log('click');
    }, function() { console.log('fired sample'); }]);

    Cream('#hover').on(['mouseenter', 'mouseout', 'click'], [function(ev) {
        console.log('mouseenter');
    }, function(ev) {
        console.log('mouseout');
    }, function(ev) {
        click.trigger('sample');
    }]);
});
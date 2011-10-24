var gpObserveText = com.ginpen.gpObserveText;

module('units');

test('general', function() {
  ok(com.ginpen.gpObserveText, 'com.ginpen.gpObserveText');
  var $el = $('<textarea />');
  equal($el.gpObserveText()[0], $el[0], 'jQuery.fn.gpObserveText');
  $el.gpObserveText('destroy');
});

test('check command', function() {
  ok(!gpObserveText._isCommand($.noop), 'function');
  ok(gpObserveText._isCommand('command'), 'string');
  ok(gpObserveText._isCommand(null), 'null');
});

test('check observed', function() {
  $el = $('<textarea />');
  ok(!gpObserveText._isObserved($el), 'before');
  gpObserveText.startObserving($el);
  ok(gpObserveText._isObserved($el), 'after');
  gpObserveText.stopObserving($el);
  ok(!gpObserveText._isObserved($el), 'destroied');
});

test('start and stop observing', function() {
  $el = $('<textarea />').val('before');
  gpObserveText.startObserving($el);
  ok($el.data('gpObserveText.timer'), 'start');
  equal($el.data('gpObserveText.lastValue'), 'before', 'start');
  gpObserveText.stopObserving($el);
  ok(!$el.data('gpObserveText.timer'), 'stop');
});

test('triggering', 6, function() {
  $el = $('<textarea />').val('first');
  gpObserveText.startObserving($el);
  $el.one('textchange', function(event, lastValue) {
    equal(event.type, 'textchange', 'typical');
    equal(lastValue, 'first', 'typical');
    equal(this, $el[0], 'typical');
    equal(this.value, 'second', 'typical');

    $(this).one('textchange', function(event, lastValue) {
      equal(this.value, 'third', 'typical');
      gpObserveText.stopObserving($(this));
      ok(!$(this).data('gpObserveText.timer'));
      start();
    });
    $(this).val('third');
  });
  $el.val('second');
  stop();
});

test('check value', function() {
  var $el = $('<textarea />')
    .val('before')
    .data('gpObserveText.lastValue', 'before');
  ok(!gpObserveText._isChanged($el), 'not changed');
  $el.val('after');
  ok(gpObserveText._isChanged($el), 'changed');
});

test('fire', 2, function() {
  var $el = $('<div />')
    .data('gpObserveText.lastValue', 'before')
    .bind('textchange', function(event, lastValue) {
      equal(event.type, 'textchange', 'typical');
      equal(lastValue, 'before', 'typical');
    });
  gpObserveText._fire($el);
});

// --------------------------------

module('jQuery interface');

test('bind', 3, function() {
  $el = $('<textarea />').val('before');
  $el.gpObserveText();
  $el.bind('textchange', function(event) {
    equal(event.type, 'textchange', 'typical');
    equal(this, $el[0], 'typical');
    start();
  });
  $el.bind('textchange', function(event) {
    equal(this, $el[0], 'typical');
    start();
    $(this).gpObserveText('destroy');
  });
  $el.val('after');
  stop();
  stop();
});

test('param', function() {
  $el = $('<textarea />').val('before');
  $el.gpObserveText(function(event) {
    equal(event.type, 'textchange', 'typical');
    equal(this, $el[0], 'typical');
    start();
  });
  $el.gpObserveText(function(event) {
    equal(this, $el[0], 'typical');
    start();
    $(this).gpObserveText('destroy');
  });
  $el.val('after');
  stop();
  stop();
});

test('destroy', function() {
  $el = $('<textarea />').val('before');
  $el.gpObserveText();
  ok($el.data('gpObserveText.timer'), 'start');
  $el.gpObserveText('destroy');
  ok(!$el.data('gpObserveText.timer'), 'stop');
});

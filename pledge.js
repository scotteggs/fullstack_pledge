var $Promise = function() {
  this.state = 'pending';
  this.value = undefined;
  //handler groups has an array of objects, each containing one or two functions: success and error callbacks.
  this.handlerGroups = [];

}

$Promise.prototype.then = function(successCb, errorCb) {
  var group = {}

  if (typeof successCb === 'function')
    group.successCb = successCb;
  else group.successCb = undefined;

  if (typeof errorCb === 'function')
    group.errorCb = errorCb;
  else group.errorCb = undefined;

  this.handlerGroups.push(group)

  if(this.state === 'resolved')
    this.callHandlers(this.handlerGroups);
}

$Promise.prototype.callHandlers = function(handlerGroups) {
  // if(!handlerGroups.length) return;

  for(var i = 0; i < handlerGroups.length; i++) {
    if(!!handlerGroups[i].successCb)
      handlerGroups[i].successCb(this.value);

    if(!!handlerGroups[i].errorCb)
      handlerGroups[i].errorCb(this.value);
  }
  this.handlerGroups = [];

}

var Deferral = function() {
  this.$promise = new $Promise();
}

Deferral.prototype.resolve = function(data) {
  var thisP = this.$promise;
  if(thisP.state === 'pending') {
    thisP.state = 'resolved';
    if(!!data) thisP.value = data;
    thisP.callHandlers(thisP.handlerGroups)
  }
}

Deferral.prototype.reject = function(reason) {
  if(this.$promise.state === 'pending') {
    this.$promise.state = 'rejected';
    if(!!reason) this.$promise.value = reason;
  }
}

var defer = function() {
  return new Deferral();
}


























/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/

'use strict';

(function(){

angular
  .module('copayApp.services')
  .factory('sendFlowRouterService', sendFlowRouterService);
  
  function sendFlowRouterService(
    sendFlowStateService
    , $state, $ionicHistory, $timeout
  ) {

    var service = {
      // A separate state variable so we can ensure it is cleared of everything,
      // even other properties added that this service does not know about. (such as "coin")

      // Functions
      start: start,
      goNext: goNext,
      goBack: goBack,
    };

    return service;

    /**
     * 
     */
    function start() {
      if ($state.current.name != 'tabs.send') {
        $state.go('tabs.home').then(function () {
          $ionicHistory.clearHistory();
          $state.go('tabs.send').then(function () {
            $timeout(function () {
              goNext();
            }, 60);
          });
        });
      } else {
        goNext();
      }
    }

    /**
     * Strategy
     * https://bitcoindotcom.atlassian.net/wiki/x/BQDWKQ
     */
    function goNext() {
      var state = sendFlowStateService.state;

      var needsDestination = !state.toWalletId && !state.toAddress;
      var needsOrigin = !state.fromWalletId;
      var needsAmount = !state.amount && !state.sendMax;

      if (needsDestination) {
        if (!state.isWalletTransfer && !state.thirdParty) {
          $state.go('tabs.send');
          return;
        } else if (!needsOrigin) {
          $state.go('tabs.send.destination');
          return;
        }
      }
      
      if (needsOrigin) {
        $state.go('tabs.send.origin');
      } else if (needsAmount) {
        $state.go('tabs.send.amount');
      } else {
        $state.go('tabs.send.review');
      }
    }

    function goBack() {

      /**
       * Strategy
       */
      $ionicHistory.goBack();
    }
  };

})();
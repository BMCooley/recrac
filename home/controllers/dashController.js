angular.module('App')
  .controller('dashController', function ($scope, $http, $rootScope, userService, mappingTools, pushNotifications) {
    $scope.events = [];
    $scope.joinedEvents = () => {
      return $scope.events.reduce((joined, event) => {
        let found = false;
        event.potentialParticipants.forEach((seat) => {
          found = seat.user === user.data.user.user;
        });
        return found ? (joined.push(event) && joined) : joined;
      }, []);
    };
    mappingTools.getEvents().then(function(data) {
      $scope.events = data;
    });
    userService
      .authenticate()
      .then(function (user) { 
        $scope.user = user; 
        $rootScope.user = user;
      });
    $scope.updateUserInfo = function(id, email, number, description) {
      $http.put('/user/' + id, {email: email, number: number, description: description}, {contentType: 'application/json'})
        .then(function (response) {
          console.log('Put Successful: ', response);  
          return response.data;
        })
        .catch(function (response) {
          console.error('Put Failed', response);
        });
    };

    $scope.subscribeUser = function (evt) {
      pushNotifications.setupSubscription();
    };
    
    $scope.isSubscribed = false;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          console.log(!!subscription.endpoint);
          $scope.isSubscribed = (!!subscription.endpoint);
        });
    });

    $scope.hasPush = pushNotifications.hasPushNotifications;
  });
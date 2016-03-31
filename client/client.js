
angular.module('app', ['ngMaterial'])

    .component('main', {
        templateUrl: 'main.html',
        controller: MainCtrl,
        bindings: {
        }
    });

function MainCtrl($http) {
    this.greeting = 'hi';
}

MainCtrl.prototype.sayHi = function() {
    console.log(this.greeting);
}
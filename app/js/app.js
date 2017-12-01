import $ from 'jquery';
import anime from 'animejs';
import charm from 'charming';
import blazy from 'blazy';

window.Popper = require('popper.js');
window.jQuery = $;
window.$ = $;
global.jQuery = $;
const bootstrap = require('bootstrap');
// import bootstrap from 'bootstrap';


// Angular app ini
var app = angular.module("demoApp",['ngRoute']);

/* ----------------------- ROUTES --------------------------*/
// Routes configuration
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	// Fix hash bang
	$locationProvider.hashPrefix('');

	// Setup router
	$routeProvider
	.when('/',{
		templateUrl: 'landing.html',
		controller: 'landingCtrl'
	})
	.when('/gallery',{
		templateUrl: 'gallery.html',
		controller: 'galleryCtrl',
		resolve: {}
	});

}]);

// Loader configuration
app.run(['$rootScope','$timeout','$location',function($rootScope,$timeout,$location) {

	// Animate loader overlay and kick in lazyload effect (effect only)
	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		if(next.resolve){
			document.querySelector('body').style.overflow = "hidden";
			document.querySelector('.loader__wrapper').style.visibility = "visible";

			$timeout(function(){
				document.querySelector('body').style.overflow = "auto";
				document.querySelector('.loader__wrapper').style.visibility = "hidden";
			},1500).then(function(){
				$(window).scroll(lazyload);
				$(window).resize(lazyload);
				lazyload();
			});
		}
	});

	// Add specific class to ng-view upon route changing
	$rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.location = $location.path();
    });
}]);

/* -------------------- CONTROLLERS ------------------------*/
// Landing page Controller
app.controller("landingCtrl",['$scope', 
	function($scope){

	/*----- trigger poppoer -------*/
	$('[data-toggle="popover"]').popover();

	/*----- landing intro animation ------ */
	function introAnimationInit(){
		const DOM = {};
		DOM.base = document.querySelector('.landing__base__bg');

		anime({
			targets: DOM.base,
			translateX: [
				{ value: 430, duration: 100, delay: 500, easing: 'easeInOutQuart' },
				{ value: 400, duration: 200, delay: 500, easing: 'easeInOutQuart' }
			],
			translateY: { value: -370, duration: 200, delay: 1000, easing: 'easeOutExpo' },
			scale: { value: 0.8, duration: 200, delay: 1000, easing: 'easeOutExpo' },
			opacity: { value: 1, duration: 500, delay: 500, easing: 'easeOutExpo'}
		});
	}

	/*----- draw triangle animation ------ */
	function drawTriangleInit(){
		const DOM = {};
		DOM.triangle = document.querySelector('.landing__triangle .lines path');

		const path = anime.path('.landing__triangle .lines path');

		// animate the triangle follower
		setTimeout(function(){
			anime({
				targets: '.follower',
				translateX: path('x'),
				translateY: path('y'),
				rotate: path('angle'),
				easing: 'easeInOutQuart',
				duration: 2000,
				direction: 'reverse',
				delay:2500,
				opacity: [
					{ value: 1, duration: 500, delay: 2700, easing: 'easeInQuart'},
					{ value: 0, duration: 800, easing: 'easeInOutQuart'}
				]
			});
		},1000);


		// animate the triangle
		anime({
			targets: DOM.triangle,
			strokeDashoffset: [anime.setDashoffset, 0],
			easing: 'easeInOutSine',
			delay: 1000,
			duration: 1800
		});
	}

	function introTextAnimation(){
		const shuffleArray = (arr) => arr.sort(() => (Math.random() - 0.5));

		class AniWord {
			constructor() {
				this.DOM = {};
				this.DOM.name = document.querySelector('.intro__name__span');
				this.DOM.prof = document.querySelector('.intro__prof__span');

				charm(this.DOM.name);
				charm(this.DOM.prof);

				this.DOM.nameLetters = this.DOM.name.querySelectorAll('span');
				this.DOM.profLetters = this.DOM.prof.querySelectorAll('span');

				this.initEvents();
			}
			initEvents() {

				// animate the author name
				anime({
					targets:this.DOM.name,
					scale: {value: 1, duration: 1000},
					opacity: 1
				});

				anime({
					targets: this.DOM.nameLetters,
					delay: (t,i) => i*20+1600,
					translateY: [
						{value: (t,i) => i%2===0?10:-10, duration: 550, easing: 'easeInSine'},
						{value: (t,i) => i%2===0?[-10,0]:[10,0], duration: 550+700, easing: 'easeOutElastic', elasticity: 600}
					],
					opacity: [
						{value: 0, duration: 550, easing: 'linear'},
						{value: 1, duration: 550, easing: 'linear'}
					],
					color: {
						value: '#c36113', 
						duration: 1,
						delay:(t,i) => i*20+1600, 
						easing: 'linear'
					}
				});

				// animate the author profession
				anime({
					targets: this.DOM.profLetters,
					duration: 5,
					delay: (t,i) => (i)*50 + 3000,
					easing: 'linear',
					opacity: [0,1]
				});	
			}
		};

		const animateWord = new AniWord();
	}

	/*----- page transition animation ------ */
	function pageTransitionInit(){
		const DOM = {};
		DOM.intro = document.querySelector('#landing__intro');
		DOM.shape = DOM.intro.querySelector('svg.intro__shape');
		DOM.basebg = DOM.intro.querySelector('.landing__base__bg');
		DOM.path = DOM.shape.querySelector('path');
		// Set the SVG transform origin.
		DOM.shape.style.transformOrigin = '50% 0%';

		const navigate = () => {
			anime({
				targets: DOM.intro,
				duration: 1100,
				easing: 'easeInOutSine',
				translateY: '-200vh'
			});
			
			DOM.basebg.style.visibility = "hidden";

			anime({
				targets: DOM.shape,
				scaleY: [
				{value:[0.8,1.8],duration: 550,easing: 'easeInQuad'},
				{value:1,duration: 550,easing: 'easeOutQuad'}]
			});
			anime({
				targets: DOM.path,
				duration: 1100,
				easing: 'easeOutQuad',
				d: DOM.path.getAttribute('pathdata:id')
			});
		};

		DOM.intro.addEventListener('click', navigate);
	}

	/*----- animate running message ------ */
	function animateRunndingMsg(){
		const DOM = {};
		DOM.runmsg = document.querySelector('.running__msg');

		anime({
			targets: DOM.runmsg,
			easing: 'linear',
			duration: 3000,
			direction: 'alternate',
			translateX: [200,-200],
			loop: true
		});
	}

	introAnimationInit();
	drawTriangleInit();
	introTextAnimation();
	pageTransitionInit();
	animateRunndingMsg();


}]);

// Gallery page Controller
app.controller("galleryCtrl",['$scope', 'flickrService', 
	function($scope, flickrService){

	// Fetch data from flickr API
	flickrService.getPhotoList().then(function(response){
		$scope.photoList = response.data.photoset.photo;
	});


	// Draw 2nd triangle on gallery page
	function drawTriangleInit(){
		const DOM = {};
		DOM.triangle = document.querySelector('.landing__triangle.customized');
		DOM.trianglePath = document.querySelector('.landing__triangle.customized .lines path');
		DOM.path = anime.path('.landing__triangle.customized .lines path');

		var triangleTimeline = anime.timeline();

		triangleTimeline
		.add({
			targets: DOM.trianglePath,
			strokeDashoffset: [anime.setDashoffset, 0],
			delay: 2000,
			duration: 1800,
			easing: 'easeInOutSine'
		})
		.add({
			targets: DOM.triangle,
			opacity: {value: 0.2, duration: 200},
			easing: 'easeInOutSine'
		})
		.add({
			targets: DOM.triangle,
			scale: {value: 0.8, duration: 200},
			offset: '-=200',
			easing: 'easeInOutSine'
		});
		// animate the triangle
		// anime({
		// 	targets: DOM.triangle,
		// 	strokeDashoffset: [anime.setDashoffset, 0],
		// 	easing: 'easeInOutSine',
		// 	delay: 2000,
		// 	duration: 1800,
		// 	opacity: {value: 0.2, duration: 200, delay: 2000}
		// });
	}

	drawTriangleInit();
}]);

/* ----------------------- FILTERS --------------------------*/
app.filter("randomString",function(){
	return function(x){
		const ranNum = Math.floor((Math.random() * 24) + 1);

		return x = x.repeat(ranNum);
	}
});

/* ----------------------- SERVICES --------------------------*/
app.service("memberList",function(){

});

app.service("flickrService",['$http', function ($http){
	var urlBase = 'https://api.flickr.com/services/rest';
	var albumUrl = 'flickr.photosets.getPhotos';
	var apiKey = '5a3b4f8f0e2f427356ee6b032eb6c929';
	var photoSetId = '72157685528708795';
	var userId = '67108637@N06';

	this.getPhotoList = function () {
		// return $http.get(urlBase + '/',{
		// 	'method': albumUrl,
		// 	'api_key': apiKey,
		// 	'photoset_id': photoSetId,
		// 	'user_id': userId,
		// 	'format': 'json',
		// 	'nojsoncallback': 1
		// });

		return $http({
			url: 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=5a3b4f8f0e2f427356ee6b032eb6c929&photoset_id=72157685528708795&user_id=67108637@N06&format=json&nojsoncallback=1',
			dataType: 'json',
			method: 'GET',
			headers: {
				"Content-Type": "application/json"
			}
		});


	// this.getPhoto = function (id) {
	// 	return $http.get(urlBase + '/' + id);
	};
}]);


// Lazy load effect
function lazyload(){
   var wt = $(window).scrollTop();    //* top of the window
   var wb = wt + $(window).height();  //* bottom of the window

   $(".lazy").each(function(){
      var ot = $(this).offset().top;  //* top of object (i.e. advertising div)
      var ob = ot + $(this).height(); //* bottom of object

      if(!$(this).attr("loaded") && wt<=ob && wb >= ot){
         $(this).attr("loaded",true);
      }
   });
}
// https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=5a3b4f8f0e2f427356ee6b032eb6c929&photoset_id=72157685528708795&user_id=67108637@N06
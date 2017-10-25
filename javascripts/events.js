"use strict";

const tmdb = require('./tmdb');
const dom = require('./dom');
const firebaseApi = require('./firebaseApi');

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter'){
      let searchText = $('#searchBar').val();
      let query = searchText.replace(/\s/g, "%20");
      tmdb.searchMovies(query);
    }
  });

};

const getMahMovies = () => {
	firebaseApi.getMovieList().then((results) =>{
				dom.clearDom('moviesMine');
				dom.domString(results, tmdb.getImgConfig(), 'moviesMine', false);
			}).catch((err) =>{
				console.log("error in getMovieList", err);
			});
};


const myLinks = () => {
	$(document).click((e) =>{
		if(e.target.id === "navSearch"){
			$("#search").removeClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").addClass("hide");
		}else if (e.target.id === "mine") {
			$("#search").addClass("hide");
			$("#myMovies").removeClass("hide");
			$("#authScreen").addClass("hide");
			getMahMovies();
		}else if (e.target.id === "authenticate"){
			$("#search").addClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").removeClass("hide");
		}
	});
};

const googleAuth = () => {
	$('#googleButton').click((e) =>{
		firebaseApi.authenticateGoogle().then().catch((err) =>{
			console.log("error in authenticateGoogle", err);
		});
	});
};

const wishListEvents = () => {
	$("body").on('click', '.wishlist', (e) => {
		console.log("wishlist event", e);
		
		let mommy = e.target.closest('.movie');

		let newMovie = {
			"title": $(mommy).find('.title').html(),
			"overview":$(mommy).find('.overview').html(),
			"poster_path":$(mommy).find('.poster_path').attr('src').split('/').pop(),
			"rating": 0,
			"isWatced": false,
			"uid":""
		};
		console.log("newMovie", newMovie);
		
		firebaseApi.saveMovie(newMovie).then((results) => {
			$(mommy).remove();
		}).catch((err) => {
			console.log("error in saveMovie", err);
		});
	});
};

const reviewEvents = () => {
	$("body").on('click', '.review', (e) => {
		console.log("review event", e);
		
		let mommy = e.target.closest('.movie');

		let newMovie = {
			"title": $(mommy).find('.title').html(),
			"overview":$(mommy).find('.overview').html(),
			"poster_path":$(mommy).find('.poster_path').attr('src').split('/').pop(),
			"rating": 0,
			"isWatced": true,
			"uid":""
		};
		console.log("newMovie", newMovie);
		
		firebaseApi.saveMovie(newMovie).then((results) => {
			$(mommy).remove();
		}).catch((err) => {
			console.log("error in saveMovie", err);
		});
	});
};

const deleteMovie = () => {
	$('body').on('click', '.delete', (e) => {
		let movieId = $(e.target).data('firebase-id');
		
		firebaseApi.deleteMovie(movieId).then ((results) => {
			getMahMovies();
		}).catch((err) => {
			console.log("error in Delete movie", err);
		});
	});
};


const init =() => {
	myLinks();
	googleAuth();
	pressEnter();
	wishListEvents();
	reviewEvents();
	deleteMovie();
};

module.exports = {init};







var apiKey = '1bd3f3a91c22eef0c9d9c15212f43593';

var baseMovieUrl = 'https://api.themoviedb.org/3/';

var baseImageUrl = 'https://image.tmdb.org/t/p/';

var discoverSearchUrl = baseMovieUrl + 'discover/movie?api_key=' + apiKey + '&';

var genres = [
    {
        id: 28,
        name: "Action"
    },
    {
        id: 12,
        name: "Adventure"
    },
    {
        id: 16,
        name: "Animation"
    },
    {
        id: 35,
        name: "Comedy"
    },
    {
        id: 80,
        name: "Crime"
    },
    {
        id: 99,
        name: "Documentary"
    },
    {
        id: 18,
        name: "Drama"
    },
    {
        id: 10751,
        name: "Family"
    },
    {
        id: 14,
        name: "Fantasy"
    },
    {
        id: 36,
        name: "History"
    },
    {
        id: 27,
        name: "Horror"
    },
    {
        id: 10402,
        name: "Music"
    },
    {
        id: 9648,
        name: "Mystery"
    },
    {
        id: 10749,
        name: "Romance"
    },
    {
        id: 878,
        name: "Science Fiction"
    },
    {
        id: 10770,
        name: "TV Movie"
    },
    {
        id: 53,
        name: "Thriller"
    },
    {
        id: 10752,
        name: "War"
    },
    {
        id: 37,
        name: "Western"
    }
];

var getSingleMovieUrl = function (movieId) {
    return baseMovieUrl + 'movie/' + movieId + '?api_key=' + apiKey;
}

var getCastsForMovie = function (movieId) {
    return baseMovieUrl + 'movie/' + movieId + '/credits' + '?api_key=' + apiKey;
}

var tmdb = {
    baseMovieUrl: baseMovieUrl,
    baseImageUrl: baseImageUrl,
    discoverSearchUrl: discoverSearchUrl,
    genres: genres,
    getSingleMovieUrl: getSingleMovieUrl,
    getCastsForMovie: getCastsForMovie
};

module.exports = tmdb;

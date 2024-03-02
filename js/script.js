document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const moviesList = document.getElementById('moviesList');

    searchButton.addEventListener('click', async function() {
        const keyword = searchInput.value.trim();
        if (keyword === '') return;

        const moviesData = await searchMoviesByKeyword(keyword);
        if (!moviesData) return;

        renderMovies(moviesData);
    });

    async function searchMoviesByKeyword(keyword) {
        const apiKey = 'cf979a15cbc3110f9c0893e1457d0866';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${keyword}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            return null;
        }
    }

    function renderMovies(movies) {
        moviesList.innerHTML = '';

        const highRatedMovies = movies.filter(movie => movie.vote_average > 7.0);

        // Calcular a média de ratings
        const totalRatings = movies.reduce((acc, movie) => acc + movie.vote_average, 0);
        const averageRating = totalRatings / movies.length;

        const movieTitles = movies.map(movie => movie.title);

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
            <div class="wrap-movie">
                <div class="movie-info-left">
                    <h2 class="movie-title">${movie.title}</h2>
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="movie-poster" alt="${movie.title} Poster">
                </div>
                <div class="movie-info-right">
                    <p class="movie-resume">${movie.overview}</p>
                    <p class="movie-rating">Rating: ${movie.vote_average}<i class="fas fa-star"></i></p>
                </div>
            </div>
            `;
            moviesList.appendChild(movieElement);
        });
        /*
        console.log('Filmes com avaliação alta:', highRatedMovies);
        console.log('Avaliação média dos filmes:', averageRating);
        console.log('Títulos dos filmes:', movieTitles);*/
    }
});

$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive:{
        0:{
            items: 1,
            nav: false
        },
        600:{
            items: 3,
            nav: false
        },
        1000:{
            items: 5,
            nav: false
        }
    }
});

async function loadRandomMovieCovers() {
    const apiKey = 'cf979a15cbc3110f9c0893e1457d0866';
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${randomNumber}`;

    try {
        const response = await fetch(url);
        
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados da API: ' + response.status);
        }

        const data = await response.json();

        if (!data || !data.results || data.results.length === 0) {
            throw new Error('Dados da API não encontrados');
        }

        data.results.slice(0, 15).forEach(movie => {
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;

            $('.owl-carousel').trigger('add.owl.carousel', [img]).trigger('refresh.owl.carousel');
        });
    } catch (error) {
        console.error('Erro ao carregar capas de filmes:', error);
    }
}


loadRandomMovieCovers(); 

async function getRandomMovie() {
    const apiKey = 'cf979a15cbc3110f9c0893e1457d0866';
    const randomNumber = Math.floor(Math.random() * 1000) + 1; 
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${randomNumber}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao carregar dados da API: ' + response.status);
        }

        const data = await response.json();

        if (!data || !data.results || data.results.length === 0) {
            throw new Error('Dados da API não encontrados');
        }

        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomMovie = data.results[randomIndex];

        const randomMovieInfo = {
            title: randomMovie.title,
            poster_path: randomMovie.poster_path,
            overview: randomMovie.overview,
            vote_average: randomMovie.vote_average
        };

        return randomMovieInfo;
    } catch (error) {
        console.error('Erro ao gerar filme aleatório:', error);
    }
}

document.getElementById('randomMovieButton').addEventListener('click', async () => {
    const randomMovieInfo = await getRandomMovie();

    const randomMovieContainer = document.getElementById('randomMovieContainer');
    randomMovieContainer.innerHTML = `
        <div class="movie">
            <h2 class="movie-title">${randomMovieInfo.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500/${randomMovieInfo.poster_path}" class="movie-poster" alt="${randomMovieInfo.title} Poster">
            <p class="movie-resume">${randomMovieInfo.overview}</p>
            <p class="movie-rating">Rating: ${randomMovieInfo.vote_average}</p>
        </div>
    `;
});


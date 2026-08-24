const movieForm = document.getElementById("movieForm");
const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("search");

let movies = [];

// Get movies from database
async function getMovies() {
    try {
        const response = await fetch("/api/movies");

        movies = await response.json();

        displayMovies(movies);
    } catch (error) {
        console.error("Error:", error);
    }
}


// Display movies
function displayMovies(movieArray) {

    movieList.innerHTML = "";

    if (movieArray.length === 0) {
        movieList.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movieArray.forEach(movie => {

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `
            <h3>${movie.title}</h3>

            <p><strong>Genre:</strong> ${movie.genre}</p>

            <p><strong>Year:</strong> ${movie.year}</p>

            <p><strong>Rating:</strong> ⭐ ${movie.rating}</p>

            <p>${movie.description || ""}</p>

            <button
                class="delete-btn"
                onclick="deleteMovie('${movie._id}')"
            >
                Delete
            </button>
        `;

        movieList.appendChild(card);
    });
}


// Add movie
movieForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const movie = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: Number(document.getElementById("year").value),
        rating: Number(document.getElementById("rating").value),
        description: document.getElementById("description").value
    };

    try {

        const response = await fetch("/api/movies", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(movie)
        });

        if (response.ok) {

            alert("Movie added successfully!");

            movieForm.reset();

            getMovies();

        } else {

            alert("Failed to add movie.");
        }

    } catch (error) {

        console.error("Error:", error);
    }
});


// Delete movie
async function deleteMovie(id) {

    if (!confirm("Are you sure you want to delete this movie?")) {
        return;
    }

    try {

        const response = await fetch(`/api/movies/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {

            alert("Movie deleted successfully!");

            getMovies();

        } else {

            alert("Failed to delete movie.");
        }

    } catch (error) {

        console.error("Error:", error);
    }
}


// Search movies
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchText) ||
        movie.genre.toLowerCase().includes(searchText)
    );

    displayMovies(filteredMovies);
});


// Load movies when page opens
getMovies();
const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Movie = require("./models/movie.models");
const Twitter = require("./models/twitterProfile.models");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working.");
});

initializeDatabase();

// const jsonData = fs.readFileSync("movies.json", "utf-8");
// const moviesData = JSON.parse(jsonData);

// const jsonUserData = fs.readFileSync("userProfiles.json", "utf-8");
// const userData = JSON.parse(jsonUserData);

// function seedData() {
//   try {
//     for (const movieData of moviesData) {
//       const newMovie = new Movie({
//         title: movieData.title,
//         releaseYear: movieData.releaseYear,
//         genre: movieData.genre,
//         director: movieData.director,
//         actors: movieData.actors,
//         language: movieData.language,
//         country: movieData.country,
//         rating: movieData.rating,
//         plot: movieData.plot,
//         awards: movieData.awards,
//         posterUrl: movieData.posterUrl,
//         trailerUrl: movieData.trailerUrl,
//       });
//       newMovie.save();
//     }
//   } catch (error) {
//     console.log("Error seeding the data", error);
//   }
// }

// function seedUserData() {
//   try {
//     for (const users of userData) {
//       const newUser = new Twitter({
//         fullName: users.fullName,
//         username: users.username,
//         bio: users.bio,
//         profilePicUrl: users.profilePicUrl,
//         followingCount: users.followingCount,
//         followerCount: users.followerCount,
//         companyName: users.companyName,
//         location: users.location,
//         portfolioUrl: users.portfolioUrl,
//       });
//       newUser.save();
//     }
//   } catch (error) {
//     console.log("Error seeding the data", error);
//   }
// }
// seedData();
// seedUserData();

// const newMovie = {
//   title: "New Movie",
//   releaseYear: 2013,
//   genre: ["Drama"],
//   director: "Aditya Roy Chopra",
//   actors: ["Actor 1", "Actor 2"],
//   language: "Hindi",
//   country: "India",
//   rating: 6.1,
//   plot: "A young man and woman fall in love on a Australia trip.",
//   awards: "IFA Filmfare Awards",
//   posterUrl: "https://example.com/new-poster1.jpg",
//   trailerUrl: "https://example.com/new-trailer1.mp4",
// };

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    return saveMovie;
  } catch (error) {
    throw error;
  }
}

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// createMovie(newMovie);

//Find a movie with a particular title

async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// readMovieByTitle("Lagaan");

async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    console.log("Error", error);
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    if (movies.length) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "Movies not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// readAllMovies();

async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    console.log("Error", error);
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const directedMovie = await readMovieByDirector(req.params.directorName);
    if (directedMovie.length) {
      res.json(directedMovie);
    } else {
      res.status(404).json({ error: "Movies are not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get movies" });
  }
});

// readMovieByDirector("Rajkumar Hirani");

async function readMovieByGenre(movieGenre) {
  try {
    const movieByGenre = await Movie.find({ genre: movieGenre });
    return movieByGenre;
  } catch (error) {
    console.log("Error: ", error);
  }
}

app.get("/movies/genre/:movieGenre", async (req, res) => {
  try {
    const genreMovies = await readMovieByGenre(req.params.movieGenre);
    if (genreMovies.length) {
      res.json(genreMovies);
    } else {
      res.status(404).json({ error: "Movies not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Updating movies -

async function updateMovie(movieId, dataToUpdate) {
  try {
    const updateData = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updateData;
  } catch (error) {
    console.log("Error in updating movie rating:", error);
  }
}

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res.status(200).json({
        message: "Movie updated successfully",
        updatedMovies: updatedMovie,
      });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the movie." });
  }
});
// updateMovie("6715f2147d74f5b11f45965f", { rating: 8.0 });
// updateMovie("6715f2147d74f5b11f45965f", { releaseYear: 2002 });

async function updateMovieData(movieTitle, dataToUpdate) {
  try {
    const updateData = await Movie.findOneAndUpdate(
      { title: movieTitle },
      dataToUpdate,
      { new: true }
    );
    return updateData;
  } catch (error) {
    console.log("Error occured while updating data: ", error);
  }
}

app.post("/movies/directory/:movieParam", async (req, res) => {
  try {
    const updatedData = await updateMovieData(req.params.movieParam, req.body);
    if (updatedData) {
      res.status(200).json({
        message: "Movie updated successfully.",
        updatedMovies: updatedData,
      });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update movies" });
  }
});
// updateMovieData("Kabhi Khushi Kabhie Gham", { releaseYear: 2001 });

async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log("Error occured while deleting the movie: ", error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the movie." });
  }
});
// deleteMovie("67165561897d8138294ce53f");

async function deletedMovieFromDb(movieTitle) {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ title: movieTitle });
    return deletedMovie;
  } catch (error) {
    console.log("Error while deleting the data: ", error);
  }
}

app.delete("/movies/titles/:movieTitle", async (req, res) => {
  try {
    const deletedMovie = await deletedMovieFromDb(req.params.movieTitle);
    res.status(200).json({ message: "Movies deleted successfully by title." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the movie" });
  }
});
// deletedMovieFromDb("3 Idiots");

const PORT = 3600;

app.listen(PORT, () => {
  console.log("Connected to the server on port: ", PORT);
});

const express = require("express");
const app = express();
module.exports = app;
app.use(express.json());
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started at http://localhost:3000/....");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorName: dbObject.director_name,
  };
};

//GET ALL
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT movie_name FROM movie
    ORDER BY movie_id;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovies) => convertDbObjectToResponseObject(eachMovies))
  );
});

//GET INDIVIDUAL
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT * FROM movie
    WHERE movie_id = ${movieId};`;
  const movieArray = await db.get(getMovieQuery);
  response.send(convertDbObjectToResponseObject(movieArray));
});

//POST
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie (director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  const movie = await db.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//PUT
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const movieUpdateQuery = `UPDATE movie
    SET
        director_id = ${directorId},
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
    WHERE 
        movie_id = ${movieId};`;
  const movie = await db.run(movieUpdateQuery);
  response.send("Movie Details Updated");
});

//DELETE
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDeleteQuery = `
    DELETE FROM movie
    WHERE movie_id = ${movieId};`;
  await db.run(movieDeleteQuery);
  response.send("Movie Removed");
});

//GET ALL DIRECTORS
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT * FROM director
    ORDER BY director_id;`;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(
    directorsArray.map((eachDirector) =>
      convertDbObjectToResponseObject(eachDirector)
    )
  );
});

//GET ALL MOVIES
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorQuery = `
    SELECT movie_name FROM movie
    WHERE director_id = ${directorId};`;
  const directorArray = await db.all(getDirectorQuery);
  response.send(
    directorArray.map((eachDirector) =>
      convertDbObjectToResponseObject(eachDirector)
    )
  );
});

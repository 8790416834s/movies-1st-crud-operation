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
  };
};

//GET ALL
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT * FROM movie
    ORDER BY movie_id;`;
  const movieArray = await db.all(getMoviesQuery);
  response.send(
    movieArray.map((eachmovie) => convertDbObjectToResponseObject(eachmovie))
  );
});

//GET INDIVIDUAL
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT * FROM movie
    WHERE movie_id = ${movieId};`;
  const movieArray = await db.all(getMovieQuery);
  response.send(
    movieArray.map((eachmovie) => convertDbObjectToResponseObject(eachmovie))
  );
});

//POST
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie (director_id, movie_name, lead_actor)
  VALUES
    ('${directorId}', ${movieName}, '${leadActor}');`;
  const movie = await db.run(postMovieQuery);
  response.send("Movie successfully Added");
});

//PUT
app.put("/movies/:moviesId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const movieUpdateQuery = `UPDATE movie
    SET
        director_id = '${directorId}',
        movie_name = ${movieName},
        lead_actor = '${leadActor}'
    WHERE 
        player_Id = ${movieId};`;
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

// setting MongoDB
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URL);
const database = client.db("sample_mflix");
const databaseCollection = database.collection("movies");



module.exports= function(app) {
   
   app.get("/movies", async (req, res) => {
      try{
      const genre = req.query.genre;
      const query = genre ? { genres: genre } : {};

      const moviesCursor = databaseCollection.find(query, {});
      const moviesList = await moviesCursor.limit(20).toArray();
      if (moviesList.length > 0) {
        const data = { movies: moviesList };
        res.render("index", data);
      } else {
        res.status(404).send("Movies is not found");
      }
      }
      catch(error){
         res
         .status(500)
         .json({message:"Internal server eror. Error fetching product", error})
      }
    });

    app.get('/average-genres', async (req, res) => {
      try {
          const result = await databaseCollection.aggregate([
              { $unwind: '$genres' },
              { $group: { _id:'$genres', averageRating: { $avg: '$imdb.rating' } } },
              { $sort: { averageRating: -1 } }
          ]).toArray();
          const data = { movies: result };
          res.render("rating", data);
      } catch (err) {
          res.status(500).send('Internal Server Error');
      }
  });
}
router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    // 1️⃣ DB Cache Check
    let cachedMovie = await MovieModel.findOne({ tmdbId: movieId });

    if (cachedMovie) {
      return res.json({
        success: true,
        movie: cachedMovie.details,
        trailer: cachedMovie.trailer,
        playlist: cachedMovie.playlist,
        aiBlog: cachedMovie.aiBlog,
        cached: true
      });
    }

    // 2️⃣ TMDB Fetch
    const movie = await tmdbService.getMovieDetails(movieId);

    // 3️⃣ Parallel calls with error protection
    // আমরা .catch ব্যবহার করছি যাতে একটা ফেল করলে অন্যগুলো কাজ করে
    const [trailer, playlist, aiBlog] = await Promise.all([
      youtubeService.getTrailer(movie.title).catch(() => null),
      youtubeService.getPlaylist(movie.title).catch(() => null),
      generateMovieBlog(movie).catch(() => "AI Blog is being updated...")
    ]);

    // 4️⃣ Save to DB (Upsert logic to avoid duplicates)
    const savedMovie = await MovieModel.findOneAndUpdate(
      { tmdbId: movieId },
      {
        tmdbId: movieId,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        trailer,
        playlist,
        aiBlog,
        details: movie
      },
      { upsert: true, new: true } // যদি না থাকে তবে তৈরি করবে, থাকলে আপডেট করবে
    );

    res.json({
      success: true,
      movie,
      trailer,
      playlist,
      aiBlog,
      cached: false
    });

  } catch (error) {
    console.error("Critical Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to load movie details'
    });
  }
});

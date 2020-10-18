var express = require("express");
var router = express.Router();
var api = require("../api");

/* POST which takes a body of text and inserts into the twitter API */
router.post("/interwhat", async (req, res, next) => {
  let query = req.body.text;
  if (query) {
    //TODO: Include word tokenization here

    // News analysis
    let news = api.get_articles(query).then(async (response) => {
      let aggregated = await api.aggregated_article_sentiment(response);
      let location = await api.news_sentiment_location(response);
      return {
        aggregated,
        location,
      };
    });

    // Twitter analysis
    let tweets = api.twitter_standard_search(query).then(async (response) => {
      let aggregated = await api.aggregated_twitter_sentiment(response);
      let location = await api.twitter_sentiment_location(response);
      return {
        aggregated,
        location,
      };
    });

    // Wait for the twitter and news functions to finish
    Promise.all([news, tweets]).then((data) => {
      if (data[0] || data[1]) {
        res.status(200).json({ news: data[0], tweets: data[1] });
      } else {
        res.status(404).json({ error: true, message: "No data found" });
      }
    });
  } else {
    res.status(400).json({
      error: true,
      message: "Request body invalid - text required",
    });
  }
});

module.exports = router;

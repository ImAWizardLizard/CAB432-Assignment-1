var express = require("express");
var axios = require("axios");
var router = express.Router();

const TWITTER_API = "https://api.twitter.com/1.1";
const TWITTER_BEARER_TOKEN =
  "AAAAAAAAAAAAAAAAAAAAANMoHAEAAAAAINo5pHxHqO0BYSH%2BAGR7KKqQSyA%3DnRBUFBWwAfBvXUqTdOSyqbkkO2hFgr5uOX0n7JSR8BOGeZ5jbT";

const SENTIM_API = "https://sentim-api.herokuapp.com/api/v1/";

let twitter_standard_search = async (query) => {
  return axios({
    method: "get",
    url: `${TWITTER_API}/search/tweets.json?q=${query}`,
    headers: {
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      Cookie:
        'personalization_id="v1_YJ+TPi2r5WXMzfrGGX7WlA=="; guest_id=v1%3A159824405664029578',
    },
  });
};

let sentiment_analysis = async (text) => {
  return axios({
    method: "post",
    url: "https://sentim-api.herokuapp.com/api/v1/",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      text: text,
    }),
  })
    .then((sentiment) => sentiment.data.result)
    .catch((err) => console.error(err));
};

let aggregated_sentiment = async (statuses) => {
  return await sentiment_analysis(
    statuses.map((status) => status.text).join("\n")
  );
};

let sentiment_location = async (statuses) => {
  return Promise.all(
    statuses.map(async (status) => {
      let sentiment = await sentiment_analysis(status.text);
      return {
        sentiment,
        location: status.user.location,
      };
    })
  );
};

/* POST which takes a body of text and inserts into the twitter API */
router.post("/twatter", async (req, res, next) => {
  let query = req.body.text;
  twitter_standard_search(query).then(async (response) => {
    let sentiment_agg = await aggregated_sentiment(response.data.statuses);
    let sentiment_loc = await sentiment_location(response.data.statuses);
    res.send({ aggregated: sentiment_agg, location: sentiment_loc });
  });
});

module.exports = router;

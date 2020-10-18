// This file contains the relevant code for interacting with the twitter, news, sentiment and crypto API's
const axios = require("axios");
const geoip = require("geoip-lite");
const url = require("url");
const dns = require("dns");
const util = require("util");

// Promisify the lookup function
const lookup = util.promisify(dns.lookup);

const TWITTER_API = "https://api.twitter.com/1.1"; // Twitter API URL
const TWITTER_BEARER_TOKEN =
  "AAAAAAAAAAAAAAAAAAAAANMoHAEAAAAAINo5pHxHqO0BYSH%2BAGR7KKqQSyA%3DnRBUFBWwAfBvXUqTdOSyqbkkO2hFgr5uOX0n7JSR8BOGeZ5jbT"; // Twitter API token

const SENTIM_API = "https://sentim-api.herokuapp.com/api/v1/"; // Sentiment analysis url

const NEWS_API_KEY = "e7a1e5e7737f455a9817a41c8318f52b";

// TWITTER API FUNCTIONS
// Requests the first 100 most popular twitter statuses on a particular general search
const twitter_standard_search = async (query) => {
  return axios({
    method: "get",
    url: `${TWITTER_API}/search/tweets.json?q=${query}&count=100`,
    headers: {
      Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      Cookie:
        'personalization_id="v1_YJ+TPi2r5WXMzfrGGX7WlA=="; guest_id=v1%3A159824405664029578',
    },
  })
    .then((response) => response.data.statuses)
    .catch((err) => console.error(err));
};

// SENTIMENT ANALYSIS API FUNCTIONS

// Sends text data to the sentiment API to be analysed
const sentiment_analysis = async (text) => {
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

// Joins all of the text from all of the statuses and processes it through the sentiment API
const aggregated_twitter_sentiment = async (statuses) => {
  return await sentiment_analysis(
    statuses.map((status) => status.text).join("\n")
  );
};

// Applies sentiment analysis to each status and pairs it with its relevant location
const twitter_sentiment_location = async (statuses) => {
  return Promise.all(
    statuses.map(async (status) => {
      if (status.coordinates) {
        let sentiment = await sentiment_analysis(status.text);
        return {
          sentiment,
          coordinates: status.coordinates,
        };
      }
    })
  );
};

// NEWS API
const get_articles = async (title) => {
  return axios({
    method: "get",
    url: `https://newsapi.org/v2/top-headlines?q=${title}&apiKey=${NEWS_API_KEY}`,
  })
    .then((response) => response.data.articles)
    .catch((err) => console.error(err));
};

const aggregated_article_sentiment = async (articles) => {
  return await sentiment_analysis(
    articles.map((article) => article.description).join("\n")
  );
};

const news_sentiment_location = async (articles) => {
  return Promise.all(
    articles.map(async (article) => {
      let sentiment = await sentiment_analysis(article.description);
      let location = await lookup(
        url.parse(article.url).hostname
      ).then((result) => geoip.lookup(result.address));

      return {
        sentiment,
        coordinates: location.ll,
      };
    })
  );
};

module.exports = {
  twitter_standard_search,
  sentiment_analysis,
  aggregated_twitter_sentiment,
  twitter_sentiment_location,
  get_articles,
  aggregated_article_sentiment,
  news_sentiment_location,
};

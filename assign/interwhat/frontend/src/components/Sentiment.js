import React from "react";
import SentimentMap from "./SentimentMap";
import "antd/dist/antd.css";
import { Empty } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Sentiment({ data, topic, error }) {
  const classes = useStyles();

  // TODO: need to account for no data which can be found (display some sort of error or notify the user)
  let { news, tweets } = data;

  // If data is available
  if (news || tweets) {
    return (
      <React.Fragment>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            {news && news.aggregated ? (
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    News Sentiment
                  </Typography>
                  <Typography variant="h5" component="h3">
                    Feeling: {news.aggregated.type}
                  </Typography>
                  <Typography variant="h5" component="h3">
                    Polarity: {news.aggregated.polarity}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    News Sentiment
                  </Typography>
                  <Typography variant="h5" component="h3">
                    No news sentiment
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          <Grid item>
            {tweets && tweets.aggregated ? (
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Twitter Sentiment
                  </Typography>
                  <Typography variant="h5" component="h3">
                    Feeling: {tweets.aggregated.type}
                  </Typography>
                  <Typography variant="h5" component="h3">
                    Polarity: {tweets.aggregated.polarity}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Twitter Sentiment
                  </Typography>
                  <Typography variant="h5" component="h3">
                    No twitter sentiment
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
        <SentimentMap
          newsLocations={news && news.location}
          twitterLocation={tweets && tweets.location}
        />
      </React.Fragment>
    );
  }

  // When no data is available
  return <Empty description={<span>No Sentiment Data</span>} />;
}

export default Sentiment;

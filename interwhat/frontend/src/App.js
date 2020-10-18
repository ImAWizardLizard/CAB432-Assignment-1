import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";
import { TextField, Paper, Button } from "@material-ui/core";
import useAxios from "axios-hooks";
import PacmanLoader from "react-spinners/PacmanLoader";
import Sentiment from "./components/Sentiment";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(1),
  },
  alertRoot: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function App() {
  // Use the styles stated above
  const classes = useStyles();
  // State for holding topic user entered
  const [topic, setTopic] = useState("");
  // Default state for sentiment data
  const [sentimentData, setSentimentData] = useState({
    news: { aggregated: {}, location: [] },
    tweets: { aggregated: {}, location: [] },
  });
  // Axios hook to manage requests better
  const [{ data, loading, error, response }, execute] = useAxios(
    {
      method: "post",
      url: "http://localhost:8000/interwhat",
      // url: "http://54.153.162.105/interwhat",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true, useCache: false }
  );

  const { control, handleSubmit } = useForm();

  // Function for form
  const onSubmit = async (text) => {
    // Merges this object with the existing one in the hook and sends the data to the API
    execute({
      data: JSON.stringify(text),
    });

    setTopic(text.text);
  };

  // Update the sentimentData state variable upon data response from API
  useEffect(() => {
    setSentimentData({ ...data });
    console.log(JSON.stringify(data));
  }, [data]);

  return (
    <div className="App">
      <Container style={{ marginTop: "50px" }} maxWidth="sm">
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
        >
          <Grid
            container
            item
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Typography
                color="primary"
                variant="h1"
                component="h2"
                gutterBottom
              >
                Interwhat
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color="secondary"
                variant="h4"
                component="h4"
                gutterBottom
              >
                What is the Internet feeling like today?
              </Typography>
            </Grid>
          </Grid>
          <Paper className={classes.padding}>
            <div className={classes.margin}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container alignItems="center" spacing={8}>
                  <Grid item md={true} sm={true} xs={true}>
                    <Controller
                      as={<TextField variant="outlined" />}
                      name="text"
                      control={control}
                      fullWidth
                      autoFocus
                      required
                    />
                  </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                  <Controller
                    as={
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ textTransform: "none" }}
                        type="submit"
                      >
                        Submit Query
                      </Button>
                    }
                    name="text"
                    control={control}
                    fullWidth
                    autoFocus
                    required
                  />
                </Grid>
              </form>
            </div>
          </Paper>
          <Grid container justify="center" style={{ marginTop: "50px" }}>
            {loading ? (
              <PacmanLoader
                size={25}
                style={{ margin: "2px" }}
                color={"#123abc"}
              />
            ) : (
              <Sentiment data={sentimentData} topic={topic} error={error} />
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

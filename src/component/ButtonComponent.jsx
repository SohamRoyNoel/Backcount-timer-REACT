import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// Import data file
import data from "../_data/data.json";
import moment from "moment";
import Timer from 'react-compound-timer';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function ButtonComponent() {
    const classes = useStyles();
    const [buttonState, setButtonState] = useState(
        () => {
            try {
                // console.log("YOO", localStorage.getItem("DisableMe"));
                return localStorage.getItem("DisableMe") ===  null ? false : true;
            } catch (error) {
                // console.log("No YOO");
                return false
            }
        }
    );
    const [backCounter, setBackCounter] = useState();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
      
        // Render useEffect 
        const interval = setInterval(() => {
             let recentTime = moment().format("h:mm:ss a");
             //   console.log("Recent : " + recentTime);
             var startTime = moment(recentTime.toString(), "HH:mm:ss a");
             var endTime = moment(data.event_Time.toString(), "HH:mm:ss a");

             // console.log("End : " + endTime);
             // calculate total duration
             var duration = moment.duration(endTime.diff(startTime));
             // duration in minutes
             // var minutes = parseInt(duration.asMinutes()) % 60;
            setBackCounter(duration);
            
            setSeconds((seconds) => seconds + 1);
         }, 100);
         return () => clearInterval(interval);
    }, [])
    // 1 Min Count
    if (
      backCounter <= 60000 &&
      backCounter >= 0 &&
      localStorage.getItem("DisableMe") !== null
    ) {
      return (
        <div className={classes.root}>
          <Timer initialTime={backCounter} direction="backward">
            {() => (
              <React.Fragment>
                <Timer.Hours /> :
                <Timer.Minutes /> :
                <Timer.Seconds />
              </React.Fragment>
            )}
          </Timer>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Button
            onClick={() => {
              localStorage.setItem("DisableMe", true);
              setButtonState(true);
            }}
            disabled={buttonState}
            style={{ float: "right" }}
            variant="contained"
            color="secondary"
          >
            Book Event
          </Button>
        </div>
      );
    }
  
}


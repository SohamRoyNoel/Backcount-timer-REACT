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
        // Origin Date Data - ZULU format -> Converted into UTC
        let receivedDate = data.validDate.toString().split(".")[0];
        let recentDate = moment().format().toString().split("+")[0];

        // Duration Counter
        let duration = moment(receivedDate, "YYYY-MM-DDTHH:mm:ss").diff(
          moment(recentDate, "YYYY-MM-DDTHH:mm:ss")
        );
        var momentDuration = moment.duration(duration);
        /*
         * Total time difference is converted into HH:MM:DD clock this way 
         * we don't need to take care about DAY GAP
         */
        var hourFormat =
          Math.floor(momentDuration.asHours()) +
          moment.utc(duration).format(":mm:ss");

        console.log("Hour Clock", hourFormat);

        /*
         * HOUR Clock is converted into SECOND clock this way 
         * we don't need to take care about DAY GAP
         */
        let secondConversation = moment.duration(hourFormat).asSeconds();

        console.log("Second Clock", secondConversation);

        // Enable Button
        if (parseInt(secondConversation) <= 0) {
          setButtonState(false);
          localStorage.setItem("DisableMe", false);
        }

        // Hook that controls TIME FLOW on timer
        setBackCounter(secondConversation);
      }, 1000);
       return () => clearInterval(interval);
    }, [])
    // 1 Min Count
    if (
      backCounter * 1000 <= 60000 && // Change this 60K to desired time
      backCounter * 1000 >= 0 &&
      localStorage.getItem("DisableMe") !== null
    ) {
      return (
        <div className={classes.root}>
          <Timer initialTime={backCounter * 1000} direction="backward">
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


import { useEffect, useState, useRef } from "react";
import { Paper, Typography, Grid, Button, TextField, Checkbox, FormControl, FormControlLabel } from '@material-ui/core';

import parseIGC from '../../utils/parseIGC';
import GMap from './GMap/GMap';
import useStyles from './styles';

const IGCViewer = () => {
  const classes = useStyles();
  const [flightData, setFlightData] = useState({});
  const [mapPoints, setMapPoints] = useState();
  const [mapCenter, setMapCenter] = useState({lat:0,lng:0});
  const [ongoingVisualization, setOngoingVisualization] = useState(false);
  const [iconPosition, setIconPosition] = useState(null);
  const [flightStartEndPos, setFlightStartEndPos] = useState();
  const [dataUrl, setDataUrl] = useState("https://xcportal.pl/sites/default/files/tracks/2021-04-12/2021-04-12-xlk-prm-012067573974.igc");
  const [iconChecked, setIconChecked] = useState(true);
  const timeoutID = useRef(null);
  const infoOrder = [
    "dateOfFlight",
    "pilot",
    "copilot",
    "flightStart",
    "flightEnd",
    "gliderType",
    "gliderClass",
    "gliderId",
    "tailFinNumber",
    "manufacturerCode",
    "flightRecordedType",
    "fixAccuracy",
  ];

  const getData = () => {
    clearTimeout(timeoutID.current);
    setOngoingVisualization(false);
    parseIGC(dataUrl).then( data => {
      setFlightData(data);
      setMapPoints(data.logPoints);
      setMapCenter(data.logPoints[0]);
      setFlightStartEndPos({start: data.logPoints[0], end: data.logPoints[data.logPoints.length-1]});
    });
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUrlChange = (e) => {
    setDataUrl(e.target.value);
  };

  const visualizePath = () => {
    if(!mapPoints) return;
    if(ongoingVisualization) {
      clearTimeout(timeoutID.current);
      setOngoingVisualization(false);
      setMapPoints(flightData.logPoints);
      return;
    }
    setOngoingVisualization(true);

    const pushPoint = (index) => {
      setIconPosition(mapPoints[index]);
      setMapPoints(oldArray => [...oldArray, mapPoints[index]]);
      // Why does this work.
      // Instead of mapPoints[i], there should be flightData.logPoints[i],
      // because mapPoints starts as empty array and begins filling up with coordinates.
      // So I'm filling up an array with contents of the same array which should produce an empty array at best.
      // I'm leaving this for future investigation
      if(index < mapPoints.length - 1) {
        timeoutID.current = setTimeout(() => pushPoint(index+1), 5);
      } else {
        setOngoingVisualization(false);
      }
    }
    setMapPoints([]);
    pushPoint(0);
  }

  const handleIconVisibilityCheck = (e) => {
    setIconChecked(e.target.checked);
  }

  return (
    <Grid
    component="main"
    container
    direction="row"
    justify="center"
    alignItems="center"
    >
      <Grid item xs={10}>
        <Paper className={classes.paper} elevation={3}>
          <Grid
          component="section"
          container
          direction="row"
          justify="center"
          alignItems="center"
          >
            <Grid item xs={12} lg={10}>
              <TextField
                fullWidth
                id="filled-name"
                label="IGC data url"
                value={dataUrl}
                onChange={handleUrlChange}
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} lg={2}>
              <Button className={classes.button} onClick={getData} variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                  {flightData?.info &&
                    infoOrder.map( field => (
                      <Typography key={field} variant ="h6">{`${flightData.info[field].name}: ${flightData.info[field].value ?? "No data"}`}</Typography>
                    ))
                  }
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <div className={classes.mapContainer}>
                        <GMap
                          pathPoints={mapPoints}
                          mapCenter={mapCenter}
                          iconPosition={iconPosition}
                          ongoingVisualization={ongoingVisualization}
                          flightStartEndPos={flightStartEndPos}
                          iconChecked={iconChecked}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <Button className={classes.button} onClick={visualizePath} variant="contained" color="primary" disabled={!mapPoints}>
                        {ongoingVisualization ? "Cancel" : "Visualize"}
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl>
                        <FormControlLabel
                          className={classes.button}
                          control={
                            <Checkbox
                            checked={iconChecked}
                            onChange={handleIconVisibilityCheck}
                            color="primary"
                            />
                          }
                          label="Icons"
                        />
                      </FormControl>
                    </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid> 
        </Paper>
      </Grid>
    </Grid>
  );
}
 
export default IGCViewer;
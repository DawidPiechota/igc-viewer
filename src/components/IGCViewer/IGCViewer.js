import { useEffect, useState } from "react";
import { Paper, Typography, Grid, Button } from '@material-ui/core';

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
  const dataUrl = "https://xcportal.pl/sites/default/files/tracks/2021-04-12/2021-04-12-xlk-prm-012067573974.igc";

  useEffect(() => {
    parseIGC(dataUrl).then( data => {
      setFlightData(data);
      setMapPoints(data.logPoints);
      setMapCenter(data.logPoints[0]);
      setFlightStartEndPos({start: data.logPoints[0], end: data.logPoints[data.logPoints.length-1]});
    });
  }, [])

  const visualizePath = () => {
    setOngoingVisualization(true);
    if(!mapPoints) return;
    const pushPoint = (index) => {
      setIconPosition(mapPoints[index]);
      setMapPoints(oldArray => [...oldArray, mapPoints[index]]);
      console.log(index);
      if(index < mapPoints.length - 1) {
        setTimeout(() => pushPoint(index+1), 5);
      } else {
        setOngoingVisualization(false);
      }
    }
    setMapPoints([]);
    pushPoint(0);
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
          justify="space-around"
          alignItems="center"
          >
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                {flightData?.info &&
                  infoOrder.map( field => (
                    <Typography variant ="h6">{`${flightData.info[field].name}: ${flightData.info[field].value ?? "No data"}`}</Typography>
                  ))
                }
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                <div className={classes.mapContainer}>
                  <GMap
                    pathPoints={mapPoints}
                    mapCenter={mapCenter}
                    iconPosition={iconPosition}
                    ongoingVisualization={ongoingVisualization}
                    flightStartEndPos={flightStartEndPos}
                  />
                </div>
                <Button className={classes.buttonVisualize} onClick={visualizePath} variant="contained" color="primary" disabled={ongoingVisualization}>
                  Visualize
                </Button>
              </Paper>
            </Grid>
          </Grid> 
        </Paper>
      </Grid>
    </Grid>
  );
}
 
export default IGCViewer;
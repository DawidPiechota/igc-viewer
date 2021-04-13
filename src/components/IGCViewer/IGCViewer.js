import { useEffect, useState } from "react";
import { Paper, Typography, Grid } from '@material-ui/core';

import parseIGC from '../../utils/parseIGC';
import useStyles from './styles';

const IGCViewer = () => {
  const classes = useStyles();
  const [flightData, setFlightData] = useState({});
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
    parseIGC(dataUrl).then( data => setFlightData(data));
  }, [])

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
            {flightData?.info &&
              infoOrder.map( field => (
                <Typography variant ="h5">{`${flightData.info[field].name}: ${flightData.info[field].value}`}</Typography>
              ))
            }
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper className={classes.paper}>
              {flightData?.info &&
                infoOrder.map( field => (
                  <Typography variant ="h6">{`${flightData.info[field].name}: ${flightData.info[field].value}`}</Typography>
                ))
              }
          </Paper>
          </Grid>
          </Grid> 
        </Paper>
      </Grid>   
    </Grid> 
   );
}
 
export default IGCViewer;
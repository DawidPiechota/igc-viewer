import { useEffect } from "react";
import { Paper, Typography, Grid } from '@material-ui/core';

import parseIGC from '../../utils/parseIGC';
import useStyles from './styles';

const IGCViewer = () => {
  const classes = useStyles();
  const texts = Array(10).fill("abc");
  const dataUrl = "https://xcportal.pl/sites/default/files/tracks/2021-04-12/2021-04-12-xlk-prm-012067573974.igc";
  useEffect(() => {
    parseIGC(dataUrl);
  }, [])

  return (
    <Grid
    component="main"
    container
    direction="row"
    justify="center"
    alignItems="center"
    >
      <Grid item xs={5}>
        <Paper className={classes.paper} elevation={3}>
          {texts.map( post => (
            <Typography variant ="h5">{post}</Typography>
          ))}
        </Paper>
      </Grid>   
    </Grid> 
   );
}
 
export default IGCViewer;
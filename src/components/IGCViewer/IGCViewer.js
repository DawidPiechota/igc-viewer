import { Paper, Typography, Grid } from '@material-ui/core';
import useStyles from './styles';

const IGCViewer = () => {
  const classes = useStyles();
  const texts = Array(10).fill("abc");
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
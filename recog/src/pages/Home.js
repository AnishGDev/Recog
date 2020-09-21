import { AppBar, Toolbar, IconButton, Box, isWidthUp, Grid, Card, CardActionArea, CardMedia, CardContent, Button, withStyles, Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import CardActions from "@material-ui/core/CardActions"
import React, {Component} from 'react'
import {signOut} from '../helpers/auth'
const userId = ""; 

const styles = 
{
    logoutButton: {
        paddingRight:"1%",
        position:"relative",
        float:'right',
    },
    card: {
        maxWidth: 345,
    },
    media: {
    paddingTop: '0', // 16:9,
    marginTop:'10',
    maxWidth:"100%",
    }
  };

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
        const allPhotos = [
            {
             id: 'Notebook 1',
             url: 'https://i.imgur.com/C3UesQX.jpg'
            },
            {
             id: 'randomstringimadeup43523526534565',
             url: 'http://fillmurray.com/200/200'
            },
            {
             id: 'randomstringimadeup433245234534',
             url: 'http://fillmurray.com/200/200'
            }                  
           ]
        this.state = {
            allPhotos
        };
    }
    
    handleLogOut() {
        signOut()
        .then(() => {
            localStorage.removeItem(userId); 
            this.props.history.push("/login");
            console.log ("User logging out");
        })
    }

    render() {
        const { classes } = this.props;
        const allImages = this.state.allPhotos.map(photo => {
            return(
            <div style={{marginTop:20, padding:30}}>
            <Grid item key={photo.id}>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardMedia
                    component="img"
                    height="140"
                    image={photo.url}
                    title="Testing"
                    className={classes.media}/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {photo.id}
                                </Typography>
                                <Typography component="p">Testing 1 2 3 4</Typography>
                            </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Open
                        </Button>
                        <Button size="small" color="primary">
                            Download
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            </div>
        )})
        return (
            <React.Fragment>
 <AppBar position="sticky">
  <Toolbar>
      <Grid>
    <Typography variant="h6" className={classes.title}>
      Scanned Notes
    </Typography>
    </Grid>
    <Grid item xs>
        <div className={classes.logoutButton}>
            <Button className={classes.logoutButton} color="inherit" onClick={this.handleLogOut}>LOGOUT</Button>
        </div>
    </Grid>
  </Toolbar>
</AppBar>
            <Grid container spacing={40} justify="center">
                {allImages}
            </Grid>
            </React.Fragment>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Home); 
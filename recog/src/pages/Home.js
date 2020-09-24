import { AppBar, Fab, Toolbar, IconButton, Box, isWidthUp, Grid, Card, CardActionArea, CardMedia, CardContent, Button, withStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from "prop-types";
import CardActions from "@material-ui/core/CardActions"
import React, {Component} from 'react'
import {signOut} from '../helpers/auth'
import firebase from 'firebase'; 
import {Redirect} from 'react-router-dom'
import customHist from '../helpers/history'
const userId = ""; 


const styles = 
{
    logoutButton: {
        paddingRight:"1%",
        position:"relative",
        float:'right',
    },
    fab: {
        margin:0,
        top:'auto',
        position:"fixed",
        right:20,
        bottom:20,
        left:"auto",
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
        this.getInitialNotes = this.getInitialNotes.bind(this);
        const Notes = []
        this.state = {
            Notes
        };
    }
    
    componentDidMount() {
        this.getInitialNotes(); 
    }

    getInitialNotes() {
        firebase.auth().onAuthStateChanged(user=> {
            let uid = user.uid;

            if (user) {
                firebase.firestore().collection(`notes-${uid}`).onSnapshot(snapshot => {
                    let allNotes = [];
                    snapshot.forEach(doc => {
                        var currNote = doc.data();
                        currNote.id = doc.id;
                        currNote.url = `https://i1.wp.com/itsfoss.com/wp-content/uploads/2015/03/desktop-wallpaper-ubuntu-vivid.jpg?ssl=1`
                        allNotes.push(currNote); 
                    })
                    // sort alphabetically. 
                    allNotes.sort((a, b)=> {
                        if (a.title)
                            return a.title.localeCompare(b.title);
                    })
                    console.log ("Printing all the notes here"); 
                    console.log(allNotes);
                    
                    this.setState({Notes: allNotes});
                })
            }
        })
    }

    handleLogOut() {
        signOut()
        .then(() => {
            localStorage.removeItem('userId'); 
            this.props.history.push("/login");
            console.log ("User logging out");
        })
    }

    addNote(id) {
        if (!id) id = ""; 
        return customHist.push({
            pathname: "/create",
            state: {noteId: {id}}
        });
    }

    render() {
        const { classes } = this.props;
        const allImages = this.state.Notes.map(photo => {
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
                                    {photo.title}
                                </Typography>
                                <Typography component="p">{photo.id}</Typography>
                            </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={()=>{this.addNote(photo.id)}} size="small" color="primary">
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
                <Fab onClick={this.addNote} className={classes.fab} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
        </React.Fragment>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Home); 
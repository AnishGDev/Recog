import { AppBar, Fab, Toolbar, IconButton, Box, isWidthUp, Grid, Card, CardActionArea, CardMedia, CardContent, Button, withStyles, Typography, TextareaAutosize } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from "prop-types";
import CardActions from "@material-ui/core/CardActions"
import React, {Component} from 'react'
import {signOut} from '../helpers/auth'
import firebase from 'firebase'; 
import {Redirect} from 'react-router-dom'
import customHist from '../helpers/history'
import SearchBar from "material-ui-search-bar";
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
        paddingTop: '5%'
    }, appBar: {
        paddingBottom: '1%'
    },
    media: {
    paddingTop: '0', // 16:9,
    marginTop:'10',
    maxWidth:"100%",
    },
    searchBar: {
        maxWidth: 500,
        width: '25vw',
        textAlign:'center',
        left:"37.5vw",
        top:'auto',
        right:'50vw',
        float:'left',
        bottom:'auto',
        position: "fixed",
        display:'inline',
        border:'1px solid #ddd',
        borderRadius:'5px'
    },
  };

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.getInitialNotes = this.getInitialNotes.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.deleteNote = this.deleteNote.bind(this); 
        const Notes = []

        this.state = {
            Notes,
            value: "",
            searchList: Notes,
            empty: false
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
                        let imgUrl = ''; 
                        console.log(doc.data());
                        var currNote = doc.data();
                        console.log(currNote.imgUrl)
                        if (currNote.imgUrl.length !== 0) {
                            console.log(currNote.imgUrl)
                            imgUrl = currNote.imgUrl[0]; 
                        } else {
                            console.log("UPDATING IMAGE")
                            imgUrl = `https://i1.wp.com/itsfoss.com/wp-content/uploads/2015/03/desktop-wallpaper-ubuntu-vivid.jpg?ssl=1`
                        }
                        currNote.id = doc.id;
                        currNote.url = imgUrl
                        allNotes.push(currNote); 
                    })
                    // sort alphabetically. 
                    allNotes.sort((a, b)=> {
                        if (a.title)
                            return a.title.localeCompare(b.title);
                    })
                    console.log ("Printing all the notes here"); 
                    console.log(allNotes);
                    let empty = false;
                    if (allNotes.length === 0) {
                        empty = true;
                    }
                    this.setState({Notes: allNotes, searchList: allNotes, empty: empty});
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
        console.log("note id is ", id);
        if (!id) console.log("CREATING NEW NOTE. ");
        customHist.push({
            pathname: "/edit",
            state: {noteId: {id}}
        });
    }

    deleteNote(id) {
        let uid = localStorage.getItem('userId'); 
        let currNotes = this.state.Notes;

        currNotes.forEach((item, index, object) => {
            if (item.id === id && uid!== null) {
                console.log ("Found the item");
                if (item.imgUrl !== undefined) {
                    console.log(item.imgUrl);
                    item.imgUrl.forEach(img => {
                        firebase.storage().refFromURL(img).delete().then(()=> {
                            console.log ('File successfully deleted');
                        }).catch(err => {
                            console.log("An error occurred while deleting files,", err); 
                        })
                    })
                }
                firebase.firestore().collection(`notes-${uid}`).doc(item.id).delete().then(()=> {
                    console.log("Document successfully deleted");
                    object.splice(index, 1); 
                }).catch(err => {
                    console.log("Error while deleting document", err); 
                })
            }
        })
    }
    handleSearch(searchQuery) {
        let currList = [];
        let newList = [];
        if (searchQuery !== "") {
            console.log("Searching for ", searchQuery);
            currList = this.state.Notes; 
            newList = currList.filter(item => {
                if (item.title !== null) {
                    console.log("The item is ", item.title);
                    const lc = item.title.toLowerCase();
                    return lc.includes(searchQuery.toLowerCase()); 
                } else {
                    return false;
                }
            })
        } else {
            newList = this.state.Notes;
        }
        this.setState({searchList: newList}); 
    }

    render() {
        const { classes } = this.props;
        const allImages = this.state.searchList.map(photo => {
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
                                <Typography component="p"></Typography>
                            </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={()=>{this.addNote(photo.id)}} size="small" color="primary">
                            Open
                        </Button>
                        <Button onClick={()=>{this.deleteNote(photo.id)}}size="small" color="secondary">
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            </div>
        )})
        return (
            <React.Fragment>
                <div className={classes.appBar}>
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
                </div>
                <div className={classes.searchBar}>
                <SearchBar
                value={this.state.value}
                onChange={(newValue) => {this.setState({ value: newValue }); this.handleSearch(newValue)}}
                onRequestSearch={() => {}}
                />
                </div>
                <Grid container spacing={40} justify="center">
                    {allImages}
                </Grid>
                <Fab onClick={()=> {this.addNote(null)}} className={classes.fab} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                {this.state.empty && (<Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
                >
                <Typography
                        hide
                        variant={"h6"}
                        style={{textAlign:'center',
                        paddingBottom:'10%',
                        margin:'0',
                        right:'auto',
                        bottom:'auto',
                        position: "fixed",}}
                        >
                          You have no notes. Add some by clicking the plus button
                        </Typography>
                        </Grid>
                )}           
        </React.Fragment>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Home); 
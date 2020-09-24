import { withStyles, Button, TextField, CircularProgress, Typography, Box} from '@material-ui/core';
import PropTypes from "prop-types";
import React, {Component, useState, useEffect} from 'react';
import {VISION_API} from '../config/constants'
import MDEditor from '@uiw/react-md-editor';
import firebase from 'firebase'
import customHist from '../helpers/history'
import {firebaseAuth} from '../config/constants'
const styles = 
{
    card: {
        maxWidth: 345,
    },
    media: {
    paddingTop: '0', // 16:9,
    marginTop:'10',
    maxWidth:"100%",
    },
  };

function Editor(props) {
    const [value, setValue] = useState(props.text);
    const minHeight = 900; 
    const style = {
        paddingTop:"1%",
        paddingLeft:"0.1%",
        position:"relative",
        float:'left',
    }
    const textFieldStyle = {
        paddingTop:"0.4%",
        paddingBottom:"0.3%",
        paddingLeft:"0.1%",
        position:"relative",
    }

    const uploadButton = {
        display: 'none'
    }
    //props.handleUpload(value)
    return (
        <React.Fragment>
      <div className="container">
        <MDEditor
          value={props.text}
          onChange={setValue}
          visiableDragbar={true}
          fullscreen={false}
          height={window.innerHeight/2}
        />
      </div>
    <div style={style}>
        <Button onClick={() => {props.queryDB(value)}} variant="contained" size="large" color="primary">Save</Button>
    </div>
    <div style={style}>
        <input
            accept="image/*"
            id="file-button"
            type="file"
            style={uploadButton}
            onChange={(e)=>{if (e.target.files[0] !== null) props.handleUpload(value, e.target.files[0])}}
        />
        <label htmlFor="file-button">
            <Button component="span" variant="contained" size="large" color="primary">Upload Scanned Image</Button>
        </label>
    </div>
    </React.Fragment>
    );
}

class Create extends Component {
    constructor(props) {
        super(props);
        this.queryDB = this.queryDB.bind(this);
        this.processImage = this.processImage.bind(this); 
        this.getNote = this.getNote.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        console.log(this.props.location.state.noteId.id);
        this.state = {
            text: "",
            noteId: this.props.location.state.noteId.id,
            title: "",
            progress: 0,
            uploading: false
        };
    }
    
    timeoutPromise(ms, promise) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("promise timeout"))
          }, ms);
          promise.then(
            (res) => {
              clearTimeout(timeoutId);
              resolve(res);
            },
            (err) => {
              clearTimeout(timeoutId);
              reject(err);
            }
          );
        })
    }

    componentDidMount() {
        if (this.state.noteId !== "") {
            this.getNote(this.state.noteId); 
        }
    }
    async getNote(noteId) {
        let uid = localStorage.getItem('userId'); 
        console.log(uid);
        //let {uid} = await firebaseAuth().currentUser; 
        let docRef = await firebase.firestore().collection(`notes-${uid}`).doc(noteId);
        docRef.get().then(doc => {
            if (doc.exists) {
                this.setState((state, props) => ({
                    text: doc.data().text,
                    title: doc.data().title,
                    noteId: state.noteId
                }));
                console.log(doc.data());
            } else {
                console.log("No such document exists");
            }
        }).catch(err => {
            console.log("Error getting document", err); 
        })
    }

    async updateNote(title, text) {
        try {
        let uid = localStorage.getItem('userId');
        console.log("Used id is ", uid);
        console.log("Note id is ", this.state.noteId);
        const noteRef = firebase.firestore().collection(`notes-${uid}`).doc(this.state.noteId); 

        let updatedNote = {
            text: text,
            title: title
        }

        const res = await noteRef.update(updatedNote);
        return res;
        console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    async queryDB(text) {
        if (this.state.noteId === "" || this.state.noteId === null) {
            await this.saveNote(this.state.title, text); 
        } else {
            await this.updateNote(this.state.title,text);
        }
    }

    async saveNote(title, text) {
        try {
            let newNote = {
                text: text,
                title: title
            }
            console.log("Uploading new note", newNote); 
            let uid = localStorage.getItem('userId')
            let noteAdded = await firebase.firestore().collection(`notes-${uid}`).add(newNote);
            console.log(noteAdded);
            return noteAdded;
        } catch (error) {
            console.log(error);
        }

        customHist.push('/app/home')
        
    }

    async processImage(imageURL) {
        const uriBase = 'https://australiaeast.api.cognitive.microsoft.com/vision/v3.0-preview/read/analyze?language=en'
        console.log("hello1");
        let txt = ""; 
        const response = await fetch(
            `https://australiaeast.api.cognitive.microsoft.com/vision/v3.0-preview/read/analyze?language=en`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': VISION_API,
                },
                body: JSON.stringify({"url": imageURL})
            })
            .then(res => new Promise(resolve=> setTimeout(() => resolve(res), 5000)))
            .then(res =>{
                fetch(res.headers.get("Operation-Location"), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': VISION_API,
                    },
                }).then(res=>{
                    return res.json(); 
                }).then(data=> {
                    console.log(data.analyzeResult.readResults[0]);
                    for (var i = 0; i < data.analyzeResult.readResults[0].lines.length; i++) {
                        txt+=(data.analyzeResult.readResults[0].lines[i].text);
                        txt+="\n\n";
                    }
                    console.log(this.state.text); 
                    this.setState((state, props) => ({
                        text: state.text + "\n\n" + txt,
                        title: state.title,
                        noteId: state.noteId
                    }));
                })
            })
            .catch((error)=> {
                console.error('Error:', error); 
            }); 
    }
    handleChange(event) {
        event.persist();
        console.log(event.target.value);
        this.setState((state, props) => ({
            text: state.text,
            title: event.target.value,
            noteId: state.noteId
        }));
      }
    
    handleUpload(text, image){
        this.setState((state, props) => ({
            text: text,
            title: state.title,
            noteId: state.noteId
        }));
        const uploadTask = firebase.storage().ref(`images/${image.name}`).put(image); 
        this.setState({uploading: true});
        uploadTask.on('state_changed', (snapshot)=> {
            const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100);
            this.setState({progress}); 
        }, (error)=> {
            console.log("Error uploading to firebase ", error);
            this.setState({uploading: false});
        }, ()=> {
            this.setState({uploading: false});
            firebase.storage().ref('images').child(image.name).getDownloadURL().then((url) => {
                const uid = localStorage.getItem('userId')
                firebase.firestore().collection(`notes-${uid}`).doc(`${this.state.noteId}`).update({
                    imgUrl: firebase.firestore.FieldValue.arrayUnion(url)
                }); 
                console.log("The URL is ", url); 
                this.processImage(url);
            })
        })
    }

    render() {
        const { classes } = this.props;
        const textFieldStyle = {
            paddingTop:"0.4%",
            paddingBottom:"0.3%",
            paddingLeft:"0.1%",
            position:"relative",
        }
        return(
            <React.Fragment>
            <div style={textFieldStyle}>
                <TextField
                error={false}
                id="outlined-secondary"
                label="Title"
                variant="outlined"
                color="secondary"
                value={this.state.title}
                onChange={this.handleChange}
            />
            </div>
            <Editor queryDB={this.queryDB} handleUpload={this.handleUpload} text={this.state.text} progress={100}/>
            </React.Fragment>
        )
    }
}
Create.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Create); 
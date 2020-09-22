import { withStyles, Button, TextField } from '@material-ui/core';
import PropTypes from "prop-types";
import React, {Component, useState} from 'react';
import {VISION_API} from '../config/constants'
import MDEditor from '@uiw/react-md-editor';
import firebase from 'firebase'
import customHist from '../helpers/history'
const styles = 
{
    card: {
        maxWidth: 345,
    },
    media: {
    paddingTop: '0', // 16:9,
    marginTop:'10',
    maxWidth:"100%",
    }
  };

function Editor(props) {
    const [value, setValue] = useState("**Hello world!!!**");
    const [title, setTitle] = useState("");
    const minHeight = 900; 
    const style = {
        paddingTop:"1%",
        paddingLeft:"0.1%",
        position:"relative",
        float:'left',
    }
    const textFieldStyle = {
        paddingTop:"0.3%",
        paddingBottom:"0.3%",
        paddingLeft:"0.1%",
        position:"relative",
    }
    return (
        <React.Fragment>
    <div style={textFieldStyle}>
    <TextField
    error={false}
    id="outlined-secondary"
    label="Title"
    variant="outlined"
    color="secondary"
    value={title}
    onChange={(e) => {setTitle(e.target.value)}}
  />
    </div>
      <div className="container">
        <MDEditor
          value={props.text}
          onChange={setValue}
          visiableDragbar={true}
          fullscreen={false}
          height={window.innerHeight/2}
        />
      </div>
    <div style={style} >
    <Button onClick={() => {props.saveNote(title,value)}} variant="contained" size="large" color="primary">Save</Button>
    </div>
    </React.Fragment>
    );
}

class Create extends Component {
    constructor(props) {
        super(props);
        this.processImage = this.processImage.bind(this); 
        this.state = {text: ""};
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

    async saveNote(title, text) {
        try {
            let newNote = {
                text: text,
                title: title
            }
            console.log("Uploading new note", newNote); 
            let {uid} = await firebase.auth().currentUser; 
            let noteAdded = await firebase.firestore().collection(`notes-${uid}`).add(newNote);
            console.log(noteAdded);
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
                body: JSON.stringify({"url":'https://i.imgur.com/VPUtsj9.jpg'})
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
                    console.log(txt);
                    console.log(this.state.text); 
                    this.setState((state, props) => ({text: state.text + txt}));
                })
            })
            .catch((error)=> {
                console.error('Error:', error); 
            }); 
    }

    render() {
        const { classes } = this.props;
        return(
            <React.Fragment>
            <Editor saveNote={this.saveNote} text={this.state.text}/>
            <Button onClick={this.processImage}>Test</Button>
            </React.Fragment>
        )
    }
}
Create.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Create); 
import React, { Component } from 'react';
import axios from 'axios';
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";
import ReactAudioPlayer from 'react-audio-player';
import Loading from 'react-loading-components';

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';
import './SectionDetail.css';

class SectionDetail extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      section: {},
      sectionName: '',
      progression: '',
      inputs: [],
      uploads: [],
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.addInput = this.addInput.bind(this);
    this.saveSection = this.saveSection.bind(this);
    this.handleLyrics = this.handleLyrics.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
  }
  
  componentDidMount() {
    axios.get(`/api/sections/${this.props.match.params.id}`)
      .then(section => {
        this.setState({
          section: section.data, 
          sectionName: section.data.title, 
          progression: section.data.progression, 
          inputs: section.data.lyrics,
          uploads: section.data.uploads
        })
      })
      .catch(err => console.log(err));
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleLyrics(e) {
    let inputs = this.state.inputs.slice();
    let toUpdate = inputs.find(input => input.id === e.target.id);
    toUpdate.value = e.target.value
    this.setState({inputs: inputs});
  }

  addInput() {
    let inputs = this.state.inputs.slice();
    inputs.push({id: `line-${inputs.length + 1}`, value: ''});
    this.setState({inputs});
  }

  saveSection() {
    let lyrics = this.state.inputs.map(input => {
      return {id: input.id, value: document.getElementById(input.id).value}
    });

    axios.put(`/api/sections/${this.state.section._id}`, {
      lyrics,
      title: this.state.sectionName,
      progression: this.state.progression
    });
  }

  handleUploadSuccess(filename) {
    firebase
      .storage()
      .ref()
      .child(filename)
      .getDownloadURL()
      .then(url => this.handleFiles(url));
  }

  handleFiles(url) {
    axios.post(`/api/sections/${this.props.match.params.id}/uploads`, {url})
      .then(uploads => {
        this.setState({uploads: uploads.data, loading: false});
      });
  }

  handleUploadStart(){
    this.setState({loading: true});
  }

  render() {
    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    let inputs = this.state.inputs.map(e => {
      return <input 
        key={e.id}
        placeholder={e.id}
        id={e.id}
        value={e.value}
        name={e.id}
        onChange={this.handleLyrics}
      />
    });

    let uploads = this.state.uploads.map(e => {
      return <ReactAudioPlayer
        key={e}
        src={e}
        autoPlay={false}
        controls={true}
      />
    });

    return (
      <div className="section-detail">
        <div className="section-panel">
          <button onClick={this.saveSection}>Save</button>
          <Accordion>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Section Info</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                    <label htmlFor="sectionName">Section Name</label>
                    <input 
                      type="text"
                      name="sectionName"
                      id="sectionName"
                      value={this.state.sectionName}
                      onChange={this.handleChange}/>
                    <label htmlFor="progression">Progression</label>
                    <input 
                      type="text"
                      name="progression"
                      id="progression"
                      value={this.state.progression}
                      onChange={this.handleChange}/>
                </AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Lyrics</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                    <button onClick={this.addInput}>Add Line</button>
                    {inputs}
                </AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Uploads</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                <FileUploader
                  accept="audio/*"
                  name="avatar"
                  randomizeFilename
                  storageRef={firebase.storage().ref()}
                  onUploadStart={this.handleUploadStart}
                  // onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  // onProgress={this.handleProgress}
                />
                {uploads}
                </AccordionItemBody>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="dictionary-panel">
          <input 
            type="text"
            placeholder="Search Term"/>
        </div>
      </div>
    );
  }
}

export default SectionDetail;
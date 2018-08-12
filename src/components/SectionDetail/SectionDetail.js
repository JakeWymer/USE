import React, { Component } from 'react';
import axios from 'axios';
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";
import ReactAudioPlayer from 'react-audio-player';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

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
      loading: false,
      dictionaryInput: '',
      dictionaryResult: {},
      word: {},
      synonyms: [], 
      antonyms: [], 
      rhymes: [], 
      nearRhymes: [],
      authorized: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.addInput = this.addInput.bind(this);
    this.saveSection = this.saveSection.bind(this);
    this.handleLyrics = this.handleLyrics.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.removeUpload = this.removeUpload.bind(this);
    this.dictionarySearch = this.dictionarySearch.bind(this);
  }
  
  componentDidMount() {
    axios.get(`/api/sections/${this.props.match.params.id}`)
      .then(section => {
        if(!section.data.song_users.includes(this.props.user.currentUser.user_id)) {
          this.setState({authorized: false});
        }
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
    let toUpdate = inputs.find(input => input.dom_id === e.target.id);
    toUpdate.body = e.target.value
    this.setState({inputs: inputs});
  }

  addInput() {
    let inputs = this.state.inputs.slice();
    inputs.push({section_id: this.state.section.section_id ,dom_id: `line-${inputs.length + 1}`, body: ''});
    this.setState({inputs});
  }

  removeInput(dom_id) {
    let inputs = this.state.inputs.slice();
    let index = inputs.findIndex(i => i.dom_id === dom_id);
    inputs.splice(index, 1);

    this.setState({inputs});
  }

  saveSection() {
    axios.put(`/api/sections/${this.state.section.section_id}`, {
      title: this.state.sectionName,
      progression: this.state.progression,
      lyrics: this.state.inputs,
      uploads: this.state.uploads
    }).then(section => {
      this.setState({
        section: section.data, 
        sectionName: section.data.title, 
        progression: section.data.progression, 
        inputs: section.data.lyrics,
        uploads: section.data.uploads,
        loading: false
      })
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
    let upload = {id: this.state.uploads.length, url};
    let uploads = this.state.uploads.slice();
    uploads.push(upload);
    this.setState({uploads});

    this.saveSection();
  }

  handleUploadStart() {
    this.setState({loading: true});
  }

  removeUpload(id) {
    let uploads = this.state.uploads.slice();
    let index = uploads.findIndex(i => i.id === id);
    uploads.splice(index, 1);
    this.setState({uploads}, () => this.saveSection());    
  }

  async dictionarySearch(e) {
    e.preventDefault();
    let res = await axios.get(`/api/words/${this.state.dictionaryInput}`);
    this.setState({
      word: res.data.word[0],
      synonyms: res.data.synonyms, 
      antonyms: res.data.antonyms, 
      rhymes: res.data.rhymes, 
      nearRhymes: res.data.nearRhymes
    });
  }

  render() {
    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    if(!this.state.authorized) {
      return <Redirect to='/dashboard'/>
    }

    let inputs = this.state.inputs.map(e => {
      return (
        <div>
          <input 
            key={e.lyric_id}
            placeholder={e.dom_id}
            id={e.dom_id}
            value={e.body}
            name={e.dom_id}
            onChange={this.handleLyrics}
          />
          <button onClick={() => this.removeInput(e.id)}>Remove</button>
        </div>
      )
    });

    let uploads = this.state.uploads.map(e => {
      return(
        <div key={e.id}>
          <ReactAudioPlayer
            src={e.url}
            autoPlay={false}
            controls={true}
          />
          <button onClick={() => this.removeUpload(e.id)}>X</button>
        </div>
      );
    });

    let def = null;

    if(this.state.word.defs) {
      def = this.state.word.defs[0].slice(2);
    }

    let rhymes = this.state.rhymes.map((rhyme, i) => {
      return <h3>{rhyme.word}</h3>
    });

    let nearRhymes = this.state.nearRhymes.map((rhyme, i) => {
      return <h3>{rhyme.word}</h3>
    });

    let synonyms = this.state.synonyms.map((synonym, i) => {
      return <h3>{synonym.word}</h3>
    });

    let antonyms = this.state.antonyms.map((antonym, i) => {
      return <h3>{antonym.word}</h3>
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
            <form onSubmit={this.dictionarySearch}>
              <input 
                type="text"
                placeholder="Search Term"
                name="dictionaryInput"
                onChange={this.handleChange}
                value={this.state.dictionaryInput}/>   
          </form>
          <h2>{this.state.word.word}</h2>
          <p>{def}</p>
          <Accordion>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Rhymes</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  {rhymes}
                </AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Near Rhymes</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  {nearRhymes}
                </AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Synonyms</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  {synonyms}
                </AccordionItemBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Antonyms</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                   {antonyms}
                </AccordionItemBody>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(SectionDetail);
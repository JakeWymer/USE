import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './SongItem.css';

const SongItem = (props) => {
  let collaborators = props.song.collaborators.map(e => {
    if(e[0].user_id !== props.user.currentUser.user_id){
      return(
        <div className="collaborator" key={e[0].user_id}>
          <img src={e[0].pic_url} alt=""/>
          <p>{e[0].name}</p>
        </div>
      );
    }
  });

  return (
    <div className="song">
      <div className="title">
        <Link to={`/song/${props.song.song_id}`}>
          <h3>{props.song.title}</h3>
        </Link>
      </div>
      {collaborators}
    </div>
  );
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(SongItem);
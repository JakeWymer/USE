import React from 'react';
import {Link} from 'react-router-dom';
import './SongItem.css';

const SongItem = (props) => {
  return (
    <div className="song">
      <div className="title">
        <Link to={`/song/${props.song.songs_id}`}><h3>{props.song.name}</h3></Link>
      </div>
    </div>
  );
};

export default SongItem;
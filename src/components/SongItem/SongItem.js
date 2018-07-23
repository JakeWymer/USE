import React from 'react';
import {Link} from 'react-router-dom';
import './SongItem.css';

const SongItem = (props) => {
  let collaborators = props.song.collaborators.map(e => {
    return <p key={e.users_id}>{e.name}</p>
  });

  return (
    <div className="song">
      <div className="title">
        <Link to={{
          pathname: `/song/${props.song.songs_id}`,
          collaborators: props.song.collaborators
        }}>
          <h3>{props.song.title}</h3>
        </Link>
      </div>
      {collaborators}
    </div>
  );
};

export default SongItem;
import React from 'react';
import {Link} from 'react-router-dom';
import './SectionItem.css';

const SectionItem = (props) => {
  return (
    <div className="section">
      <div className="title">
        <Link to={`/section/${props.section._id}`}>
          <h3>{props.section.title}</h3>
          <h4>{props.section.progression}</h4>
        </Link>
      </div>
    </div>
  );
};

export default SectionItem;
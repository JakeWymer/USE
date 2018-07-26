import React from 'react';
import {Link} from 'react-router-dom';
import './SectionItem.css';

const SectionItem = (props) => {
  // let lyrics = props.section.lyrics.map(e => {
  //   return <h5 key={e.id}>{e.value}</h5>
  // });

  return (
    <div className="section">
      <i 
        class="fas fa-times remove-section"
        onClick={() => props.deleteSection(props.section.section_id)}></i>
      <div className="title">
        <Link to={`/section/${props.section.section_id}`}>
          <h3>{props.section.title}</h3>
          <h4>{props.section.progression}</h4>
        </Link>
      </div>
      {/* {lyrics} */}
    </div>
  );
};

export default SectionItem;
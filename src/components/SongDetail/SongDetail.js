import React, { Component } from 'react';

class SongDetail extends Component {
  render() {
    return (
      <div>
        {`Song Detail ${this.props.match.params.id}`}
      </div>
    );
  }
}

export default SongDetail;
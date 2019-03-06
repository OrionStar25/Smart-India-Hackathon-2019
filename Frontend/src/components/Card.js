import React, { Component } from 'react';
var moment = require('moment');

class Card extends Component {
  render() {
    let { data } = this.props;
    let score = data.score;
    data = data.each;
    let date = data.timestamp.substr(0, 10);
    let m = moment(date, 'YYYY-MM-DD').format('Do MMM YYYY');
    if(data.summary.length > 270) {
      data.summary = (data.summary.substr(0, 270)) + " ...";
    }
    return (
        <div className="card">
          <div className="content">
            <a href={data.link} target="_blank" className="card_link"><h4>{data.title}</h4></a>
            <h6><span style={{ 'color' : '#6f6d75' }}>{m} | </span> {data.link}</h6>
            <h5>{data.summary}</h5>
          </div>
          <br />
        </div>
    );
  }
}

export default Card;

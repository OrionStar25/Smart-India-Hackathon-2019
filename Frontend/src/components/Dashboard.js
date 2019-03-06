import React, { Component } from 'react';
import MainNavbar from './MainNavbar';
import { DB_CONFIG } from '../Config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import home from '../imgs/home11.svg';
import upload from '../imgs/upload1.svg';
import search from '../imgs/search11_1.svg';
import load from '../imgs/download.svg';
import Card from './Card';
import Fuse from 'fuse.js';
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import Iframe from 'react-iframe';
import { Line } from 'react-chartjs-2';
import $ from 'jquery';
import '../App.css';

var keyword_extractor = require("keyword-extractor");
var stringSimilarity = require('string-similarity');

class Dashboard extends Component {
  constructor() {
    super();
    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('update');
    this.state = {
      data: [],
      loaded: false,
      filtered_res: [],
      first_time: true,
      chart_data: [],
   }
  }

  componentDidMount() {
    let filtered_data = [];
    this.database.on('child_added', snap => {
      let data = {
        id: snap.key,
        keywords: snap.val().keywords,
        summary: snap.val().summarized_text.trim(),
        title: snap.val().topic.trim(),
        link: snap.val().link.trim(),
        timestamp: snap.val().timestamp.trim()
      };
      filtered_data.push(data);
    });
    setTimeout(() => {
      this.setState({ data: filtered_data, loaded: true });
    }, 4000);
  }

  search(e) {
    if(e.which === 13) {
      $("#frame").hide();
      $("#line-plot").fadeIn(500);
      let search_text = e.target.value;
      let { data } = this.state;
      let temp = data;
      let filtered = [], score;
      let keywords = keyword_extractor.extract(search_text, {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false
      });

      let newkeys = "";
      for(const words of keywords) newkeys += (words+" ");
      newkeys.trim();
      let map = new Map(), fmap = new Map();
      let chart_data = [];
      for(const each of temp) {
        let freq = 0;
        for(const kw of each.keywords) {
          score = stringSimilarity.compareTwoStrings(newkeys, kw.trim());
          if(score > 0.60 && each != undefined) {
            if(!map.has(each.title)) {
              filtered.push({ each: each, score: score });
              map.set(each.title);
              freq++;
            }
          }
        }
        if(!fmap.has(each.timestamp.substr(0, 4)))
          fmap.set(each.timestamp.substr(0, 4), freq);
        else {
          let c = fmap.get(each.timestamp.substr(0, 4));
          c += freq;
          fmap.set(each.timestamp.substr(0, 4), c);
        }
      }

      let pairs = [];
      fmap.forEach(function(value, key, map) {
        pairs.push({ year: key, freq: value });
      });
      pairs.sort((a, b) => a.year - b.year);

      for(const each of pairs) {
        chart_data.push(each.freq);
      }

      //charting
      const chart = {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019'],
        datasets: [
          {
            label: 'Frequency',
            data: chart_data,
            fill: false,          // Don't fill area under the line
            borderColor: '#49C2FF'  // Line color
          }
        ]
      };
      filtered.sort((a, b) => b.score - a.score);
      this.setState({ filtered_res: filtered, first_time: false, chart_data: chart });
    }
  }

  home() {
    $('#home').addClass('active');
    $("#upload").removeClass('active');
    $("#search-bar, .filtered").fadeIn(500);
    $("#upload-area").fadeOut();
  }

  upload() {
    $('#home').removeClass('active');
    $("#upload").addClass('active');
    $("#search-bar, .filtered").fadeOut();
    $("#upload-area").fadeIn(500);
  }

  handleUpload(e) {
    e.preventDefault();
    const data = new FormData();

    data.append('classType', this.classType.value);
    data.append('uploadedFile', this.uploadedFile.files[0]);

    fetch('http://localhost:5000/upload_file', {
      method: 'POST',
      body: data,
    }).then((response) => {
      alert("Your file has been successfully uploaded :)");
      response.json().then((body) => {
        alert("Your file has been successfully uploaded :)");
      });
    });
  }

  up() {
    $("#upload-btn").click();
    $('input[type="file"]').change(function(e) {
        var fileName = e.target.files[0].name;
        alert('The file "' + fileName +  '" has been selected.');
        $(".dropper").html(`<b style="color: red;">${fileName}</b> selected !`);
    });
  }

  render() {
    let { data, loaded, filtered_res, first_time, chart_data } = this.state;
    let filtered, results;
    if(first_time === false) {
      if(loaded === true && data !== undefined) {
          if(filtered_res.length !== 0) {
            results = <h5 className="res"><b>{filtered_res.length}</b> articles matched ...</h5>;
            filtered = filtered_res.map(each => <Card data={each} />);
          }
          else {
            results = <h5 className="res"><b>No results found</b></h5>;
          }
      }
      else {
          filtered = <h4 className="num"><b style={{ letterSpacing: '0.5px' }}>Loading...</b></h4>;
      }
    }
    else {
      results = null;
    }
    const options = {
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      },
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: true,
        text: 'Related research in past years'
      },
      tooltips: {
        mode: 'label'
      },
      hover: {
        mode: 'dataset'
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              show: true,
              labelString: 'Year'
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              show: true,
              labelString: 'Frequency'
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 30
            }
          }
        ]
      }
    }
    return (
      <div className="dashboard">
        <MainNavbar />
        <div className="row">
          <div className="col-md-1 sidebar">
            <div className="tits">
              <ul className="options">
                <li className="bullets active" id="home"><i className="fas fa-home icon" onClick={this.home.bind(this)}></i></li>
                <li className="bullets" id="upload"><i className="fas fa-cloud-upload-alt icon" onClick={this.upload.bind(this)}></i></li>
              </ul>
            </div>
          </div>
          <div className="col-md-8" id="search-bar">
            <div className="form-group main-group">
              <input type="text" className="form-control top-search" placeholder="Search" onKeyPress={this.search.bind(this)} />
            </div>
            <img src={search} className="mag" />
          </div>
          <div className="col-md-8" id="upload-area">
            <form className="form" onSubmit={this.handleUpload.bind(this)} encType="multitype/form-data">
              <div className="form-group">
                <label>Please select the category of your research and analysis</label> <br />
                <select className="form-control" title="Choose a therapy" ref={(ref) => { this.classType = ref; }} name="classType">
                  <option value="Respiratory">Respiratory</option>
                  <option value="Urology">Urology</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
              <div id="upload-box" onClick={this.up.bind(this)}>
                <p className="dropper"><b>Click</b> to select files to upload.</p>
              </div>
              <input id="upload-btn" className="form-group" ref={(ref) => { this.uploadedFile = ref; }} type="file" name="uploadedFile" style={{ 'display': 'none' }} />
              <input type="submit" id="sub" className="btn btn-default"></input>
            </form>
          </div>
          <div className="col-md-3">
          </div>
        </div>
        <div className="filtered">
          {results}
          <div className="col-md-8">
              {filtered}
              <Iframe url="https://pradeepgangwar.github.io/SIH-2019/"
                width="1100px"
                height="950px"
                id="frame"
                className="myClassname"
                position="relative"
                styles={{ 'display': 'block', 'z-index': 100, 'margin-right': '-2em' }}
                allowFullScreen />
          </div>
          <div className="col-md-4" id="line-plot">
            <Line data={chart_data} options={options} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

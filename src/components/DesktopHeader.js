import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Sticky from 'react-sticky-fill';
import AppBar from '@material-ui/core/AppBar';
import '../App.css';
import {connect} from "react-redux";
import zooLogo from '../assets/logo.png';

class DesktopHeader extends Component {

  render() {
    const { history } = this.props;
    return (
      <Sticky style={{top: 0, width: '100%', zIndex: 100}}>
        <AppBar position="static" className="appBar">
          <div className="logoContainer">
            <img className="logo" src={zooLogo} alt={"Woodland Park Zoo logo"}/>
          </div>
          <h1 className="headerTitle" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
            Carnivore Spotter
          </h1>
          <div className="nav">
            <div id="explore" className="categories" onClick={() => history.push('/')}><h4 style={{textDecoration: history.location.pathname==='/'? "underline":""}}>EXPLORE</h4></div>
            <div id="resources" className="categories" onClick={() =>history.push('/resources')}><h4 style={{textDecoration: history.location.pathname==='/resources'? "underline":""}}>IDENTIFICATION TIPS</h4>
            </div>
            <div id="faq" className="categories" onClick={() =>history.push('/faqs')}><h4 style={{textDecoration: history.location.pathname==='/faqs'? "underline":""}}>FAQs</h4>
            </div>
          </div>
        </AppBar>
      </Sticky>
    );
  }
}

DesktopHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile
  };
};

export default withRouter(connect(mapStateToProps)(DesktopHeader));

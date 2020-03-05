import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';

import { getDataForSpecies, getSpeciesByIndex} from '../services/SpeciesService';
import raccoon from "../assets/Raccoon-Thinking.svg";

const styles = {
  allContent: {
    backgroundColor: '#F5F5F5',
    height: '100vh',
    paddingLeft: 35,
    position: 'fixed'
  },
  sideContentWrapper: {
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      maxWidth: 300,
      minHeight: 400,
      position: 'fixed',
      bottom: 30,
  },
  sideContent: {
      minHeight: 200,
      padding: 20,
      textAlign: 'left',
      '& h2': {
          color: '#055BB2'
      },
      '& p': {
          color: 'grey',
          fontSize: 20,
      }
  },
  raccoonImage: {
     minHeight: 200,
     padding: 5,
     textAlign: 'right'
  },
  faqContent: {
    backgroundColor: '#f5b6bb',
     maxWidth: 700,
     minHeight: '100vh',
     position: 'fixed',
     bottom: 30,
     left: '50%',
     top: 50,
     padding: 35,
     right: '10%'
  },
  widthWrapper: {
    display: 'flex',
    justifyContent: 'center',
    //minHeight: 'calc(100vh - 37px)'
  },
  speciesContent: {
    marginTop: 72,
    paddingBottom: 24
  },
  header: {
    textAlign: 'left',
  },
  content: {
    textAlign: 'left',
    paddingBottom: 24
  },
  tabsContainer: {
    margin: '0px -32px 0px -32px',
    backgroundColor: 'white',
  },
  tab: {
    minWidth: 140,
  }
};

class Faqs extends Component {

  state = {
    tabValue: 0
  };

  render() {
    const {classes} = this.props;
    const {tabValue} = this.state;
    const currData = getDataForSpecies(getSpeciesByIndex(tabValue));
    return<div className={classes.allContent}>
            <div className={classes.faqContent}>
             <h3>Frequently Asked Questions</h3>
           </div>
            <div className={classes.sideContentWrapper}>
             <div className={classes.sideContent}>
              <h2> Can't find the answer you are looking for? </h2>
              <p> Contact us: </p>
              <p> seattlecarnivores@zoo.org </p>
             </div>
             <div className={classes.raccoonImage}>
              <img className={classes.raccoonImage} src={raccoon} alt="Raccoon" />
             </div>
        </div>
    </div>
  }
};

export default withStyles(styles)(Faqs);

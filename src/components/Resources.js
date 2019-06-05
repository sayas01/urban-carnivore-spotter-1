import React, { Component } from 'react';
import {Collapse, withStyles, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/ArrowUpward';
import ResourceCard from "./ResourceCard";
import '../assets/blackbear.png'

const styles = {
    allContent: {
        height: '100%',
        overflow: 'scroll',
        position: 'static',
        flexDirection: 'column',
        backgroundColor: 'white'

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1
    },
    expandButton: {
        boxShadow: 'none',
        float: 'right',
        position: 'relative',
        top: -8,
        backgroundColor: '#93C838',
        color: 'white'
    },
    expandHeader: {
        margin: 16,
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerTitle: {
        alignText: 'left'
    },
    collapsible: {
        margin: 16,
        textAlign: 'left'
    }
};
class Resources extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            showTips: false,
            showProjectDescription: false,
            showContactUs: false,
        };
    }

    getCollapse = (classes, headerTitle, onClick, expand, child) => {
        return <>
            <div className={classes.expandHeader}>
                <span className={classes.headerTitle}>{headerTitle}</span>
                <Fab
                    onClick={onClick}
                    size="small"
                    disableRipple={true}>
                    {expand ? <RemoveIcon /> : <AddIcon />}
                </Fab>
            </div>
            <Collapse in={expand} className={classes.collapsible}>
                {child}
            </Collapse>
        </>
    };

    toggleShow = groupName => () => {
        this.setState(state => ({...state,
            [groupName]: !state[groupName]}));
    };

    openImage = () => {
        return <img src={ require('../assets/blackbear.png') } />
    };
        render = () => {
            const {showTips, showProjectDescription, showContactUs} = this.state;
            const {classes} = this.props;
            return(
                <div className={classes.allContent}>
                    <div>
                        <ul>
                            <li><img src="../assets/blackbear.png" alt="blackbear"/></li>
                        </ul>

                    </div>
                    {/* Species Identification Tips */}
                    {this.getCollapse(classes, "Species Identification Tips", this.toggleShow('showTips'), showTips,
                        <div onClick={() => this.openImage()}>
                            <ul>
                                <li> BlackBear</li>
                            </ul>

                        </div>
                    )}
                    <hr/>

                    {/* Seattle Urban Carnivore Project */}
                    {this.getCollapse(classes, "Seattle Urban Carnivore Project", this.toggleShow('showProjectDescription'), showProjectDescription,
                        <div className={classes.headerTitle}>
                            <body>Seattle Spotter is part of the SeattleUrban Carnivore Project, a collaboration between the Seattle University and WoodlandPark Zoo</body>
                            <a href="https://www.zoo.org/otters">learn more</a>
                        </div>

                    )}
                    <hr/>

                    {/* Contact Us */}
                    {this.getCollapse(classes, "Contact Us", this.toggleShow('showContactUs'), showContactUs,
                        <div className={classes.headerTitle} >
                            <a href="mailto:seattlecarnivores@zoo.org">seattlecarnivores@zoo.org</a>
                        </div>
                    )}
                    <hr/>
                </div>
            );
    }
}

export default (withStyles(styles)(Resources));

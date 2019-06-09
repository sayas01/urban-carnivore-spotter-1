import React, { Component } from 'react';
import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import axios from "axios";
import PointTooltip from '../components/PointTooltip';
import FilterDrawer from './FilterDrawer';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { dataMatchesFilter } from '../services/FilterService';
import { getColorForSpecies } from '../services/ColorService';
import NavigationIcon from '@material-ui/icons/Navigation';
import Fab from '@material-ui/core/Fab';
import List from "@material-ui/icons/List";
import Help from "@material-ui/icons/HelpOutline";
import {withRouter} from "react-router-dom";
import DialogContent from "./Form";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";


const Map2 = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const getReports = "https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports";

const styles = {
    filterContainer: {
        backgroundColor: 'white',
        position: 'fixed',
        left: '5%',
        top: '15%',
        width: 250,
        zIndex: 1,
        height: '60%',
        boxShadow: '2px 2px 2px'
    }
};
class MapView extends Component {
    state = {
        viewport: {
            center: [-122.335167, 47.608013],
            zoom: [10],
        },
        popupInfo: null,
        reports: null,
        legend: false
    };

    componentDidMount() {
        const url = getReports+"?mapLat=47.608013&mapLng=-122.335167";
        axios.get(url)
            .then(reports => {
                this.setState({ reports: reports.data});
            })
            .catch(error => error);
    }

    onMoveEnd = e => {
        let center = e.getCenter();
        const url = getReports+"?mapLat="+center.lat+"&mapLng="+center.lng;
        axios.get(url)
            .then(reports => {
                reports.data!=="No data!" ? this.setState({ reports: reports.data}):
                    this.setState({reports: null})
            })
            .catch(error => error);

    };

    renderPopup() {
        const {popupInfo} = this.state;
        if(popupInfo)
        {
            return (
                <Popup tipSize={5}
                       anchor="bottom"
                       coordinates={[popupInfo.data.mapLng, popupInfo.data.mapLat]}
                       className="cardContainer"
                       onMouseLeave={() => this.setState({popupInfo: false})}>
                    <PointTooltip className="mapboxgl-popup-content" report={popupInfo} key={popupInfo.id}/>
                </Popup>
            );
        }
    }

    handleClose = () => {
        const { history} = this.props;
        this.setState({legend: false}, () => {
            history.push('/');})
    };


    render() {
        const {classes, isMobile, filter,history} = this.props;
        const {reports,legend} = this.state;
        if (!reports) {
            return <Map2 style="mapbox://styles/mapbox/streets-v9"
                         className="map"
                         {...this.state.viewport}
                         onMoveEnd={e => this.onMoveEnd(e)}
            />
        }
        return (
            <div className="mapContainer">
                { !isMobile && <div className={classes.filterContainer}>
                    <FilterDrawer/>
                </div>}
                <Map2 style="mapbox://styles/mapbox/streets-v9"
                      className="map"
                      {...this.state.viewport}
                      onMoveEnd={e => this.onMoveEnd(e)}
                >
                    {this.renderPopup()}
                    {reports.filter(report => dataMatchesFilter(report, filter))
                        .map(report => (
                            <Layer type="circle"
                                key ={report.id}
                                paint={{'circle-color': getColorForSpecies(report.data.species.toLowerCase())}}>
                                <Feature  key ={report.id} coordinates={[report.data.mapLng, report.data.mapLat]}
                                        onClick={() => this.setState({popupInfo: report})}
                                />
                            </Layer>))}
                    <div>
                        <Fab  aria-label="Add" className="navContainer" size="small">
                            <NavigationIcon  onClick={() => this.setState({viewport: {
                                    center: [-122.335167, 47.608013],
                                    zoom: [10],
                                }})}/>
                        </Fab>
                    </div>

                    <div>
                        <Fab  aria-label="Add" className="mapListToggle" size="small">
                            <List onClick={() => history.push('/list')}/>
                        </Fab>
                    </div>

                    <div>
                        <Fab  aria-label="Add" className="legendContainer" size="small">
                            <Help onClick={() => this.setState({legend: true})}/>
                        </Fab>
                    </div>

                    <div>
                        <Dialog
                            open={legend}
                            onClose={this.handleClose}
                        >
                            <DialogContent>
                                <DialogContentText>
                                    <div>
                                        <h4>Population</h4>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>
                    </div>

                </Map2>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isMobile: state.isMobile,
        filter: state.filter
    };
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(MapView)));

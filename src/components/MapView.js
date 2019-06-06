import React, { Component } from 'react';
import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import axios from "axios";
import PointTooltip from '../components/PointTooltip';
import FilterDrawer from './FilterDrawer';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { dataMatchesFilter } from '../services/FilterService';
import { getColorForSpecies } from '../services/ColorService';

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
}
class MapView extends Component {
    state = {
        viewport: {
            center: [-122.335167, 47.608013],
            zoom: [10],
        },
        popupInfo: null,
        reports: null,
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

    render() {
        const {classes, isMobile, filter} = this.props;
        const {reports} = this.state;
        if (!reports) {
            return <Map2 style="mapbox://styles/mapbox/streets-v9"
                         className="map"
                         {...this.state.viewport}
                         onMoveEnd={e => this.onMoveEnd(e)}
            />
        }
        return (
            <div className="mapContainer ">
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
}
export default connect(mapStateToProps)(withStyles(styles)(MapView));

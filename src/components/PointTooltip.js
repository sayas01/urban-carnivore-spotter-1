import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {KeyboardArrowLeft} from "@material-ui/icons";
import Button from "./ReportViewer";
import {Card, CardContent, Typography} from "@material-ui/core";
import CardMedia from "./ListCard";

const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

const timeToString = time => {
    const date = new Date(time);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
};


/* TODO: Should be updated with neighborhood info */
class PointTooltip extends Component {
    render() {
        const { report } = this.props;
        return (
            <Card>
                <CardContent className={classes.allContent}>
                    <CardMedia className="cardPicture"
                               image={report.data.mediaPaths && report.data.mediaPaths.length>0 ? report.data.mediaPaths[0] : DEFAULT_IMAGE_URL}
                    />
                    <CardContent className={classes.info}>
                        <Typography variant={'h3'}>{report.data.species.toUpperCase()}</Typography>
                        <Typography> Date & Time:</Typography>
                        <Typography variant={'subtitle1'}>{timeToString(report.data.timestamp)}</Typography>
                        <Typography style={{ color: 'grey' }}>Location: {report.data.mapLat},{report.data.mapLng}</Typography>
                        <li>
                            <Link to={`/reports/${report.id}`}>See Report</Link>
                        </li>
                    </CardContent>
                </CardContent>
                </Card>
            )
    }
}

export default PointTooltip;

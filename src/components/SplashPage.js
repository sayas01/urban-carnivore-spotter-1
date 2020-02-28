import React from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {withStyles} from "@material-ui/core";
import {withCookies} from "react-cookie";

const VISITED_BEFORE = "visitedBefore";

const styles = {
  bulleted: {
    listStyleType: 'disc',
    color: '#93C838'
  },
  text: {
    color: 'black'
  },
  paragraph: {
    color: 'grey'
  }
};
const SplashPage = (props) => {
  const {cookies, classes} = props;

  return <Dialog open={!cookies.get(VISITED_BEFORE)}
          onClose={() => cookies.set(VISITED_BEFORE, true)}>
    <DialogContent>
      <h2> Welcome  to Carnivore Spotter!</h2>
      <p>The Seattle Urban Carnivore project is a partnership between Woodland Park Zoo and Seattle University and aims to explore how mammalian carnivores live and interact with people across urban and suburban areas in the Seattle region.</p>
        <p><strong>The project focuses on the following species:</strong></p>

      <ul>
          <li className={classes.bulleted}><span className={classes.text}>Black Bear</span></li>
          <li className={classes.bulleted}><span className={classes.text}>Bobcat</span></li>
          <li className={classes.bulleted}><span className={classes.text}>Cougar / Mountain Lion</span></li>
          <li className={classes.bulleted}><span className={classes.text}>Coyote</span></li>
          <li className={classes.bulleted}><span className={classes.text}>Opossum</span></li>
          <li className={classes.bulleted}><span className={classes.text}>Raccoon</span></li>
          <li className={classes.bulleted}><span className={classes.text}>River Otter</span></li>
        <li className={classes.bulleted}><span className={classes.text}>Red Fox</span></li>
      </ul>
        <p className={classes.paragraph}><i>These are terrestrial (not marine) mammals in the taxonomic order Carnivora (*except for opossums). Some of them have a carnivorous diet (eating other animals). Many of them, however, have an omnivorous diet, eating plants as well as animals.</i></p>
        <p>You can use this observation form to submit observations of any of the above animals (or if you think you may have seen one of them, but aren’t sure!)</p>
        <p/>
        <p>
          Each dot on this map represents an observation submitted to Carnivore Spotter; there may be multiple observations of individual animals. Every report is reviewed by project staff, but only those with media (photos, video or audio) can be verified for accuracy.
        </p>
    </DialogContent>
  </Dialog>
};

export default withStyles(styles)(withCookies(SplashPage));
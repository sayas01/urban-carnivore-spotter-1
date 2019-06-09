const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const moment = require('moment');
const turf = require('@turf/turf');

admin.initializeApp(functions.config().firebase);
const database = admin.firestore();

const NEIGHBORHOOD = 'neighborhood';
const UNIQUES = 'uniques';

/**
 * Internal helper method that converts JS Date objects to firebase timestamps.
 * Thanks to https://stackoverflow.com/questions/53482750/convert-date-to-timestamp-for-storing-into-firebase-firestore-in-javascript
 * for the hint
 */
const toTimestamp = (date) => {
  return admin.firestore.Timestamp.fromDate(date);
};

exports.addReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }
    const report = req.body;
    const reportWithTimestamp = {...report,
      time_submitted: toTimestamp(new Date())
    };
    // Add neighborhood to the list of unique neighborhoods, if it's not already present
    const updateNeighborhoodsPromise = database.collection(UNIQUES).doc(NEIGHBORHOOD)
      .update({
        values: admin.firestore.FieldValue.arrayUnion(report[NEIGHBORHOOD])
      });
    // Add the full report to the database.
    const addReportPromise = database.collection('reports').add(reportWithTimestamp);
    return Promise.all([updateNeighborhoodsPromise, addReportPromise])
      .then(ref => {
        return res.status(200).send('Success!');
      })
      .catch(error => {
        return res.status(500).send(`Error adding document: ${error}`);
    });
  });
});

exports.getReport = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }
    return database.collection('reports').doc(req.query.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          return res.status(200).send(doc.data());
        } else {
          return res.status(200).send('No data!');
        }
      })
      .catch(error => {
        return res.status(500).send(`Error getting documents: ${error}`);
      })
  });
});


/**
 * Internal helper method to build database queries given some parameters.
 * Currently accepts species, neighborhood, season, year, and time_of_day as fields
 * that are acceptable to search. Always filters by at least one week old.
 */
buildQuery = (queryParams, collection) => {
  // always filter by time_submitted
  let week_ago = toTimestamp(moment().subtract(1, 'week').toDate());
  let initialQuery = collection.where('time_submitted', '<=', week_ago);
  if (queryParams.species) {
    initialQuery = initialQuery.where('species', '==', queryParams.species);
  }
  if (queryParams.neighborhood) {
    initialQuery = initialQuery.where(NEIGHBORHOOD, '==', queryParams.neighborhood);
  }
  if (queryParams.season) {
    initialQuery = initialQuery.where('season', '==', queryParams.season);
  }
  if (queryParams.year) {
    initialQuery = initialQuery.where('year', '==', queryParams.year);
  }
  if (queryParams.timeOfDay) {
    initialQuery = initialQuery.where('time_of_day', '==', queryParams.timeOfDay);
  }
  return initialQuery;
};

exports.getReports = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(404).json({
        message: `Not Allowed`
      });
    }
    let reports = database.collection('reports');
    return buildQuery(req.query, reports)
      .get()
      .then(snapshot => {
        let items = [];
        if (snapshot.empty) {
          res.status(200).send('No data!');
        } else if (req.query.mapLat !== undefined && req.query.mapLng !== undefined) {
          const queryLatitude = Number(req.query.mapLat);
          const queryLongitude = Number(req.query.mapLng);
          const from = turf.point([queryLongitude, queryLatitude]);
          const options = { units: 'miles' };
          snapshot.forEach(doc => {
            const data = doc.data();
            let dataLatitude = data['mapLat'];
            let dataLongitude = data['mapLng'];
            if (dataLatitude !== undefined && dataLongitude !== undefined) {
              const to = turf.point([dataLongitude,dataLatitude]);
              const distance = turf.distance(from, to, options);
              // If distance is within 500 miles from the query lat long
              if (distance <= 500) {
                items.push({ id: doc.id, data: doc.data() });
              }
            }
          });
        } else {
          snapshot.forEach(doc => {
            items.push({ id: doc.id, data: doc.data() });
          });
        }
        return items.length === 0 ? res.status(200).send('No data!') : res.status(200).send(items);
      })
      .catch(err => {
        res.status(500).send(`Error getting documents: ${err}`);
      });
  }, (error) => {
    res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
    });
  });
});

exports.getNeighborhoods = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not Allowed'
      });
    }
    return database.collection(UNIQUES)
      .doc(NEIGHBORHOOD)
      .get()
      .then(snapshot => snapshot.get('values'))
      .then(neighborhoods => res.status(200).send(neighborhoods))
      .catch(err => {
        res.status(500).send(`Error getting documents: ${err}`);
      });
  },
  (error) => {
      res.status(error.code).json({
      message: `Error getting documents: ${error.message}`
    });
  });
});

import json
import csv
from datetime import datetime

IN_FILEPATH = "/Users/critigenuser/Desktop/testNewDatadumpTacoma.json"
OUT_FILEPATH = "/Users/critigenuser/Desktop/testNewDatadumpTacoma.csv"

result = []
headers = ('ID', 'Vocalization', 'Vocalization Description', 'Carnivore Response', 'Number of Young Species',
           'Number of Adult Species', 'Eating', 'Time Seen', 'Latitude', 'Longitude', 'Behavior', 'Time Submitted',
           'Reaction Description', 'Species', 'On Leash', 'Number of Adults', 'Number of Children', 'Confidence',
           'Uploaded Media', 'Dog Size', 'General Comments', 'Neighborhood', 'Animal Features', 'Conflict Description',
           'Reaction', 'Conflict', 'Number of Dogs', 'In Tacoma')

with open(IN_FILEPATH) as f:
    raw_data = json.load(f)
    for entry in raw_data:
        ident = entry['id']
        data = entry['data']
        vocalization = data['vocalization']
        carnivore_response = data['carnivoreResponse']
        number_young_species = data['numberOfYoungSpecies']
        eating = data['animalEating']
        time_seen = data['timestamp']
        latitude = data['mapLat']
        behavior = data['animalBehavior']
        # TODO parse this out better 'time_submitted': {
        #             '_seconds': 1567010523,
        #             '_nanoseconds': 384000000}

        time_submitted_firebase = data['time_submitted']
        time_submitted_nano = (time_submitted_firebase['_seconds'] * 1000000000) + time_submitted_firebase['_nanoseconds']
        time_submitted_datetime = datetime.fromtimestamp(time_submitted_nano // 1000000000)
        # time_submitted = time_submitted_datetime.strftime('%YYYY-%mm-%dd %HH:%MM:%SS')  # 2019-02-21T20:00:00.000Z
        time_submitted = time_submitted_datetime.strftime('%Y-%m-%d %H:%M:%S')
        reaction_description = data['reactionDescription']
        species = data['species']
        on_leash = data['onLeash']
        number_adults = data['numberOfAdults']
        number_children = data['numberOfChildren']
        confidence = data['confidence']
        uploaded_media = data['mediaPaths']
        dog_size = data['dogSize']
        number_adult_species = data['numberOfAdultSpecies']
        general_comments = data['generalComments']
        neighborhood = data['neighborhood']
        animal_features = data['animalFeatures']
        longitude = data['mapLng']
        conflict_description = data['conflictDesc']
        reaction = data['reaction']
        conflict = data['carnivoreConflict']
        vocalization_description = data['vocalizationDesc']
        number_dogs = data['numberOfDogs']
        if 'isTacoma' in data:
            is_Tacoma = data['isTacoma']
        else:
            is_Tacoma = False
        result.append((ident, vocalization, vocalization_description, carnivore_response, number_young_species,
                       number_adult_species, eating, time_seen, latitude, longitude, behavior, time_submitted,
                       reaction_description, species,
                       on_leash, number_adults, number_children, confidence, uploaded_media, dog_size,
                       general_comments, neighborhood, animal_features, conflict_description,
                       reaction, conflict, number_dogs, is_Tacoma))

with open(OUT_FILEPATH, 'w') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(result)

import { Measure } from './measure.model';

export interface Station {
    id: string;
    RLOIid: string;
    catchmentName: string;
    dateOpened: string;
    easting: number;
    label: string;
    lat: number;
    long: number;
    measures: Measure[];
    northing: number;
    notation: string;
    riverName: string;
    stageScale: string;
    stationReference: string;
    status: string;
    town: string;
    wiskiID: string;
}

export interface StationResponse {
    items: Station[]
}

/*
{
      "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH",
      "RLOIid": "7041",
      "catchmentName": "Cotswolds",
      "dateOpened": "1994-01-01",
      "easting": 417990,
      "label": "Bourton Dickler",
      "lat": 51.874767,
      "long": -1.740083,
      "measures": [
        {
          "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-downstage-i-15_min-mASD",
          "parameter": "level",
          "parameterName": "Water Level",
          "period": 900,
          "qualifier": "Downstream Stage",
          "unitName": "mASD"
        },
        {
          "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-stage-i-15_min-mASD",
          "parameter": "level",
          "parameterName": "Water Level",
          "period": 900,
          "qualifier": "Stage",
          "unitName": "mASD"
        }
      ],
      "northing": 219610,
      "notation": "1029TH",
      "riverName": "River Dikler",
      "stageScale": "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale",
      "stationReference": "1029TH",
      "status": "http://environment.data.gov.uk/flood-monitoring/def/core/statusActive",
      "town": "Little Rissington",
      "wiskiID": "1029TH"
    },
*/
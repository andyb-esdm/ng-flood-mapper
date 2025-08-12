export interface Measure {
    id: string;
    parameter: string;
    parameterName: string;
    period: number;
    qualifier: string;
    unitName: string;
}

/*
{
          "@id": "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-downstage-i-15_min-mASD",
          "parameter": "level",
          "parameterName": "Water Level",
          "period": 900,
          "qualifier": "Downstream Stage",
          "unitName": "mASD"
        },
*/
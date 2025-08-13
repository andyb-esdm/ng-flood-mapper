export interface FloodArea {
    county: string;
    description: string;
    eaAreaName: string;
    notation: string;
    riverOrSea: string;
    polygon: string;
    geoJSON: string;
}

export interface FloodAreasResponse {
    items: FloodArea[]
}

export interface FloodAreaResponse {
    items: FloodArea;
}

/*
{ 
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/053FWFPUWI06" ,
    "county" : "Lincolnshire" ,
    "description" : "Areas near the River Witham, Sincil Dyke, Great Gowts Drain, Fossdyke Canal, Boultham Drain and the Brayford Pool in Lincoln" ,
    "eaAreaName" : "Lincs and Northants" ,
    "floodWatchArea" : "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/053WAF113LWA" ,
    "fwdCode" : "053FWFPUWI06" ,
    "label" : "Watercourses in the Lincoln area" ,
    "lat" : 53.22002 ,
    "long" : -0.55462 ,
    "notation" : "053FWFPUWI06" ,
    "polygon" : "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/053FWFPUWI06/polygon" ,
    "quickDialNumber" : "307044" ,
    "riverOrSea" : "River Witham, Sincil Dyke, Great Gowts Drain"
  }
    */
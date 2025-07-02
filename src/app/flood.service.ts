import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Flood, FloodResponse } from './flood.model';

@Injectable({
  providedIn: 'root'
})
export class FloodService {

  private httpClient = inject(HttpClient);

  constructor() { }

  getReadings(): Observable<any> {
    return this.httpClient.get('https://environment.data.gov.uk/flood-monitoring/data/readings?latest');
  }

  getFloods() {
    return this.httpClient.get('https://environment.data.gov.uk/flood-monitoring/id/floods');

    // http://environment.data.gov.uk/flood-monitoring/id/floodAreas/053FWFPUWI06/polygon')
  }

  getFloodsWithPolygons(): Observable<Flood[]> {
    const floodsUrl = 'https://environment.data.gov.uk/flood-monitoring/id/floods';
    // fetch the list of floods
    return this.httpClient.get<FloodResponse>(floodsUrl).pipe(
      map(response => response.items),

      // for each flood, fetch the polygon data
      switchMap((floods: Flood[]) => {
        // array of requests for fetching polygon data
        const polygonRequests: Observable<Flood>[] = floods.map(flood => {
          return this.httpClient.get<string>(flood.floodArea.polygon).pipe(
            // combine the polygon data with the flood data
            map((polygonData: string) => ({
              ...flood,
              floodArea: {
                ...flood.floodArea,
                geoJSON: polygonData
              }
            }))
          );
        });

        // return completed requests
        return forkJoin(polygonRequests);
      })
    );
  }

  getFloodArea(): Observable<any> {
    const floodAreaUrl = 'https://environment.data.gov.uk/flood-monitoring/id/floodAreas/122WAC953';
    return this.httpClient.get<any>(floodAreaUrl).pipe(
      switchMap((floodArea) => {
        const polygonUrl = floodArea.items.polygon;
        return this.httpClient.get<any>(polygonUrl).pipe(
          map(geoJson => {
            const response = {
              county: floodArea.items.county,
              description: floodArea.items.description,
              riverOrSea: floodArea.items.riverOrSea,
              geoJson: geoJson
            };
            return response;
          }),

        )
      })
    );
  }
}

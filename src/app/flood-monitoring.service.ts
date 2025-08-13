import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Flood, FloodResponse } from './models/flood.model';
import { FloodArea, FloodAreaResponse } from './models/flood-area.model';
import { Coordinate } from 'ol/coordinate';
import { Station, StationResponse } from './models/station.model';


@Injectable({
  providedIn: 'root'
})
export class FloodMonitoringService {

  private httpClient = inject(HttpClient);
  private readonly apiBaseUrl = 'https://environment.data.gov.uk/flood-monitoring';

  private stationsSubject = new BehaviorSubject<Station[]>([]);
  readonly stations$ = this.stationsSubject.asObservable();

  constructor() { }

  private cleanItem = (item: any): any => {
    const { ['@id']: atId, ...rest } = item;
    return { id: atId, ...rest };
  };

  getReadings(): Observable<any> {
    return this.httpClient.get('https://environment.data.gov.uk/flood-monitoring/data/readings?latest');
  }

  getFloods(): Observable<any> {
    return this.httpClient.get('https://environment.data.gov.uk/flood-monitoring/id/floods');

    // http://environment.data.gov.uk/flood-monitoring/id/floodAreas/053FWFPUWI06/polygon')
  }

  /*
  getFloodAreas(): Observable<FloodArea[]> {
  const url = `${this.apiBaseUrl}/id/floodAreas`;
  return this.httpClient.get<FloodApiResponse<FloodArea>>(url).pipe(
    map(response => response.items.map(item => this.cleanItem(item)))
  );
}
  */

  getFloodsWithPolygons(): Observable<Flood[]> {
    const floodsUrl = `${this.apiBaseUrl}/id/floods`;
    // const floodsUrl = 'https://environment.data.gov.uk/flood-monitoring/id/floods';
    // fetch the list of floods
    return this.httpClient.get<FloodResponse>(floodsUrl).pipe(
      map(response => response.items),
      map(floods => floods.map(flood => this.cleanItem(flood))),
      // for each flood, fetch the polygon data
      switchMap((floods: Flood[]) => {
        // array of requests for fetching polygon data
        const polygonRequests: Observable<Flood>[] = floods.map(flood => {
          return this.httpClient.get<string>(flood.floodArea.polygon).pipe(
            // combine the polygon data with the flood data
            map((polygonData: string) => {
              const floodWithPolygon = {
                ...flood,
                floodArea: {
                  ...flood.floodArea,
                  geoJSON: polygonData
                }
              };
              return floodWithPolygon;
            })
          );
        });

        // return completed requests
        return forkJoin(polygonRequests);
      })
    );
  }

  getFloodAreasWithPolygons(coordinates: Coordinate | undefined, distance: number = 100): Observable<FloodArea[]> {
    let floodAreasUrl = 'https://environment.data.gov.uk/flood-monitoring/id/floodAreas';
    if (coordinates) {
      const long = coordinates[0];
      const lat = coordinates[1];
      floodAreasUrl = `${floodAreasUrl}?lat=${lat}&long=${long}&dist=${distance}`;
    }

    // fetch the list of flood areas
    return this.httpClient.get<FloodAreaResponse>(floodAreasUrl).pipe(
      map(response => response.items),
      map(floodAreas => floodAreas.map(floodArea => this.cleanItem(floodArea))),
      // for each flood, fetch the polygon data
      switchMap((floodAreas: FloodArea[]) => {
        // array of requests for fetching polygon data
        const polygonRequests: Observable<FloodArea>[] = floodAreas.map(floodArea => {
          return this.httpClient.get<string>(floodArea.polygon).pipe(
            // combine the polygon data with the floodArea data
            map((polygonData: string) => {
              const floodAreaWithPolygon = {
                ...floodArea,
                geoJSON: polygonData
              };
              return floodAreaWithPolygon;
            })
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
          map(geoJSON => {
            const response = {
              county: floodArea.items.county,
              description: floodArea.items.description,
              riverOrSea: floodArea.items.riverOrSea,
              geoJSON: geoJSON
            };
            return response;
          }),

        )
      })
    );
  }

  getStations(coordinates: Coordinate | undefined, distance: number = 100): Observable<Station[]> {
    let stationsUrl = `${this.apiBaseUrl}/id/stations`;
    if (coordinates) {
      const long = coordinates[0];
      const lat = coordinates[1];
      stationsUrl = `${stationsUrl}?lat=${lat}&long=${long}&dist=${distance}`;
    }
    return this.httpClient.get<StationResponse>(stationsUrl).pipe(
      map(response => response.items),
      map(stations => stations.map(station => this.cleanItem(station))),
      tap(stations => this.stationsSubject.next(stations))
    );
  }

}

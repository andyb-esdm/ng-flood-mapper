import { inject, Injectable } from '@angular/core';

import { MapBrowserEvent, Map as olMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FloodMonitoringService } from '../flood-monitoring.service';
import VectorLayer from 'ol/layer/Vector';
import { Flood } from '../models/flood.model';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style, { StyleLike } from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { FloodArea } from '../models/flood-area.model';
import olGeolocation from 'ol/Geolocation';
import Feature, { FeatureLike } from 'ol/Feature';
import CircleStyle from 'ol/style/Circle';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { Station } from '../models/station.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private distanceQueryParam = 30;
  private map: olMap | null = null;
  private floodMonitoringService = inject(FloodMonitoringService);

  private floodLayer = new VectorLayer();
  private floodAreasLayer = new VectorLayer();

  private floodAreaLayer = new VectorLayer();
  private stationLayer = new VectorLayer();

  private positionLayer = new VectorLayer();

  private coordinates: Coordinate | undefined = undefined;

  getMap(): olMap {
    if (this.map === null) {
      this.map = new olMap({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });


      this.map.on('pointermove', (event: MapBrowserEvent): void => {
        if (this.map) {
          const pixel = this.map.getEventPixel(event.originalEvent);
          if (pixel && this.map.hasFeatureAtPixel(pixel)) {
            this.map.getViewport().style.cursor = 'pointer';
          } else {
            this.map.getViewport().style.cursor = '';
          }
        }
      });

      this.setupGeoLocation();
    }
    return this.map;
  }

  private setupGeoLocation() {
    const geolocation = new olGeolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true,
      },
      // default projection is latlong
      // projection: this.map?.getView().getProjection(),
    });

    geolocation.setTracking(true);

    geolocation.on('error', (error) => {
      console.log(error);
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: '#3399CC',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      }),
    );

    const vectorSource = new VectorSource();
    vectorSource.addFeature(positionFeature);
    this.positionLayer.setSource(vectorSource);

    this.map?.addLayer(this.positionLayer);

    geolocation.on('change:position', () => {
      const wgs84Coordinates = geolocation.getPosition();
      this.coordinates = wgs84Coordinates;
      if (wgs84Coordinates) {
        const mapCoordinates = transform(wgs84Coordinates, 'EPSG:4326', 'EPSG:3857');
        positionFeature.setGeometry(wgs84Coordinates ? new Point(mapCoordinates) : undefined);
      }
    });
  }

  addFloodsToMap() {
    this.floodMonitoringService.getFloodsWithPolygons().subscribe(floods => {
      this.createFloodLayer(floods);
    });
  }

  addFloodAreasToMap() {
    this.floodMonitoringService.getFloodAreasWithPolygons(this.coordinates, this.distanceQueryParam).subscribe(floodAreas => {
      this.createFloodAreasLayer(floodAreas);
    })
  }

  addFloodAreaToMap() {
    this.floodMonitoringService.getFloodArea().subscribe(floodArea => {
      this.createFloodAreaLayer(floodArea.geoJSON);
    })
  }

  private createFloodAreaLayer(geoJSON: any) {
    console.log(geoJSON)
    this.removeAllLayers();

    const formatter = new GeoJSON();

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJSON, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
    });

    this.floodAreaLayer.setSource(vectorSource);

    const style = new Style({
      stroke: new Stroke({
        color: 'rgb(0,0,255)'
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.2)'
      })
    });

    this.floodAreaLayer.setStyle(style);

    this.map?.addLayer(this.floodAreaLayer);

    this.map?.getView().fit(vectorSource.getExtent());
  }

  private createFloodAreasLayer(floodAreas: FloodArea[]) {
    this.removeAllLayers();

    const formatter = new GeoJSON();
    const vectorSource = new VectorSource();
    floodAreas.forEach(floodArea => {
      const features = formatter.readFeatures(floodArea.geoJSON, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      features.forEach(feature => {
        feature.set('notation', floodArea.notation);
        feature.set('recordType', 'floodArea');
      });
      vectorSource.addFeatures(features);
    });

    this.floodAreasLayer.setSource(vectorSource);

    const style = new Style({
      stroke: new Stroke({
        color: 'rgb(0,0,255)'
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.2)'
      })
    });

    this.floodAreasLayer.setStyle(style);

    this.map?.addLayer(this.floodAreasLayer);

    this.map?.getView().fit(vectorSource.getExtent());
  }

  private createFloodLayer(floods: Flood[]) {
    this.removeAllLayers();

    const formatter = new GeoJSON();
    const vectorSource = new VectorSource();
    floods.forEach(flood => {
      const features = formatter.readFeatures(flood.floodArea.geoJSON, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      features.forEach(feature => {
        feature.set('notation', flood.floodAreaID);
        feature.set('severityLevel', flood.severityLevel);
        feature.set('recordType', 'flood');
      });
      vectorSource.addFeatures(features);
    });

    this.floodLayer.setSource(vectorSource);

    // const style = new Style({
    //   stroke: new Stroke({
    //     color: 'rgb(255,0,0)'
    //   }),
    //   fill: new Fill({
    //     color: 'rgba(255, 0, 0, 0.2)'
    //   })
    // });

    this.floodLayer.setStyle(this.floodStyle);

    this.map?.addLayer(this.floodLayer);

    this.map?.getView().fit(vectorSource.getExtent());
  }

  // 1	Severe Flood Warning	Severe Flooding, Danger to Life.
  // 2	Flood Warning	Flooding is Expected, Immediate Action Required.
  // 3	Flood Alert	Flooding is Possible, Be Prepared.
  // 4	Warning no Longer in Force	The warning is no longer in force

  private floodStyle = (feature: FeatureLike, resolution: number): Style => {
    const defaultStyle = new Style({ stroke: new Stroke({ color: 'rgb(0,0,255)' }), fill: new Fill({ color: 'rgba(0, 0, 255, 0.2)' }) });
    const styleMap = new Map<number, Style>([
      [1, new Style({ stroke: new Stroke({ color: 'rgb(255,0,0)' }), fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }) })],
      [2, new Style({ stroke: new Stroke({ color: 'rgb(255,255,0)' }), fill: new Fill({ color: 'rgba(255, 255, 0, 0.2)' }) })],
      [3, new Style({ stroke: new Stroke({ color: 'rgb(255,191,0)' }), fill: new Fill({ color: 'rgba(255, 191, 0, 0.2)' }) })],
      [4, new Style({ stroke: new Stroke({ color: 'rgb(0,255,0)' }), fill: new Fill({ color: 'rgba(0, 255, 0, 0.2)' }) })]
    ]);
    const severityLevel = Number(feature.get('severityLevel'));
    return styleMap.get(severityLevel) ?? defaultStyle;
  }

  addStationsToMap() {
    this.floodMonitoringService.getStations(this.coordinates, this.distanceQueryParam).subscribe(stations => {
      this.createStationsLayer(stations);
    })
  }

  private createStationsLayer(stations: Station[]) {
    this.removeAllLayers();
    const vectorSource = new VectorSource();
    stations.forEach(station => {
      const wgs84Coordinates: Coordinate = [station.long, station.lat];
      const mapCoordinates = transform(wgs84Coordinates, 'EPSG:4326', 'EPSG:3857');

      const feature = new Feature(new Point(mapCoordinates));
      feature.set('notation', station.notation);
      feature.set('recordType', 'station');
      vectorSource.addFeature(feature);

    });
    this.stationLayer.setSource(vectorSource);
    this.map?.addLayer(this.stationLayer);
    this.map?.getView().fit(vectorSource.getExtent());
  }

  private removeAllLayers() {
    this.map?.removeLayer(this.floodLayer);
    this.map?.removeLayer(this.floodAreasLayer);
    this.map?.removeLayer(this.stationLayer);
    this.map?.removeLayer(this.floodAreaLayer);
  }

}

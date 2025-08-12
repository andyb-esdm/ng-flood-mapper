import { Component, OnInit, inject } from '@angular/core';
import { Map as olMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FloodMonitoringService } from '../flood-monitoring.service';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private floodMonitoringService = inject(FloodMonitoringService);
  private mapService = inject(MapService);

  protected county: string | null = null;
  protected description: string | null = null;
  protected riverOrSea: string | null = null;

  map: olMap | null = null;
  ngOnInit(): void {
    this.map = this.mapService.getMap();
    this.map.setTarget('map');

    // this.mapService.addFloodsToMap();

    // this.floodMonitoringService.getFloodArea().subscribe(floodArea => {
    //   this.county = floodArea.county;
    //   this.description = floodArea.description;
    //   this.riverOrSea = floodArea.riverOrSea;
    //   this.createFloodAreaLayer(floodArea.geoJson);
    // })
  }

  private createFloodAreaLayer(geoJson: any) {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const feature = vectorSource.getFeatures()[0];
    const simplifiedGeom = feature.getGeometry()?.simplify(30);

    const clone = feature.clone();
    clone.setGeometry(simplifiedGeom);
    vectorSource.addFeature(clone);


    const style = new Style({
      stroke: new Stroke({
        color: 'rgb(255,0,0)'
      })
    });
    clone.setStyle(style)

    this.map?.addLayer(vectorLayer);

    this.map?.getView().fit(vectorSource.getExtent());
  }
}

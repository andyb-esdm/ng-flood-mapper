import { Component, OnInit, inject } from '@angular/core';
import { Map as olMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FloodService } from '../flood.service';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private floodService = inject(FloodService);

  protected county: string | null = null;
  protected description: string | null = null;
  protected riverOrSea: string | null = null;

  map: olMap | null = null;
  ngOnInit(): void {
    this.map = new olMap({
      target: 'map',
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

    this.floodService.getFloodArea().subscribe(floodArea => {
      this.county = floodArea.county;
      this.description = floodArea.description;
      this.riverOrSea = floodArea.riverOrSea;
      this.createFloodAreaLayer(floodArea.geoJson);
    })
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

    this.map?.addLayer(vectorLayer);

    this.map?.getView().fit(vectorSource.getExtent());
  }
}

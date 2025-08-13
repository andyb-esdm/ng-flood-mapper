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
  }
}

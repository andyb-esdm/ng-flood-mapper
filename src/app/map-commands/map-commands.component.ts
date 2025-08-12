import { Component, inject } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map-commands',
  standalone: true,
  imports: [],
  templateUrl: './map-commands.component.html',
  styleUrl: './map-commands.component.scss'
})
export class MapCommandsComponent {
  private mapService = inject(MapService);

  showFloodWarnings() {
    this.mapService.addFloodsToMap();
  }

  showFloodAreas() {
    this.mapService.addFloodAreasToMap();
  }

  showStations() {
    this.mapService.addStationsToMap();
  }

}

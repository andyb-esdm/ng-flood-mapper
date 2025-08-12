import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FloodMonitoringService } from './flood-monitoring.service';
import { MapComponent } from './map/map.component';
import { FeatureInfoComponent } from './feature-info/feature-info.component';
import { MapCommandsComponent } from './map-commands/map-commands.component';
import { StationsComponent } from './stations/stations.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe, MapComponent, FeatureInfoComponent, MapCommandsComponent, StationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private floodMonitoringService = inject(FloodMonitoringService);

  readings$ = this.floodMonitoringService.getReadings();
  floods$ = this.floodMonitoringService.getFloods();
  stations$ = this.floodMonitoringService.stations$;

  floodsWithPolygons$ = this.floodMonitoringService.getFloodsWithPolygons();
  title = 'ng-flood-mapper';
}

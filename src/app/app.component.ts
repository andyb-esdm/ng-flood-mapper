import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FloodService } from './flood.service';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private floodService = inject(FloodService);

  readings$ = this.floodService.getReadings();
  floods$ = this.floodService.getFloods();

  floodsWithPolygons$ = this.floodService.getFloodsWithPolygons();
  title = 'ng-flood-mapper';
}

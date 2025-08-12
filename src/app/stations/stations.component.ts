import { Component, Input } from '@angular/core';
import { Station } from '../models/station.model';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss'
})
export class StationsComponent {
  @Input({ required: true }) stations!: Station[];
}

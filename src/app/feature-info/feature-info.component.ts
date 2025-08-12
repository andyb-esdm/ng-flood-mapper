import { Component, inject } from '@angular/core';
import { FeatureInfoService } from '../services/feature-info.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-feature-info',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './feature-info.component.html',
  styleUrl: './feature-info.component.scss'
})
export class FeatureInfoComponent {
  protected featureInfo$ = inject(FeatureInfoService).featureInfo$;
}

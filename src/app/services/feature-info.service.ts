import { inject, Injectable } from '@angular/core';
import { MapService } from './map.service';
import { MapBrowserEvent, Map as olMap } from 'ol';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureInfoService {
  private mapService = inject(MapService);
  private map: olMap | null = null;

  private featureInfoSubject = new BehaviorSubject<string | null>(null);
  public readonly featureInfo$ = this.featureInfoSubject.asObservable();

  constructor() {
    this.map = this.mapService.getMap();
    this.map.on('singleclick', (event) => this.getFeatureInfo(event));
  }

  private getFeatureInfo(event: MapBrowserEvent) {
    const pixel = event.pixel;
    let featureInfo: string | null = '';
    this.map?.forEachFeatureAtPixel(pixel, (feature, layer) => {
      const notation = feature.get('notation');
      featureInfo += feature.get('notation');
      const recordType = feature.get('recordType');
      if (recordType === 'station') {
        alert(notation)
      }
    });
    if (featureInfo === '') {
      featureInfo = null;
    }
    this.featureInfoSubject.next(featureInfo);
  }
}

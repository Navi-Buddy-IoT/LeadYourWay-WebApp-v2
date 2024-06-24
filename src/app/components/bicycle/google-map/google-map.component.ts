import { Component, Input } from '@angular/core';
import { GoogleMapsModule, MapCircle } from '@angular/google-maps';
import { Bicycle } from '../../../models/bicycle.model';
import { environment } from '../../../env/environment';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [GoogleMapsModule, MapCircle],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
})
export class GoogleMapComponent {
  @Input() bicycle!: Bicycle;
  @Input() isRented!: boolean;

  options: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    center: { lat: -12, lng: -77 },
    zoom: 13,
    zoomControl: false,
    mapTypeControl: false,
  };
  circleCenter: google.maps.LatLngLiteral = { lat: -12, lng: -77 };
  radius = 1500;
  markerContent: Element | null = null;

  ngOnInit() {
    const parser = new DOMParser();
    const svg = parser.parseFromString(
      environment.bikeSvg2,
      'image/svg+xml'
    ).documentElement;
    this.markerContent = svg;
    this.options.center = {
      lat: this.bicycle.latitude,
      lng: this.bicycle.longitude,
    };
    this.circleCenter = {
      lat: this.bicycle.latitude,
      lng: this.bicycle.longitude,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Coordinates } from 'src/app/interface/coordinates.interface';
import { User } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/service/user.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css'],
})
export class UserdetailComponent implements OnInit {
  user: User;
  mode: 'edit' | 'locked' = 'locked';
  buttonText: 'Save Changes' | 'Edit' = 'Edit';
  marker = new Leaflet.Icon({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = <User>(
      this.activatedRoute.snapshot.data['resolvedResponse'].results[0]
    );
    console.log(this.user);
    this.loadMap(this.user.coordinate);
    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
    //   console.log('User ID: ' + params.get('uuid'));
    //   this.userService
    //     .getUser(params.get('uuid'))
    //     .subscribe((response: any) => {
    //       console.log(response);
    //       this.response = response;
    //       this.user = this.response.results[0];
    //     });
    // });
  }

  changeMode(mode: 'edit' | 'locked'): void {
    console.log(mode);
    this.mode = this.mode === 'locked' ? 'edit' : 'locked';
    this.buttonText = this.buttonText === 'Edit' ? 'Save Changes' : 'Edit';
    if (mode === 'edit') {
      // Logic to update the user on te back end
      console.log('Updating using on the back end');
    }
  }

  private loadMap(coordinate: Coordinates): void {
    const map = Leaflet.map('map', {
      center: [coordinate.latitude, coordinate.longitude],
      zoom: 8,
    });
    const mainLayer = Leaflet.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        maxZoom: 30,
        crossOrigin: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    mainLayer.addTo(map);
    const marker = Leaflet.marker([coordinate.latitude, coordinate.longitude], {
      icon: this.marker,
    });
    marker
      .addTo(map)
      .bindPopup(`${this.user.firstName}'s Location`)
      .openPopup();
  }
}

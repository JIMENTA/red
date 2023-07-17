
import { AfterViewInit, Component, ElementRef,  ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLat, Map, Marker} from 'mapbox-gl';
import { MarkerColor, PlainMarker } from '../../interfaces/marker.interface';

@Component({
  selector: 'app-markers-map',
  templateUrl: './markers-map.component.html',
  styleUrls: ['./markers-map.component.css']
})
export class MarkersMapComponent  implements AfterViewInit{
  @ViewChild('map') divMap ?: ElementRef;

  public markers : MarkerColor[] = []

  public zoom :number =13;
  public map ?: Map;
  public currentCenter : LngLat = new LngLat(2.158703911971088, 41.3822696576799);


  ngAfterViewInit(): void {
    if(!this.divMap) throw 'No se ha encontrado el elemento HTML'
    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.zoom 
  });
     
    this.readFromLocalStorage();
  }

  createMarker(){
    if(!this.map)return;
    
    const lngLat = this.map.getCenter()
    
    this.addMarker(lngLat)
  }

  addMarker(lngLat: LngLat){
    if(!this.map)return;
    const marker = new Marker({ color: 'red',  draggable:true})
    .setLngLat( lngLat) 
    // .setPopup(
    // new mapboxgl.Popup() 
    //   .setHTML(
    //     `<h4>${ Marker.name}</h4><p>esta descripcion</p>`) //*todo: refactorizar
    //   )
    .addTo(this.map)
    this.markers.push({color: 'red',marker})
    this.saveToLocalStorage()

    marker.on('dragend', () => this.saveToLocalStorage())
  }
  
  flyto(marker : Marker){
    this.map?.flyTo({
      zoom: 15,
      center : marker.getLngLat()
    })
  }

  saveToLocalStorage(){
    const plainMarkers : PlainMarker[] = this.markers.map(({color, marker}) =>{
      return{
        color, 
        lngLat : marker.getLngLat().toArray()
      }
    })
localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers))
  }

  readFromLocalStorage(){
    const plainMarkersStrig = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers : PlainMarker[] = JSON.parse(plainMarkersStrig)

    plainMarkers.forEach(({ lngLat}) => {
      const [ lng, lat] = lngLat
      const coords = new LngLat(lng, lat)

      this.addMarker(coords)
    });
  }
}

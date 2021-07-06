import { FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';

import { showLocal } from './LocalMode';
import { addMarker, getCurrentLocation } from './MapFunctions';

declare const manywho: any;

export default class FlowMap extends FlowComponent {

    context: any;

    currentPosition: google.maps.LatLng;
    os: string;
    browser: string;
    browserManu: string;

    map: google.maps.Map;

    google: any;
    googleLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.beginMapsApi = this.beginMapsApi.bind(this);
        this.apiLoaded = this.apiLoaded.bind(this);
        this.showMarkers = this.showMarkers.bind(this);

        // {apiKey: 'AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY'}
        // GoogleApiWrapper(this.apiLoaded);

    }

    async componentDidMount() {
        await super.componentDidMount();

        this.os = navigator.platform;
        this.browser = navigator.product;
        this.browserManu = navigator.vendor;

        

       this.beginMapsApi();
    }

    beginMapsApi() {
        if(typeof google === 'undefined' || typeof google.maps === 'undefined') {
            if(typeof (window as any).GoogleMapsLoading === 'undefined') {
                const script = document.createElement('script');
                const apiKey = this.getAttribute('apiKey', '');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';
                window.document.body.appendChild(script);
                script.addEventListener('load', this.apiLoaded);
                (window as any).GoogleMapsLoading = true;
            }
            else {
                // already loading
                window.setImmediate(this.beginMapsApi);
            }
        }
        else {
            this.apiLoaded();
        }
    }

    // fires when the maps script has loaded
    async apiLoaded() {
        this.googleLoaded = true;
        this.currentPosition = await getCurrentLocation();
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement ,{
            center: this.currentPosition,
            zoom: parseInt(this.getAttribute("zoom","8"))
        });
        this.showMarkers();
    }

    

    

    // this triggers when the map page element is ready from the event handler on <Map>
    async showMarkers() {

        this.model.dataSource.items.forEach((marker: FlowObjectData) => {
            let place: any = {name: "Me", vicinity: "me"};
            addMarker(this.map,new google.maps.LatLng(
                {
                    lat: marker.properties["Latitude"].value as number, 
                    lng: marker.properties["Latitude"].value as number
                })
                ,
                marker.properties["Label"].value as string,
                "",
                place
                ,
                null
            )
        });
        // decide what to do based on attribute "mode"
        const mode = this.getAttribute('mode', 'local');
        switch (mode) {
            case 'local':
            default:
                const poiTypes: string = this.getAttribute('poiTypes', '');
                showLocal(this.map, this.currentPosition, poiTypes);
                break;
        }

        this.forceUpdate();
    }

    render() {
        const style: CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'px';
        }
        if (this.model.height) {
            style.height = this.model.height + 'px';
        }

        return (
            <div
                style={style}
            >
                <div 
                    style={{width:"100%", height: "100%"}}
                    id="map"
                />

            </div>
        );

    }
}

manywho.component.register('FlowMap', FlowMap);


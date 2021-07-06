import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import { CSSProperties } from 'react';

import { showLocal } from './LocalMode';
import { getCurrentLocation } from './MapFunctions';

declare const manywho: any;

export default class FlowMap extends FlowComponent {

    context: any;

    currentPosition: any;
    os: string;
    browser: string;
    browserManu: string;

    map: google.maps.Map;

    google: any;
    googleLoaded: boolean = false;

    markers: any[] = [];

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

        this.currentPosition = await getCurrentLocation();

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
        let center: google.maps.LatLng = new google.maps.LatLng({lat: this.currentPosition.coords.latitude, lng: this.currentPosition.coords.longitude});
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement ,{
            center: center,
            zoom: 8
        });
        this.showMarkers();
    }

    

    

    // this triggers when the map page element is ready from the event handler on <Map>
    async showMarkers() {
        // decide what to do based on attribute "mode"
        const mode = this.getAttribute('mode', 'local');
        switch (mode) {
            case 'local':
            default:
                const poiTypes: string = this.getAttribute('poiTypes', '');
                this.markers = await showLocal(this.map, this.currentPosition, poiTypes);
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


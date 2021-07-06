

export async function getCurrentLocation(options?: any): Promise<google.maps.LatLng> {
    let pos: any = await _getCurrentLocation(options);
    let loc: google.maps.LatLng = new google.maps.LatLng({lat: pos.coords.latitude, lng: pos.coords.longitude});
    return loc;
}

export async function _getCurrentLocation(options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

export async function findNearby(map: any, currentPosition: google.maps.LatLng, keys: string[], radiusMeters: number): Promise<any[]> {
    const service = new google.maps.places.PlacesService(map);
    const request: any = {
        location: currentPosition,
        radius: radiusMeters,
        types: keys,
      };
    const { results, status } = await new Promise((resolve) => {
        service.nearbySearch(
        request,
        // pass a callback to getDetails that resolves the promise
        (results, status) => resolve({ results, status }),
        );
    });
    return results;

}

export function addMarker(map: google.maps.Map, position: google.maps.LatLng, label: string, tooltip: string, place: google.maps.Place, icon: string): any {

    let marker: google.maps.Marker = new google.maps.Marker({
        map: map,
        position: position,
        place: place,
        icon: icon,
        title: label
    });

    marker.addListener("click",(event: google.maps.MapMouseEvent) => {this.openInfoWindow(map, event, marker, place)})

    return marker;
}

export function openInfoWindow(map: google.maps.Map, event: google.maps.MapMouseEvent, marker: google.maps.Marker, place: google.maps.Place) {
    const contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<span style="font-size: 20px">' + (place as any).name + '</span>' +
        '<div id="bodyContent">' +
        '<p style="font-size: 16px">' + (place as any).vicinity + '</p>' +
        '</div>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
    infowindow.setPosition(event.latLng);
    infowindow.open(map);
}

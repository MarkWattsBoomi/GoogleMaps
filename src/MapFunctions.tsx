
export async function getCurrentLocation(options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

export async function findNearby(map: any, currentPosition: any, keys: string[], radiusMeters: number): Promise<any[]> {
    const service = new google.maps.places.PlacesService(map);
    const me = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
    const request: any = {
        location: me,
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

export function addMarker(map: google.maps.Map, latitude: number, longitude: number, label: string, tooltip: string, place: google.maps.Place, icon: string): any {
    // const placeLoc = place.geometry.location;
    const pos: google.maps.LatLng = new google.maps.LatLng({lat: latitude, lng: longitude});

    let marker: google.maps.Marker = new google.maps.Marker({
        map: map,
        position: pos,
        place: place,
        icon: icon,
    });

    marker.addListener("click",this.openInfoWindow)

    return marker;
}

export function openInfoWindow(marker: google.maps.Marker, place: any) {
    const contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<span style="font-size: 20px">' + place.name + '</span>' +
        '<div id="bodyContent">' +
        '<p style="font-size: 16px">' + place.vicinity + '</p>' +
        '</div>' +
        '</div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
    infowindow.setPosition(marker.getPosition());
    infowindow.open(this.map);
}

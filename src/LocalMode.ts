import { addMarker, findNearby } from './MapFunctions';

export async function showLocal(map: google.maps.Map, currentPosition: google.maps.LatLng, poiTypeNames: string): Promise<any[]> {
    const markers: any[] = [];
    let place: any = {name: "Me", vicinity: "me"};
    
    markers.push(
        addMarker(
            map,
            currentPosition,
            'Me',
            'I am here',
            place,
            null,
        ),
    );
    if (poiTypeNames.length > 0) {
        let poiTypes: string[] = poiTypeNames.split(';');
        poiTypes = poiTypes.map((s) => s.trim());
        const pointsOfInterest: any = await findNearby(map, currentPosition, poiTypes, 30000);
        if (pointsOfInterest && pointsOfInterest.length > 0) {
            pointsOfInterest.forEach((result: any) => {
                markers.push(
                    addMarker(
                        map,
                        result.geometry.location,
                        result.name,
                        result.vicinity,
                        result,
                        result.icon,
                    ));
            });
        }
    }
    return markers;
}

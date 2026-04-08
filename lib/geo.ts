/**
 * Haversine formula — distance en kilomètres entre deux points GPS
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // arrondi à 0.1 km
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Trie un tableau de marqueurs par distance à un point de référence
 */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  userLat: number,
  userLon: number
): (T & { distanceFromUser: number })[] {
  return items
    .map((item) => ({
      ...item,
      distanceFromUser: haversineDistance(userLat, userLon, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
}

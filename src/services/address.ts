import type { UberEatsConfig } from "../schemas/config";
import type { SavedAddress } from "../schemas/address";
import { post } from "../http";

export async function getAddresses(config: UberEatsConfig): Promise<SavedAddress[]> {
  try {
    const data = await post<any>("/_p/api/getSavedAddressesV1", {}, config);
    const raw = data?.data?.savedPlaces || data?.savedPlaces || [];
    return raw.map((a: any) => ({
      id: a.uuid || a.id || "",
      label: a.label || a.name || a.type || "Address",
      address: a.addressComponents?.formattedAddress || a.address || a.streetAddress || "",
      lat: a.latitude || a.geo?.lat || 0,
      lng: a.longitude || a.geo?.lng || 0,
      isDefault: a.isDefault || false,
    }));
  } catch {
    return [];
  }
}

export async function setAddress(address: string, config: UberEatsConfig): Promise<void> {
  await post<any>("/_p/api/setTargetLocationV1", {
    targetLocation: { address },
  }, config);
}

export async function switchAddress(label: string, config: UberEatsConfig): Promise<SavedAddress | null> {
  const addresses = await getAddresses(config);
  const match = addresses.find(
    (a) => a.label.toLowerCase() === label.toLowerCase()
  );
  if (!match) return null;

  await post<any>("/_p/api/setTargetLocationV1", {
    targetLocation: {
      latitude: match.lat,
      longitude: match.lng,
      address: match.address,
    },
  }, config);
  return match;
}

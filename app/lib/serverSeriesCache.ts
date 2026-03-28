import {
  getAllSeriesIds as storeIds,
  getSeriesMeta as storeMeta,
  getTvSeriesList,
  hasSeriesDetails,
  hasSeriesInStore,
} from "@/lib/tvSeriesStore";

export function getAllSeriesIds(): string[] {
  return storeIds();
}

export async function getSeriesMeta(imdbId: string, enrich: boolean = false) {
  return storeMeta(imdbId, enrich);
}

export function getSeriesList() {
  return getTvSeriesList();
}

export function getSeriesCacheState() {
  return {
    totalIds: storeIds().length,
    hasDetails: hasSeriesDetails(),
  };
}

export { hasSeriesInStore };


export function getBeerInfo(beer){
    return {
      name: beer.name,
      category: beer.category,
      ranking: beer.popularity,
      alcLevel: beer.alc,
      description: beer.description.overallImpression,
    };
  }
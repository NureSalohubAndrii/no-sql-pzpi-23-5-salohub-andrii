export const searchAddress = async (query: string) => {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '10',
    'accept-language': 'en',
  });

  const response = await fetch(`${process.env.OSM_API_URL}/search?${params}`, {
    headers: {
      'User-Agent': `find-pets-api/1.0 (${process.env.EMAIL_USER})`,
    },
  });

  if (!response.ok) {
    throw new Error(`OSM API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return parseSearchResponse(data);
};

export const reverseGeocoding = async (lon: number, lat: number) => {
  const response = await fetch(
    `${process.env.OSM_API_URL}/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: {
        'User-Agent': `find-pets-api/1.0 (${process.env.EMAIL_USER})`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`OSM API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const results = parseSearchResponse([data]);
  return results.length > 0 ? results[0] : null;
};

export const parseSearchResponse = (data: any[]) => {
  const seen = new Set<string>();

  return data
    .map(item => {
      const addr = item.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb;
      const street = addr.road || addr.street;
      const houseNumber = addr.house_number;

      const countryCode = addr.country_code?.toUpperCase() || '';
      const country = addr.country || '';
      const state = addr.state;
      const postcode = addr.postcode;

      const key = item.osm_id.toString();
      if (seen.has(key)) return null;
      seen.add(key);

      const displayNameShort = street
        ? `${street}${houseNumber ? ', ' + houseNumber : ''}`
        : city || country;

      return {
        properties: {
          osmId: item.osm_id,
          name: displayNameShort,
          type: item.type,
          countryCode,
          country,
          state,
          city,
          postcode,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        },
      };
    })
    .filter(Boolean);
};

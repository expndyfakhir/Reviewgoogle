import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  // Get API key from environment variable
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('Google Places API key is missing');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Encode the query parameter
    const encodedQuery = encodeURIComponent(query);
    
    // Make request to Google Places API - Text Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add detailed logging to debug the response
    console.log('Google Places API response status:', data.status);
    console.log('Google Places API response results:', data.results);
    console.log('Results length:', data.results ? data.results.length : 0);
    
    // Check if the API returned an error status
    if (data.status !== 'OK') {
      console.error(`Google Places API error: ${data.status}`, data.error_message);
      return NextResponse.json(
        { error: `Google Places API error: ${data.error_message || data.status}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      places: data.results.map(place => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      }))
    });
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google Places API' },
      { status: 500 }
    );
  }
}
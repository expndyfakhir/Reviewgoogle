import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  
  if (!placeId) {
    return NextResponse.json({ error: 'Place ID parameter is required' }, { status: 400 });
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
    // Make request to Google Places API - Place Details
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,review,user_ratings_total&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return NextResponse.json({
      place: {
        name: data.result.name,
        formatted_address: data.result.formatted_address,
        rating: data.result.rating,
        user_ratings_total: data.result.user_ratings_total,
        reviews: data.result.reviews || []
      }
    });
  } catch (error) {
    console.error('Error fetching place details from Google Places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place details from Google Places API' },
      { status: 500 }
    );
  }
}
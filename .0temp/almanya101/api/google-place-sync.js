// =====================================================
// API/GOOGLE-PLACE-SYNC.JS
// Vercel Serverless Function
// Syncs provider data with Google Places API
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key (server-side only!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Cache duration in milliseconds (7 days)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

// =====================================================
// MAIN HANDLER
// =====================================================
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get provider_id from query params
    const { provider_id, force } = req.query;

    if (!provider_id) {
      return res.status(400).json({ error: 'provider_id is required' });
    }

    // Validate environment variables
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    // Fetch provider from database
    const { data: provider, error: fetchError } = await supabase
      .from('providers')
      .select('*')
      .eq('id', provider_id)
      .single();

    if (fetchError || !provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Check if provider has google_place_id
    if (!provider.google_place_id) {
      return res.status(400).json({ error: 'Provider does not have a google_place_id' });
    }

    // Check cache (skip if force=1)
    const shouldForce = force === '1' || force === 'true';

    if (!shouldForce && provider.google_last_sync_at) {
      const lastSync = new Date(provider.google_last_sync_at);
      const now = new Date();
      const timeSinceSync = now - lastSync;

      if (timeSinceSync < CACHE_DURATION) {
        return res.status(200).json({
          message: 'Sync skipped (cached)',
          provider_id: provider.id,
          last_sync_at: provider.google_last_sync_at,
          cache_remaining_hours: Math.floor((CACHE_DURATION - timeSinceSync) / (60 * 60 * 1000))
        });
      }
    }

    // Fetch place details from Google Places API
    const placeDetails = await fetchGooglePlaceDetails(provider.google_place_id);

    // Update provider with Google data
    const updateData = {
      google_rating: placeDetails.rating || null,
      google_user_ratings_total: placeDetails.user_ratings_total || null,
      google_maps_url: placeDetails.url || provider.google_maps_url,
      lat: placeDetails.geometry?.location?.lat || null,
      lng: placeDetails.geometry?.location?.lng || null,
      google_last_sync_at: new Date().toISOString(),
      google_raw: placeDetails
    };

    // Update address if not already set
    if (!provider.address && placeDetails.formatted_address) {
      updateData.address = placeDetails.formatted_address;
    }

    // Update provider in database
    const { error: updateError } = await supabase
      .from('providers')
      .update(updateData)
      .eq('id', provider_id);

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    return res.status(200).json({
      success: true,
      provider_id: provider.id,
      synced_at: updateData.google_last_sync_at,
      data: {
        rating: updateData.google_rating,
        user_ratings_total: updateData.google_user_ratings_total,
        maps_url: updateData.google_maps_url,
        lat: updateData.lat,
        lng: updateData.lng
      }
    });

  } catch (error) {
    console.error('Google Place Sync Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// =====================================================
// FETCH GOOGLE PLACE DETAILS
// =====================================================
async function fetchGooglePlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');

  url.searchParams.append('place_id', placeId);
  url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
  url.searchParams.append('fields', 'place_id,name,rating,user_ratings_total,formatted_address,geometry,url');
  url.searchParams.append('language', 'de'); // German language for results

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Google Places API returned ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
  }

  return data.result;
}

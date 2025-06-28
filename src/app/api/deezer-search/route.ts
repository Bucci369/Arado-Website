import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'Arado'
    const limit = searchParams.get('limit') || '6'
    
    // Call Deezer API from server (no CORS issues)
    const response = await fetch(
      `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'DJ-ARADO-Website/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Deezer API')
    }

    const data = await response.json()
    
    // Transform Deezer data to our format
    const transformedTracks = data.data?.map((track: {
      id: number;
      title: string;
      preview: string;
      link: string;
      album: { title: string; cover_xl?: string; cover_big?: string; cover_medium?: string; cover: string };
      artist: { name: string };
      duration: number;
      rank?: number;
    }) => ({
      id: track.id.toString(),
      name: track.title,
      preview_url: track.preview, // 30-second preview URL
      external_urls: { 
        spotify: track.link,
        deezer: track.link 
      },
      album: { 
        name: track.album.title,
        images: [{ 
          url: track.album.cover_xl || track.album.cover_big || track.album.cover_medium || track.album.cover, 
          height: 640, 
          width: 640 
        }] 
      },
      artists: [{ name: track.artist.name }],
      duration_ms: track.duration * 1000,
      popularity: track.rank || 50
    })) || []
    
    return NextResponse.json({ 
      tracks: transformedTracks,
      total: data.total || 0
    })
    
  } catch (error) {
    console.error('Deezer API error:', error)
    return NextResponse.json(
      { error: 'Failed to search tracks', tracks: [] },
      { status: 500 }
    )
  }
}
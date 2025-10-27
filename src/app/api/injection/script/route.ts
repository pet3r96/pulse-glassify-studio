import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the injection script
    const scriptPath = join(process.cwd(), 'src/lib/injection/ghl-injection-script.js');
    const script = readFileSync(scriptPath, 'utf-8');

    // Add configuration based on query parameters
    const url = new URL(request.url);
    const debug = url.searchParams.get('debug') === 'true';
    const version = url.searchParams.get('version') || '1.0.0';

    // Replace configuration in the script
    const configuredScript = script
      .replace(/debug: false/g, `debug: ${debug}`)
      .replace(/version: '1\.0\.0'/g, `version: '${version}'`);

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/javascript');
    headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new NextResponse(configuredScript, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving injection script:', error);
    return NextResponse.json(
      { error: 'Failed to load injection script' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

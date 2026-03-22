// Vercel API proxy for BMF Steuerrechner (CORS workaround)
// BMF external interface: https://www.bmf-steuerrechner.de/interface/

import { json } from "./_lib.js";

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const { LZZ, STKL, RE4, KRV, KVZ, code, year } = req.query;

  // Validate required params
  if (!LZZ || !STKL || !RE4 || !KVZ) {
    return json(res, 400, { error: "Missing required parameters: LZZ, STKL, RE4, KVZ" });
  }

  // Build BMF URL
  const bmfYear = year || "2026";
  const bmfCode = code || `Lohn${bmfYear}`;
  const versionXhtml = `${bmfYear}Version1.xhtml`;

  const bmfUrl = new URL(`https://www.bmf-steuerrechner.de/interface/${versionXhtml}`);
  bmfUrl.searchParams.set("code", bmfCode);
  bmfUrl.searchParams.set("LZZ", LZZ);
  bmfUrl.searchParams.set("STKL", STKL);
  bmfUrl.searchParams.set("RE4", RE4);
  bmfUrl.searchParams.set("KRV", KRV || "1");
  bmfUrl.searchParams.set("KVZ", KVZ);

  try {
    const response = await fetch(bmfUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/xml",
        "User-Agent": "almanya101-MaasHesaplayici/1.0"
      }
    });

    if (!response.ok) {
      return json(res, 502, {
        error: "BMF request failed",
        status: response.status,
        statusText: response.statusText
      });
    }

    const xmlText = await response.text();

    // Parse XML and extract values
    const result = parseXml(xmlText);

    return json(res, 200, {
      success: true,
      data: result,
      source: "BMF Externe Schnittstelle",
      year: bmfYear
    });

  } catch (error) {
    console.error("BMF proxy error:", error);
    return json(res, 500, {
      error: "Internal server error",
      message: error.message
    });
  }
}

function parseXml(xmlText) {
  // Simple XML parsing for BMF output format
  // Format: <ausgabe name="LSTLZZ" value="12345" type="STANDARD"/>
  const result = {};

  const regex = /<ausgabe\s+name="([^"]+)"\s+value="([^"]+)"/g;
  let match;

  while ((match = regex.exec(xmlText)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
}

import { JSDOM } from 'jsdom';
import { NextApiRequest, NextApiResponse } from 'next';

function getMetaDataFromHTML(htmlText: any) {
  const dom = new JSDOM(htmlText);
  const metaTags: any = dom.window.document.querySelectorAll('meta');
  const metaData: any = {};

  for (const metaTag of metaTags) {
    const name = metaTag.getAttribute('name');
    const content = metaTag.getAttribute('content');
    if (name && content) {
      metaData[name] = content;
    }
  }

  return metaData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    if (!url) {
      throw new Error('URL is required');
    }

    const r = await fetch(url as string, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        priority: 'u=0, i',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-arch': '"x86"',
        'sec-ch-ua-bitness': '"64"',
        'sec-ch-ua-form-factors': '"Desktop"',
        'sec-ch-ua-full-version': '"128.0.6613.138"',
        'sec-ch-ua-full-version-list':
          '"Chromium";v="128.0.6613.138", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"macOS"',
        'sec-ch-ua-platform-version': '"13.6.0"',
        'sec-ch-ua-wow64': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'service-worker-navigation-preload': 'true',
        'upgrade-insecure-requests': '1',
        'Referrer-Policy': 'origin-when-cross-origin',
      },
      body: null,
      method: 'GET',
    });

    const html = await r.text();
    const data = getMetaDataFromHTML(html);

    res.status(200).json({ result: data });
  } catch {
    res.status(500).json({ error: 'failed to load data' });
  }
}

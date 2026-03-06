import { useEffect } from 'react';

export default function SEO({ title, description, url }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Alerta Água PG`;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    }
    
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    }
    
    if (url) {
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    }
  }, [title, description, url]);

  return null;
}

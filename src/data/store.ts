// Products sold on /store. Checkout runs on Lemon Squeezy (merchant of record:
// it handles payment, sales tax/VAT and emails the license key). Leave a URL
// empty until it exists; the page then shows a "coming soon" state instead of a
// broken button.

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  note: string;
  checkoutUrl: string; // Lemon Squeezy variant "Share" link
  best?: boolean;
}

export interface Product {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  icon: string;
  installUrl: string; // Chrome Web Store listing
  privacyUrl: string;
  supportEmail: string;
  activationLimit: number; // must match the Lemon Squeezy product's license activation limit
  plans: Plan[];
}

export const mdViewer: Product = {
  slug: 'md-viewer',
  name: 'MD Viewer',
  kind: 'Chrome extension',
  tagline: 'Read, copy and paste Markdown the easy way.',
  summary:
    'Opens .md files beautifully rendered, copies Markdown as rich text that keeps its formatting, and turns any web page or selection into clean Markdown.',
  icon: '/store/md-viewer/icon.png',
  installUrl: 'https://chromewebstore.google.com/detail/md-viewer-markdown-reader/enmpoeakakgiipgoabhhlhkopcbmajgj',
  privacyUrl: 'https://pacificfrontdesk.github.io/md-viewer/privacy.html',
  supportEmail: 'support@pacificfrontdesk.com',
  activationLimit: 3,
  plans: [
    { id: 'yearly', name: 'Yearly', price: '$4.99', period: 'per year', note: 'Cancel anytime', checkoutUrl: '' },
    { id: 'lifetime', name: 'Lifetime', price: '$14.99', period: 'one-time', note: 'Pay once, keep Pro forever', checkoutUrl: '', best: true },
  ],
};

export const products: Product[] = [mdViewer];

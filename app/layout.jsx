import './globals.css';

export const metadata = {
  title: 'VC Analytics Dashboard',
  description: 'AI-Powered Sales Analytics Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

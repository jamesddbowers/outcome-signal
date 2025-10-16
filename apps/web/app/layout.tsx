export const metadata = {
  title: 'OutcomeSignal',
  description: 'AI-powered initiative management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

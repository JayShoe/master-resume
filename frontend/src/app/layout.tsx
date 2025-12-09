import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SystemThemeProvider } from "@/providers/SystemThemeProvider";
import { IdentityProvider } from "@/providers/IdentityProvider";
import { getIdentity, getProfessionalSummaries } from '@/lib/data-source';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

async function getPortfolioData() {
  try {
    const [identity, professionalSummaries] = await Promise.all([
      getIdentity(),
      getProfessionalSummaries()
    ]);

    const primarySummary = professionalSummaries?.[0];

    if (identity) {
      const fullName = `${identity.first_name} ${identity.last_name}`;
      const title = primarySummary?.title || 'Professional Portfolio';
      return {
        identity,
        metadata: {
          fullName,
          title,
          description: primarySummary?.content?.replace(/<[^>]*>/g, '').substring(0, 160) ||
                      'A comprehensive portfolio and resume management system showcasing professional experience, projects, and skills.'
        }
      };
    }
  } catch (error) {
    console.error('Failed to load portfolio data:', error);
  }

  return {
    identity: null,
    metadata: {
      fullName: 'Portfolio',
      title: 'Professional Portfolio',
      description: 'A comprehensive portfolio and resume management system showcasing professional experience, projects, and skills.'
    }
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { metadata: portfolioMeta } = await getPortfolioData();

  return {
    title: `${portfolioMeta.fullName} - ${portfolioMeta.title}`,
    description: portfolioMeta.description,
    keywords: ["resume", "portfolio", "professional", "experience", "projects", "skills", portfolioMeta.fullName],
    authors: [{ name: portfolioMeta.fullName }],
    creator: portfolioMeta.fullName,
    openGraph: {
      title: `${portfolioMeta.fullName} - ${portfolioMeta.title}`,
      description: portfolioMeta.description,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${portfolioMeta.fullName} - ${portfolioMeta.title}`,
      description: portfolioMeta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { identity } = await getPortfolioData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider defaultTheme="system" enableSystemSync={true} enableStorageSync={true}>
          <SystemThemeProvider>
            <IdentityProvider identity={identity}>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </IdentityProvider>
          </SystemThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

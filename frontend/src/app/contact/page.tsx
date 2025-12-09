import { getIdentity } from '@/lib/data-source';
import PageLayout from '@/components/layout/PageLayout';
import ContactDisplay from '@/components/contact/ContactDisplay';

export default async function ContactPage() {
  let identity: any = null;
  let error: string | null = null;

  try {
    identity = await getIdentity();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load contact information';
    console.error('Contact page data fetch error:', err);
  }

  return (
    <PageLayout
      title="Let's Connect"
      description="Ready to collaborate on your next project? I'm always interested in discussing new opportunities, innovative challenges, and ways we can work together."
    >
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px',
              textAlign: 'center'
            }}>
              <h2 style={{
                color: '#dc2626',
                fontWeight: '600',
                marginBottom: '8px',
                fontSize: '16px'
              }}>Data Loading Error</h2>
              <p style={{ color: '#dc2626', fontSize: '16px', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          <ContactDisplay identity={identity} />
        </div>
      </section>
    </PageLayout>
  );
}

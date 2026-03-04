import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-[#94A3B8] mb-12">
            Last updated: 4 March 2026
          </p>

          <div className="space-y-10 text-[14px] text-[#475569] leading-relaxed">
            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">1. Introduction</h2>
              <p>
                WhipSpec Pty Ltd (ABN pending) (&ldquo;WhipSpec&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
                operates whipspec.com. We are committed to protecting your privacy and complying with the
                Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              </p>
              <p className="mt-3">
                This policy explains how we collect, use, disclose, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">2. Information We Collect</h2>
              <p className="font-medium text-[#0F172A] mb-2">Information you provide:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Account details: name, email address, password</li>
                <li>Profile information: display name, bio, profile photo</li>
                <li>Build content: vehicle details, modification lists, photos, videos</li>
                <li>Shop information: business name, services, location, contact details</li>
                <li>Communications: messages sent through contact forms or support</li>
                <li>Payment information: processed securely through Stripe (we do not store card details)</li>
              </ul>
              <p className="font-medium text-[#0F172A] mb-2">Information collected automatically:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Device and browser information</li>
                <li>IP address and approximate location</li>
                <li>Pages visited, time spent, and interaction data</li>
                <li>Referral source and search terms</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide, operate, and improve the WhipSpec platform</li>
                <li>Create and manage your account</li>
                <li>Display build pages, shop pages, and attribution content</li>
                <li>Process payments and subscriptions</li>
                <li>Send service-related communications (account updates, security alerts)</li>
                <li>Send marketing communications (with your consent, which you can withdraw at any time)</li>
                <li>Analyse platform usage to improve features and user experience</li>
                <li>Generate anonymised and aggregated analytics</li>
                <li>Track affiliate link clicks and attribution for commerce features</li>
                <li>Detect and prevent fraud, spam, and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">4. How We Share Your Information</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Service providers:</strong> hosting (Vercel), database (Neon), payments (Stripe),
                  email (Resend), analytics — only as necessary to operate the platform
                </li>
                <li>
                  <strong>Affiliate networks:</strong> anonymised click and conversion data for commerce
                  attribution
                </li>
                <li>
                  <strong>Other users:</strong> your public profile, build pages, and shop pages are visible
                  to other users and the public
                </li>
                <li>
                  <strong>Legal requirements:</strong> where required by law, regulation, or legal process
                </li>
                <li>
                  <strong>Business transfers:</strong> in connection with a merger, acquisition, or sale
                  of assets
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">5. Cookies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Understand how you use the platform</li>
                <li>Track affiliate attribution</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Disabling cookies may affect
                platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">6. Data Storage and Security</h2>
              <p>
                Your data is stored on servers located in Australia and the United States (via our
                hosting and database providers). We implement industry-standard security measures
                including encryption in transit (TLS), secure authentication, and access controls.
              </p>
              <p className="mt-3">
                While we take reasonable steps to protect your information, no method of transmission
                or storage is completely secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed
                to provide services. If you delete your account, we will delete or anonymise your
                personal information within 30 days, except where retention is required by law.
              </p>
              <p className="mt-3">
                Public build pages and shop attributions may be retained in anonymised form after
                account deletion to preserve the integrity of the platform&rsquo;s content.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">8. Your Rights</h2>
              <p>Under Australian privacy law, you have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@whipspec.com" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                  privacy@whipspec.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">9. Third-Party Links</h2>
              <p>
                WhipSpec may contain links to third-party websites, retailers, and services. We are
                not responsible for the privacy practices of these third parties. We encourage you
                to review their privacy policies before providing personal information.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">10. Children</h2>
              <p>
                WhipSpec is not intended for children under 18. We do not knowingly collect personal
                information from children. If you believe a child has provided us with personal
                information, please contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">11. International Users</h2>
              <p>
                WhipSpec is operated from Australia. If you access the platform from outside Australia,
                your information may be transferred to and processed in Australia or other countries
                where our service providers are located. By using the platform, you consent to this
                transfer.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Material changes will be
                communicated via email or a prominent notice on the platform. The &ldquo;last
                updated&rdquo; date at the top reflects the most recent revision.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">13. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or how we handle your data:
              </p>
              <ul className="mt-3 space-y-1">
                <li>
                  Email:{" "}
                  <a href="mailto:privacy@whipspec.com" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                    privacy@whipspec.com
                  </a>
                </li>
                <li>
                  Website:{" "}
                  <a href="https://whipspec.com/contact" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                    whipspec.com/contact
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-[13px] text-[#94A3B8]">
                You may also lodge a complaint with the Office of the Australian Information
                Commissioner at{" "}
                <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                  oaic.gov.au
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

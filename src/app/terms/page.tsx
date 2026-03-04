import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-[13px] text-[#94A3B8] mb-12">
            Last updated: 4 March 2026
          </p>

          <div className="space-y-10 text-[14px] text-[#475569] leading-relaxed">
            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using WhipSpec (&ldquo;whipspec.com&rdquo;), operated by WhipSpec Pty Ltd
                (ABN pending) (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be
                bound by these Terms of Service. If you do not agree, do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years of age or the age of majority in your jurisdiction to create
                an account. By registering, you represent that all information provided is accurate and complete.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">3. Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree
                to notify us immediately of any unauthorised use. We reserve the right to suspend or terminate
                accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">4. User Content</h2>
              <p className="mb-3">
                &ldquo;User Content&rdquo; means any text, images, videos, build specifications, reviews,
                or other materials you submit to WhipSpec. You retain ownership of your User Content. By
                submitting content, you grant us a worldwide, non-exclusive, royalty-free licence to use,
                display, reproduce, and distribute your content on and through the platform.
              </p>
              <p>You represent that you have the right to submit all content and that it does not:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Infringe on any third-party intellectual property rights</li>
                <li>Contain false, misleading, or defamatory information</li>
                <li>Promote illegal activities or unsafe vehicle modifications</li>
                <li>Include malicious code, spam, or unsolicited advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">5. Build Pages and Attribution</h2>
              <p>
                WhipSpec allows creators to publish build specifications and attribute parts, brands,
                and shops. Attribution is provided by users and may not be independently verified by
                WhipSpec. We do not guarantee the accuracy of any build specification, product
                identification, or shop attribution.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">6. Shop Pages</h2>
              <p>
                Shops and brands may claim and manage their profiles on WhipSpec. Claimed shop pages
                are the responsibility of the claiming business. WhipSpec may create draft pages for
                shops based on user-submitted build attributions. Shops may request edits or removal
                of draft pages by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">7. Affiliate Links and Commerce</h2>
              <p>
                WhipSpec may include affiliate links to third-party retailers. We may earn a commission
                on purchases made through these links. Product pricing and availability are determined
                by third-party retailers and are not controlled by WhipSpec.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">8. Subscriptions and Payments</h2>
              <p>
                Certain features require a paid subscription. Prices are listed in Australian Dollars
                (AUD) and are inclusive of GST where applicable. Subscriptions renew automatically
                unless cancelled before the renewal date. Refunds are handled in accordance with
                Australian Consumer Law.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">9. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use the platform for any unlawful purpose</li>
                <li>Impersonate another person or business</li>
                <li>Scrape, harvest, or collect data without authorisation</li>
                <li>Interfere with the platform&rsquo;s operation or security</li>
                <li>Submit false build specifications or fraudulent shop claims</li>
                <li>Use automated systems to access the platform without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">10. Intellectual Property</h2>
              <p>
                The WhipSpec name, logo, design, and all platform software are the property of WhipSpec
                Pty Ltd and are protected by Australian and international intellectual property laws.
                You may not reproduce, modify, or distribute any part of the platform without our
                written consent.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">11. Disclaimers</h2>
              <p>
                WhipSpec is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
                warrant that the platform will be uninterrupted, error-free, or secure. We are not
                responsible for any vehicle modifications performed based on information found on
                the platform. Always consult qualified professionals and ensure compliance with
                Australian road safety regulations.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">12. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, WhipSpec Pty Ltd shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from your
                use of the platform. Nothing in these terms excludes or limits liability that cannot
                be excluded under Australian Consumer Law.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">13. Termination</h2>
              <p>
                We may suspend or terminate your access at any time for violations of these terms.
                You may delete your account at any time. Upon termination, your right to use the
                platform ceases immediately, though certain provisions survive (including intellectual
                property, disclaimers, and limitation of liability).
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">14. Governing Law</h2>
              <p>
                These terms are governed by the laws of the State of Western Australia, Australia.
                Any disputes shall be subject to the exclusive jurisdiction of the courts of Western
                Australia.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">15. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Material changes will be communicated
                via email or a prominent notice on the platform. Continued use after changes
                constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-[#0F172A] mb-3">16. Contact</h2>
              <p>
                Questions about these terms? Contact us at{" "}
                <a href="mailto:hello@whipspec.com" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                  hello@whipspec.com
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

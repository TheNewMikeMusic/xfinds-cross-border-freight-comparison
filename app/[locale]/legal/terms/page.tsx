import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  // Force English content for legal pages
  const isEnglish = locale === 'en'
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <Card className="glass">
          <CardContent className="p-6 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">1. Acceptance of Terms</h2>
                  <p className="mb-4">
                    By accessing and using Xfinds (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p className="mb-4">
                    These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, mobile applications, and other services provided by Xfinds. Your use of our Service constitutes your agreement to these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">2. Description of Service</h2>
                  <p className="mb-4">
                    Xfinds is a product search and agent comparison platform that enables users to discover, compare, and access products through various third-party agent services. We provide:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Product search and discovery tools</li>
                    <li>Price comparison across multiple agent platforms</li>
                    <li>Agent ratings, reviews, and service information</li>
                    <li>Product information aggregation and display</li>
                    <li>Shopping cart and comparison features</li>
                  </ul>
                  <p className="mb-4">
                    <strong className="text-white">Important:</strong> Xfinds is a comparison platform and does not directly sell products. We are not a retailer, distributor, or manufacturer. All transactions are conducted between you and third-party agent services. We do not process payments, handle shipping, or manage product fulfillment.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">3. User Accounts and Registration</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Account Creation</h3>
                  <p className="mb-4">
                    To access certain features of our Service, you may be required to create an account. When creating an account, you agree to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and identification</li>
                    <li>Accept all responsibility for activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Account Eligibility</h3>
                  <p className="mb-4">
                    You must be at least 18 years old or the age of majority in your jurisdiction to use our Service. By using our Service, you represent and warrant that you meet this age requirement.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Account Termination</h3>
                  <p className="mb-4">
                    We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">4. User Responsibilities and Conduct</h2>
                  <p className="mb-4">
                    You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Violate any applicable local, state, national, or international law or regulation</li>
                    <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, libelous, invasive of another&apos;s privacy, hateful, or racially, ethnically, or otherwise objectionable</li>
                    <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                    <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                    <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service</li>
                    <li>Use any robot, spider, scraper, or other automated means to access the Service for any purpose without our express written permission</li>
                    <li>Collect or harvest any personally identifiable information from the Service</li>
                    <li>Use the Service to transmit any unsolicited commercial communications</li>
                    <li>Modify, adapt, translate, or reverse engineer any portion of the Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">5. Third-Party Services and Links</h2>
                  <p className="mb-4">
                    Our Service contains links to third-party websites, services, and agent platforms (&quot;Third-Party Services&quot;). These links are provided for your convenience only. We do not:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Endorse or assume responsibility for the content, privacy policies, or practices of Third-Party Services</li>
                    <li>Control or monitor Third-Party Services</li>
                    <li>Guarantee the availability, accuracy, or quality of products or services offered by Third-Party Services</li>
                    <li>Process payments or handle transactions on behalf of Third-Party Services</li>
                  </ul>
                  <p className="mb-4">
                    When you click on links to Third-Party Services, you will be subject to their terms of service and privacy policies. We encourage you to review these policies before engaging with any Third-Party Service.
                  </p>
                  <p className="mb-4">
                    <strong className="text-white">Disclaimer:</strong> All transactions, including payment processing, shipping, returns, and customer service, are handled directly by the Third-Party Services. Xfinds is not responsible for any issues arising from your interactions with Third-Party Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">6. Product Information and Pricing</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.1 Information Accuracy</h3>
                  <p className="mb-4">
                    We strive to provide accurate product information, pricing, and availability data. However, we do not warrant that product descriptions, prices, shipping costs, or other content on our Service is accurate, complete, reliable, current, or error-free.
                  </p>
                  <p className="mb-4">
                    Product information, including but not limited to prices, availability, specifications, and images, is provided by Third-Party Services and may change without notice. We are not responsible for discrepancies between information displayed on our Service and information on Third-Party Service websites.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Price Comparison</h3>
                  <p className="mb-4">
                    Our price comparison features are provided for informational purposes only. Final prices, including shipping costs, taxes, and fees, may vary. Always verify the final price on the Third-Party Service&apos;s website before completing a purchase.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">7. Intellectual Property Rights</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.1 Our Intellectual Property</h3>
                  <p className="mb-4">
                    The Service and its original content, features, and functionality are owned by Xfinds and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 User Content</h3>
                  <p className="mb-4">
                    You retain ownership of any content you submit, post, or display on or through the Service (&quot;User Content&quot;). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content for the purpose of operating and promoting the Service.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 Third-Party Content</h3>
                  <p className="mb-4">
                    Product images, descriptions, and other content displayed on our Service may be owned by third parties. We use such content under fair use principles and in accordance with applicable laws. If you believe your intellectual property rights have been infringed, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">8. Disclaimers and Limitations of Liability</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.1 Service Disclaimer</h3>
                  <p className="mb-4">
                    THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                  <p className="mb-4">
                    We do not warrant that:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The Service will be uninterrupted, secure, or error-free</li>
                    <li>Defects will be corrected</li>
                    <li>The Service is free of viruses or other harmful components</li>
                    <li>The results obtained from using the Service will be accurate or reliable</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 Product and Transaction Disclaimer</h3>
                  <p className="mb-4">
                    We make no representations or warranties regarding:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The quality, safety, legality, or authenticity of products offered by Third-Party Services</li>
                    <li>The accuracy of product descriptions, prices, or availability</li>
                    <li>The ability of Third-Party Services to complete transactions</li>
                    <li>The quality or timeliness of shipping or delivery services</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 Limitation of Liability</h3>
                  <p className="mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL XFINDS, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Your use or inability to use the Service</li>
                    <li>Any products, services, or content obtained through the Service</li>
                    <li>Unauthorized access to or alteration of your transmissions or data</li>
                    <li>Statements or conduct of any third party on the Service</li>
                    <li>Any other matter relating to the Service</li>
                  </ul>
                  <p className="mb-4">
                    Our total liability to you for all claims arising from or related to the use of the Service shall not exceed the amount you paid us, if any, in the twelve (12) months preceding the claim, or $100, whichever is greater.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">9. Indemnification</h2>
                  <p className="mb-4">
                    You agree to defend, indemnify, and hold harmless Xfinds, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney&apos;s fees and costs, arising out of or in any way connected with:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Your access to or use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party right, including without limitation any intellectual property right, publicity, confidentiality, property, or privacy right</li>
                    <li>Any claim that your User Content caused damage to a third party</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">10. Privacy and Data Protection</h2>
                  <p className="mb-4">
                    Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
                  </p>
                  <p className="mb-4">
                    By using our Service, you consent to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">11. Modifications to Terms</h2>
                  <p className="mb-4">
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Posting the updated Terms on this page</li>
                    <li>Updating the &quot;Last Updated&quot; date at the top of this page</li>
                    <li>Sending an email notification to registered users (if applicable)</li>
                  </ul>
                  <p className="mb-4">
                    Your continued use of the Service after any such modifications constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">12. Termination</h2>
                  <p className="mb-4">
                    We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
                  </p>
                  <p className="mb-4">
                    Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">13. Governing Law and Dispute Resolution</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.1 Governing Law</h3>
                  <p className="mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Xfinds operates, without regard to its conflict of law provisions.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.2 Dispute Resolution</h3>
                  <p className="mb-4">
                    Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of a recognized arbitration organization, except where prohibited by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">14. Miscellaneous</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">14.1 Entire Agreement</h3>
                  <p className="mb-4">
                    These Terms constitute the entire agreement between you and Xfinds regarding the use of the Service and supersede all prior agreements and understandings.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">14.2 Severability</h3>
                  <p className="mb-4">
                    If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">14.3 Waiver</h3>
                  <p className="mb-4">
                    No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">14.4 Assignment</h3>
                  <p className="mb-4">
                    You may not assign or transfer these Terms, by operation of law or otherwise, without our prior written consent. We may assign these Terms without restriction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">15. Contact Information</h2>
                  <p className="mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    <li className="text-gray-300">
                      <strong className="text-white">Email:</strong> legal@xfinds.com
                    </li>
                    <li className="text-gray-300">
                      <strong className="text-white">Support:</strong> support@xfinds.com
                    </li>
                    <li className="text-gray-300">
                      <strong className="text-white">Website:</strong> <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">xfinds.com/contact</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

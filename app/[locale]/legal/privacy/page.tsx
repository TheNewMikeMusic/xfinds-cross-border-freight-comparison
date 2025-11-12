import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <Card className="glass">
          <CardContent className="p-6 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">1. Introduction</h2>
                  <p className="mb-4">
                    Xfinds (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;the Service&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and related services (collectively, the &quot;Service&quot;).
                  </p>
                  <p className="mb-4">
                    Please read this Privacy Policy carefully. By accessing or using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, do not use our Service.
                  </p>
                  <p className="mb-4">
                    This Privacy Policy is incorporated into and subject to our Terms of Service. Capitalized terms used but not defined in this Privacy Policy have the meanings given to them in our Terms of Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">2. Information We Collect</h2>
                  <p className="mb-4">
                    We collect information that you provide directly to us, information collected automatically when you use our Service, and information from third-party sources.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide to Us</h3>
                  <p className="mb-4">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="text-white">Account Information:</strong> When you create an account, we collect your email address, password (hashed), and any other information you choose to provide, such as your name.</li>
                    <li><strong className="text-white">Profile Information:</strong> Information you provide in your user profile, including preferences and settings.</li>
                    <li><strong className="text-white">User Content:</strong> Information you submit, post, or display on the Service, including product reviews, comments, and feedback.</li>
                    <li><strong className="text-white">Communications:</strong> Information you provide when you contact us for support or other inquiries, including email addresses, messages, and any other information you choose to provide.</li>
                    <li><strong className="text-white">Shopping Data:</strong> Products you add to your cart, comparison lists, and saved preferences.</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Information Collected Automatically</h3>
                  <p className="mb-4">When you use our Service, we automatically collect certain information, including:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our Service, including pages visited, time spent on pages, click patterns, search queries, and navigation paths.</li>
                    <li><strong className="text-white">Device Information:</strong> Information about your device, including device type, operating system, browser type and version, device identifiers, and mobile network information.</li>
                    <li><strong className="text-white">Log Data:</strong> Server logs that may include IP addresses, access times, pages viewed, browser type, and referring website addresses.</li>
                    <li><strong className="text-white">Location Data:</strong> General location information based on your IP address or device settings, which we may use to provide localized content and currency conversion.</li>
                    <li><strong className="text-white">Cookies and Tracking Technologies:</strong> Information collected through cookies, web beacons, pixel tags, and similar tracking technologies. See Section 6 for more information.</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Information from Third Parties</h3>
                  <p className="mb-4">We may receive information about you from third-party sources, including:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="text-white">Agent Platforms:</strong> Product information, pricing, availability, and other data from third-party agent services.</li>
                    <li><strong className="text-white">Analytics Providers:</strong> Usage and demographic information from analytics services.</li>
                    <li><strong className="text-white">Social Media Platforms:</strong> If you connect your account with social media services, we may receive information from those platforms.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">3. How We Use Your Information</h2>
                  <p className="mb-4">We use the information we collect for various purposes, including:</p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Service Provision</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Provide, maintain, and improve our Service</li>
                    <li>Process your registration and manage your account</li>
                    <li>Enable product search, comparison, and discovery features</li>
                    <li>Facilitate your interactions with third-party agent services</li>
                    <li>Personalize your experience and provide customized content</li>
                    <li>Respond to your inquiries, comments, and requests</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Communication</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Send you service-related notifications, updates, and administrative messages</li>
                    <li>Send you marketing communications (with your consent, where required)</li>
                    <li>Notify you about changes to our Service or policies</li>
                    <li>Provide customer support and respond to your inquiries</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Analytics and Improvement</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Analyze usage patterns and trends to improve our Service</li>
                    <li>Conduct research and analytics to understand user preferences</li>
                    <li>Develop new features and functionality</li>
                    <li>Monitor and prevent fraud, abuse, and security threats</li>
                    <li>Debug and troubleshoot technical issues</li>
            </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 Legal Compliance</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Comply with applicable laws, regulations, and legal processes</li>
                    <li>Respond to requests from public and government authorities</li>
                    <li>Enforce our Terms of Service and other agreements</li>
                    <li>Protect our rights, privacy, safety, and property</li>
                    <li>Protect the rights, privacy, safety, and property of our users and others</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">4. How We Share Your Information</h2>
                  <p className="mb-4">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 With Your Consent</h3>
                  <p className="mb-4">
                    We may share your information with third parties when you consent to such sharing, such as when you choose to connect your account with social media platforms.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Service Providers</h3>
                  <p className="mb-4">
                    We may share your information with third-party service providers who perform services on our behalf, including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Hosting and cloud storage services</li>
                    <li>Analytics and data analysis services</li>
                    <li>Email and communication services</li>
                    <li>Payment processing services (if applicable)</li>
                    <li>Customer support services</li>
                  </ul>
                  <p className="mb-4">
                    These service providers are contractually obligated to protect your information and use it only for the purposes for which we disclose it to them.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Third-Party Agent Services</h3>
                  <p className="mb-4">
                    When you interact with third-party agent services through our platform, you may be redirected to their websites. These third parties have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party agent services.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.4 Business Transfers</h3>
                  <p className="mb-4">
                    If we are involved in a merger, acquisition, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.5 Legal Requirements</h3>
                  <p className="mb-4">
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.6 Protection of Rights</h3>
                  <p className="mb-4">
                    We may disclose your information to protect our rights, privacy, safety, or property, or that of our users or others, including to prevent fraud or abuse.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.7 Aggregated and Anonymized Data</h3>
                  <p className="mb-4">
                    We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to identify you for various purposes, including research, analytics, and marketing.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">5. Data Security</h2>
                  <p className="mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Encryption of data in transit using SSL/TLS protocols</li>
                    <li>Secure password storage using industry-standard hashing algorithms</li>
                    <li>Regular security assessments and vulnerability testing</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection and security</li>
                  </ul>
                  <p className="mb-4">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                  </p>
                  <p className="mb-4">
                    If you believe your account has been compromised, please contact us immediately at security@xfinds.com.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">6. Cookies and Tracking Technologies</h2>
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.1 Types of Cookies We Use</h3>
                  <p className="mb-4">We use cookies and similar tracking technologies to collect and store information. Types of cookies we use include:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="text-white">Essential Cookies:</strong> Required for the Service to function properly, such as authentication and security cookies.</li>
                    <li><strong className="text-white">Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences and settings.</li>
                    <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our Service by collecting and reporting information anonymously.</li>
                    <li><strong className="text-white">Advertising Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness (if applicable).</li>
            </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Managing Cookies</h3>
                  <p className="mb-4">
                    Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, if you disable cookies, some features of our Service may not function properly.
                  </p>
                  <p className="mb-4">
                    For more information about managing cookies, visit:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><a href="https://www.allaboutcookies.org" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
                    <li><a href="https://www.youronlinechoices.com" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
            </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">7. Your Rights and Choices</h2>
                  <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.1 Access and Portability</h3>
                  <p className="mb-4">
                    You have the right to access and receive a copy of your personal information that we hold about you.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Correction</h3>
                  <p className="mb-4">
                    You have the right to request correction of inaccurate or incomplete personal information.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 Deletion</h3>
                  <p className="mb-4">
                    You have the right to request deletion of your personal information, subject to certain exceptions (e.g., legal obligations, legitimate business interests).
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.4 Objection and Restriction</h3>
                  <p className="mb-4">
                    You have the right to object to processing of your personal information or request restriction of processing in certain circumstances.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.5 Opt-Out</h3>
                  <p className="mb-4">
                    You can opt out of receiving marketing communications from us by:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Following the unsubscribe instructions in our emails</li>
                    <li>Updating your account preferences</li>
                    <li>Contacting us directly</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.6 Account Settings</h3>
                  <p className="mb-4">
                    You can access and update certain information through your account settings on our Service.
                  </p>
                  
                  <p className="mb-4">
                    To exercise any of these rights, please contact us at privacy@xfinds.com. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">8. Data Retention</h2>
                  <p className="mb-4">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Factors we consider when determining retention periods include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The nature and sensitivity of the information</li>
                    <li>The purposes for which we process the information</li>
                    <li>Legal and regulatory requirements</li>
                    <li>The potential risk of harm from unauthorized use or disclosure</li>
                  </ul>
                  <p className="mb-4">
                    When we no longer need your personal information, we will securely delete or anonymize it.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">9. Children&apos;s Privacy</h2>
                  <p className="mb-4">
                    Our Service is not intended for children under the age of 18 (or the age of majority in your jurisdiction). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">10. International Data Transfers</h2>
                  <p className="mb-4">
                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our Service, you consent to the transfer of your information to these countries.
                  </p>
                  <p className="mb-4">
                    We take appropriate safeguards to ensure that your personal information receives an adequate level of protection in the jurisdictions in which we process it.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">11. California Privacy Rights</h2>
                  <p className="mb-4">
                    If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The right to know what personal information we collect, use, disclose, and sell</li>
                    <li>The right to delete personal information we have collected from you</li>
                    <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                    <li>The right to non-discrimination for exercising your privacy rights</li>
                  </ul>
                  <p className="mb-4">
                    To exercise these rights, please contact us at privacy@xfinds.com.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">12. European Privacy Rights</h2>
                  <p className="mb-4">
                    If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR), including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The right to access your personal data</li>
                    <li>The right to rectification of inaccurate data</li>
                    <li>The right to erasure (&quot;right to be forgotten&quot;)</li>
                    <li>The right to restrict processing</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing</li>
                    <li>Rights related to automated decision-making and profiling</li>
                  </ul>
                  <p className="mb-4">
                    Our legal basis for processing your personal information includes consent, contract performance, legal obligations, legitimate interests, and protection of vital interests.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">13. Changes to This Privacy Policy</h2>
                  <p className="mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Posting the updated Privacy Policy on this page</li>
                    <li>Updating the &quot;Last Updated&quot; date at the top of this page</li>
                    <li>Sending an email notification to registered users (if applicable)</li>
                    <li>Displaying a prominent notice on our Service</li>
                  </ul>
                  <p className="mb-4">
                    Your continued use of our Service after any changes to this Privacy Policy constitutes your acceptance of the updated policy. We encourage you to review this Privacy Policy periodically.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">14. Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <ul className="list-none pl-0 mb-4 space-y-2">
                    <li className="text-gray-300">
                      <strong className="text-white">Privacy Officer:</strong> privacy@xfinds.com
                    </li>
                    <li className="text-gray-300">
                      <strong className="text-white">General Inquiries:</strong> support@xfinds.com
                    </li>
                    <li className="text-gray-300">
                      <strong className="text-white">Security Concerns:</strong> security@xfinds.com
                    </li>
                    <li className="text-gray-300">
                      <strong className="text-white">Website:</strong> <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">xfinds.com/contact</a>
                    </li>
                  </ul>
                  <p className="mb-4">
                    We will respond to your inquiry within a reasonable timeframe and in accordance with applicable law.
                  </p>
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

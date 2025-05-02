import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="text-2xl font-bold mb-8">
            Broqui Food Assistant
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Last Updated: November 1, 2023
          </p>
        </div>

        <div className="prose max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At Broqui Food Assistant ("we," "our," or "us"), we value your
            privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our website, mobile
            application, or any other services provided by Broqui Food Assistant
            (collectively, the "Services").
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with
            the terms of this Privacy Policy, please do not access our Services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, information
            we collect automatically when you use our Services, and information
            from third-party sources.
          </p>

          <h3>2.1 Information You Provide to Us</h3>
          <p>
            We may collect the following types of information when you provide
            it to us:
          </p>
          <ul>
            <li>
              <strong>Account Information:</strong> When you register for an
              account, we collect your name, email address, and password.
            </li>
            <li>
              <strong>Profile Information:</strong> You may choose to provide
              additional information for your profile, such as dietary
              preferences and food allergies.
            </li>
            <li>
              <strong>User Content:</strong> Information you provide through our
              Services, including messages, images, and other content you share.
            </li>
            <li>
              <strong>Communications:</strong> When you contact us directly, we
              may keep a record of your communication to help solve any issues
              you might be facing.
            </li>
          </ul>

          <h3>2.2 Information We Collect Automatically</h3>
          <p>
            When you use our Services, we may collect certain information
            automatically, including:
          </p>
          <ul>
            <li>
              <strong>Device Information:</strong> Information about your
              device, including IP address, device type, operating system, and
              browser type.
            </li>
            <li>
              <strong>Usage Information:</strong> Information about how you use
              our Services, such as the pages you visit, features you use, and
              the time and duration of your visits.
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We may use
              cookies and similar tracking technologies to collect information
              about your browsing activities.
            </li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes,
            including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our Services</li>
            <li>Process and complete transactions</li>
            <li>
              Send you technical notices, updates, security alerts, and support
              messages
            </li>
            <li>Respond to your comments, questions, and requests</li>
            <li>
              Personalize your experience and deliver content tailored to your
              interests
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our Services
            </li>
            <li>
              Detect, investigate, and prevent fraudulent transactions and other
              illegal activities
            </li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information with the following entities:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share your information
              with third-party vendors, consultants, and other service providers
              who need access to such information to perform services on our
              behalf.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a
              merger, acquisition, or sale of all or a portion of our assets,
              your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is
            active or as needed to provide you with our Services. We will retain
            and use your information as necessary to comply with our legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul>
            <li>
              The right to access the personal information we hold about you
            </li>
            <li>
              The right to request the correction of inaccurate personal
              information
            </li>
            <li>
              The right to request the deletion of your personal information
            </li>
            <li>The right to withdraw consent to data processing</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at
            privacy@broqui.com.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our Services are not directed to children under 18 years of age. We
            do not knowingly collect personal information from children under
            18. If we become aware that a child under 18 has provided us with
            personal information, we will take steps to delete such information.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement reasonable security measures to protect your personal
            information from unauthorized access, use, or disclosure. However,
            no method of transmission over the internet or electronic storage is
            100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to, and maintained on, computers
            located outside of your state, province, country, or other
            governmental jurisdiction where the data protection laws may differ.
            If you are located outside the United States and choose to provide
            information to us, please note that we transfer the information to
            the United States and process it there.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date at the top of this Privacy
            Policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@broqui.com.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

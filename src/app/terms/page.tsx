import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="text-2xl font-bold mb-8">
            Broqui Food Assistant
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Last Updated: November 1, 2023
          </p>
        </div>

        <div className="prose max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Broqui Food Assistant ("we," "our," or "us"). By
            accessing or using our website, mobile application, or any other
            services provided by Broqui Food Assistant (collectively, the
            "Services"), you agree to be bound by these Terms of Service
            ("Terms"). Please read these Terms carefully before using our
            Services.
          </p>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By accessing or using our Services, you acknowledge that you have
            read, understood, and agree to be bound by these Terms. If you do
            not agree to these Terms, you must not access or use our Services.
          </p>

          <h2>3. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. If we make
            changes, we will provide notice by updating the date at the top of
            these Terms and by maintaining a current version of the Terms at
            broqui.com/terms. Your continued use of our Services after any such
            change constitutes your acceptance of the new Terms.
          </p>

          <h2>4. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By using our
            Services, you represent and warrant that you are at least 18 years
            old and that your use of the Services does not violate any
            applicable laws or regulations.
          </p>

          <h2>5. Account Registration</h2>
          <p>
            To access certain features of our Services, you may be required to
            register for an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your account credentials and
            for all activities that occur under your account. You agree to
            notify us immediately of any unauthorized use of your account.
          </p>

          <h2>6. User Conduct</h2>
          <p>You agree not to use our Services to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe the intellectual property rights of others</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Send spam or other unsolicited messages</li>
            <li>Upload viruses or other malicious code</li>
            <li>Attempt to circumvent security measures</li>
            <li>Impersonate another person</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            Our Services and its contents, including but not limited to text,
            graphics, logos, button icons, images, audio clips, data
            compilations, and software, are the property of Broqui Food
            Assistant or its content suppliers and protected by international
            copyright laws.
          </p>

          <h2>8. User Content</h2>
          <p>
            You retain ownership of any content you submit through our Services
            ("User Content"). By submitting User Content, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce,
            modify, adapt, publish, translate, and distribute your User Content
            in any existing or future media.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites or services
            that are not owned or controlled by Broqui Food Assistant. We have
            no control over, and assume no responsibility for, the content,
            privacy policies, or practices of any third-party websites or
            services.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your access to our Services immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach these Terms.
          </p>

          <h2>11. Disclaimer of Warranties</h2>
          <p>
            Our Services are provided on an "as is" and "as available" basis.
            Broqui Food Assistant expressly disclaims all warranties of any
            kind, whether express or implied, including but not limited to the
            implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>

          <h2>12. Limitation of Liability</h2>
          <p>
            In no event shall Broqui Food Assistant be liable for any indirect,
            incidental, special, consequential, or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the Services.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of [Country/State], without regard to its conflict of law
            provisions.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@broqui.com.
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

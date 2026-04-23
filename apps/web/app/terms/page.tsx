"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const lastUpdated = "March 25, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-700 leading-6">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Tatari platform, you agree to these Terms
                of Service. If you do not agree, do not use the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                2. Services
              </h2>
              <p>
                Tatari connects clients with independent service providers. Tatari
                does not perform services and does not guarantee outcomes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                3. Accounts and Eligibility
              </h2>
              <p>
                You must provide accurate information, maintain the security of
                your account, and comply with applicable laws. You are responsible
                for activity under your account.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                4. Payments and Fees
              </h2>
              <p>
                Payment terms, fees, and escrow rules are provided in the platform
                during checkout or job confirmation. You agree to those terms when
                you complete a transaction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                5. Provider Responsibilities
              </h2>
              <p>
                Providers are independent contractors. They are responsible for
                delivering services, maintaining appropriate licenses, and meeting
                job requirements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                6. Client Responsibilities
              </h2>
              <p>
                Clients must provide accurate job details and cooperate with
                providers. Disputes should be raised promptly through platform
                tools.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                7. Prohibited Conduct
              </h2>
              <p>
                You may not misuse the platform, attempt to bypass payments, or
                violate applicable law. Tatari may suspend or terminate accounts
                for violations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                8. Disputes and Resolution
              </h2>
              <p>
                The platform provides a dispute process for completed jobs.
                Tatari may review evidence and determine outcomes in accordance
                with platform policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                9. Limitation of Liability
              </h2>
              <p>
                Tatari is not liable for indirect or consequential damages arising
                from your use of the platform, to the extent permitted by law.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                10. Changes to Terms
              </h2>
              <p>
                We may update these terms periodically. Continued use of the
                platform after changes indicates acceptance.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

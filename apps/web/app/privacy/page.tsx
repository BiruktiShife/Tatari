"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const lastUpdated = "March 25, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-700 leading-6">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                1. Information We Collect
              </h2>
              <p>
                We collect account information, contact details, job and payment
                information, and usage data to operate and improve the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                2. How We Use Information
              </h2>
              <p>
                We use your information to provide services, process transactions,
                prevent fraud, communicate with you, and comply with legal
                obligations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                3. Sharing of Information
              </h2>
              <p>
                We share necessary information with other users to fulfill jobs,
                and with payment processors and service providers who help us
                operate the platform. We do not sell your personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                4. Data Retention
              </h2>
              <p>
                We retain data as long as needed for legitimate business purposes
                and legal requirements, then delete or anonymize it.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                5. Security
              </h2>
              <p>
                We use reasonable safeguards to protect your data, but no system
                can be completely secure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                6. Your Choices
              </h2>
              <p>
                You can update your profile information and manage certain
                notifications within the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                7. International Transfers
              </h2>
              <p>
                Your data may be processed in jurisdictions where we or our
                service providers operate.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this policy from time to time. The updated version
                will be posted on this page.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

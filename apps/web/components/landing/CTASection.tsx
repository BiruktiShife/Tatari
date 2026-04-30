"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Client Path */}
          <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-indigo-100 hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
                <Briefcase size={28} />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
                Need to get something done?
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Post your task and receive quotes from top-rated professionals
                in minutes. Tatari protects your payments until the job is done.
              </p>
              <ul className="space-y-4 mb-10 text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-indigo-600" /> Free to
                  post a task
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-indigo-600" /> Only pay
                  when satisfied
                </li>
              </ul>
            </div>
            <Button
              size="lg"
              className="h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-lg group-hover:gap-4 transition-all"
            >
              Find a Professional <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>

          {/* Provider Path */}
          <div className="bg-indigo-600 p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-8">
                <UserPlus size={28} />
              </div>
              <h3 className="text-3xl font-extrabold mb-4">
                Are you a skilled expert?
              </h3>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Join our network of elite professionals. Set your own hours,
                find high-quality leads, and get paid instantly upon job
                completion.
              </p>
              <ul className="space-y-4 mb-10 text-indigo-50 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" /> Keep
                  100% of your tips
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" /> Verified
                  reviews for your portfolio
                </li>
              </ul>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 text-lg relative z-10"
            >
              Become a Provider
            </Button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <span className="font-bold text-xl text-slate-900">
            256-bit Encryption
          </span>
          <span className="font-bold text-xl text-slate-900">
            Verified Identity
          </span>
          <span className="font-bold text-xl text-slate-900">
            Secure Payments
          </span>
          <span className="font-bold text-xl text-slate-900">24/7 Support</span>
        </div>
      </div>
    </section>
  );
}

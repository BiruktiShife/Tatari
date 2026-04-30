"use client";
import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Zap,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2.5 mb-6 group">
              <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Tatari
              </span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
              The most trusted marketplace for professional services. Connecting
              skilled experts with people who need to get things done, securely
              and efficiently.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">
              Platform
            </h3>
            <ul className="space-y-4">
              {[
                "How it Works",
                "Browse Services",
                "Pricing",
                "Success Stories",
                "Tatari Pro",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-indigo-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">
              Support
            </h3>
            <ul className="space-y-4">
              {[
                "Help Center",
                "Safety Center",
                "Community",
                "Terms of Service",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-indigo-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">
              Stay in the loop
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Subscribe to get latest updates, tips for pros, and exclusive
              offers.
            </p>

            {/* Contact Details */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors cursor-default">
                <Mail size={16} className="text-indigo-500" />
                <span>support@tatari.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-indigo-500" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500">
            © {currentYear} Tatari Hub. All rights reserved.
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                Systems Operational
              </span>
            </div>

            <div className="flex gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
              <Link href="#" className="hover:text-white transition-colors">
                English
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Amharic
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

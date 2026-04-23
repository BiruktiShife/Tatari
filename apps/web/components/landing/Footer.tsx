import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="font-bold text-white">HS</span>
              </div>
              <div>
                <div className="text-xl font-bold">Habesha Skills Hub</div>
                <div className="text-sm text-gray-400">
                  Connecting talent with opportunity
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Ethiopia&apos;s leading platform connecting skilled professionals with
              clients who need their services.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Icon size={20} />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "How It Works",
                "Browse Services",
                "Become a Provider",
                "Pricing",
                "About Us",
                "Blog",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Safety Center",
                "FAQ",
                "Contact Us",
                "Terms of Service",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and tips.
            </p>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail size={18} />
              </Button>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} />
                <span>+251 911 234 567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} />
                <span>support@Tatari.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Tatari Hub. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Empowering Ethiopia&apos;s workforce through technology
          </p>
        </div>
      </div>
    </footer>
  );
}

import { CheckCircle2, Search, Zap, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How Tatari Works
          </h2>
          <p className="text-lg text-slate-600">
            Get your tasks done in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {[
            {
              icon: Search,
              title: "Post a Task",
              text: "Describe what you need and set your budget.",
            },
            {
              icon: Zap,
              title: "Get Quotes",
              text: "Receive competitive offers from pros within minutes.",
            },
            {
              icon: CheckCircle2,
              title: "Choose Pro",
              text: "Check reviews and hire the best fit for you.",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payout",
              text: "Pay securely. Funds release only when happy.",
            },
          ].map((step, i) => (
            <div key={i} className="relative text-center group">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-6 group-hover:border-indigo-200 transition-colors">
                <step.icon size={32} className="text-indigo-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

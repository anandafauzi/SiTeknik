import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Wind, Droplet, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { ServiceItem } from "@/lib/types";

interface ServicesSummaryProps {
  services: ServiceItem[];
  whatsappNumber?: string;
}

export default function ServicesSummary({
  services,
  whatsappNumber = "6281234567890",
}: ServicesSummaryProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "listrik":
        return <Zap className="w-5 h-5 text-brand-accent" />;
      case "ac":
        return <Wind className="w-5 h-5 text-sky-500" />;
      case "bor-sumur":
        return <Droplet className="w-5 h-5 text-cyan-600" />;
      default:
        return <Zap className="w-5 h-5 text-brand-accent" />;
    }
  };

  return (
    <section id="layanan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
            Katalog Layanan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 mt-3 font-heading">
            Tiga Layanan Utama Spesialis SiTeknik
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Solusi teknis terlengkap untuk kenyamanan hunian Anda di Tangerang Selatan. Dikerjakan dengan peralatan modern dan garansi nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-navy-900 flex items-center gap-1.5 shadow-sm">
                  {getIcon(service.category)}
                  <span className="capitalize">{service.category.replace("-", " ")}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-navy-900 font-heading group-hover:text-brand-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2.5 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Garansi Resmi
                    </span>
                    <span className="font-semibold text-navy-900">
                      Mulai Rp{service.startingPrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Link
                    href={`/layanan/${service.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-navy-900 hover:bg-navy-800 text-white transition-colors group-hover:bg-brand-accent"
                  >
                    <span>Lihat Detail Layanan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

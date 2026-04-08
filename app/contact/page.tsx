"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="section">
      <div className="container-main max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="section-title">Contactez-nous</h1>
          <p className="section-subtitle mx-auto">
            Une question, un projet ou envie de rejoindre GreenCart ? Écrivez-nous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: <Mail size={20} className="text-brand-primary" />, label: "Email", value: "hello@greencart.fr" },
              { icon: <Phone size={20} className="text-brand-primary" />, label: "Téléphone", value: "+33 1 23 45 67 89" },
              { icon: <MapPin size={20} className="text-brand-primary" />, label: "Adresse", value: "12 rue du Marché Vert\n75011 Paris" },
            ].map((item) => (
              <div key={item.label} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="text-sm text-gray-800 font-semibold whitespace-pre-line mt-0.5">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            <div className="card p-5 bg-green-50 border-green-100">
              <p className="text-sm text-green-700 font-medium">🌿 Vous êtes producteur ?</p>
              <p className="text-xs text-green-600 mt-1 leading-relaxed">
                Rejoignez notre réseau de producteurs partenaires. Nous vous répondons sous 48h.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 card p-8">
            {sent ? (
              <div className="text-center py-12">
                <span className="text-5xl mb-4 block">✅</span>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Prénom" placeholder="Marie" required />
                  <Input label="Nom" placeholder="Dupont" required />
                </div>
                <Input label="Email" type="email" placeholder="vous@example.com" required />
                <Input label="Sujet" placeholder="Votre sujet" required />
                <div>
                  <label className="label">Message</label>
                  <textarea
                    className="input min-h-[140px] resize-none"
                    placeholder="Votre message…"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Envoi…" : (
                    <>
                      Envoyer le message
                      <Send size={16} />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

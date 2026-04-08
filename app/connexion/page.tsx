"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Leaf, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-brand-offwhite">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex w-14 h-14 bg-brand-primary rounded-2xl items-center justify-center mb-4 shadow-card">
            <Leaf size={28} className="text-white" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-1">Bon retour sur GreenCart 🌿</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@example.com"
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-brand-red">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Link href="/mot-de-passe-oublie" className="text-sm text-brand-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-green-50 rounded-xl border border-green-100 space-y-1">
            <p className="text-xs font-semibold text-green-700">Comptes de démonstration</p>
            <p className="text-xs text-green-600">
              🛒 Consommateur : <strong>marie@example.com</strong> / password123
            </p>
            <p className="text-xs text-green-600">
              🚜 Vendeur : <strong>ferme@example.com</strong> / password123
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-brand-gray text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-brand-primary font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Espace vendeur ?{" "}
          <Link href="/dashboard" className="text-brand-primary font-medium hover:underline">
            Accéder au dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}

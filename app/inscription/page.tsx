"use client";

import { registerUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Leaf, Lock, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVendeur = searchParams.get("role") === "vendeur";

  const [role, setRole] = useState<"consumer" | "vendor">(isVendeur ? "vendor" : "consumer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const companyName = fd.get("companyName") as string | undefined;

    const result = await registerUser({ name, email, password, role, companyName: companyName || undefined });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    await signIn("credentials", { email, password, redirect: false });
    router.push(role === "vendor" ? "/dashboard" : "/");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-brand-offwhite">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex w-14 h-14 bg-brand-primary rounded-2xl items-center justify-center mb-4 shadow-card">
            <Leaf size={28} className="text-white" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 mt-1">Bienvenue dans la communauté GreenCart 🌱</p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-white border border-brand-gray rounded-2xl p-1 mb-6 shadow-soft">
          {(["consumer", "vendor"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                role === r
                  ? "bg-brand-primary text-white shadow-soft"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r === "consumer" ? "🛒 Consommateur" : "🚜 Producteur"}
            </button>
          ))}
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Prénom et nom"
              name="name"
              placeholder="Marie Dupont"
              required
              leftIcon={<User size={15} />}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="vous@example.com"
              leftIcon={<Mail size={15} />}
              required
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="8 caractères minimum"
              leftIcon={<Lock size={15} />}
              required
            />
            {role === "vendor" && (
              <Input
                label="Nom de votre exploitation"
                name="companyName"
                placeholder="Ferme des Collines"
                required
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-brand-red">
                {error}
              </div>
            )}

            <p className="text-xs text-gray-400">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/cgv" className="text-brand-primary hover:underline">CGV</Link>{" "}
              et notre{" "}
              <Link href="/confidentialite" className="text-brand-primary hover:underline">
                politique de confidentialité
              </Link>.
            </p>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Création du compte…" : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-gray text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-brand-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense>
      <InscriptionForm />
    </Suspense>
  );
}

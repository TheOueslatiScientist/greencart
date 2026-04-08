"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export type RegisterResult =
  | { success: true; userId: string }
  | { success: false; error: string };

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "consumer" | "vendor";
  companyName?: string;
}): Promise<RegisterResult> {
  const { name, email, password, role, companyName } = data;

  if (!name || !email || !password) {
    return { success: false, error: "Tous les champs sont obligatoires." };
  }

  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
    },
  });

  // Auto-create producer profile for vendors
  if (role === "vendor" && companyName) {
    const slug = companyName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await prisma.producer.create({
      data: {
        userId: user.id,
        name: companyName.trim(),
        slug: `${slug}-${user.id.slice(-6)}`,
        description: "",
        shortBio: "",
        location: "",
        badges: "[]",
        certifications: "[]",
      },
    });
  }

  return { success: true, userId: user.id };
}

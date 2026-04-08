import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GreenCart database — Métropole Européenne de Lille…");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.producer.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleaned existing data");

  const passwordHash = await bcrypt.hash("password123", 12);

  // ── Consumers ──────────────────────────────────────────────────────────────
  const consumer = await prisma.user.create({
    data: {
      email: "marie@example.com",
      name: "Marie Dupont",
      password: passwordHash,
      role: "consumer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    },
  });

  // ── Vendors ────────────────────────────────────────────────────────────────
  const vendor1 = await prisma.user.create({ data: { email: "ferme@example.com",       name: "Jean-Pierre Collin",  password: passwordHash, role: "vendor" } });
  const vendor2 = await prisma.user.create({ data: { email: "jardins@example.com",     name: "Sophie Vanderhaegen", password: passwordHash, role: "vendor" } });
  const vendor3 = await prisma.user.create({ data: { email: "fromagerie@example.com",  name: "Paul Martin",         password: passwordHash, role: "vendor" } });
  const vendor4 = await prisma.user.create({ data: { email: "rucher@example.com",      name: "François Durand",     password: passwordHash, role: "vendor" } });
  const vendor5 = await prisma.user.create({ data: { email: "maraichage@example.com",  name: "Amélie Delebarre",    password: passwordHash, role: "vendor" } });
  const vendor6 = await prisma.user.create({ data: { email: "boulangerie@example.com", name: "Thomas Leroy",        password: passwordHash, role: "vendor" } });
  console.log("  ✓ Users created");

  // ── Producers — MEL ────────────────────────────────────────────────────────
  const p1 = await prisma.producer.create({
    data: {
      userId: vendor1.id,
      name: "Ferme du Mélantois",
      slug: "ferme-du-melantois",
      description:
        "Depuis trois générations, la Ferme du Mélantois cultive ses légumes en agriculture biologique sur 32 hectares à Villeneuve-d'Ascq. Nos sols argileux du mélantois donnent des légumes d'une saveur incomparable. Circuits courts, vente directe et paniers hebdomadaires.",
      shortBio: "Agriculture bio certifiée, 32 ha aux portes de Lille.",
      location: "Villeneuve-d'Ascq, MEL",
      address: "18 Route du Mélantois",
      city: "Villeneuve-d'Ascq",
      latitude: 50.6070,
      longitude: 3.1830,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop",
      badges: JSON.stringify(["bio", "local"]),
      certifications: JSON.stringify(["AB - Agriculture Biologique", "HVE - Haute Valeur Environnementale"]),
      rating: 4.9,
      reviewCount: 312,
      productCount: 5,
      joinedAt: new Date("2022-03-15"),
    },
  });

  const p2 = await prisma.producer.create({
    data: {
      userId: vendor2.id,
      name: "Les Jardins de Flandre",
      slug: "jardins-de-flandre",
      description:
        "Maraîchage diversifié installé à Lambersart depuis 2016, avec une spécialisation dans les légumes anciens et les variétés oubliées du Nord. Nous pratiquons la permaculture sur 8 hectares et proposons des paniers anti-gaspillage chaque vendredi.",
      shortBio: "Légumes anciens, permaculture et paniers anti-gaspi à Lambersart.",
      location: "Lambersart, MEL",
      address: "34 Chemin des Jardins",
      city: "Lambersart",
      latitude: 50.6619,
      longitude: 3.0294,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      badges: JSON.stringify(["local", "antigaspi", "saison"]),
      certifications: JSON.stringify(["AB - Agriculture Biologique", "Nature & Progrès"]),
      rating: 4.7,
      reviewCount: 198,
      productCount: 4,
      joinedAt: new Date("2022-06-01"),
    },
  });

  const p3 = await prisma.producer.create({
    data: {
      userId: vendor3.id,
      name: "Fromagerie des Ch'tis",
      slug: "fromagerie-des-chtis",
      description:
        "Artisans fromagers depuis 1958 à Roubaix, nous sommes les spécialistes du Maroilles AOP et de la Mimolette du Nord. Notre cave d'affinage traditionnelle garantit des fromages au caractère authentiquement nordiste.",
      shortBio: "Spécialistes du Maroilles AOP et de la Mimolette depuis 1958.",
      location: "Roubaix, MEL",
      address: "12 Rue des Fromagers",
      city: "Roubaix",
      latitude: 50.6942,
      longitude: 3.1750,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=400&fit=crop",
      badges: JSON.stringify(["local"]),
      certifications: JSON.stringify(["AOP - Appellation d'Origine Protégée", "Artisan Fromager"]),
      rating: 4.8,
      reviewCount: 276,
      productCount: 3,
      joinedAt: new Date("2023-01-10"),
    },
  });

  const p4 = await prisma.producer.create({
    data: {
      userId: vendor4.id,
      name: "Rucher des Flandres",
      slug: "rucher-des-flandres",
      description:
        "Apiculteur passionné depuis 18 ans à Tourcoing, je prends soin de mes 65 ruches installées autour des champs de colza et des jardins familiaux de la MEL. Mon miel est récolté à la main, non pasteurisé et non filtré pour conserver toutes ses propriétés.",
      shortBio: "65 ruches entre colza et fleurs sauvages de la MEL, miel brut.",
      location: "Tourcoing, MEL",
      address: "7 Allée des Abeilles",
      city: "Tourcoing",
      latitude: 50.7239,
      longitude: 3.1612,
      avatar:
        "https://images.unsplash.com/photo-1560250097-0dc05a977a68?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      badges: JSON.stringify(["bio", "local"]),
      certifications: JSON.stringify(["AB - Agriculture Biologique"]),
      rating: 5.0,
      reviewCount: 143,
      productCount: 2,
      joinedAt: new Date("2023-04-22"),
    },
  });

  const p5 = await prisma.producer.create({
    data: {
      userId: vendor5.id,
      name: "Maraîchage Delebarre",
      slug: "maraichage-delebarre",
      description:
        "Jeune maraîchère installée en 2020 à Marcq-en-Barœul, je cultive 5 hectares en agriculture raisonnée avec un fort engagement anti-gaspillage. Chaque vendredi, je propose des paniers surprise avec les légumes invendus de la semaine à prix réduit.",
      shortBio: "Maraîchage raisonné, paniers anti-gaspi chaque vendredi à Marcq.",
      location: "Marcq-en-Barœul, MEL",
      address: "9 Route des Champs",
      city: "Marcq-en-Barœul",
      latitude: 50.6758,
      longitude: 3.0983,
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
      badges: JSON.stringify(["local", "antigaspi"]),
      certifications: JSON.stringify(["Agriculture Raisonnée"]),
      rating: 4.6,
      reviewCount: 127,
      productCount: 3,
      joinedAt: new Date("2023-09-05"),
    },
  });

  const p6 = await prisma.producer.create({
    data: {
      userId: vendor6.id,
      name: "Boulangerie du Vieux-Lille",
      slug: "boulangerie-vieux-lille",
      description:
        "Boulangerie artisanale au cœur du Vieux-Lille depuis 2009. Nous travaillons au levain naturel avec des farines de blé ancien issues de meuneries locales du Nord-Pas-de-Calais. Notre gâteau battu traditionnel est notre fierté.",
      shortBio: "Pain au levain et gâteau battu traditionnel, farines du Nord.",
      location: "Lille, MEL",
      address: "5 Rue de la Monnaie",
      city: "Lille",
      latitude: 50.6376,
      longitude: 3.0637,
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face",
      coverImage:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop",
      badges: JSON.stringify(["local", "antigaspi"]),
      certifications: JSON.stringify(["Artisan Boulanger", "Maître Artisan"]),
      rating: 4.9,
      reviewCount: 521,
      productCount: 3,
      joinedAt: new Date("2022-11-20"),
    },
  });

  console.log("  ✓ Producers created — MEL coordinates");

  // ── Products ───────────────────────────────────────────────────────────────
  await prisma.product.createMany({
    data: [
      // Ferme du Mélantois ─────────────────────────────────────────────────
      {
        name: "Panier de légumes bio MEL",
        slug: "panier-legumes-bio-mel",
        description:
          "Assortiment de légumes bio de saison récoltés le matin même sur nos terres du mélantois. Composition variable : endives, carottes, poireaux, betteraves, choux. Idéal pour une semaine.",
        price: 18.5,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["bio", "local", "saison"]),
        producerId: p1.id,
        stock: 20,
        unit: "panier",
        weight: "3 kg",
        rating: 4.9,
        reviewCount: 145,
      },
      {
        name: "Endives du mélantois (filet 1 kg)",
        slug: "endives-melantois-1kg",
        description:
          "Endives blanches cultivées dans les caves de notre ferme selon la méthode traditionnelle du forçage. Tendres, légèrement amères, idéales en salade ou braisées.",
        price: 3.5,
        image: "https://images.unsplash.com/photo-1627735036893-38d6fb60e34f?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p1.id,
        stock: 45,
        unit: "filet",
        weight: "1 kg",
        rating: 4.8,
        reviewCount: 89,
      },
      {
        name: "Tomates cerises bio (barquette 250 g)",
        slug: "tomates-cerises-bio-mel",
        description:
          "Tomates cerises mélangées cultivées sous serre chauffée au bois. Variétés Sungold et Black Cherry pour un mélange sucré-acidulé incomparable.",
        price: 3.9,
        image: "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p1.id,
        stock: 30,
        unit: "barquette",
        weight: "250 g",
        rating: 4.8,
        reviewCount: 112,
      },
      {
        name: "Œufs fermiers plein air (boîte x12)",
        slug: "oeufs-fermiers-plein-air",
        description:
          "Œufs de poules élevées en plein air sur notre ferme. Nourries aux céréales locales sans OGM ni antibiotiques. Jaune d'œuf bien orange, goût authentique.",
        price: 4.5,
        image: "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=600&h=600&fit=crop",
        category: "elevage",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p1.id,
        stock: 40,
        unit: "boîte",
        weight: "12 œufs",
        rating: 4.9,
        reviewCount: 203,
      },
      {
        name: "Carottes des Flandres bio (botte)",
        slug: "carottes-flandres-bio",
        description:
          "Carottes fanes variété Nantaise, cultivées en pleine terre sur nos parcelles bio. Chair croquante et sucrée, parfaites pour les jus et les plats mijotés nordistes.",
        price: 2.5,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["bio", "local", "saison"]),
        producerId: p1.id,
        stock: 35,
        unit: "botte",
        weight: "500 g",
        rating: 4.7,
        reviewCount: 67,
      },

      // Les Jardins de Flandre ──────────────────────────────────────────────
      {
        name: "Salade mélangée bio (bouquet)",
        slug: "salade-melangee-bio-flandre",
        description:
          "Mélange de jeunes pousses bio : roquette, mâche, épinards, frisée de Ruffec. Cueilli le matin même, livré dans la journée. Sans aucun traitement.",
        price: 2.8,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p2.id,
        stock: 25,
        unit: "bouquet",
        weight: "150 g",
        rating: 4.6,
        reviewCount: 58,
      },
      {
        name: "Pommes de terre Charlotte (filet 2 kg)",
        slug: "pommes-de-terre-charlotte",
        description:
          "Pommes de terre Charlotte de nos parcelles en agriculture raisonnée. Chair ferme et fondante, idéale pour les potées et plats traditionnels du Nord.",
        price: 3.2,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["local", "saison"]),
        producerId: p2.id,
        stock: 50,
        unit: "filet",
        weight: "2 kg",
        rating: 4.7,
        reviewCount: 95,
      },
      {
        name: "Panier surprise anti-gaspi (Jardins)",
        slug: "panier-antigaspi-jardins-flandre",
        description:
          "Invendus de la semaine rassemblés en panier surprise à prix réduit. Légumes calibre B, parfaitement bons, simplement moins beaux. Contenu variable selon stock.",
        price: 7.0,
        originalPrice: 16.0,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop",
        category: "antigaspi",
        badges: JSON.stringify(["local", "antigaspi", "promo"]),
        producerId: p2.id,
        stock: 10,
        unit: "panier",
        weight: "~4 kg",
        rating: 4.8,
        reviewCount: 201,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Poireaux des Flandres (botte)",
        slug: "poireaux-flandres",
        description:
          "Poireaux de saison cultivés en pleine terre à Lambersart. Fût blanc bien développé, idéaux pour la flamiche aux poireaux ou la soupe.",
        price: 2.2,
        image: "https://images.unsplash.com/photo-1548045096-c57a88cbc2d7?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["local", "saison"]),
        producerId: p2.id,
        stock: 30,
        unit: "botte",
        weight: "600 g",
        rating: 4.5,
        reviewCount: 43,
      },

      // Fromagerie des Ch'tis ───────────────────────────────────────────────
      {
        name: "Maroilles AOP (1/4 de Maroilles)",
        slug: "maroilles-aop-quart",
        description:
          "Le roi des fromages du Nord ! Maroilles AOP affiné 5 semaines dans notre cave humide. Croûte orangée caractéristique, pâte souple et crémeuse, goût corsé et parfumé.",
        price: 6.9,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
        category: "fromagerie",
        badges: JSON.stringify(["local"]),
        producerId: p3.id,
        stock: 25,
        unit: "pièce",
        weight: "200 g",
        rating: 4.9,
        reviewCount: 187,
      },
      {
        name: "Mimolette vieille (tranche 250 g)",
        slug: "mimolette-vieille-250g",
        description:
          "Mimolette affinée 18 mois, croûte grise grâce aux acariens d'affinage, pâte dure et fruitée. La fierté du Nord, appelée aussi 'Boule de Lille'.",
        price: 8.5,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
        category: "fromagerie",
        badges: JSON.stringify(["local"]),
        producerId: p3.id,
        stock: 20,
        unit: "tranche",
        weight: "250 g",
        rating: 4.8,
        reviewCount: 134,
      },
      {
        name: "Boulette d'Avesnes (pièce)",
        slug: "boulette-avesnes",
        description:
          "Fromage au lait de vache, aromatisé à l'estragon et au poivre, roulé dans du paprika. Saveur intense et authentique du terroir avesnois. À déguster avec du pain de seigle.",
        price: 4.8,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop",
        category: "fromagerie",
        badges: JSON.stringify(["local"]),
        producerId: p3.id,
        stock: 18,
        unit: "pièce",
        weight: "180 g",
        rating: 4.7,
        reviewCount: 89,
      },

      // Rucher des Flandres ─────────────────────────────────────────────────
      {
        name: "Miel de colza des Flandres (pot 500 g)",
        slug: "miel-colza-flandres-500g",
        description:
          "Miel de colza récolté au printemps sur les immenses champs jaunes de la MEL. Cristallise naturellement en quelques semaines, texture crémeuse et saveur douce et vanillée.",
        price: 11.0,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        category: "epicerie",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p4.id,
        stock: 32,
        unit: "pot",
        weight: "500 g",
        rating: 5.0,
        reviewCount: 143,
      },
      {
        name: "Miel toutes fleurs de Tourcoing (pot 250 g)",
        slug: "miel-toutes-fleurs-tourcoing",
        description:
          "Miel polyfloral récolté en été, issu des jardins et parcs de la MEL. Notes florales complexes, couleur ambrée, non pasteurisé et non filtré.",
        price: 7.5,
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&h=600&fit=crop",
        category: "epicerie",
        badges: JSON.stringify(["bio", "local"]),
        producerId: p4.id,
        stock: 28,
        unit: "pot",
        weight: "250 g",
        rating: 4.9,
        reviewCount: 87,
      },

      // Maraîchage Delebarre ────────────────────────────────────────────────
      {
        name: "Panier anti-gaspi Delebarre",
        slug: "panier-antigaspi-delebarre",
        description:
          "Panier surprise composé des invendus et légumes calibre B de la semaine. Parfaitement comestibles, juste un peu moins beaux ! Chaque panier est différent, la surprise fait partie du plaisir.",
        price: 6.0,
        originalPrice: 14.0,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop",
        category: "antigaspi",
        badges: JSON.stringify(["local", "antigaspi", "promo"]),
        producerId: p5.id,
        stock: 8,
        unit: "panier",
        weight: "~4 kg",
        rating: 4.6,
        reviewCount: 178,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Bouquet d'herbes aromatiques",
        slug: "bouquet-herbes-aromatiques",
        description:
          "Bouquet d'herbes fraîches de saison : persil plat, ciboulette, estragon et menthe. Cueilli le matin, livré le jour même. Idéal pour sublimer la cuisine nordiste.",
        price: 1.8,
        image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["local", "saison"]),
        producerId: p5.id,
        stock: 20,
        unit: "bouquet",
        weight: "80 g",
        rating: 4.5,
        reviewCount: 54,
      },
      {
        name: "Chicons du Nord (filet 1 kg)",
        slug: "chicons-du-nord",
        description:
          "Endives locales appelées 'chicons' dans le Nord, cultivées en pleine terre puis forcées. Moins amères que les endives standard, idéales crues en salade ou en gratin.",
        price: 3.0,
        image: "https://images.unsplash.com/photo-1627735036893-38d6fb60e34f?w=600&h=600&fit=crop",
        category: "legumes",
        badges: JSON.stringify(["local", "saison"]),
        producerId: p5.id,
        stock: 35,
        unit: "filet",
        weight: "1 kg",
        rating: 4.7,
        reviewCount: 62,
      },

      // Boulangerie du Vieux-Lille ──────────────────────────────────────────
      {
        name: "Pain ch'ti au levain (800 g)",
        slug: "pain-chti-levain",
        description:
          "Pain rustique au levain naturel fermenté 20 heures. Farine de blé ancien T80 de la Minoterie Caudron à Cambrai. Mie alvéolée, croûte croustillante, se conserve 5 jours.",
        price: 5.5,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
        category: "boulangerie",
        badges: JSON.stringify(["local"]),
        producerId: p6.id,
        stock: 40,
        unit: "miche",
        weight: "800 g",
        rating: 4.9,
        reviewCount: 521,
      },
      {
        name: "Gâteau battu (traditionnel)",
        slug: "gateau-battu-traditionnel",
        description:
          "La brioche emblématique du Nord-Pas-de-Calais ! Recette ancestrale, pâte très beurrée, moule cylindrique haut caractéristique. Incontournable pour le ch'ti du dimanche.",
        price: 8.0,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop",
        category: "boulangerie",
        badges: JSON.stringify(["local"]),
        producerId: p6.id,
        stock: 15,
        unit: "pièce",
        weight: "600 g",
        rating: 4.9,
        reviewCount: 234,
      },
      {
        name: "Cramique aux raisins",
        slug: "cramique-aux-raisins",
        description:
          "Brioche belgo-nordiste aux raisins secs, légèrement sucrée, parfumée à la fleur d'oranger. Idéale au petit déjeuner avec du beurre. Recette du grand-père Leroy.",
        price: 5.2,
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=600&fit=crop",
        category: "boulangerie",
        badges: JSON.stringify(["local"]),
        producerId: p6.id,
        stock: 20,
        unit: "pièce",
        weight: "450 g",
        rating: 4.8,
        reviewCount: 167,
      },
    ],
  });
  console.log("  ✓ Products created (20 produits MEL)");

  // ── Demo order ─────────────────────────────────────────────────────────────
  const firstProduct = await prisma.product.findFirst({ where: { producerId: p1.id } });
  if (firstProduct) {
    await prisma.order.create({
      data: {
        userId: consumer.id,
        status: "delivered",
        total: 18.5,
        deliveryAddress: "15 rue Faidherbe, 59000 Lille",
        items: {
          create: [{ productId: firstProduct.id, quantity: 1, unitPrice: 18.5 }],
        },
      },
    });
    console.log("  ✓ Demo order created");
  }

  console.log("\n✅ Seed MEL completed successfully!\n");
  console.log("Comptes de démonstration :");
  console.log("  Consommateur : marie@example.com     / password123");
  console.log("  Vendeur      : ferme@example.com     / password123");
  console.log("  Vendeur      : boulangerie@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

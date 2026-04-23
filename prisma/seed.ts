import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      name: "Sunil",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@blog.com" },
    update: {},
    create: {
      email: "user@blog.com",
      name: "Regular User",
      password: userPassword,
      role: Role.USER,
    },
  });

  const blogPosts = [
    {
      title: "The Architecture of Silence",
      content: "Minimalism is not the lack of something. It is simply the perfect amount of something. In the modern world, silence has become a luxury. Architectural minimalism aims to recapture that luxury by focusing on clean lines, natural light, and the honest expression of materials.\n\nBy stripping away the unnecessary, we allow the essential to speak. A single beam of light falling across a concrete floor can tell a story more powerful than a room filled with ornamentation. This is the essence of the new quietude.",
      image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: admin.id,
    },
    {
      title: "Digital Nomadism: The New Frontier",
      content: "The office is no longer a place. It's a state of mind. As the world becomes increasingly connected, the boundaries between work and life are blurring in beautiful ways. From the misty forests of the Pacific Northwest to the vibrant streets of Tokyo, the digital nomad lifestyle offers a unique opportunity to curate your environment for maximum creativity.\n\nBut it's not all sunset laptop sessions. It requires discipline, a deep understanding of one's own rhythms, and the ability to find community in transient spaces.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: admin.id,
    },
    {
      title: "The Future of Typography in Web Design",
      content: "Typography is the voice of the web. As display technologies evolve, our ability to render complex, elegant serifs and precise geometric sans-serifs has reached a new pinnacle. Variable fonts are changing the game, allowing for fluid weight and width adjustments that respond to user interaction and screen size.\n\nWe are moving towards a web that feels more like a high-end magazine—intentional, rhythmic, and deeply readable. The 'Digital Curator' aesthetic is at the heart of this movement.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: admin.id,
    },
    {
      title: "Sustainable Design: Materials and Ethics",
      content: "Design is no longer just about aesthetics. It's about responsibility. Sustainable design focuses on the life cycle of materials—where they come from, how they are processed, and where they go when they are no longer needed.\n\nRecycled glass, bamboo, and cork are not just alternative materials; they are the foundation of a new design language that respects the planet while creating premium experiences for humans. Ethics is the new luxury.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: user.id,
    },
    {
      title: "The Rhythm of Morning Rituals",
      content: "How you start your day is how you live your life. A curated morning ritual—be it a quiet cup of coffee, fifteen minutes of meditation, or a short walk—sets the frequency for the hours to follow.\n\nIn a world of constant notification, reclaiming the first hour of your day for yourself is an act of rebellion. It's about choosing intention over reaction.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: user.id,
    },
    {
      title: "Curating Your Digital Space",
      content: "Our digital environments are just as important as our physical ones. From the apps we use to the people we follow, every digital touchpoint shapes our mental state.\n\nDigital curation is the practice of intentionally choosing what enters our consciousness. It's about quality over quantity, depth over speed. It's time to declutter our digital lives and make room for what truly matters.",
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200",
      published: true,
      authorId: admin.id,
    }
  ];

  for (const post of blogPosts) {
    await prisma.post.create({ data: post });
  }

  console.log("Seed data created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

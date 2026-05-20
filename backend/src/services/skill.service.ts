import { prisma } from "../config/database.js";
import { slugify } from "../utils/slug.js";

export async function syncInternSkills(internId: string, skillsCsv: string) {
  const names = skillsCsv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (names.length === 0) return;

  await prisma.internSkill.deleteMany({ where: { internId } });

  for (const name of names) {
    const slug = slugify(name) || `skill-${Date.now()}`;
    const skill = await prisma.skill.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });

    await prisma.internSkill.create({
      data: { internId, skillId: skill.id },
    });
  }
}

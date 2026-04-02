const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create collections
  const work = await prisma.collection.create({
    data: { name: "Work", description: "Work-related notes", color: "#3B82F6" },
  });
  const personal = await prisma.collection.create({
    data: { name: "Personal", description: "Personal notes and ideas", color: "#10B981" },
  });
  const learning = await prisma.collection.create({
    data: { name: "Learning", description: "Things I'm learning", color: "#F59E0B" },
  });

  // Create tags
  const tagImportant = await prisma.tag.create({ data: { name: "important" } });
  const tagTodo = await prisma.tag.create({ data: { name: "todo" } });
  const tagIdea = await prisma.tag.create({ data: { name: "idea" } });
  const tagReference = await prisma.tag.create({ data: { name: "reference" } });

  // Create notes
  const notes = [
    { title: "Q2 Planning", content: "Review goals and set priorities for the quarter.", collectionId: work.id, pinned: true },
    { title: "API Design Principles", content: "REST conventions, pagination patterns, error handling standards.", collectionId: learning.id },
    { title: "Grocery List", content: "Milk, eggs, bread, coffee, vegetables.", collectionId: personal.id },
    { title: "Claude Code Tips", content: "Use CLAUDE.md for project context. Plan Mode before implementation.", collectionId: learning.id, pinned: true },
    { title: "Team Standup Notes", content: "Discussed deployment timeline and blockers.", collectionId: work.id },
    { title: "Book Recommendations", content: "Designing Data-Intensive Applications, Clean Code, The Pragmatic Programmer.", collectionId: personal.id },
    { title: "Database Migration Checklist", content: "Backup, test on staging, run migration, verify, monitor.", collectionId: work.id },
    { title: "Weekend Plans", content: "Visit the museum, try the new restaurant on ECR.", collectionId: personal.id },
  ];

  for (const note of notes) {
    await prisma.note.create({ data: note });
  }

  // Add some tags to notes
  const allNotes = await prisma.note.findMany();
  await prisma.noteTag.create({ data: { noteId: allNotes[0].id, tagId: tagImportant.id } });
  await prisma.noteTag.create({ data: { noteId: allNotes[0].id, tagId: tagTodo.id } });
  await prisma.noteTag.create({ data: { noteId: allNotes[3].id, tagId: tagReference.id } });
  await prisma.noteTag.create({ data: { noteId: allNotes[6].id, tagId: tagImportant.id } });

  console.log("Seed complete: 3 collections, 4 tags, 8 notes");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

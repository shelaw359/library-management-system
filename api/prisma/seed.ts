import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  { name: "Fiction", slug: "fiction" },
  { name: "Science", slug: "science" },
  { name: "History", slug: "history" },
  { name: "Technology", slug: "technology" },
];

const books = [
  // Fiction
  { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9780385474542", genre: "fiction" },
  { title: "Weep Not, Child", author: "Ngugi wa Thiong'o", isbn: "9780435908355", genre: "fiction" },
  { title: "The River Between", author: "Ngugi wa Thiong'o", isbn: "9780435905484", genre: "fiction" },
  { title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "9781400095209", genre: "fiction" },
  // Science
  { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", genre: "science" },
  { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "9780198788607", genre: "science" },
  { title: "Cosmos", author: "Carl Sagan", isbn: "9780345539434", genre: "science" },
  { title: "The Gene", author: "Siddhartha Mukherjee", isbn: "9781476733500", genre: "science" },
  // History
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316110", genre: "history" },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393317558", genre: "history" },
  { title: "Facing Mount Kenya", author: "Jomo Kenyatta", isbn: "9780436234002", genre: "history" },
  { title: "Born a Crime", author: "Trevor Noah", isbn: "9780399588174", genre: "history" },
  // Technology
  { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", genre: "technology" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", isbn: "9780135957059", genre: "technology" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", genre: "technology" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "9781593279509", genre: "technology" },
];

async function main() {
  const genreIds: Record<string, number> = {};

  for (const g of genres) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genreIds[g.slug] = genre.id;
  }

  for (const b of books) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genreIds[b.genre],
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${books.length} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
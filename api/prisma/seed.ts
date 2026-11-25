import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];

const sampleBooks = [
  // Fantasy
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", isbn: "9780547928227" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genre: "Fantasy", isbn: "9780547773742" },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", isbn: "9780756404741" },
  { title: "Mistborn: The Final Empire", author: "Brandon Sanderson", genre: "Fantasy", isbn: "9780765311788" },
  // Science Fiction
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", isbn: "9780441172719" },
  { title: "Neuromancer", author: "William Gibson", genre: "Science Fiction", isbn: "9780441569595" },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Science Fiction", isbn: "9780441478125" },
  { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction", isbn: "9780553293357" },
  // Mystery
  { title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery", isbn: "9780394758282" },
  { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", genre: "Mystery", isbn: "9780141034317" },
  { title: "And Then There Were None", author: "Agatha Christie", genre: "Mystery", isbn: "9780062073488" },
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery", isbn: "9780307454546" },
  // Biography
  { title: "Educated", author: "Tara Westover", genre: "Biography", isbn: "9780399590504" },
  { title: "Long Walk to Freedom", author: "Nelson Mandela", genre: "Biography", isbn: "9780316548182" },
  { title: "Dreams from My Father", author: "Barack Obama", genre: "Biography", isbn: "9781400082773" },
  { title: "Born a Crime", author: "Trevor Noah", genre: "Biography", isbn: "9780399588174" },
];

async function main() {
  const genreMap = new Map<string, number>();

  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
    genreMap.set(name, genre.id);
  }

  for (const book of sampleBooks) {
    const genreId = genreMap.get(book.genre);
    if (genreId === undefined) {
      throw new Error(`Unknown genre: ${book.genre}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: `${book.title} by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 3,
        genreId,
      },
    });
  }

  console.log(`Seeded ${genreNames.length} genres and ${sampleBooks.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
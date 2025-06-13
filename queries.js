// queries.js
db = db.getSiblingDB('plp_bookstore');

// Task 2: Basic CRUD Operations
// Find all books in a specific genre
const fantasyBooks = db.books.find({ genre: "Fantasy" });
print("Fantasy books:", fantasyBooks.toArray());

// Find books published after a certain year
const recentBooks = db.books.find({ published_year: { $gt: 2000 } });
print("Books published after 2000:", recentBooks.toArray());

// Find books by a specific author
const tolkienBooks = db.books.find({ author: "J.R.R. Tolkien" });
print("Books by J.R.R. Tolkien:", tolkienBooks.toArray());

// Update the price of a specific book
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 17.99 } }
);
print("Updated price for The Hobbit");

// Delete a book by its title
db.books.deleteOne({ title: "The Alchemist" });
print("Deleted 'The Alchemist'");

// Task 3: Advanced Queries
// Books in stock and published after 2010
const inStockRecent = db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});
print("In-stock books published after 2010:", inStockRecent.toArray());

// Projection - only title, author, and price
const projectedBooks = db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);
print("Books with projected fields:", projectedBooks.toArray());

// Sorting by price
const ascendingPrice = db.books.find().sort({ price: 1 });
print("Books sorted by price (ascending):", ascendingPrice.toArray());

const descendingPrice = db.books.find().sort({ price: -1 });
print("Books sorted by price (descending):", descendingPrice.toArray());

// Pagination (5 books per page, page 2)
const page2 = db.books.find().skip(5).limit(5);
print("Page 2 results (5 items):", page2.toArray());

// Task 4: Aggregation Pipeline
// Average price by genre
const avgPriceByGenre = db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      avgPrice: { $avg: "$price" }
    }
  }
]);
print("Average price by genre:", avgPriceByGenre.toArray());

// Author with most books
const prolificAuthor = db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);
print("Author with most books:", prolificAuthor.toArray());

// Books by publication decade
const booksByDecade = db.books.aggregate([
  {
    $group: {
      _id: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
print("Books by publication decade:", booksByDecade.toArray());

// Task 5: Indexing
// Create indexes
db.books.createIndex({ title: 1 });
db.books.createIndex({ author: 1, published_year: 1 });
print("Indexes created on title and author+published_year");

// Performance comparison
const explainTitle = db.books.find({ title: "The Hobbit" }).explain("executionStats");
print("Execution stats for title query:", explainTitle);

const explainAuthorYear = db.books.find({ 
  author: "J.R.R. Tolkien", 
  published_year: 1937 
}).explain("executionStats");
print("Execution stats for author+year query:", explainAuthorYear);
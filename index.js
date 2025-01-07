import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content: "Decentralized Finance (DeFi) is an emerging and rapidly evolving...",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content: "Artificial Intelligence (AI) is no longer a concept of the future...",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content: "Sustainability is more than just a buzzword...",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Static files (CSS, JS)
app.set("view engine", "ejs"); // Set EJS as the view engine

// Authentication middleware
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Authentication Routes
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    req.session.user = { username };
    res.redirect("/posts");
  } else {
    res.render("login", { error: "Invalid credentials!" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Protected Routes
app.get("/posts", isAuthenticated, (req, res) => {
  res.render("posts", { posts });
});

app.get("/posts/:id", isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("viewPost", { post });
});

app.get("/new", isAuthenticated, (req, res) => {
  res.render("editPost", { heading: "New Post", submit: "Create" });
});

app.post("/api/posts", isAuthenticated, (req, res) => {
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };
  posts.push(newPost);
  res.redirect("/posts");
});

app.get("/edit/:id", isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("editPost", {
    post,
    heading: "Edit Post",
    submit: "Update",
  });
});

app.post("/api/posts/:id", isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }
  posts[postIndex] = {
    ...posts[postIndex],
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };
  res.redirect("/posts");
});

app.get("/api/posts/delete/:id", isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== id);
  res.redirect("/posts");
});

// API Routes
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

app.post("/api/posts", (req, res) => {
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.patch("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts[postIndex] = {
    ...posts[postIndex],
    ...req.body,
    date: new Date().toISOString(),
  };
  res.json(posts[postIndex]);
});

app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = posts.length;
  posts = posts.filter((post) => post.id !== id);
  if (posts.length === initialLength) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(204).send(); // No content
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
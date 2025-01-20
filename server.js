import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg"
import bcryptjs from "bcryptjs"

const saltRound = 10;
const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog_users",
  password: "Chika12mark??",
  port: "5432"
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", (req, res)=>{
  res.render("home.ejs")
})
//login page
app.get("/login", (req, res)=>{
  res.render("login.ejs")
});
//registration
app.get("/register", (req, res)=>{
  res.render("register.ejs")
})

app.post("/register", async(req,res)=>{
  try{
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    const checkDatabaseForUser = await db.query("SELECT * FROM users  WHERE email = $1", [email])
    if(checkDatabaseForUser.rows.length > 0){
      res.redirect("/")
    }else{
      const hash = await bcryptjs.hash(password, saltRound)
      await db.query("INSERT INTO users (name, email, password) VALUES($1, $2, $3)", [name, email, hash])
      res.redirect("/blog")

    }
  }catch(error){
    res.redirect("/")
  }
})

app.post("/login", async(req, res)=>{
  try{
    //const name = req.body.name
    const email = req.body.email
    const loggedInPassword = req.body.password

    const checkDatabaseForUser = await db.query("SELECT * FROM users WHERE email = $1", [email])
    //console.log(checkDatabaseForUser.rows)
    if(checkDatabaseForUser.rows.length > 0){
      const savedPassword = checkDatabaseForUser.rows[0].password
      const checker = await bcryptjs.compare(loggedInPassword, savedPassword) 
      if(checker){
        res.redirect("/blog")
      }else{
        res.redirect("/login")
      }
      
    }else{
      res.redirect("/login")
    }
  }catch(error){
    res.redirect("/login")
  }
})

//still working on how to ensure that redirect takes user to blog post and not home page
app.get("/blog", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    //console.log(response);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});


// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});


// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});


// Read post.
app.get("/posts/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log("consumer response", response.data)
    res.render("postDetails.ejs", { post: response.data});
  } catch (error) {
    res.status(500).json({ message: "Error fetching post details" });
  }
});


// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});


// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

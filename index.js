import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import { checkDb, checkdbId, insertQuery, updatePost, deleteDb } from "./database.js"; // Import functions


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/posts", async(req, res)=>{
  const writeUp = await checkDb()
  try{
    res.json(writeUp)
  }catch(error){
    res.status(500).json({ error: "Error fetching posts from the database" });
  }
})


app.get("/posts/:id", async(req, res)=>{
  try{
    const pid = parseInt(req.params.id);
    if(isNaN(pid)){
      return res.status(404).json({error: `Post not found`})
    }
    const result =  await checkdbId(pid)
    const searchPost = result.rows[0]

    if (searchPost.length === 0) {
      return res.status(404).json({ error: "Post not found" }); // 404 for no result
    }
    console.log(searchPost[0])
    res.json(searchPost);

  }catch(error){
    console.log("Error fetching post", error.message)
    res.status(500).json({error:"Internal server error"})
  }
})


app.post("/posts", async(req, res)=>{
  try{
    const {title, content, author} = req.body

    if (!title || !content || !author) {
      return res.status(400).json({ error: "Title, content, and author are required" });
    }
    const result = await insertQuery(title, content, author);
    const newPost = result.rows
    res.status(201).json(newPost)

  }catch(error){
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
})


app.patch("/posts/:id", async(req, res)=>{
  try{
    const pid = parseInt(req.params.id);
    if(isNaN(pid)){
      return res.status(404).json({error: `Post not found`})
    }
    const formerPost = await checkdbId(pid)
    if(!formerPost.rows.length){
      res.status(404).json({error:"data not found"})
    }

    const updatedPost = await updatePost(
      pid,
      req.body.title || formerPost.rows[0][title],
      req.body.content || formerPost.rows[0][content],
      req.body.author || formerPost.rows[0][author],
      new Date()
    );
    res.json(updatedPost)

  }catch(error){
    console.log("Error fetching data", error.message)
    res.status(500).json({error: "Internal Server Error"})
  }
});


app.delete("/posts/:id", async(req, res)=>{
  try{
    const pid = parseInt(req.params.id);
    const result = await deleteDb(pid)
    res.json(result)
  }catch(error){
    res.status(404).json({error: "No post found"})
  }
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
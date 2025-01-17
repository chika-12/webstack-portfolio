import pg from "pg"

// Database queries..........................................................................................
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "Chika12mark??",
  port: "5432"
});


db.connect()

export async function checkDb(){
  const  result = await db.query("SELECT * FROM posts");
  const writeUp = result.rows
  return writeUp
}

export async function checkdbId(value){
  try{
    const data = await db.query("SELECT * FROM posts WHERE id = ($1)",[value])
    return data
  }catch(error){
    console.log(error.message)
    return error.message
  }
}

export async function insertQuery(val1, val2, val3){
  const data = await db.query(
    "INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *",
    [val1, val2, val3]
  );
  return data
}

export async function updatePost(id, title, content, author, date) {
  const data = await db.query(
    "UPDATE posts SET title = $1, content = $2, author = $3, date = $4 WHERE id = $5",
    [title, content, author, date, id]
  );
  return data.rows[0];
}
export async function deleteDb(pid){
  const result = await db.query("DELETE FROM posts WHERE id =$1", [pid])
  return result
}
//end..........................................................................................................
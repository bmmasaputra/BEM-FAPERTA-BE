import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default app;
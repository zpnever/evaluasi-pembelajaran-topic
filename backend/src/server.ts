import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on http://localhost:${PORT}`);
});

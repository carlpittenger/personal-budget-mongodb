import express from "express";
import { readFile } from "node:fs";
import cors from "cors";

const port = 3000;
const app = express();

function main() {
    app.use(cors());

    app.use("/", express.static("public"));

    app.get("/hello", (_req, res) => {
        res.send("Hello, world!");
    });
    app.get("/budget", (_req, res) => {
        readFile("budget.json", "utf8", (err, data) => {
            if (err !== null) {
                console.error(`Error reading JSON file: ${err}`);
                res.status(500).send("Internal Server Error");
                return;
            }

            const budget = JSON.parse(data);
            res.json(budget);
        });
    });

    app.listen(port, () => {
        console.log(`API serving at http://localhost:${port}`);
    });
}

main();

import express from "express";
// import { readFile, writeFile } from "node:fs";
import cors from "cors";
// import { json } from "body-parser";
import bodyParser from "body-parser";
const { json } = bodyParser;
import { connect, Schema, model } from "mongoose";

const port = 3000;

const app = express();

const colors = {
    blue: "#0000FF",
    green: "#00FF00",
    red: "#FF0000",
    yellow: "#FFFF00",
    orange: "#FF8000",
    purple: "#800080",
    gray: "#808080",
};

async function main() {
    // connect to mongodb
    connect("mongodb://localhost/budget", {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    const budgetSchema = new Schema({
        title: { type: String, required: true },
        budget: { type: Number, required: true },
        color: {
            type: String,
            match: /^#([0-9A-Fa-f]{6})$/,
            required: true,
        },
    });

    const Budget = model("Budget", budgetSchema);

    app.use(cors());
    app.use(json());

    app.use("/", express.static("public"));

    app.get("/hello", (_req, res) => {
        res.send("Hello, world!");
    });

    app.get("/budget", async (_req, res) => {
        try {
            const myBudget = await Budget.find();
            console.log(myBudget);
            res.json({ myBudget });
        } catch (err) {
            console.error(`Error reading budget data: ${err}`);
            res.status(500).send("Internal Server Error");
        }

        // readFile("budget.json", "utf8", (err, data) => {
        //     if (err !== null) {
        //         console.error(`Error reading JSON file: ${err}`);
        //         res.status(500).send("Internal Server Error");
        //         return;
        //     }

        //     const budget = JSON.parse(data);
        //     res.json(budget);
        // });
    });

    // endpoint to update data
    app.post("/budget", async (req, res) => {
        // assuming the request body contains the updated budget data
        const updatedBudget = req.body;

        try {
            const budget = new Budget(updatedBudget);
            await budget.save();
            res.status(200).send("Budget updated successfully");
        } catch (err) {
            console.error(`Error adding budget data: ${err}`);
            res.status(500).send("Internal Server Error");
        }

        // // read the existing budget data
        // readFile("budget.json", "utf8", (err, data) => {
        //     if (err !== null) {
        //         console.error(`Error reading JSON file: ${err}`);
        //         res.status(500).send("Internal Server Error");
        //         return;
        //     }

        //     const currentBudget = JSON.parse(data);

        //     // update the budget data
        //     currentBudget.myBudget = updatedBudget;

        //     // write the updated data back to the file
        //     writeFile(
        //         "budget.json",
        //         JSON.stringify(currentBudget, null, 4),
        //         (err) => {
        //             if (err) {
        //                 console.error(`Error writing JSON file: ${err}`);
        //                 res.status(500).send("Internal Server Error");
        //                 return;
        //             }

        //             res.status(200).send("Budget updated successfully");
        //         },
        //     );
        // });
    });

    app.listen(port, () => {
        console.log(`API serving at http://localhost:${port}`);
    });
}

await main();

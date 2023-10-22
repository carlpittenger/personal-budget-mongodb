import express from "express";
import cors from "cors";
// import { json } from "body-parser";
import bodyParser from "body-parser";
const { json } = bodyParser;
import { connect, Schema, model } from "mongoose";

const port = 3000;

function main() {
    const app = express();

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
            res.json({ myBudget });
        } catch (err) {
            console.error(`Error reading budget data: ${err}`);
            res.status(500).send("Internal Server Error");
        }
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
    });

    app.listen(port, () => {
        console.log(`API serving at http://localhost:${port}`);
    });
}

main();

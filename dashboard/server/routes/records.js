import express from "express";

import db from "../server.js"

import { ObjectId } from "mongodb";

import jwt from "jsonwebtoken";

const router = express.Router();

const secretKey = process.env.jwtSecret;

router.post("/test", async (req, res) => {
    return res.send({"balance": req.body.balance}).status(200);
})
//find specific ninja by name and location
router.get("/:name/:loc", async (req, res) => {
    let ninja = req.params.name;
    let collection = await db.collection(req.params.loc);
    try {
        let result = await collection.find({name: ninja}).toArray();
        if (result) {
            res.send(result).status(200);
        } else {
            res.status(404).send("Ninja not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding ninja");
    }
})

//access different collections based on location
router.get("/:loc", async (req, res) => {
    let loc = req.params.loc;
    let collection = await db.collection(`${loc}`);
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
})

//finding commments of specific ninja
router.get("/comments/:name/:loc", async (req, res) => {
    let ninja = req.params.name;
    let collection = await db.collection(req.params.loc);
    try {
        let result = await collection.find({name: ninja}).toArray();
        if (result) {
            res.send(result).status(200);
        } else {
            res.status(404).send("Ninja not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding ninja");
    }
})

//modify balance (ninja-side)
router.patch("/ninja", async (req, res) => {
    try{
        let loc = req.body.loc;
        let amnt = parseInt(req.body.amnt);
        const changeBal = { $inc: {balance: amnt}}
        
        let collection = await db.collection(`${loc}`);
        let result = await collection.updateOne({name: req.body.name}, changeBal);
        res.send(result).status(200);
    } catch (err){
        console.error(err);
        res.status(500).send("Error updating balance");
    }
})
//modify balance (sensei-side)
router.patch("/:id/:amnt", async (req, res) =>{
    try{
        let loc = req.body.loc;
        let amnt = parseInt(req.params.amnt);
        const changeBal = { $inc: {balance: amnt}}

        const query = { _id: new ObjectId(req.params.id)};
        
        let collection = await db.collection(`${loc}`);
        let result = await collection.updateOne(query, changeBal);
        res.send(result).status(200);
    } catch (err){
        console.error(err);
        res.status(500).send("Error updating balance");
    }
});
//add comments
router.patch("/comments", async (req, res) => {
    try{
        const loc = req.body.loc;
        const cmnt = req.body.cmnt;
        const addComment = {$push: {comments: cmnt}};
        
        const query = {name: req.body.name}

        let collection = await db.collection(`${loc}`);
        let result = await collection.updateOne(query, addComment);
        
        //add comment to transactionHistory
        collection = await db.collection("transactionHistory");
        //formatting the date
        const date = new Date();
        const month = date.getMonth() + 1; 
        const day = date.getDate()-1; 
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        let newComment = {
            name: req.body.name,
            comment: cmnt,
            location: loc,
            date: formattedDate,
        }
        let commentAdded = await collection.insertOne(newComment);
        res.send({result, commentAdded}).status(200);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding comment");
    }
})
//create new ninja
router.post("/", async (req, res) => {
    try{
        let newNinja = {
            name: req.body.name,
            balance: 0,
            comments: [],
        };
    
        let collection = await db.collection(req.body.loc);
        let result = await collection.insertOne(newNinja);

        //add new ninja info to ninjaLogins
        collection = await db.collection("ninjaLogin");
        result = await collection.insertOne({name: req.body.name,  password: req.body.pwd, location: req.body.loc})
        res.send(result).status(200);
    } catch(err){
        console.error(err);
        res.status(500).send("Error adding ninja");
    }   
})

//searching for login details
router.post("/login", async (req, res) => {

    let collection = await db.collection(req.body.collection);
    let user = await collection.findOne({name: req.body.name})
    try {
        if (user && user.password === req.body.password) {
            const token = jwt.sign(
                { id: user._id, name: user.name, location: user.location },
                secretKey,
                { expiresIn: '15m' }
            );
            return res.status(200).json({ message: "Login success!", token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

//deleting comments and ninjas
router.delete("/:id", async (req, res) => {
    const delNin = req.body.delNin;
    try{
        let collection = await db.collection(req.body.loc);
        let query = {_id: new ObjectId(req.params.id)};

        let result = await collection.deleteOne(query);

        //if the function is deleting ninja, delete their comments and login
        if (delNin){
            collection = await db.collection("transactionHistory");
            result = await collection.deleteMany({name: req.body.name});
            collection = await db.collection("ninjaLogin");
            result = await collection.deleteMany({name: req.body.name});
        //otherwise, delete the comment from the ninja's comment history
        } else {
            collection = await db.collection(req.body.location);
            result = await collection.updateOne({name: req.body.name}, {$pull: {comments: req.body.comment}});
        }
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error deleting ninja");
    }
})

export default router;
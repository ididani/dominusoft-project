const express = require("express")
const contactModel = require("../models/contactModel")
const path = require("path")

const app = express()

// CRUD
// create: post
app.post('/create', async (req, res) => {
    try {
        const newContact = new contactModel(req.body)
        newContact.save()
        console.log(newContact)
        res.status(200).send(newContact)
    } catch (err) {
        res.status(500).send("Not sent: " + err)
    }
})

// read: get
// app.get('', async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(500).send("Not read: " + err)
//     }
// })
// update:  put, patch
// app.patch('', async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(500).send("Not updated: " + err)
//     }
// })
// delete: delete
// app.delete('', async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(500).send("Not delete: " + err)
//     }
// })



module.exports = app
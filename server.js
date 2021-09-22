const nodemailer = require("nodemailer")
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
require("dotenv").config()

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))
app.use(express.static("contact"))

const port = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.sendFile("/index.html")
})

app.get("/debug", (req, res) => {
  res.sendFile("index.html")
})

// POST route from contact form
app.post("/contact", (req, res) => {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secureConnection: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
    tls: {
      ciphers: "SSLv3"
    }
  })

  // Specify what the email will look like
  const mailOpts = {
    from: process.env.GMAIL_USER, // This is ignored by Gmail
    to: "joshcompanion@gmail.com",
    subject: "New message from portfolio contact form",
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error)
      res.send("contact-failure") // Show a page indicating failure
    } else {
      console.log("No issues, Form submited")

      res.sendFile(path.join(__dirname, "contact", "index.html"))
    }
  })
})

// Prints a log once the server starts listening
app.listen(port, () => {
  console.log(`Server running at port: ${port}`)
})

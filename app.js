const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
// const cors = require('cors')

const app = express()

const PORT = config.get('port') || 5000

// app.use(cors())

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.router'))
app.use('/api/link', require('./routes/link.router'))
app.use('/t', require('./routes/redirect.router'))

if(process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

async function start(){
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has been run on port ${PORT}`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()


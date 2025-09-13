
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import chatRoutes from './routers/router.chat.js'


const app = express()
const port = process.env.PORT || 3001


app.use(express.json()) // for body parsing
app.use(cors()) // prevevt cors errors



app.use('/api/chat',chatRoutes)

//routes place here
app.get('/',(req,res)=>{
    res.json({
        msg:'Success'
    })
})





app.listen(port,()=>console.log(`server started at ${port} port`))

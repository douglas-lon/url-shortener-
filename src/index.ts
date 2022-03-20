import express, {Request, Response} from 'express'
import urlShortRouter from './routes/urlShortener'

const app = express()
app.use(express.json())

app.use(urlShortRouter)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({works: true})
})

app.listen(3000, () => {
    console.log('Iniciado')
})
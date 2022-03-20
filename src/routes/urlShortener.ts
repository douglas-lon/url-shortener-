import APP_CONST from '../constants/Constants'
import { NextFunction, Request, Response, Router } from 'express'
import shortId from 'shortid'
import sqlite3 from 'sqlite3'

type rows =  {
    originUrl?: string;
    hash?: string;
    shortUrl?: string;

}

const urlShortRouter = Router()

const getByUrlFromDB = async (db: any, url: string)  => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM url WHERE originUrl = ?`, [url], (err: any, row: any) => {
            if (err) {
                return console.error(err.message)
              }
            resolve(row);
        })
    })
}

const getByHashFromDB = async (db: any, hash: string): Promise<rows> => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM url WHERE hash = ?`, [hash], (err: any, row: any) => {
            if (err) {
                return console.error(err.message)
              }
            resolve(row);
        })
    })
}


urlShortRouter.post('/shortener', async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database('./easy.db')
    const { originUrl } = req.body
    
    const row = await getByUrlFromDB(db, originUrl)

    if (row) {
        db.close()
        res.status(400).send({alreadyExists: true})
        return
    }
    
    const hash = shortId.generate()
    const shortUrl = `${APP_CONST.API_URL}/${hash}`
    db.run(`INSERT INTO url(originUrl, hash, shortUrl) VALUES(?, ?, ?)`, [originUrl, hash, shortUrl])

    db.close()
    res.status(200).send({
        originUrl: originUrl,
        hash: hash,
        shortUrl: shortUrl,
    })

})

urlShortRouter.get('/:hash', async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database('./easy.db')
    const { hash } = req.params
    const row = await getByHashFromDB(db, hash)

    db.close()
    if (row) {
        res.redirect(row.originUrl || '')
        return
    }

    res.status(400).send({urlExists: false})
})

export default urlShortRouter
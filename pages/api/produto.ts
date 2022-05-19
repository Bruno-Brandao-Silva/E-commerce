import type { NextApiRequest, NextApiResponse } from 'next'
import Produto from "../../utils/produto"

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()

    if (req.method == "GET") {

        const { _id, name, description, price, promotion } = req.query
        try {
            produto.set(_id, name, description, price, null, promotion)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const docproduto = await produto.findAll()
        res.status(200).json(docproduto)

    } else if (req.method == "POST") {
        
        var baseUrl = req.headers.host + '/produto/'
        if (req.headers.host && req.headers.host.toString().includes('localhost')) {
            baseUrl = 'http://' + baseUrl
        } else {
            baseUrl = 'https://' + baseUrl
        }
        console.log('baseUrl: ' + baseUrl)
        const parseBody = JSON.parse(req.body)
        const { name, description, price, promotion } = parseBody
        const image = parseBody.imageFilesName
        try {
            produto.set(null, name, description, price, image, promotion)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const insertedProduto = await produto.insertOne()
        const redirectUrl = '/produto/' + insertedProduto.insertedId
        res.redirect(308, redirectUrl)

    } else if (req.method == "PUT") {

        const { _id, name, description, price, image, promotion } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, promotion)
        await produto.replaceOne()
        res.status(200).json({ txt: "Produto substituido." })

    } else if (req.method == "PATCH") {

        const { _id, name, description, price, image, promotion } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, promotion)
        await produto.updateOne()
        res.status(200).json({ txt: "Produto atualizado." })

    } else if (req.method == "DELETE") {

        const { _id } = req.query
        if (!_id) {
            res.status(400).json({ txt: "_id não existe." })
            return
        }
        try {
            produto.set(_id, null, null, null, null, null)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        await produto.deleteOne()
        res.status(200).json({ txt: "Produto excluido." })

    } else {
        res.status(400).json({ txt: "Metodo invalido." })
    }
}
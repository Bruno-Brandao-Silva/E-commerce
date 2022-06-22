import bdMongodb from "./bdmongo"
import Auth from "./auth"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PERFIL!
const auth = new Auth()

export default class Perfil {

    private email!: string
    private name!: string
    private birthDate!: string
    private cpf!: string
    private phone!: string
    private carrinho!: any[]
    private estoque!: any[]

    set(name: any, birthDate: any, cpf: any, phone: any) {
        this.name = String(name)
        this.birthDate = String(birthDate)
        this.cpf = String(cpf)
        this.phone = String(phone)
    }

    async setEmail(sub: string) {
        const docprofile = await auth.setProfile(sub)
        return this.email = docprofile?.email
    }

    async insertOne() {
        await bdwicksell.insertOne(colecao, this)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, { email: this.email })
    }

    async updateOne() {
        await bdwicksell.updateOne(colecao, { email: this.email }, { $set: this })
    }

    async replaceOne() {
        await bdwicksell.replaceOne(colecao, { email: this.email }, this)
    }

    async deleteOne() {
        await bdwicksell.deleteOne(colecao, { email: this.email })
    }
}
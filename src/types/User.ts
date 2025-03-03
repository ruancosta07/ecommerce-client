import type { Reviews, } from "./Product"
import type { Product as Products } from "./Product"

interface Product {
    id: string
    name: string
    price: number
    description: string
    images: string[]
    tags?: string[]
    adress?: {
        zipCode: string
        street: string
        complement: string
        state: string
        city: string
        neighborhood: string
        number: string
    }
}

type Status = "pending" |"approved" |"expired" |"canceled"

interface Adress {
    zipCode: string
    street: string
    complement: string
    state: string
    city: string
    neighborhood: string
    number: string
}


export interface Orders {
    id?: string
    userId?: string
    user?: User
    status?: Status
    productId: string
    product?: Product
    estimatedDeliveryDate: Date
    price: number
    expireDate: Date
    createdAt: Date
    checkoutUrl: string
    reviewed:boolean
    quantity:number;
}

enum UserRole {
    client,
    seller
}

export interface User {
    id: string
    name: string;
    email: string
    password: string
    avatar?: string
    twoStepsAuth?: boolean
    twoStepsAuthCode?: number
    reviews?: Reviews[]
    favorites: Product[]
    cart: Product[]
    products?: Products[]
    role: UserRole
    orders: Orders[]
    adress: Adress
}
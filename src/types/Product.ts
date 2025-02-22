import { User } from "./User"

type UserSafe = Pick<User, "avatar" | "email" | "name" >

export interface Reviews {
    id: string
    rating: number
    title: string
    comment: string
    createdAt: Date
    productId: string
    userId: string
    product?: Product
    user?: UserSafe
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: Array<string>;
    reviews?: Reviews[]
    tags?:string[]
    section?:string
    quantity:number
    stripeProductId?:string
}
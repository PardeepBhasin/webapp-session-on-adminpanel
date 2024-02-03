'use server';

import connectToDatabase from "./connectToDatabase";
import { PrismaClient } from "@prisma/client";
import z from 'zod';
import userModel from "./model/user";

const prisma = new PrismaClient();
const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
    phoneNumber: z.string()
})
const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number()
})

export async function saveUser(formData: FormData) {
    await connectToDatabase();
    const data = userSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber")
    });
    if (!data.success) {
        return {
            message: 'schema validtion failed'
        }
    }
    try {
        const user = await userModel.create(data.data);
        console.log("user++++++++++++++++", user);
        return {
            user,
            message: 'user saved successfully'
        }
    } catch (error) {
        return {
            error,
            message: 'failed to save user'
        }
    }
}

export async function saveUserWithPrisma(formData: FormData) {
    await prisma.$connect();
    const parsed = userSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber")
    });
    if (!parsed.success) {
        return {
            message: 'schema validtion failed'
        }
    }
    try {
        const { username, password, email, phoneNumber } = parsed.data;
        const user = await prisma.users.create({
            data: {
                username,
                password,
                email,
                phoneNumber
            }
        });
        console.log("user saved with prisma++++++++++++++++", user);
        return {
            user,
            message: 'user saved successfully'
        }
    } catch (error) {
        return {
            error,
            message: 'failed to save user'
        }
    }
}

export async function fetchUsers(role: string, email: string) {
    await prisma.$connect();
    console.log('role++++++++++++++++', role);
    try {
        if (role === 'admin') {
            const data = await prisma.users.findMany(
                {
                    select: {
                        username: true,
                        email: true,
                        phoneNumber: true,
                        role: true
                    }
                }
            );
            return {
                data,
                message: 'users fetched successfully'
            };
        } else {
            const data = await prisma.users.findMany(
                {
                    where: {
                        email: email
                    },
                    select: {
                        username: true,
                        email: true,
                        phoneNumber: true,
                        role: true
                    }
                }
            );
            return {
                data,
                message: 'users fetched successfully for non admin users'
            };
        }

    } catch (error) {
        return {
            error,
            message: 'failed to get users'
        }
    }
}

export async function saveUserRole(roleName: string, email: string) {
    if (!email || !roleName) {
        return {
            message: 'email or role name is missing'
        }
    }
    await prisma.$connect();
    try {
        const isUserAlreadyExist = await prisma.role.findUnique({
            where: {
                userEmail: email
            }
        });
        if (isUserAlreadyExist) {
            const updatedData = await prisma.role.update({
                where: {
                    userEmail: email
                },
                data: {
                    name: roleName
                }
            });
            return updatedData;
        } else {
            const data = await prisma.role.create({
                data: {
                    name: roleName,
                    userEmail: email
                }
            });
            return data
        }
    } catch (error) {
        return {
            error,
            message: 'failed to save user role'
        }
    }
}

export async function addProduct(formData: FormData) {
    await prisma.$connect();
    const parsedData = productSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
    });
    console.log("parsedData++++++++++++++", parsedData);
    if (!parsedData.success) {
        return {
            message: 'schema validtion failed'
        }
    }
    try {
        const { name, description, price } = parsedData.data;
        const data = await prisma.products.create({
            data: {
                name,
                description,
                price,
                image: '/veg.png',
                status: 'created'
            }
        });
        return data;
    } catch (error) {
        return {
            error,
            message: 'failed to add product'
        }
    }
}

export async function getProducts() {
    await prisma.$connect();
    try {
        const data = await prisma.products.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                    status: true
                }
            }

        );
        return data;
    } catch (error) {
        return {
            error,
            message: 'failed to fetch products'
        }
    }
}

export async function updateProductStatus(id: string, status: string) {
    await prisma.$connect();
    try {
        const data = await prisma.products.update({
            where: {
                id
            },
            data: {
                status
            }
        });
        return data;
    } catch (error) {
        return {
            error,
            message: 'failed to update product status'
        }
    }
}

export async function fetchUserByCredentials(credentials: any) {
    await prisma.$connect();
    try {
        const data = await prisma.users.findUnique({
            where: {
                email: credentials.email,
                password: credentials.password
            },
            select: {
                username: true,
                email: true,
                phoneNumber: true,
                role: true
            }
        });
        if (!data) {
            return {
                message: 'user not found'
            }
        }
        return data;
    } catch (error) {
        return {
            error,
            message: 'failed to fetch user by credentials'
        }
    }
}
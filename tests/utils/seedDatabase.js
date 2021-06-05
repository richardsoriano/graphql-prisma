import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'


const userOne = {
    input: {
        name: 'BenJen',
        email: 'benjen@abc.com',
        password: bcrypt.hashSync('dragon123')
    },
    user: undefined,
    jwt: undefined
}
const userTwo = {
    input: {
        name: 'Samwell',
        email: 'sam@abc.com',
        password: bcrypt.hashSync('dragon123')
    },
    user: undefined,
    jwt: undefined
}
const postOne = {
    input: {
        title: 'Swords of Fire Published',
        body: 'George RR Martin is a lazy fuck',
        published: true,
    },
    post: undefined
}
const postTwo = {
    input: {
        title: 'Swords of Fire unPublished',
        body: 'Douglas Adams 20th anniversary',
        published: false,
    },
    post: undefined
}
const commentOne = {
    input: {
        text: 'Gilly forever',
    },
    comment: undefined
}
const commentTwo = {
    input: {
        text: 'Master Aeomon forever'
    },
    comment: undefined
}
 

const seedDatabase = async ()=>{
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.PRISMA_AUTH_SECRET)  
    
    // Create user two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    }) 
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.PRISMA_AUTH_SECRET)   

    // Create Post one
    postOne.post = await prisma.mutation.createPost({
        data:{
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
    
    // Create post two
    postTwo.post = await prisma.mutation.createPost({
        data:{
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // create a comment one
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id:postOne.post.id
                }
            }
        }
    })  

    // create a comment two
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id:postOne.post.id
                }
            }
        }
    })
}
export { seedDatabase as default, userOne,  userTwo, postOne , postTwo, commentOne, commentTwo }
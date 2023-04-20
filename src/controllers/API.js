import { pool } from '../configs/index'
import { v4 as uuidv4 } from 'uuid'
import getTimeNow from '../functions/getTimeNow'

const getAllUser = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `select * from users where role = 0`
    )

    return res.status(200).json(rows)
}

const handleSignUpUser = async (req, res) => {
    const { userName, email, password, phoneNumber } = req.body
    const id = uuidv4()
    const imageDefault = 'https://firebasestorage.googleapis.com/v0/b/food-app-24bf2.appspot.com/o/avatar_user%2Favatar_default.JPEG?alt=media&token=780593e5-add2-4334-b6c0-f1b024dbecb0'
    const role = 0
    const createdAt = getTimeNow()
    const updatedAt = createdAt

    // check input
    console.log(
        `
        \n>>>>> Check input sign up user: 
        User name: ${userName}
        Email: ${email}
        Password: ${password}
        PhoneNumber: ${phoneNumber}
        ID: ${id}
        ImageDefault: ${imageDefault}
        Role: ${role == 0 ? 'User' : 'Admin'}
        Created at: ${createdAt}
        Updated at: ${updatedAt}
        \n
        `
    )

    // Kiểm tra email đã tồn tại trong csdl chưa
    const [emailFound] = await pool.execute(
        `select email from users where email = ?`, [email]
    )

    // Kiểm tra số điện thoại tồn tại trong csdl chưa
    const [phoneNumberFound] = await pool.execute(
        `select phoneNumber from users where phoneNumber = ?`, [phoneNumber]
    )

    // validate
    if (emailFound[0]) {
        console.log(
            `
                \n>>>>> Check user found by email: ${JSON.stringify(emailFound[0])}\n
            `
        )
        return res.status(400).json({
            message: 'Email này đã được đăng kí!'
        })
    } if (phoneNumberFound[0]) {
        console.log(
            `
                \n>>>>> Check phone number found: ${JSON.stringify(phoneNumberFound[0])}\n
            `
        )
        return res.status(401).json({
            message: 'Số điện thoại này đã được đăng kí!'
        })
    }

    // handle add to db
    await pool.execute(
        `insert into users (id, userName, email, password, image, role, phoneNumber, created_at, updated_at)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userName, email, password, imageDefault, role, phoneNumber, createdAt, updatedAt]
    )

    console.log(
        `\n>>>>>> Inser new user successful!\n`
    )

    return res.status(200).json({
        message: 'Oke'
    })
}

const API = {
    getAllUser,
    handleSignUpUser
}

export default API
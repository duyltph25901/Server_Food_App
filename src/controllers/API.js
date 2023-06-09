import { pool } from '../configs/index'
import { v4 as uuidv4 } from 'uuid'
import getTimeNow from '../functions/getTimeNow'

const getAllUser = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `select * from users where role = 0`
    )

    return res.status(200).json(rows)
}

const getHomeProduct = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `
        SELECT 
        foods.id, foods.name, description,
        price, image, status, discount
        , categories_child.name as category
        FROM foods
        JOIN categories_child on foods.category_id = categories_child.id
        where categories_child.name in ('Cơm', 'Trà sữa', 'Bánh mì', 'Bánh tráng', 'Mì')
        and status = 1
        limit 30
        `
    )

    return res.status(200).json(rows.sort(() => Math.random() - 0.5))
}

const getAllRice = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `
        SELECT 
        foods.id, foods.name, description,
        price, image, status, discount
        , categories_child.name as category
        FROM foods
        JOIN categories_child on foods.category_id = categories_child.id
        where categories_child.name in ('Cơm')
        and status = 1
        `
    )

    return res.status(200).json(rows.sort(() => Math.random() - 0.5))
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

const handleLoginUser = async (req, res) => {
    const { email, password } = req.body

    const [userFound] = await pool.execute(
        `select * from users where email = ? and role = 0`, [email]
    )

    console.log(
        `
        \n>>>>> Check user found: ${JSON.stringify(userFound[0])}
        `
    )

    if (!userFound[0]) {
        return res.status(404).json({
            message: 'Không tìm thấy email!'
        })
    } if (userFound[0].password !== password) {
        return res.status(405).json({
            message: 'Mật khẩu không đúng!'
        })
    }

    return res.status(200).json({
        objectCurrent: userFound[0]
    })
}

const handleSearchFoodByName = async (req, res) => {
    const { keyName } = req.body

    const sqlQuery = `SELECT 
    foods.id, foods.name, description,
    price, image, status, discount
    , categories_child.name as category
    FROM foods
    JOIN categories_child on foods.category_id = categories_child.id where foods.name like '%${keyName}%'`
    const [results] = await pool.execute(
        sqlQuery
    )

    // => results is arr

    return res.status(200).json({
        results: results
    })
}

const handleUpdatePhoneNumber = async (req, res) => {
    const { phoneNumber, idUser } = req.body

    // find phoneNumber in db
    const [phoneNumberFound] = await pool.execute(
        `select phoneNumber from users where phoneNumber = ?`, [phoneNumber]
    )

    console.log(
        `
        \n>>>>> Check phone number found: ${phoneNumberFound[0]}\n
        `
    )

    if (phoneNumberFound[0]) {
        return res.status(405).json({
            message: 'Số điện thoại đã được đăng kí trước đó!'
        })
    }

    // handle update phone number
    await pool.execute(
        `update users
        set phoneNumber = ?
        where id = ?`, [phoneNumber, idUser]
    )

    return res.status(200).json({
        message: 'Cập nhật số điện thoại thành công!'
    })
}

const findUserById = async (req, res) => {
    const idUser = req.params.id

    const [user] = await pool.execute(
        'select * from users where id = ?', [idUser]
    )

    console.log(
        `
        \n>>>>> Check user found by id: ${JSON.stringify(user[0])}\n
        `
    )

    return res.status(200).json(user[0])
}

const handleUpdateEmail = async (req, res) => {
    const { email, idUser } = req.body

    // find email
    const [emailFound] = await pool.execute(
        `select email from users where email = ?`, [email]
    )

    if (emailFound[0]) {
        return res.status(405).json({
            message: 'Email đã được đăng kí trước đó!'
        })
    }

    // handle update email
    await pool.execute(
        `
        update users
        set email = ?
        where id = ?
        `, [email, idUser]
    )

    return res.status(200).json({
        message: 'Cập nhật email thành công!'
    })
}

const handleUpdatePassword = async (req, res) => {
    const { password, idUser } = req.body

    await pool.execute(
        `update users
        set password = ?
        where id = ?`, [password, idUser]
    )

    return res.status(200).json({
        message: 'Update password user successful!'
    })
}

const handleUpdateUserInfo = async (req, res) => {
    const { fieldUpdateValue, updated_at, idUser, flag } = req.body
    let message = ''

    switch (flag) {
        case 0: {
            // handle update
            await pool.execute(
                `update users
                set userName = ?, updated_at = ?
                where id = ?`, [fieldUpdateValue, updated_at, idUser]
            )

            message = 'Cập nhật tên đăng nhập thành công!'
            break
        }
        case 1: {
            await pool.execute(
                `update users
                set bio = ?, updated_at = ?
                where id = ?`, [fieldUpdateValue, updated_at, idUser]
            )

            message = 'Cập nhật bio thành công!'
            break
        }
        case 2: {
            await pool.execute(
                `update users 
                set gender = ?, updated_at = ?
                where id = ?`, [fieldUpdateValue, updated_at, idUser]
            )

            message = 'Cập nhật giới tính thành công!'
            break
        }
        case 3: {
            await pool.execute(
                `
                update users
                set dob = ?, updated_at = ?
                where id = ?
                `, [fieldUpdateValue, updated_at, idUser]
            )

            message = 'Cập nhật ngày sinh người dùng thành công!'
            break
        }
        default: {
            break
        }
    }

    return res.status(200).json({
        message: message
    })
}

const API = {
    getAllUser,
    getHomeProduct,
    handleSignUpUser,
    handleLoginUser,
    handleSearchFoodByName,
    getAllRice,
    handleUpdatePhoneNumber,
    findUserById,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateUserInfo
}

export default API
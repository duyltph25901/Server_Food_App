import { v4 as uuidv4 } from 'uuid'
import getTimeNow from '../functions/getTimeNow'
import { pool } from '../configs/index'
import { storage } from '../configs/firebase'
import path from 'path'
import multer from 'multer'
import { setTimeout } from 'timers'

const getLoginScreen = (req, res) => {
    return res.render('LoginScreen.ejs', { error: false })
}

const getSignUpScreen = (req, res) => {
    return res.render('SignUpScreen.ejs', { error: false })
}

const getHomeScreen = async (req, res) => {
    const userCurrent = await req.cookies.userCurrent

    console.log(
        `
            \n>>>>> Check userCurrent cookie: ${userCurrent}
        `
    )

    const [rows, fields] = await pool.execute(
        `select * from foods limit 30`
    )


    return res.render('HomeScreen.ejs', { data: rows })
}

const getCategoryScreen = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `select * from categories_parent`
    )

    return res.render('CategoryScreen.ejs', { data: rows })
}

const getCategoriesParent = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `select * from categories_parent`
    )

    return res.render('CategoriesParent.ejs', { data: rows })
}

const getCategoriesChild = async (req, res) => {
    const [rows, fields] = await pool.execute(
        `
            select categories_child.id,
            categories_child.name, 
            categories_parent.name as categoryParentName
            from categories_child
            join categories_parent on categories_parent.id = categories_child.id_category_parent 
        `
    )

    return res.render('CategoriesChild.ejs', { data: rows })
}

const getProductScreen = async (req, res) => {
    const [categories] = await pool.execute(
        `select * from categories_child`
    )
    return res.render('ProductsScreen.ejs', { data: categories })
}

const handleSignUp = async (req, res) => {
    const { email, userName, password, phoneNumber } = req.body
    const id = uuidv4()
    const avatarDefault = 'https://firebasestorage.googleapis.com/v0/b/food-app-24bf2.appspot.com/o/avatar_user%2Favatar_default.JPEG?alt=media&token=780593e5-add2-4334-b6c0-f1b024dbecb0'
    const role = 0
    const createdAt = getTimeNow()
    const updateAt = createdAt

    const [users] = await pool.execute(
        `select email from users where email = ?`, [email]
    )

    console.log(
        `
            \n>>>>> Check user found by email: ${JSON.stringify(users[0])}\n
        `
    );

    if (users[0]) {
        return res.render('SignUpScreen.ejs', { error: true })
    }

    console.log(
        `
            \n>>>>> Check user sign up: \nID: ${id}\nUser name: ${userName}\nEmail: ${email}\nPassword: ${password}\nImage: ${avatarDefault}\nRole: ${role}\nPhoneNumber: ${phoneNumber}\nCreated at: ${createdAt}\nUpdate at: ${createdAt}\n
        `
    );

    await pool.execute(
        `insert into users (id, userName, email, password, image, role, phoneNumber, created_at, updated_at)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userName, email, password, avatarDefault, role, phoneNumber, createdAt, updateAt]
    )

    return res.redirect('/login')
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body

    // check email is exited in data
    const [users] = await pool.execute(
        `select * from users where email = ? and password = ? and role = ?`, [email, password, 1]
    )

    console.log(
        `
            \n>>>>> Check user logged in: ${JSON.stringify(users[0])}\n
        `
    )

    if (!users[0]) {
        // return res.redirect('/login', { error: true })
        return res.render('LoginScreen.ejs', { error: true })
    }

    // handle save cookie
    res.setHeader('set-cookie', `userCurrent=${JSON.stringify(users[0])}`)
    console.log(`\n>>>>> Message: Save cookie user current  succsseful!\n`);

    return res.redirect('/')
}

const handleLogOut = async (req, res) => {
    const cookies = req.cookies
    for (const cookieName in cookies) {
        res.clearCookie(cookieName)
    }

    console.log(`\n>>>>> Check cookie status: Deleted all!\n`);

    return res.redirect('/login')
}

const handleAddCategoryParent = async (req, res) => {
    const { categoryParentName } = req.body
    const id = uuidv4()

    console.log(
        `
        \n>>>>> Check category parent: \nName: ${categoryParentName}\nID: ${id}
        `
    )

    await pool.execute(
        `insert into categories_parent (id, name)
        values(?, ?)`, [id, categoryParentName]
    )

    return res.redirect('/category')
}

const handleAddCategoryChild = async (req, res) => {
    const { idCategoryParent, categoryChildName } = req.body
    const id = uuidv4()

    console.log(
        `
            \n>>>>> Check add category child:\nID: ${id},\nID category parent: ${idCategoryParent}\nName: ${categoryChildName}\n
        `
    )

    await pool.execute(
        `insert into categories_child (id, id_category_parent, name)
        values (?, ?, ?)`, [id, idCategoryParent, categoryChildName]
    )

    return res.redirect('/category')
}

const handleAddProduct = async (req, res) => {
    const { name, description, price, status, idCategory } = req.body
    const id = uuidv4()
    const createdAt = getTimeNow()
    const updatedAt = createdAt
    var imageName = ''

    const upload = multer().single('image_product')
    upload(req, res, async function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(`Error 1: ${err}`);
        }
        else if (err) {
            return res.send(`Error 2: ${err}`);
        }
        imageName = await req.file.filename
    });
    // =============== handle upload file ===================

    setTimeout(() => {
        console.log(
            `
                \n>>>>> Check add product:\nName: ${name}\nDes: ${description}\nPrice: ${price}vnd\nStatus: ${status}\nId category: ${idCategory}\nID: ${id}\nCreatedAt: ${createdAt}\nUpdated at: ${updatedAt}\nImage name: ${imageName}\n
            `
        )

        // ================= handle upload to firebase ========================
        const filePath
            = `C:\\Users\\FPT\\Desktop\\MyProject\\Project_React_Native\\Food_App\\Server\\src\\public\\images\\${imageName}`
        storage.upload(filePath, {
            destination: `image_product/${imageName}` // => đây là đường dẫn tới folder ảnh trên firebase
        }).then(() => {
            // ================ handle get to http image ======================
            const file = storage.file(`image_product/${imageName}`)
            file.getSignedUrl({
                action: 'read',
                expires: '03-17-2150'
            })
                .then(async (url) => {
                    console.log(`\n>>>>>Check url image after upload to firebase: ${url[0]}\n`);
                    await pool.execute(
                        `insert into foods (id, name, category_id, description, price, image, created_at, updated_at, status)
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [id, name, idCategory, description, price, url[0], createdAt, updatedAt, status]
                    )

                    return res.redirect('/product')
                })
                .catch((err) => {
                    console.log(err);
                    return res.redirect('/')
                })
            // ================ handle get to http image ======================
        }).catch((err) => {
            console.log(err);
            return res.redirect('/')
        })
        // ================= handle upload to firebase ========================
    }, 2000);
}

export {
    getLoginScreen,
    getSignUpScreen,
    getHomeScreen,
    handleSignUp,
    handleLogin,
    handleLogOut,
    getCategoryScreen,
    handleAddCategoryParent,
    handleAddCategoryChild,
    getCategoriesParent,
    getCategoriesChild,
    getProductScreen,
    handleAddProduct
}
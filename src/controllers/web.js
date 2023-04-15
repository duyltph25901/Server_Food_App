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

const getDetailsProductScreen = async (req, res) => {
    const id = req.params.id

    console.log(
        `
            \n>>>>> Check id food from params: ${id}\n
        `
    )

    const food = await pool.execute(
        `select foods.*, 
        categories_child.name as categoryChild , 
        categories_parent.name as categoryParent
        from foods 
        inner join categories_child on foods.category_id = categories_child.id
        inner join categories_parent on categories_child.id_category_parent = categories_parent.id
        where foods.id = ?`, [id]
    )

    console.log(
        `
            \n>>>>> Check object food found by id: ${JSON.stringify(food[0][0])}\n
        `
    )

    return res.render('DetailsProductSceen', { data: food[0][0] })
}

const getUpdateProductScreen = async (req, res) => {
    const id = req.params.id

    const foods = await pool.execute(
        `select * from foods where id = ?`, [id]
    )
    const [rows, fields] = await pool.execute(
        `select * from categories_child`
    )

    return res.render('UpdateProductScreen.ejs', {
        food: foods[0][0],
        categories: rows,
    })
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
    const { name, description, price, status, idCategory, discount } = req.body
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
                \n>>>>> Check add product:\nName: ${name}\nDes: ${description}\nPrice: ${price}vnd\nStatus: ${status}\nId category: ${idCategory}\nID: ${id}\nCreatedAt: ${createdAt}\nUpdated at: ${updatedAt}\nImage name: ${imageName}\nDiscount: ${discount}\n
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
                        `insert into foods (id, name, category_id, description, price, image, created_at, updated_at, status, discount)
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [id, name, idCategory, description, price, url[0], createdAt, updatedAt, status, discount]
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

const handleUpdateProduct = async (req, res) => {
    const { name, description, price, discount, imageLink, status, idCategory, id, createdAt } = req.body
    const lastUpdate = getTimeNow()
    var imageName = ''
    let isImageUploadNull = true

    const upload = multer().single('image_product')
    upload(req, res, async function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError)
        }
        else if (!req.file) { // image upload null => user not update image
            imageName = imageLink
            isImageUploadNull = true
        }
        else if (err instanceof multer.MulterError) {
            return res.send(`Error 1: ${err}`)
        }
        else if (err) {
            return res.send(`Error 2: ${err}`)
        } else { // true case => user update image
            imageName = await req.file.filename
            isImageUploadNull = false
        }
    })
    // =============== handle upload file ===================

    setTimeout(async () => {
        if (isImageUploadNull) {

            console.log(
                `\n>>>>> Check req body update food:
                Name: ${name}
                Price: ${price}
                Description: ${description}
                Discount: ${discount}%
                Image link: ${imageLink == imageName}
                Status: ${status}
                ID category: ${idCategory}
                ID: ${id}
                Created at: ${createdAt}
                Last update: ${lastUpdate}\n`
            )

            await pool.execute(
                `update foods
                set name = ?, description = ?, price = ?, discount = ?, image = ?, status = ?, category_id = ?, created_at = ?, updated_at = ?
                where id = ?`,
                [name, description, price, discount, imageLink, status, idCategory, createdAt, lastUpdate, id]
            )

            return res.redirect('/')
        }

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
                    console.log(
                        `\n>>>>> Check req body update food:
                        Name: ${name}
                        Price: ${price}
                        Description: ${description}
                        Discount: ${discount}%
                        Image link new: ${url[0]}
                        Status: ${status}
                        ID category: ${idCategory}
                        ID: ${id}
                        Created at: ${createdAt}
                        Last update: ${lastUpdate}\n`
                    )
                    await pool.execute(
                        `update foods
                        set name = ?, description = ?, price = ?, discount = ?, image = ?, status = ?, category_id = ?, created_at = ?, updated_at = ?
                        where id = ?`, [name, description, price, discount, url[0], status, idCategory, createdAt, lastUpdate, id]
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
    }, 2000)
}

const handleSearchProductByName = async (req, res) => {
    const { keyProductName } = req.body

    console.log(
        `\n>>>>> Check key product name: ${keyProductName}\n`
    )

    const query = `select * from foods where name like '%${keyProductName}%'`

    const [foods] = await pool.execute(query)

    console.log(
        `
        \n>>>>> Check key product found: ${JSON.stringify(foods)}\n
        `
    )

    return res.render('HomeScreen', { data: foods })
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
    handleAddProduct,
    getDetailsProductScreen,
    getUpdateProductScreen,
    handleUpdateProduct,
    handleSearchProductByName
}
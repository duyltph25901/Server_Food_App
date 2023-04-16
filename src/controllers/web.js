import { v4 as uuidv4 } from 'uuid'
import getTimeNow from '../functions/getTimeNow'
import { pool } from '../configs/index'
import { storage } from '../configs/firebase'
import multer from 'multer'
import { setTimeout } from 'timers'
import { validateEmail, validatePhoneNumber, validatePassword } from '../public/js/validate'

var previousUrl = ''

const getLoginScreen = (req, res) => {
    return res.render('LoginScreen.ejs', { error: false })
}

const getSignUpScreen = (req, res) => {
    const oldInput = {
        email: '',
        userName: '',
        password: '',
        phoneNumber: ''
    }

    return res.render('SignUpScreen.ejs', {
        error: false,
        inputOld: oldInput
    })
}

const getHomeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const userCurrent = await req.cookies.userCurrent

    console.log(
        `
            \n>>>>> Check userCurrent cookie: ${userCurrent}
        `
    )

    const [rows, fields] = await pool.execute(
        `select * from foods where discount = 0 limit 30`
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
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select * from categories_parent`
    )

    return res.render('CategoriesParent.ejs', { data: rows })
}

const getCategoriesChild = async (req, res) => {
    previousUrl = req.originalUrl
    const page = parseInt(req.query.page) || 1
    var perPage = 5
    var start = (page - 1) * perPage
    var end = page * perPage

    const [rows, fields] = await pool.execute(
        `
            select categories_child.id,
            categories_child.name, 
            categories_parent.name as categoryParentName
            from categories_child
            join categories_parent on categories_parent.id = categories_child.id_category_parent 
        `
    )

    // return res.render('CategoriesChild.ejs', { data: rows.slice(start, end) })
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

const getSaleProductScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select * from foods where discount > 0`
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getRiceScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Cơm']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getVegetarianRice = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Cơm chay']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getNoodleScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Mì']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getFastFoodScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Đồ ăn nhanh']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getSmoothieScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Sinh tố']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getCarbonatedWarterScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Nước có gas']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getCoffeeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Cà phê']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getMilkTeaScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Trà sữa']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getCupCakeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Cupcake']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getTartCakeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Tart']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getChoxCakeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Su kem']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getCustardCakeScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Bông lan']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getBreadScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Bánh mì']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getDriedBeef = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Khô bò']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getDriedChicken = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Khô gà']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getRicePaper = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Bánh tráng']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getSpicySnacks = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Que cay']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getSnack = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select foods.*,
        categories_child.name as CategoryName
        from foods
        inner join categories_child on categories_child.id = foods.category_id 
        where categories_child.name = ?`, ['Snack']
    )

    return res.render('SaleProductScreen', { data: rows })
}

const getAllUserScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select * from users where role = 0`
    )

    return res.render('UserScreen', { data: rows })
}

const getAllAdminScreen = async (req, res) => {
    previousUrl = req.originalUrl
    const [rows, fields] = await pool.execute(
        `select * from users where role = 1`
    )

    return res.render('AdminsScreen', { data: rows })
}

const getUserDetailsScreen = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id user details: ${id}\n
        `
    )

    const [user] = await pool.execute(
        `select * from users where id = ?`, [id]
    )

    console.log(
        `
        \n>>>>> Check user found details: ${JSON.stringify(user[0])}
        `
    )

    return res.render('DetailsUserScreen', { data: user[0] })
}

const getUpdateUserScreen = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id user update: ${id}\n
        `
    )

    const [user] = await pool.execute(`select * from users where id = ?`, [id])

    console.log(
        `
        \n>>>>> Check user found after update: ${JSON.stringify(user[0])}
        `
    )

    return res.render('UpdateUserScreen', { data: user[0] })
}

const getUpdateCategoryParentScreen = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id category parent udpate: ${id}\n
        `
    )

    const [category] = await pool.execute(`select * from categories_parent where id = ?`, [id])

    console.log(
        `
        \n>>>>> Check category udpate found by id: ${JSON.stringify(category[0])}\n
        `
    )

    return res.render('UpdateCategoryParent', { data: category[0] })
}

const getUpdateCategoryChildScreen = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id update category child: ${id}\n
        `
    )

    const [categoryChild] = await pool.execute(
        `select * from categories_child where id = ?`, [id]
    )
    const [categoryParent] = await pool.execute(
        `select * from categories_parent`
    )

    console.log(
        `
        \n>>>>> Check category update found by id: ${id}\n
        `
    )

    return res.render('UpdateCategoryChildScreen', {
        data: categoryChild[0],
        categoriesParent: categoryParent
    })
}

const getConfirmDeleteProductScreen = async (req, res) => {
    const id = req.params.id
    const [rows, fields] = await pool.execute(`select * from foods limit 30`)
    const [food] = await pool.execute(`select * from foods where id = ?`, [id])

    return res.render('ConfirmDeleteProductScreen', {
        data: rows,
        objectCurrent: food[0]
    })
}

const getConfirmDeleteCategoryChildScreen = async (req, res) => {
    const id = req.params.id

    const [category] = await pool.execute(`select * from categories_child where id = ?`, [id])
    const [rows, fields] = await pool.execute(
        `
            select categories_child.id,
            categories_child.name, 
            categories_parent.name as categoryParentName
            from categories_child
            join categories_parent on categories_parent.id = categories_child.id_category_parent 
        `
    )

    return res.render('ConfirmDeleteCategoryChildScreen', { objectCurrent: category[0], data: rows })
}

const getConfirmDeleteCategoryParentScreen = async (req, res) => {
    const id = req.params.id

    const [objectCurrent] = await pool.execute(`select * from categories_parent where id = ?`, [id])
    const [rows, fields] = await pool.execute(`select * from categories_parent`)

    return res.render('ConfirmDeleteCategoryParentScreen', { data: rows, objectCurrent: objectCurrent[0] })
}

const getConfirmDeleteUserScreen = async (req, res) => {
    const id = req.params.id
    const [user] = await pool.execute(`select * from users where id = ?`, [id])
    const [rows, fields] = await pool.execute(`select * from users where role = 0`)

    return res.render('confirmDeleteUserScreen', { data: rows, objectCurrent: user[0] })
}

const getConfirmDeleteAdminScreen = async (req, res) => {
    const id = req.params.id
    const [user] = await pool.execute(`select * from users where id = ?`, [id])
    const [rows, fields] = await pool.execute(`select * from users where role = 1`)

    return res.render('confirmDeleteUserScreen', { data: rows, objectCurrent: user[0] })
}

const handleSignUp = async (req, res) => {
    const { email, userName, password, phoneNumber } = req.body
    const id = uuidv4()
    const avatarDefault = 'https://firebasestorage.googleapis.com/v0/b/food-app-24bf2.appspot.com/o/avatar_user%2Favatar_default.JPEG?alt=media&token=780593e5-add2-4334-b6c0-f1b024dbecb0'
    const role = 0
    const createdAt = getTimeNow()
    const updateAt = createdAt

    // tìm kiếm email tạo mới đã có trong db chưa
    const [users] = await pool.execute(
        `select email from users where email = ?`, [email]
    )
    // tìm kiếm số điện thoại tạo mới đã có trong db chưa
    const [phoneNumberFound] = await pool.execute(`select phoneNumber from users where phoneNumber = ?`, [phoneNumber])

    console.log(
        `
            \n>>>>> Check user found by email: ${JSON.stringify(users[0])}\n
        `
    )

    console.log(
        `
            \n>>>>> Check phone number found: ${JSON.stringify(phoneNumberFound[0])}\n
        `
    )

    // giữ lại data input cũ để khi reload lại trang người dùng không cần nhập lại từ đầu
    const oldInput = {
        email: email,
        userName: userName,
        password: password,
        phoneNumber: phoneNumber
    }

    if (users[0]) {
        return res.render('SignUpScreen.ejs', {
            error: true,
            errorMessage: 'Tài khoản email này đã tồn tại trong hệ thống!',
            inputOld: oldInput
        })
    } if (!validateEmail(email)) {
        return res.render('SignUpScreen.ejs', {
            error: true,
            errorMessage: 'Email không đúng định dạng!',
            inputOld: oldInput
        })
    } if (!validatePassword(password)) {
        return res.render('SignUpScreen.ejs', {
            error: true,
            errorMessage: 'Mật khẩu phải chứa tối thiểu 6 kí tự bao gồm cả chữ cái viết hoa, viết thường và kí tự đặc biệt!',
            inputOld: oldInput
        })
    } if (phoneNumberFound[0]) {
        return res.render('SignUpScreen.ejs', {
            error: true,
            errorMessage: 'Số điện thoại này đã được đăng kí trước đó!',
            inputOld: oldInput
        })
    } if (!validatePhoneNumber(phoneNumber)) {
        return res.render('SignUpScreen.ejs', {
            error: true,
            errorMessage: 'Số điện thoại không đúng định dạng!',
            inputOld: oldInput
        })
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

    // clear all cookie before
    const cookies = req.cookies
    for (const cookieName in cookies) {
        res.clearCookie(cookieName)
    }

    console.log(`\n>>>>> Check cookie status: Deleted all!\n`);

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
                `\n>>>>> Check req body update food (case user not update image):
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
            destination: `image_product_update/${imageName}` // => đây là đường dẫn tới folder ảnh trên firebase
        }).then(() => {
            // ================ handle get to http image ======================
            const file = storage.file(`image_product_update/${imageName}`)
            file.getSignedUrl({
                action: 'read',
                expires: '03-17-2150'
            })
                .then(async (url) => {
                    console.log(
                        `\n>>>>> Check req body update food (case user update image):
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

const handleDeleteCategoryParent = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id category parent delete: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from categories_parent where id = ?`, [id])
        return res.redirect(previousUrl)
    } catch (err) {
        return res.send(err)
    }
}

const handleDeleteCategoryChild = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id category parent delete: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from categories_child where id = ?`, [id])
        return res.redirect(previousUrl)
    } catch (err) {
        return res.send(err)
    }
}

const handleSearchUserByName = async (req, res) => {
    const { keyUserName } = req.body

    console.log(
        `
        \n>>>>> Check key user name search: ${keyUserName}\n
        `
    )

    const sql = `select * from users where username like '%${keyUserName}%'`
    const [users] = await pool.execute(sql)

    console.log(
        `
        >>>>> Check users found: ${JSON.stringify(users)}\n
        `
    );

    if (keyUserName) {
        return res.render('ResultFoundUserScreen', { data: users })
    }

    return res.redirect('/user')
}

const handleDeleteUserById = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id user delete: ${id}\n
        `
    )

    try {
        await pool.execute(
            `delete from users where id = ?`, [id]
        )

        return res.redirect(previousUrl)
    } catch (err) {
        return res.send(err)
    }
}

const handleUpdateUserById = async (req, res) => {
    const { imageOld, email, userName, pass, phoneNumber, createdAt, role, id } = req.body
    const updatedAt = getTimeNow()
    var imageName = ''
    let isImageUploadNull = true

    const upload = multer().single('image_user')
    upload(req, res, async function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError)
        }
        else if (!req.file) { // image upload null => user not update image
            imageName = imageOld
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
        // user not update image
        if (isImageUploadNull) {

            console.log(
                `\n>>>>> Check req body update user (case user not update image):
                User name: ${userName}
                Email: ${email}
                Link image old: ${imageOld}
                Password: ${pass}%
                Image link: ${imageOld == imageName}
                Phone number: ${phoneNumber}
                ID: ${id}
                Role: ${role}
                Created at: ${createdAt}
                Last update: ${updatedAt}\n`
            )

            await pool.execute(
                `update users
                set userName = ?, email = ?, image = ?, password = ?, phoneNumber = ?, role = ?, created_at = ?, updated_at = ? where id = ?`,
                [userName, email, imageOld, pass, phoneNumber, role, createdAt, updatedAt, id]
            )

            return res.redirect('/user')
        }

        // user update image
        // ================= handle upload to firebase ========================
        const filePath
            = `C:\\Users\\FPT\\Desktop\\MyProject\\Project_React_Native\\Food_App\\Server\\src\\public\\images\\${imageName}`
        storage.upload(filePath, {
            destination: `avatar_user_update/${imageName}` // => đây là đường dẫn tới folder ảnh trên firebase
        }).then(() => {
            // ================ handle get to http image ======================
            const file = storage.file(`avatar_user_update/${imageName}`)
            file.getSignedUrl({
                action: 'read',
                expires: '03-17-2150'
            })
                .then(async (url) => {
                    console.log(
                        `\n>>>>> Check req body update user (case user update image):
                        User name: ${userName}
                        Email: ${email}
                        Link image old: ${imageOld}
                        Password: ${pass}%
                        New image link: ${url[0]}
                        Phone number: ${phoneNumber}
                        ID: ${id}
                        Role: ${role}
                        Created at: ${createdAt}
                        Last update: ${updatedAt}\n`
                    )
                    await pool.execute(
                        `update users
                        set userName = ?, email = ?, image = ?, password = ?, phoneNumber = ?, role = ?, created_at = ?, updated_at = ? where id = ?`,
                        [userName, email, url[0], pass, phoneNumber, role, createdAt, updatedAt, id]
                    )

                    return res.redirect('/user')
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

const handleUpdateCategoryParent = async (req, res) => {
    const { categoryParentName, id } = req.body

    console.log(
        `
        \n>>>>> Check body category parent update:
        Category parent name: ${categoryParentName}
        ID: ${id}
        `
    )

    await pool.execute(
        `update categories_parent set name = ? where id = ?`, [categoryParentName, id]
    )

    return res.redirect('/categories-parent')
}

const handleUpdateCategoryChild = async (req, res) => {
    const { categoryChildName, idCategoryParent, id } = req.body

    console.log(
        `
        \n>>>>> Check body update category child:
        Category child name: ${categoryChildName}
        ID category parent: ${idCategoryParent}
        ID: ${id}\n
        `
    )

    await pool.execute(
        `update categories_child set name = ?, id_category_parent = ? where id = ?`, [categoryChildName, idCategoryParent, id]
    )

    return res.redirect('/categories-child')
}

const handleDeleteProduct = async (req, res) => {
    const id = req.params.id

    console.log(
        `
        \n>>>>> Check id product delete: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from foods where id = ?`, [id])

        return res.redirect(previousUrl)
    } catch (err) {
        return res.send(err)
    }
}

const handleCancelDelete = async (req, res) => {
    res.redirect(previousUrl)
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
    handleSearchProductByName,
    getSaleProductScreen,
    getRiceScreen,
    getVegetarianRice,
    getNoodleScreen,
    getFastFoodScreen,
    getSmoothieScreen,
    getCarbonatedWarterScreen,
    getCoffeeScreen,
    getMilkTeaScreen,
    getBreadScreen,
    getCustardCakeScreen,
    getChoxCakeScreen,
    getCupCakeScreen,
    getTartCakeScreen,
    getDriedBeef,
    getDriedChicken,
    getRicePaper,
    getSpicySnacks,
    getSnack,
    handleDeleteCategoryParent,
    handleDeleteCategoryChild,
    getAllUserScreen,
    getAllAdminScreen,
    handleSearchUserByName,
    getUserDetailsScreen,
    handleDeleteUserById,
    getUpdateUserScreen,
    handleUpdateUserById,
    getUpdateCategoryParentScreen,
    handleUpdateCategoryParent,
    getUpdateCategoryChildScreen,
    handleUpdateCategoryChild,
    getConfirmDeleteProductScreen,
    handleDeleteProduct,
    handleCancelDelete,
    getConfirmDeleteCategoryChildScreen,
    getConfirmDeleteCategoryParentScreen,
    getConfirmDeleteUserScreen,
    getConfirmDeleteAdminScreen
}
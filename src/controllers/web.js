const getLoginScreen = (req, res) => {
    return res.render('LoginScreen.ejs')
}

const getSignUpScreen = (req, res) => {
    return res.render('SignUpScreen.ejs')
}

const getHomePage = (req, res) => {
    return res.render('HomeScreen.ejs')
}

export {
    getLoginScreen,
    getSignUpScreen,
    getHomePage
}
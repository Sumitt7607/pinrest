const loadAuth = (req, res) => {
    res.render('register');
}

const successGoogleLogin = (req , res) => { 
	if(!req.user) 
		res.redirect('/failure'); 
    console.log(req.user);
	res.render("feed"); 
}

const failureGoogleLogin = (req , res) => { 
	res.render("login"); 
}

module.exports = {
    loadAuth,
    successGoogleLogin,
    failureGoogleLogin
}
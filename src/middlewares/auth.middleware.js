function isUser(req, res, next) {
    if (req.session?.user?.email) {
      return next();
    } 
    return res.status(401).render('error', { error: 'Authentication Error! You must be logged in to access this page.', style:'error404.css',
    title:'Authorization error'}); 
  }
  
function isAdmin (req, res, next) {
    let session = req.session.user 
    if (req.session?.user?.rol === 'Admin') {
      return next();
    }
    return res.status(403).render('error', { error: 'Authorization error! You must have Administrator permissions to access this page.', style:'error404.css',
    title:'Authorization error', session:session, User:req.session.user });
  }
  function isAdminPrimium(req, res, next) {
    let session = req.session.user 
    if (req.session?.user?.rol === 'Admin' || req.session?.user?.rol === 'Premium') {
      return next();
    }
    return res.status(403).render('error', { error: 'Authorization error! You must have Administrator permissions or be a Premium user to access this page.', style:'error404.css',
    title:'Authorization error', session:session, User:req.session.user });
  }
  function isUserPrimium(req, res, next) {
    let session = req.session.user 
    if (req.session?.user?.rol != 'Admin') {
      return next();
    }
    return res.status(403).render('error', { error: 'Authorization error! You must have a User or Premium role to access this page.', style:'error404.css',
    title:'Authorization error', session:session, User:req.session.user });
  }
  function goToLogin(req, res, next){
    if (req.session?.user?.email) {
      return next();
    }
    return res.status(401).render('login', { });
  }

  module.exports = { isUser,isAdmin,isAdminPrimium,isUserPrimium,goToLogin }
const getGithubCallBack = (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
}

module.exports = {
  getGithubCallBack 
}

 
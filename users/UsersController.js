const express = require('express');
const router = express.Router();
const User = require('./User');
const bCrypt = require('bcrypt');
const adminAuth = require('../middlewares/adminAuth');

router.get('admin/user/new', (req, res) => {
    res.render('./admin/user/create');
});

router.post('/admin/user/save', adminAuth, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const salt = bCrypt.genSaltSync(10);
    const hash = bCrypt.hashSync(password, salt);

    User
    .findOne({ where: { email: email } })
    .then((user) => {
        if(user == undefined) {
            User
            .create({ email: email, password: hash })
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => {
                console.error(err);
                res.redirect('/');
            });
        }
        else {
            res.redirect('/admin/user/new');
        }
    })
    .catch((err) => {
        console.error(err);
    });
    
});

router.get('/admin/users/index', adminAuth, (req, res) => {
    User
    .findAll({ attributes: ['id', 'email', 'createdAt', 'updatedAt'] })
    .then((users) => {
        res.render('./admin/user/index', { users: users });
    })
    .catch((err) => {
        console.error(err);
        res.redirect('/');
    });
});

module.exports = router;
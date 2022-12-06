const express = require('express');
const Category = require('./Category');
const sugify = require('slugify');
const slugify = require('slugify');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');

let msg = ''

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('./admin/categories/new', { msg });
});

router.post('/admin/categories/save', (req, res) => {
    let formTitle = req.body.formCatTitle;

    if(formTitle !== '') {
        Category
            .create({
                title: formTitle,
                slug: sugify(formTitle)
            })
            .then(() => {
                res.redirect('/admin/categories');
            });
    }
    else {
        res.status(303).redirect('/admin/categories/new');
        msg = 'Título obrigatório';
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category
        .findAll()
        .then((categories) => {
            res.render('./admin/categories/categories', {categoriesHTML:categories});
        })
        .catch((err) => console.error(err));
});

router.post('/admin/categories/delete', (req, res) => {
    let idForm = req.body.id;

    if(idForm != undefined) {
        if(!isNaN(idForm)) {
            Category
                .destroy({where: {id: idForm}})
                .then(() => {
                    res.redirect('/admin/categories');
                });
        }
        else {
            res.redirect('/admin/categories');
        }
    }
    else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;
    msg = 'Título obrigatório';

    if(isNaN(id)) res.redirect('/admin/categories');

    Category
        .findByPk(id)
        .then((category) => {
            if(category != undefined) {
                res.render('./admin/categories/edit', 
                { categoryForm: category });
            } else {
                res.redirect('/admin/categories');
            }
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/admin/categories');
        });
});

router.post('/admin/categories/update', adminAuth, (req, res) => {
    let idForm = req.body.id;
    let titleForm = req.body.title;
    let slugForm = slugify(titleForm);

    Category.update(
        {title: titleForm, slug: slugForm}, 
        {where: {id: idForm}})
        .then(() => {
            res.redirect('/admin/categories');
        })
        .catch(err => {
            console.error(err);
            res.redirect('/admin/categories');
        });

});

module.exports = router;
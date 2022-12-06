const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('../articles/Article');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article
        .findAll({ include: [{ model: Category, required: true }] })
        .then((articles) => {
            // res.json(articles)
            res.render('./admin/articles/articles', {articles: articles});
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category
        .findAll()
        .then((categories) => {
            res.status(200).render('./admin/articles/new', {categories: categories});
        })
        .catch((err) => {
            res.redirect('/admin/articles/new');
            console.error(err);
        });
});

router.post('/admin/articles/save', adminAuth, (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Article
        .create({
            title: title,
            body: body,
            slug: slugify(title),
            categoryId: category
        })
        .then(() => {
            res.redirect('/admin/articles');
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/admin/articles');
        });
});

router.post('/admin/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article
                .destroy({ where: { id: id } })
                .then(() => {
                    res.redirect('/admin/articles');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else {
            res.redirect('/admin/articles');
        }
    }
    else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) res.redirect('/admin/articles');
    if (id != undefined) {
        Article
            .findByPk(id, { include: [{ model: Category, required: true }] })
            .then((article) => {
                Category
                .findAll()
                .then((categories) => {
                    res.render('./admin/articles/edit', 
                    {
                        article: article,
                        categories: categories
                    });
                }).catch((err) => {
                    console.error(err);
                    res.redirect('/admin/articles');
                });

            })
            .catch((err) => {
                console.error(err);
            });
    }
    else {
        res.redirect('/admin/articles');
    }
});

router.post('/admin/articles/update', adminAuth, (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article
    .update(
    {
        title: title,
        body: body,
        categoryId: category
    }, 
    {
        where: { id: id }
    })
    .then(() => {
        res.redirect('/admin/articles/');
    })
    .catch((err) => {
        console.error(err);
        res.redirect('/admin/articles/');
    });
});

router.get('/articles/page/:num', (req, res) => {
    const pageNumber = req.params.num;
    let offset = 0;
    let limit = 4;

    if (isNaN(pageNumber) || pageNumber == 1) {
        offset = 0;
    }
    else {                //o num da pag. e um array
        offset = parseInt(pageNumber - 1) * limit;
    }

    Article
    .findAndCountAll(
    {
        limit: limit,
        offset: offset,
        order: [ ['id', 'DESC'] ]
    })
    .then((articles) => {
        let next;

        if (offset + limit >= articles.count) {
            next = false;
        }
        else {
            next = true;
        }

        let pagination = 
        {
            next: next,
            articles: articles,
            page: parseInt(pageNumber)
        }
        Category
        .findAll()
        .then((categories) => {
            res.render('pages', 
            {
                pagination: pagination,
                categories: categories
            });
        })
        .catch((err) => {
            console.error(err);
        });
        
    })
    .catch();
});

module.exports = router;
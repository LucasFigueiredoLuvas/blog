// modules import - libs
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

// db and model connection
const dbConnection = require('./database/database');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

// controllers
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');

// auth
const adminAuth = require('./middlewares/adminAuth');

// view engine
app.set('view engine', 'ejs');

// session
app.use(session(
    {
    secret: 'afagalhadalhas',
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true
    }
));

// static files
app.use(express.static('public'));

// forms and jsons
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db connection
dbConnection.
authenticate().
then(() => {
    console.log('DataBase Connected');
}).
catch((err) => {
    console.log(err);
});

// routes

app.get('/', (req, res) => {
    Article
    .findAll({ order: [ ['id', 'DESC'] ], limit: 4 })
    .then((articles) => {
        Category
        .findAll()
        .then((categories) => {
            res
            .status(200)
            .render('index', 
            { 
                articles: articles, 
                categories: categories
            });
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/');
        });
    })
    .catch((err) => {
        console.error(err);
        res.redirect('/');
    });
});

app.get('/articles/:slug', (req, res) => {
    slug = req.params.slug;

    Article
    .findOne({ where: { slug: slug } })
    .then((article) => {
        if (article != undefined) {
            Category
            .findAll()
            .then((categories) => {
                res
                .status(200)
                .render('article', 
                { 
                    article: article,
                    categories: categories
                });
            })
            .catch((err) => {
                console.error(err);
                res.redirect('/');
            });
        }
        else {
            res.redirect('/');
        }
    })
    .catch((err) => {
        console.error(err);
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug;

    Category
    .findOne
        ({
            where: { slug: slug },
            include: [{ model: Article }]
        })
    .then((category) => {
        if (category != undefined) {
            Category
            .findAll()
            .then((categories) => {
                res.render('index', 
                { 
                    articles: category.articles,
                    categories: categories
                })
            }).catch((err) => {
                console.error(err);
                res.render('/');
            });
        }
        else {
            res.render('/');
        }
    })
    .catch((err) => {
        console.error(err);
        res.render('/');
    });
});

app.get('/admin/login', (req, res) => {
    res.render('./admin/user/login');
});

app.post('/admin/auth', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User
    .findOne({ where: { email: email} })
    .then((user) => {
        if(user != undefined) {
            let correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {id: user.id, email: user.email};
                res.render('./admin/user/panel');
            }
            else {
                res.redirect('/admin/login');
            }
        }
        else {
            res.redirect('/admin/login');
        }
    })
    .catch((err) => {
        console.error(err);
        res.redirect('/admin/login');
    });
});

app.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

app.use('/', CategoriesController);
app.use('/', ArticlesController);
app.use('/', UsersController);

// server up
app.listen(8000, (err) => {
    if(err) throw err;
    console.log('Server running *:8000');
});

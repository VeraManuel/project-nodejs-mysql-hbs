const express = require('express');
const router = express.Router();
const { isLogedIn } = require('../lib/auth');

const pool = require('../database');

router.get('/add', isLogedIn, (req, res) => {
    return res.render('links/add');
});

router.post('/add', isLogedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    return res.redirect('/links');
});

router.get('/', isLogedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    return res.render('links/list', { links });
});

router.get('/delete/:id', isLogedIn, async (req, res) => {
    const { id } = req.params;

    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    return res.redirect('/links');
});

router.get('/edit/:id', isLogedIn, async (req, res) => {
    const { id } = req.params;

    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    
    return res.render('links/edit', { link: links[0]});

});

router.post('/edit/:id', isLogedIn, async (req, res) => {
    const  { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('UPDATE links set ? WHERE ID = ?', [newLink,id]);
    req.flash('success', 'Link Edited Successfully');
    return res.redirect('/links');

});


module.exports = router;
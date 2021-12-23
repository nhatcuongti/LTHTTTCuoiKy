import express from 'express'
import accountModel from "../models/account.model.js";
import formatData from '../utils/formatData.js'
import {Login7TokenHandler} from "tedious/lib/token/handler.js";

const router = express();
let generalData;

router.get('/', async function (req, res) {
    res.render('guest/login', {
        layout:false
    });
});

router.post('/', async function (req, res) {
    const account = req.body;
    var dataUser =  await accountModel.checkAccount(account);
    console.log(dataUser);
    if (dataUser === null) {
        console.log("Wrong account");
        var err_message = "Your ID or Password is not valid !!"
        return res.render('guest/login', {
            layout: false,
            err_message
        });
    }
    const type = dataUser.type;

    req.session.typeAccount = type;
    req.session.authUser = req.body.username;
    req.session.auth = true;

    if (type === 'client'){
        req.session.authIDUser = dataUser.MaKH;
        res.redirect('/client')
    }
    else if (type === 'company'){
        req.session.authIDUser = dataUser.MADOANHNGHIEP;
        res.redirect('/company/product');
    }
    else if (type === 'driver'){
        req.session.authIDUser = dataUser.MATX;
        res.redirect('/driver/profile');
    }
    else if (type === 'admin')
        res.redirect('/admin')
});

router.get('/register', async function (req, res) {
    res.render('guest/register', {
        layout:false
    });
});

router.post('/register', async function (req, res) {
    const generalInfor = req.body;
    generalData = generalInfor;
    var type = +req.body.typeUser;
    if (type === 1)
        res.redirect("/register/client");
    else if (type === 2)
        res.redirect('/register/partner');
    else
        res.redirect('/register/driver');
})

router.get('/register/client', async function (req, res) {
    res.render('guest/register_client', {
        layout:false
    });
});

router.post('/register/client', async function (req, res) {
    const check = await accountModel.insertAccountClient(generalData, req.body);
    if (!check)
        res.render('guest/register_client', {
            layout:false
        });
    else{
        req.session.typeAccount = 'client';
        req.session.authUser = req.body.username;
        req.session.auth = true;
        res.redirect('/client')
    }
});

router.get('/register/driver', async function (req, res) {
    const rawData = await accountModel.getActivePlace();
    const activePlaces = rawData.recordset;
    res.render('guest/register_driver', {
        layout:false,
        activePlaces
    });
});

router.post('/register/driver', async function (req, res) {
    const check = await accountModel.insertAccountDriver(generalData, req.body);
    if (!check)
        res.render('guest/register_driver', {
            layout:false
        });
    else{
        req.session.typeAccount = 'driver';
        req.session.authUser = req.body.username;
        req.session.auth = true;
        res.redirect('/driver/profile');
    }
});

router.get('/register/partner', async function (req, res) {
    const rawData = await accountModel.getTypeProduct();
    const typeProduct = rawData.recordset;
    console.log(typeProduct);
    res.render('guest/register_partner', {
        layout:false,
        typeProduct
    });
});

router.post('/register/partner', async function (req, res) {
    const check = await accountModel.insertAccountPartner(generalData, req.body);

    if (!check)
        res.render('guest/register_partner', {
            layout:false
        });
    else{
        req.session.typeAccount = 'driver';
        req.session.authUser = req.body.username;
        req.session.auth = true;
        res.redirect('/company/product');
    }
});






export default router;
import express from 'express'
import accountModel from "../models/account.model.js";
import formatData from '../utils/formatData.js'
import driverModel from "../models/driver.model.js";

const router = express();
let generalData;

router.get('/', async function (req, res) {
    res.render('guest/login', {
        layout:false
    });
});

router.post('/', async function (req, res) {
    const account = req.body;
    accountModel.checkAccount(account.username, account.password).then(
        function (data, headers, status){
            if (data.data.docs.length === 0){
                console.log("Wrong account");
                var err_message = "Your ID or Password is not valid !!"
                return res.render('guest/login', {
                    layout: false,
                    err_message
                });
            }

            const userData = data.data.docs[0];
            console.log(userData);

            req.session.typeAccount = userData.type;
            req.session.authUser = req.body.Username;
            req.session.auth = true;
            req.session.status = true;

            if (userData.type === 'client'){
                req.session.authIDUser = userData['_id'];
                res.redirect('/client')
            }
            else if (userData.type === 'store'){
                req.session.authIDUser = userData['_id'];
                res.redirect('/company/product');
            }
            else {
                req.session.authIDUser = userData['_id'];
                req.session.activePlace = "Binh Phuoc"
                res.redirect('/driver');
            }


        },
        function (err){
            console.log(err);
        }
    )
    // if (dataUser === null) {
    //     console.log("Wrong account");
    //     var err_message = "Your ID or Password is not valid !!"
    //     return res.render('guest/login', {
    //         layout: false,
    //         err_message
    //     });
    // }
    // else if (!dataUser.status){
    //     var err_message = "Your account is locked !!"
    //     return res.render('guest/login', {
    //         layout: false,
    //         err_message
    //     });
    // }
    // const type = dataUser.type;
    // req.session.typeAccount = type;
    // req.session.authUser = req.body.username;
    // req.session.auth = true;
    // req.session.status = dataUser.status;
    //
    // if (type === 'client'){
    //
    //     req.session.authIDUser = dataUser.MaKH;
    //     res.redirect('/client')
    // }
    // else if (type === 'company'){
    //     req.session.authIDUser = dataUser.MADOANHNGHIEP;
    //     res.redirect('/company/product');
    // }
    // else if (type === 'driver'){
    //     req.session.authIDUser = dataUser.MATX;
    //
    //     const driverInfor = await driverModel.getDriverWithID(dataUser.MATX);
    //     console.log(driverInfor);
    //     req.session.activePlace = driverInfor.KHUVUCHD;
    //     console.log("Khu vuc hoat dong : " + req.session.activePlace )
    //
    //     res.redirect('/driver');
    // }
    // else if (type === 'admin')
    //     res.redirect('/admin')
    // else{
    //     res.redirect('/staff');
    // }
});

// router.get('/register', async function (req, res) {
//     res.render('guest/register', {
//         layout:false
//     });
// });
//
// router.post('/register', async function (req, res) {
//     const generalInfor = req.body;
//     generalData = generalInfor;
//     var type = +req.body.typeUser;
//     if (type === 1)
//         res.redirect("/register/client");
//     else if (type === 2)
//         res.redirect('/register/partner');
//     else
//         res.redirect('/register/driver');
// })
//
// router.get('/register/client', async function (req, res) {
//     res.render('guest/register_client', {
//         layout:false
//     });
// });
//
// router.post('/register/client', async function (req, res) {
//     const check = await accountModel.insertAccountClient(generalData, req.body);
//     if (!check)
//         res.render('guest/register_client', {
//             layout:false
//         });
//     else{
//         req.session.typeAccount = 'client';
//         req.session.authUser = req.body.username;
//         req.session.auth = true;
//         res.redirect('/client')
//     }
// });
//
// router.get('/register/driver', async function (req, res) {
//     const rawData = await accountModel.getActivePlace();
//     const activePlaces = rawData.recordset;
//     res.render('guest/register_driver', {
//         layout:false,
//         activePlaces
//     });
// });
//
// router.post('/register/driver', async function (req, res) {
//     const check = await accountModel.insertAccountDriver(generalData, req.body);
//     if (!check)
//         res.render('guest/register_driver', {
//             layout:false
//         });
//     else{
//         req.session.typeAccount = 'driver';
//         req.session.authUser = req.body.username;
//         req.session.auth = true;
//         res.redirect('/driver');
//     }
// });
//
// router.get('/register/partner', async function (req, res) {
//     const rawData = await accountModel.getTypeProduct();
//     const typeProduct = rawData.recordset;
//     console.log(typeProduct);
//     res.render('guest/register_partner', {
//         layout:false,
//         typeProduct
//     });
// });
//
// router.post('/register/partner', async function (req, res) {
//     console.log(req.body);
//     const check = await accountModel.insertAccountPartner(generalData, req.body);
//
//     if (!check)
//         res.render('guest/register_partner', {
//             layout:false
//         });
//     else{
//         req.session.typeAccount = 'driver';
//         req.session.authUser = req.body.username;
//         req.session.auth = true;
//         res.redirect('/company/product');
//     }
// });

export default router;
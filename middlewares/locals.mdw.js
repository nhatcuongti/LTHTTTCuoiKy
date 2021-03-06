export default function (app) {
  app.use(async function (req, res, next) {
    res.locals.isManageUser = false;
    res.locals.isManageTypeProduct = false;
    res.locals.isManagePlaces = false;

    //Staff
    res.locals.StaffProfile = false;

    //Driver
    res.locals.MyOrder = false;
    res.locals.Delivery = false;
    res.locals.Revenue = false;
    next();
  });

  app.use(async function (req, res, next) {

    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    if (typeof (req.session.cart) === 'undefined'){
      req.session.cart = [];
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
  });
}
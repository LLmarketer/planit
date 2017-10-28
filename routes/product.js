const express  = require('express');
const Product = require('../models/product');
const PROTYPES     = require('../models/campaign-pro-types');
const TYPES    = require('../models/campaign-types');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
const moment = require('moment');
const multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });
//var request = require("request"),
//  csv = require("csv");

// this is the code the customer gets when visiting /new
router.get('/new', (req,res) => {
res.render('products/new', {types: PROTYPES});
});

//below we check if the user is logged in
// and posting the product info to the database

router.post('/', ensureLoggedIn('/login'), upload.single('picture'),(req,res,next) =>{
	const newProduct = new Product ({
		name: req.body.name,
		picture: `${req.file.filename}`,
		sku: req.body.sku,
		cat: req.body.cat,
		price: req.body.price,
		_creator: req.user._id
});
newProduct.save( (err) => {
if (err) {
	console.log('ERROR!!!!!!!!', err);
	res.render('products/new', { product: newProduct, types: PROTYPES });
} else {
	res.redirect(`/products/${newProduct._id}`);
}
});
});

// show the product action gets the campaign id
router.get('/:id', (req,res,next) => {
Product.findById(req.params.id,(err,product) => {
if (err)  {return next(err)}
if (!product)  {return next(new Error("404"))}
return res.render('products/show', {product});
});
});

//PRODUCT EDIT ACTION
//get to the user the edit page
router.get('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
  Product.findById(req.params.id, (err, product) => {
    if (err)       { return next(err) }
    if (!product) { return next(new Error("404")) }
    return res.render('products/edit', { product, types: PROTYPES })
  });
});

//edit action


router.post('/:id', upload.single('picture'),  (req, res, next ) => {
	Product.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			cat: req.body.cat,
			sku: req.body.sku,
			price: req.body.price,
			picture: req.file.filename
		},
		(err, product) => {
			if (err) { return next(err); }

			return res.redirect(`/products/${product._id}`);
		}
	);
});

//Bulk upload action - starts
//get
// var request = require("request"),
//     csv = require("csv");
//
// module.exports = function(app) {
//     // accepts the POST form submit of the CSV file
//     app.post("/uploads/data", function(req, res) {
//         // the name under "files" must correspond to the name of the
//         // file input field in the submitted form (here: "csvdata")
//         csv().from.path(req.files.csvdata.path, {
//             delimiter: ",",
//             escape: '"'
//         })
//         // when a record is found in the CSV file (a row)
//         .on("record", function(row, index) {
//             var firstName, lastName;
//
//             // skip the header row
//             if (index === 0) {
//                 return;
//             }
//
//             // read in the data from the row
//             name = row[0].trim();
//             picture = row[1].trim();
// 						sku = row[2].trim();
// 						cat = row[3].trim();
// 						price = row[4].trim();
// 						_creator = row[5].trim();
//             // perform some operation with the data
//             // ...
//         })
//         // when the end of the CSV document is reached
//         .on("end", function() {
//             // redirect back to the root
//             res.redirect("/");
//         })
//         // if any errors occur
//         .on("error", function(error) {
//             console.log(error.message);
//         });
//     });
// };


//end bulk upload action


//starts  campaign delete action
router.post('/:id/delete', (req, res, next) => {
  //const campaignId = req.params.id;
  Product.findByIdAndRemove(req.params.id, (err, product) => {
  if (err){ return next(err); }
  return res.redirect('/products/new');
  });
});




module.exports = router;

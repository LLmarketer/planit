const express  = require('express');
const Campaign = require('../models/campaign');
const TYPES    = require('../models/campaign-types');
const Product  = require ('../models/product');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
const moment = require('moment');
const mongoose = require('mongoose');


//this is the code the customer gets when when visinting /new
router.get('/new', (req,res) => {
  Product.find({}, function(err, product){
    res.render('campaigns/new', {types: TYPES, products: product} );
  });
});


// we're checking the user is logged in
//and posting the camapign info to the db
router.post('/', ensureLoggedIn('/login'), (req, res, next) => {
console.log('eetstes', req.body.product);
  const newCampaign = new Campaign({
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    products: req.body.product,
    percentage: req.body.percentage,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
    _creator: req.user._id
  });


      newCampaign.save( (err) => {
      if (err) {
        res.render('campaigns/new', { campaign: newCampaign, types: TYPES });
      } else {
        res.redirect(`/campaigns/${newCampaign._id}`);
      }
    });
    });

//end form post

//gets the campaign + id
router.get('/:id', (req,res,next) => {
  Campaign.findById(req.params.id).populate('_creator').populate('products').exec((err, campaign) => {
    if (err || !campaign){ return next(new Error("404")); }
    console.log(campaign);
    res.render('campaigns/show', { campaign });
  });
});





//start edit action
//get to the user the edit page


router.get('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err)       { return next(err) }
    if (!campaign) { return next(new Error("404")) }
    Product.find({}, function(err, product){
        return res.render('campaigns/edit', { campaign, types: TYPES, products: product });
      });
    });
  });

//post the edit
router.post('/:id', ensureLoggedIn('/login'), (req, res, next) => {
  Campaign.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      goal: req.body.goal,
      description: req.body.description,
      category: req.body.category,
      deadline: req.body.deadline,
    },
    (err, campaign) => {
    if (err) { return next(err); }
    console.log("HERE: ", req.body.products);
    //req.body.products.forEach(function(x){
      //console.log("CURRENT X = ", x);
      //campaign.products.push(mongoose.Types.ObjectId(x));
    //})
    console.log(campaign);

    return res.redirect(`/campaigns/${campaign._id}`);
  }
);
});
//end edit action

//starts  campaign delete action
router.post('/:id/delete', (req, res, next) => {
  //const campaignId = req.params.id;
  Campaign.findByIdAndRemove(req.params.id, (err, campaign) => {
  if (err){ return next(err); }
  return res.redirect('/campaigns/new');
  });
});
//ends campaign delete action

//start campaign data fetch by month
router.get('/:year/:month',(req,res,next)=>{
  var searchParams = {};
  var di = moment('2017-10-01', "YYYY-MM-DD").toArray();
  var de = moment('2017-10-30', "YYYY-MM-DD").toArray();
    searchParams['startdate'] = {
    $gte: new Date(di[0],di[1],di[2]),
    $lte:  new Date(de[0],de[1],de[2]) };

  Campaign.find(searchParams).exec(function(err, campaign) {
       console.log('result')
       res.render('campaigns/summary', { campaign });
       if (err)return console.log('err',err);

     });
});


module.exports = router;

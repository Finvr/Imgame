var Reviews = require ('../models/reviewsModel.js');
    helpers = require ('../utils/helpers.js');

module.exports = {
	
	findOrCreateReview: function (req, res){
		console.log("findOrCreateReview: ", req.body);
		var review = req.body;
    review.reviewer_id = req.user.id;
    review.reviewee_id = req.body.user_id
    // review.gamepost_id = parseInt(req.url.split('/')[2]);
    // review.rating = req.body.rating;
    // review.showed_up = req.body.showed_up;
		Reviews.findOrCreateReview(review)
      .then(function (data) {
      	console.log('test',data)
        res.send(data);
      })
      .catch(function (err) {
      	console.log('catch')
        helpers.handleError(err, res)
      })
	}
}

 //module.exports.findOrCreateReview();
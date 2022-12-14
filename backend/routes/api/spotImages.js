const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, SpotImage, User,Booking, Review,ReviewImage, sequelize } = require('../../db/models');


//Delete a spot Image 

router.delete('/:imageId',requireAuth, async(req, res)=> {
    const image = await SpotImage.findOne({
        where: {
            id: req.params.imageId
        }
    })

    if (!image) {
        {
            res.status(404)
            res.json(
                {
                    "message": "Spot Image couldn't be found",
                    "statusCode": 404
                }
            )
        }
        return
    }

    //console.log(image);

    const spot = await Spot.findOne({
        where: {
            id: image.spotId
        }
    })

    const userId = req.user.id;
    if (spot.ownerId !== userId){
        res.status(403)
        res.json(
            {
                "message": "User does not own the corresponding spot",
                "statusCode": 403
            }
        )
        return;
    }

    await image.destroy()
    res.status(200)
    res.json(
        {
            "message": "Successfully deleted",
            "statusCode": 200
          }
    )
})













module.exports = router;
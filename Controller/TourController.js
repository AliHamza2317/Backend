const tour = require("../Models/tourSchema");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dj1safmih',
  api_key: '625184533391514',
  api_secret: '11OIiafi90Sfl4OKWGOf48JcSuE'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'public',
    allowed_formats: ['png', 'jpeg', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage }).array('image', 5);

const addtour = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      return res.status(400).json({
        status: 'FAILED',
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      // An unknown error occurred during file upload
      return res.status(500).json({
        status: 'FAILED',
        message: 'Unknown error during file upload: ' + err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'No images in the request'
      });
    }

    const { tour_id, tour_name, description, destination, price, departure_date, duration_days } = req.body;
    const imageUrls = req.files.map(file => file.path);

    tour.findOne({ tour_id: tour_id })
      .then(existingTour => {
        if (existingTour) {
          return res.status(400).json({
            status: 'FAILED',
            message: 'Tour ID already exists. Please choose a different ID.'
          });
        } else {
          const newTour = new tour({
            tour_id,
            tour_name,
            description,
            destination,
            image: imageUrls,
            price,
            departure_date,
            duration_days
          });

          newTour.save()
            .then(() => {
              res.status(200).json({
                status: 'SUCCESS',
                message: 'Tour added successfully.'
              });
            })
            .catch(err => {
              res.status(500).json({
                status: 'FAILED',
                message: 'Tour not added. Error: ' + err.message
              });
            });
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'FAILED',
          message: 'Error checking tour ID. ' + err.message
        });
      });
  });
};

const updateTour = (req, res) => {
  upload(req, res, function (err) {
    // Handle multer upload errors

    const { tour_name, description, destination, price, departure_date, duration_days, tour_id } = req.body;

    tour.findOne({ tour_id: tour_id })
      .then(existingTour => {
        if (!existingTour) {
          return res.status(404).json({
            status: "FAILED",
            message: "Tour not found. Cannot update non-existent tour."
          });
        } else {
          // Update only the provided fields
          if (tour_name) {
            existingTour.tour_name = tour_name;
          }
          if (description) {
            existingTour.description = description;
          }
          if (destination) {
            existingTour.destination = destination;
          }
          if (price) {
            existingTour.price = price;
          }
          if (departure_date) {
            existingTour.departure_date = departure_date;
          }
          if (duration_days) {
            existingTour.duration_days = duration_days;
          }

          if (req.files && req.files.length > 0) {
            // Upload images to Cloudinary
            const imageUrls = req.files.map(file => file.path);

            existingTour.image = imageUrls;

            existingTour.save()
              .then(() => res.status(200).json({
                status: "SUCCESS",
                message: "Tour updated successfully."
              }))
              .catch(err => res.status(500).json({
                status: "FAILED",
                message: "Error updating tour. " + err.message
              }));
          } else {
            // No images uploaded, save the tour without modifying the image property
            existingTour.save()
              .then(() => res.status(200).json({
                status: "SUCCESS",
                message: "Tour updated successfully."
              }))
              .catch(err => res.status(500).json({
                status: "FAILED",
                message: "Error updating tour. " + err.message
              }));
          }
        }
      })
      .catch(err => res.status(500).json({
        status: "FAILED",
        message: "Error checking tour ID. " + err.message
      }));
  });
};



const viewtour=async(req,res)=>{
    try {
    
      const tours = await tour.find();
  
      res.send(tours);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
    
  }

  


  const deletetour = (req, res) => {
    const tour_id= req.params.id;
  
    tour.findOneAndDelete({ tour_id: tour_id })
      .then(deletedTour => {
        if (!deletedTour) {
          
          res.status(404).send({
            status: "FAILED",
            message: "Tour not found. Cannot delete non-existent tour."
          });
        } else {
          res.status(200).send({
            status: "SUCCESS",
            message: "Tour deleted successfully."
          });
        }
      })
      .catch(err => res.status(500).send({
        status: "FAILED",
        message: "Error deleting tour. " + err.message
      }));
  };
  


 
  
  


module.exports={
    addtour,
    viewtour,
    deletetour,
    updateTour
   
}





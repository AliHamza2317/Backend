const tour = require("../Models/tourSchema");
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    if (!isValid) {
      return cb(new Error('Invalid image type'), null);
    }
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage: storage }).array('image');

const addtour = (req, res) => {
  uploadOptions(req, res, function (err) {
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
    const fileNames = req.files.map(file => file.filename);
    const basePath = `${req.protocol}://${req.get('host')}/public/`;

    tour.findOne({ tour_id: tour_id })
      .then(existingTour => {
        if (existingTour) {
          return res.status(400).json({
            status: 'FAILED',
            message: 'Tour ID already exists. Please choose a different ID.'
          });
        } else {
          const imagePaths = fileNames.map(fileName => `${basePath}${fileName}`);
          const newTour = new tour({ tour_id, tour_name, description, destination, image: imagePaths, price, departure_date, duration_days });
          newTour.save()
          .then(() => res.status(200).json({
            status: 'SUCCESS',
            message: 'Tour added successfully.'
          }))
          .catch(err => res.status(500).json({
            status: 'FAILED',
            message: 'Tour not added. Error: ' + err.message
          }));
        }
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error checking tour ID. ' + err.message
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
  


  const updateTour = (req, res) => {
    uploadOptions(req, res, function (err) {
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
              // If new images are uploaded, update the image property
              const fileNames = req.files.map(file => file.filename);
              const basePath = `${req.protocol}://${req.get('host')}/public/`;
              const imagePaths = fileNames.map(fileName => `${basePath}${fileName}`);
              existingTour.image = imagePaths;
            }
  
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
        })
        .catch(err => res.status(500).json({
          status: "FAILED",
          message: "Error checking tour ID. " + err.message
        }));
    });
  };
  
  
  
 



module.exports={
    addtour,
    viewtour,
    deletetour,
    updateTour
   
}





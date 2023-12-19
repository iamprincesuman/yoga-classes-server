const enrollmentModel = require('../models/enrollmentModel');
const paymentService = require('../services/paymentService');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    enrollParticipant : (req, res) => {
        // Assuming req.body contains user data (e.g., name, age, batchId)
        // Basic validation
        console.log(req.body);
        let name = req.body.name;
        let age = req.body.age;
        let batchId = req.body.batch;
        if (!name || !age || !batchId) {
            return errorHandler(res, 400, 'Name, age, and batchId are required.');
        }

        // Store data in the database
        const user = {
            name: name,
            age: age,
            batchId: batchId,
        };

        enrollmentModel.enrollParticipant(user, (err, result) => {
            if(err) return errorHandler(res, 500, err);
            // Process payment
            const paymentResult = paymentService.processPayment(user);
            // Send response to the front-end based on payment result
            // console.log(result.insertId);
            if(paymentResult.success) {
                res.status(200).json({
                    success : true,
                    message : `Enrollment succesful!, Your Enrollment ID is ${result.insertId}`
                });
            } else {
                errorHandler(res, 500, 'Payment failed');
            }
        });
    },

    shiftBatch : (req, res) => {
        // Assuming req.params.participantId and req.body.newBatchId are available
        // if we create an account for them as well, then we can use req.params for the request handling
        // instead of user manually entering the Enroll ID.
        
        const participantId = req.body.enrollmentId; 
        const newBatchId = req.body.newBatch;

        // Basic validation
        if (!participantId || !newBatchId) {
            return errorHandler(res, 400, 'Participant ID and new Batch ID are required.');
        }

        // Call the model function to shift the batch
        enrollmentModel.shiftBatch(participantId, newBatchId, (err, result) => {
            if (err) {
                return errorHandler(res, 500, err);
            }
    
            // Send a success response
            res.status(200).json({
                success: true,
                message: 'Batch shifted successfully',
                result: result,
            });
        });
    },

    makeMonthlyPayment: (req, res) => {
        // Assuming req.body.participantId is available
        const participantId = req.body.enrollmentId;
        // Basic validation
        if (!participantId) {
          return errorHandler(res, 400, 'Participant ID is required.');
        }
    
        // Call the model function to make the monthly payment
        enrollmentModel.makeMonthlyPayment(participantId, (err, result) => {
          if (err) {
            return errorHandler(res, 500, err);
          }

          // Send a success response
          res.status(200).json({
            success: true,
            message: 'Monthly payment made successfully',
            result: result,
          });
        });
    },
};
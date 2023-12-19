const db = require('../db/db');

module.exports = {
    enrollParticipant: (user, callback) => {
      
      if (user.age < 18 || user.age > 65) {
        return callback('Invalid age. Participants must be between 18 and 65 years old.');
      }

      // Additional logic: Generate enrollment date and end date for the month
      const currentDate = new Date();
      const enrollmentDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const endDate = lastDateOfMonth.toISOString().split('T')[0];

      
      // Additional logic: Set the participant's batch for the month
      // Participants can choose any batch in a month and can move to any other batch next month.
      // In the same month, they need to be in the same batch.
      const batchId = user.batchId;
      
      // Additional logic: Store data in the database
      const enrollmentData = {
        name: user.name,
        age: user.age,
        batchId: batchId,
        enrollmentDate: enrollmentDate,
        endDate: endDate,
      };

      const sql = 'INSERT INTO participants SET ?';
      db.query(sql, enrollmentData, (err, result) => {
        if (err) {
          return callback(err);
        }
        
        // Additional logic: Update payment table
        const paymentData = {
          participantId: result.insertId,
          paymentDate: enrollmentDate, // Assuming payment is made on the enrollment date
          amount: 500, // Monthly fee
        };
        const paymentSql = 'INSERT INTO payments SET ?';
        db.query(paymentSql, paymentData, (paymentErr, paymentResult) => {
          if (paymentErr) {
            return callback(paymentErr);
          }
          callback(null, result);
        });
      });
    },

    
    shiftBatch: (participantId, newBatchId, callback) => {
      // Additional logic: Get current enrollment details
      // console.log(participantId + " | " + newBatchId);
      const getCurrentEnrollmentSql =
        'SELECT * FROM participants WHERE participantId = ? ORDER BY enrollmentDate DESC LIMIT 1';
      db.query(getCurrentEnrollmentSql, [participantId], (err, currentEnrollment) => {
        if (err) {
          return callback(err);
        }
        // console.log(currentEnrollment);
        // Additional logic: Check if there is a current enrollment
        if (currentEnrollment.length === 0) {
          return callback('Participant not found or not enrolled.');
        }
  
        const currentBatchId = currentEnrollment[0].BatchID;
        const currentEndDate = currentEnrollment[0].EndDate.toISOString().split('T')[0];

        // Additional logic: Check if the participant is trying to shift batches in the same month
        if (currentEndDate >= new Date().toISOString().split('T')[0]) {
          return callback('Participants must remain in the same batch for the current month.');
        }
        
        const currentDate = new Date();
        const enrollmentDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const endDate = lastDateOfMonth.toISOString().split('T')[0];
  
        // Additional logic: Update participant_batches table for the new batch
        const shiftBatchData = {
          // participantId: participantId,
          batchId: newBatchId,
          enrollmentDate: new Date().toISOString().split('T')[0],
          endDate : endDate
        };
        
        // const shiftBatchSql = 'INSERT INTO participants SET ?';
        const shiftBatchSql = 'UPDATE participants SET ? WHERE participantId = ?';
        db.query(shiftBatchSql, [shiftBatchData, participantId], (shiftBatchErr, shiftBatchResult) => {
          if (shiftBatchErr) {
            console.log(shiftBatchErr);
            return callback(shiftBatchErr);
          }
  
          callback(null, shiftBatchResult);
        });
      });
    },

    makeMonthlyPayment: (participantId, callback) => {
      // Additional logic: Get current enrollment details
      
      const getCurrentEnrollmentSql =
        'SELECT * FROM participants WHERE participantId = ? ORDER BY enrollmentDate DESC LIMIT 1';
      db.query(getCurrentEnrollmentSql, [participantId], (err, currentEnrollment) => {
        if (err) {
          return callback(err);
        }
  
        // Additional logic: Check if there is a current enrollment
        if (currentEnrollment.length === 0) {
          return callback('Participant not found or not enrolled.');
        }
  
        const enrollmentDate = currentEnrollment[0].EnrollmentDate;
        const currentEndDate = currentEnrollment[0].EndDate.toISOString().split('T')[0];

        // Additional logic: Check if the participant has already made a payment for the current month
        if(currentEndDate >= new Date().toISOString().split('T')[0]) {
          return callback('Payment for the current month has already been made');
        } else {
          // Additional logic: Make the monthly payment
          const monthlyPaymentData = {
            participantId: participantId,
            paymentDate: enrollmentDate,
            amount: 500, // Monthly fee
          };
          const monthlyPaymentSql = 'INSERT INTO payments SET ?';
          db.query(monthlyPaymentSql, monthlyPaymentData, (monthlyPaymentErr, monthlyPaymentResult) => {
            if (monthlyPaymentErr) {
              return callback(monthlyPaymentErr);
            }
            callback(null, monthlyPaymentResult);
          });
        }
      });
    },
};
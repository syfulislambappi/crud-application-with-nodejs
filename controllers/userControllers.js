// Dependencies
const fs = require("fs");

// Data file path
const dataPath = `${__dirname}/../data/data.json`;

// Get all users
module.exports.getAllUsers = (req, res) => {
  // Get url query
  const { limit } = req.query;
  // Read data
  fs.readFile(dataPath, (err, data) => {
    const parsedData = JSON.parse(data);
    // Validation
    if (!err && data && !limit) {
      res.status(200).send(parsedData);
    } else if (!!limit) {
      const limitedUsers = parsedData.filter(
        (_, index) => index < Number(limit)
      );
      res.status(200).send(limitedUsers);
    } else {
      res.status(500).json({ message: "Internal Server Error." });
    }
  });
};

// Get random user
module.exports.getRandomUser = (_, res) => {
  fs.readFile(dataPath, (err, data) => {
    const parsedData = JSON.parse(data);
    // Validation
    if (!err && data) {
      const randomuserIndex = Math.floor(Math.random() * parsedData.length);

      res.status(200).send(parsedData[randomuserIndex]);
    } else {
      res.status(500).json({ message: "Internal Server Error." });
    }
  });
};

// Save user
module.exports.saveUser = (req, res) => {
  const user = req.body;
  const { gender, contact, address, photoUrl } = user;
  const validation = !!gender && !!contact && !!address && !!photoUrl;
  // Validation
  if (validation) {
    fs.readFile(dataPath, (err, data) => {
      if (!err && data) {
        const parsedData = JSON.parse(data);
        const userData = { id: parsedData.length + 1, ...user };
        parsedData.push(userData);
        fs.writeFile(dataPath, JSON.stringify(parsedData), (err) => {
          if (!err) {
            res.status(200).send(userData);
          } else {
            res.status(500).json({ message: "Internal Server Error." });
          }
        });
      } else {
        res.status(500).json({ message: "Internal Server Error." });
      }
    });
  } else {
    res.status(400).json({ message: "All inputs are not given." });
  }
};

// Update single user
module.exports.updateSingleUser = (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  fs.readFile(dataPath, (err, data) => {
    const parsedData = JSON.parse(data);
    let desiredData = parsedData.find((user) => user.id === Number(id));
    // Validation
    if (!err && !!desiredData) {
      // Update the user
      desiredData = { ...desiredData, ...userData };
      // Find user index
      let desiredDataIndex = parsedData.findIndex(
        (element) => element.id === Number(id)
      );
      // Update user data file with updated user
      parsedData.splice(desiredDataIndex, 1, desiredData);
      fs.writeFile(dataPath, JSON.stringify(parsedData), (err) => {
        if (!err) {
          res.status(200).json({ message: "User is updated successfully" });
        } else {
          res.status(500).json({ message: "Internal Server Error." });
        }
      });
    } else {
      res.status(404).json({ message: `Can't find user with the id.` });
    }
  });
};

// Update multiple user
module.exports.updateMultipleUsers = (req, res) => {
  // Get data from client
  const users = req.body;
  // Read data
  fs.readFile(dataPath, (err, data) => {
    const parsedData = JSON.parse(data);

    for (user of users) {
      // Validate user
      let desiredData = parsedData.find((element) => element.id === user.id);
      if (!err && !!desiredData) {
        // Update the user
        desiredData = { ...desiredData, ...user };

        // Get user index
        let desiredDataIndex = parsedData.findIndex(
          (element) => element.id === user.id
        );
        // Update the user data with updated user
        parsedData.splice(desiredDataIndex, 1, desiredData);
        fs.writeFile(dataPath, JSON.stringify(parsedData), (err) => {
          if (!err) {
            res
              .status(200)
              .json({ message: "Users are updated successfully." });
          } else {
            res.status(500).json({ message: "Internal Server Error." });
          }
        });
      } else {
        res.status(500).json({ message: `Can't find user with the id.` });
      }
    }
  });
};

// Delete user
module.exports.deleteUser = (req, res) => {
  const { id } = req.params;

  fs.readFile(dataPath, (err, data) => {
    const parsedData = JSON.parse(data);
    // Get user index
    const desiredDataIndex = parsedData.findIndex(
      (element) => element.id === Number(id)
    );
    // Validation
    if (err || desiredDataIndex === -1) {
      res.status(404).json({ message: "User is not found." });
    } else {
      // Delete user
      parsedData.splice(desiredDataIndex, 1);
      // Update user file after delete
      fs.writeFile(dataPath, JSON.stringify(parsedData), (err) => {
        if (!err) {
          res.status(200).json({ message: "User is successfully deleted." });
        } else {
          res.status(500).json({ message: "Internal Server Error." });
        }
      });
    }
  });
};

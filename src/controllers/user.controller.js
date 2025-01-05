import ConnectionRequest from '../models/connectionRequest.js';

// Get all the pending connection requests for the logged in user
export const requests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', [
      'firstName',
      'lastName',
      'photoUrl',
      'age',
      'gender',
      'about',
      'skills',
    ]);
    return res.status(200).json({
      message: 'Data fetched successfully !',
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(400).send('ERROR : ' + err.message);
  }
};

import ConnectionRequest from '../models/connectionRequest.js';

const USER_SAFE_DATA = [
  'firstName',
  'lastName',
  'photoUrl',
  'age',
  'gender',
  'about',
  'skills',
];

// Get all the pending connection requests for the logged in user
export const requests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    return res.status(200).json({
      message: 'Data fetched successfully !',
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(400).send('ERROR : ' + err.message);
  }
};

export const connections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(400).send('ERROR : ' + err.message);
  }
};

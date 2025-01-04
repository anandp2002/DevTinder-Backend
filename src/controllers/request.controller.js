import ConnectionRequest from '../models/connectionRequest.js';
import User from '../models/User.js';

export const sendStatus = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: 'Invalid status type : ' + status });
    }

    // Check whether toUserId exist in DB or not
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: 'User not found !' });
    }

    //Check If there is an exising connectionRequest
    const exisingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (exisingConnectionRequest) {
      return res
        .status(400)
        .json({ message: 'Connection request already exists !' });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message:
        status === 'interested'
          ? `${req.user.firstName} is interested in ${toUser.firstName} !`
          : `${req.user.firstName} ignored ${toUser.firstName} !`,
      data,
    });
  } catch (err) {
    return res.status(400).send('ERROR : ' + err.message);
  }
};

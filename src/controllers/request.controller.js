export const sendConnectionRequest = async (req, res) => {
  const user = req.user;
  console.log('Sending connection request');
  res.status(200).send(user.firstName + ' sent a connection request !');
};

const jwt = require('jsonwebtoken')
const User = require('../../Models/users.model')

exports.httpLogin = async (req, res) => {
  
    const {email, password} = req.body
    const user = await User.findOne({email})

    if (!user)
    {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // const isMatch = await user.comparePassword(password);
    
    // if (!isMatch) {
    //     return res.status(401).json({ message: 'Invalid password' });
    // }

    const token = jwt.sign({ id: user._id, email: user.email, role: 'User' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token: token })

}

exports.httpRegister = async (req, res) => {
    // Get the email and password from the request body
  const { email, password, name } = req.body;

  // Check if the email is already taken
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email is already taken' });
  }

  // Create a new user in the database
  const user = new User({ email, password, name });
  await user.save();

  // Return a success message as a JSON response
  res.status(200).json({ message: 'User created successfully' });

}


exports.httpUpdateProfile = async (req, res) => {
  const {name, email, imageUrl} = req.body

  const user = await User.updateOne(
      {email: req.email}, 
      {name: name, email: email, imageUrl: imageUrl}, 
      {upsert: false}
      )

  if (!user){
      return res.status(401).json({error: 'Profile is not updated'})
  }
  return res.status(200).json(user)
}

exports.httpGetProfile = async (req, res) => {
  const user = await User.findOne({email: req.email})
  return res.status(200).json(user)
}
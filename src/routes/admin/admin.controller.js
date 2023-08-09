const jwt = require('jsonwebtoken')
const Admin = require('../../Models/admin.model')
const Dermatologist = require('../../Models/dermatologist.model')

exports.httpLogin = async (req, res) => {
  
    const {email, password} = req.body
    const user = await Admin.findOne({email})

    const isMatch = await user.comparePassword(password);
    
    if (!user || !isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    //res.json({ token })
    return res.status(200).json({ token: token })

}

exports.httpRegister = async (req, res) => {
    // Get the email and password from the request body
  const { email, password, name } = req.body;

  // Check if the email is already taken
  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email is already taken' });
  }

  // Create a new user in the database
  const user = new Admin({ email, password, name });
  await user.save();

  // Return a success message as a JSON response
  res.json({ message: 'User created successfully' });

}


exports.httpUpdateProfile = async (req, res) => {
  const {name, email, imageUrl} = req.body

  const user = await Admin.updateOne(
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
  const user = await Admin.findOne({email: req.email})
  return res.status(200).json(user)
}

exports.httpAddDermatologist = async (req, res) => {
  const { email, name, gender, phoneNumber, description } = req.body;
  const existingDermatologist = await Dermatologist.findOne({ email });

    if (existingDermatologist) {
      return res.status(400).json({ message: 'Dermatologist with the same email already exists' });
    }


    const newDermatologist = new Dermatologist({
      email,
      name,
      gender,
      phoneNumber,
      description,
    });

    await newDermatologist.save();
    

    res.status(200).json({ message: 'Dermatologist added successfully' });
}

exports.httpGetDermatologists = async (req, res) => {
  const dermatologists = await Dermatologist.find();
  res.status(200).json(dermatologists);
}

exports.httpGetDermatologistById = async (req, res) => {
  const dermatologistId = req.params.id;
  const dermatologist = await Dermatologist.findById(dermatologistId);

    if (!dermatologist) {
      return res.status(404).json({ message: 'Dermatologist not found' });
    }

    res.status(200).json(dermatologist);
}

exports.httpUpdateDermatologistById = async (req, res) => {
  const { email, name, gender, phoneNumber, description, imageUrl, status } = req.body;
  console.log(status)
  let actualStatus
  if (status == 'true'){
    actualStatus = true;
  }
  else{
    actualStatus = false
  }
  console.log(actualStatus)
  const dermatologist = await Dermatologist.updateOne(
    {_id: req.params.id},
    {
      email: email, 
      name: name, 
      gender: gender, 
      phoneNumber: phoneNumber, 
      description: description, 
      imageUrl: imageUrl,
      status: actualStatus
    },
    {
      upsert: false
    }
  )
  if (!dermatologist){
    return res.status(401).json({error: 'Profile is not updated'})
}
return res.status(200).json(dermatologist)
}

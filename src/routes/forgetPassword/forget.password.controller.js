const Otp = require('../../Models/otp.model')
const User = require('../../Models/users.model')
const Admin = require('../../Models/admin.model')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')


exports.httpForgetPassword = async (req, res) => {

    const { email } = req.body

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    let token = await Otp.findOne({ userId: user._id })

    if (token) {
        await token.deleteOne()
    }


    // Generate a random 6-digit OTP
    let resetCode = crypto.randomInt(10000, 100000)

    // Save the OTP to the user's document in the database
    const otp = new Otp({ code: resetCode.toString(), userId: user._id })
    await otp.save()

    // Send the OTP to the user's email address
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hassammurtaza999@gmail.com',
            pass: 'ngoibbkgpxkqdgov'
        }
    }
    )

    const mailOptions = {
        from: 'hassammurtaza999@gmail.com',
        to: email,
        subject: 'Reset your password',
        text: `Your otp is ${resetCode}. Please enter this code in the reset password form`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to send OTP' })
        }
        res.status(200).json({ id: user._id, email: user.email })
    })

}

exports.httpCheckToken = async (req, res) => {
    const { code, id } = req.body
    const otp = await Otp.findOne({ userId: id })
    if (!otp) {
        return res.status(401).json({ error: "Invalid or expired password reset token" })
    }
    console.log(1)
    const isMatch = await bcrypt.compare(code, otp.code)
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid or expired password reset token" })
    }
    console.log(2)
    res.status(200).json({ message: "Otp is valid, you can reset password", id: id })
}

exports.httpResetPassword = async (req, res) => {
    const { id, password } = req.body

    const user = await User.updateOne(
        { _id: id },
        { password: password },
        { upsert: false }
    )
    if (!user) {
        return res.status(401).json({ error: 'Password is not updated' })
    }
    return res.status(200).json(user)
}

// Admin

exports.httpForgetPasswordAdmin = async (req, res) => {

    const { email } = req.body

    const admin = await Admin.findOne({ email });

    if (!admin) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    let token = await Otp.findOne({ userId: admin._id })

    if (token) {
        await token.deleteOne()
    }


    // Generate a random 6-digit OTP
    let resetCode = crypto.randomInt(10000, 100000)

    // Save the OTP to the user's document in the database
    const otp = new Otp({ code: resetCode.toString(), userId: admin._id })
    await otp.save()

    // Send the OTP to the user's email address
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hassammurtaza999@gmail.com',
            pass: 'ngoibbkgpxkqdgov'
        }
    }
    )

    const mailOptions = {
        from: 'hassammurtaza999@gmail.com',
        to: email,
        subject: 'Reset your password',
        text: `Your otp is ${resetCode}. Please enter this code in the reset password form`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to send OTP' })
        }
        res.status(200).json({ id: admin._id, email: admin.email })
    })

}

exports.httpResetPasswordAdmin = async (req, res) => {
    const { id, password } = req.body


    const admin = await Admin.findOne({ _id: id });
    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }
    admin.password = password;
    await admin.save();
    return res.status(200).json(admin)
}
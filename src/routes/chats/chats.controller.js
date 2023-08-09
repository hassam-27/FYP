const ChatMessage = require('../../Models/chatMessage.model')
const ChatRoom = require('../../Models/chatRoom.model')
const mongoose = require('mongoose');

exports.httpInitiateChat = async (req, res) => {

    try {
        const availableRoom = await ChatRoom.findOne({
            usersIds: req.body.users
        })

        if (availableRoom) {
            return res.status(200).json({ existingChatRoomId: availableRoom._id })
        }

        const newRoom = await ChatRoom.create({ usersIds: req.body.users })

        return res.status(200).json({ newRoomId: newRoom._id })
    }
    catch (error) {
        return res.status(500).json({ error: 'Server Error' })
    }

}

exports.httpGetChatMessages = async (req, res) => {

    const chatRoomId = req.params.chatRoomId
    try {
        const messages = await ChatMessage.find({ chatRoom: chatRoomId }).sort('createdAt')
        return res.status(200).json(messages)
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }

}

exports.httpGetAllChats = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId)
    try {
        const chatRooms = await ChatRoom.aggregate([
            {
                $match: {
                    usersIds: { $all: [userId] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'usersIds',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'usersIds',
                    foreignField: '_id',
                    as: 'recievers',
                },
            },
            
            {
                $project: {
                    _id: 1,
                    users: {
                        $map: {
                            input: '$users',
                            as: 'user',
                            in: {
                                _id: '$$user._id',
                                name: '$$user.name',
                                imageUrl: '$$user.imageUrl',
                            },
                        },
                    },
                    recievers: {
                        $map: {
                            input: '$recievers',
                            as: 'admin',
                            in: {
                                _id: '$$admin._id',
                                name: '$$admin.name',
                                imageUrl: '$$admin.imageUrl',
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'chatmessages',
                    localField: '_id',
                    foreignField: 'chatRoom',
                    as: 'latestMessage',
                },
            },
            {
                $addFields: {
                    latestMessage: {
                        $let: {
                            vars: {
                                latest: { $arrayElemAt: ['$latestMessage', -1] },
                            },
                            in: {
                                $mergeObjects: ['$$latest', {}],
                            },
                        },
                    },
                },
            },
            {
                $sort: { 'latestMessage.createdAt': -1 },
            },
            {
                $group: {
                    _id: '$_id',
                    users: { $first: '$users' },
                    recievers: { $first: '$recievers' },
                    latestMessage: { $first: '$latestMessage' },
                },
            },
            {
                $project: {
                    _id: 1,
                    users: {
                        $map: {
                            input: '$users',
                            as: 'user',
                            in: {
                                id: '$$user._id',
                                name: '$$user.name',
                                imageUrl: '$$user.imageUrl',
                            },
                        },
                    },
                    recievers: {
                        $map: {
                            input: '$recievers',
                            as: 'admin',
                            in: {
                                id: '$$admin._id',
                                name: '$$admin.name',
                                imageUrl: '$$admin.imageUrl',
                            },
                        },
                    },
                    latestMessage: {
                        content: 1,
                        sender: 1,
                        imageUrl: 1,
                    },
                },
            },
        ])

        return res.status(200).json(chatRooms)
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: err })
    }

}

// exports.httpGetAllChats = async (req, res) => {
//     const userId = new mongoose.Types.ObjectId(req.params.userId)
//     try {
//         const chatRooms = await ChatRoom.aggregate([
//             {
//                 $match: {
//                     usersIds: { $all: [userId] }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'usersIds',
//                     foreignField: '_id',
//                     as: 'users',
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'admins',
//                     localField: 'usersIds',
//                     foreignField: '_id',
//                     as: 'admins',
//                 },
//             },
            
//             {
//                 $project: {
//                     _id: 1,
//                     users: {
//                         $map: {
//                             input: '$users',
//                             as: 'user',
//                             in: {
//                                 _id: '$$user._id',
//                                 name: '$$user.name',
//                                 imageUrl: '$$user.imageUrl',
//                             },
//                         },
//                     },
//                     admins: {
//                         $map: {
//                             input: '$admins',
//                             as: 'admin',
//                             in: {
//                                 _id: '$$admin._id',
//                                 name: '$$admin.name',
//                                 imageUrl: '$$admin.imageUrl',
//                             },
//                         },
//                     },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'chatmessages',
//                     localField: '_id',
//                     foreignField: 'chatRoom',
//                     as: 'latestMessage',
//                 },
//             },
//             {
//                 $addFields: {
//                     latestMessage: {
//                         $let: {
//                             vars: {
//                                 latest: { $arrayElemAt: ['$latestMessage', -1] },
//                             },
//                             in: {
//                                 $mergeObjects: ['$$latest', {}],
//                             },
//                         },
//                     },
//                 },
//             },
//             {
//                 $sort: { 'latestMessage.createdAt': -1 },
//             },
//             {
//                 $group: {
//                     _id: '$_id',
//                     users: { $first: '$users' },
//                     admins: { $first: '$admins' },
//                     latestMessage: { $first: '$latestMessage' },
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     users: {
//                         $map: {
//                             input: '$users',
//                             as: 'user',
//                             in: {
//                                 name: '$$user.name',
//                                 imageUrl: '$$user.imageUrl',
//                             },
//                         },
//                     },
//                     admins: {
//                         $map: {
//                             input: '$admins',
//                             as: 'admin',
//                             in: {
//                                 name: '$$admin.name',
//                                 imageUrl: '$$admin.imageUrl',
//                             },
//                         },
//                     },
//                     latestMessage: {
//                         content: 1,
//                         sender: 1,
//                         imageUrl: 1,
//                     },
//                 },
//             },
//         ])

//         return res.status(200).json(chatRooms)
//     }
//     catch (err) {
//         console.error(err)
//         return res.status(500).json({ message: err })
//     }

// }
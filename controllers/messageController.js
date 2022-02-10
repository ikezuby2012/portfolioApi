const Message = require("../models/messageModel");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAllMessages = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Message.find(), req.query)
        .filter().sort().limitFields().paginate();
    const messages = await features.query;

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: messages
    });
});

exports.sendMessage = catchAsync(async (req, res, next) => {

    const newMessage = await Message.create(req.body);

    if (!newMessage) {
        return next(new AppError("message not found", 400));
    }

    res.status(201).json({
        status: "success",
        message: newMessage
    })
});

exports.getMessage = catchAsync(async (req, res, next) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new AppError("message not found", 404));
    }

    res.status(200).json({
        status: "success",
        message
    })
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
        return next(new AppError("No message found with that Id", 404));
    }
    res.status(204).json({
        status: "successful",
        data: null
    })
});

exports.updateMessage = catchAsync(async (req, res, next) => {

});
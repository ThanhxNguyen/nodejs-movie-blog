var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, require: true},
    createdAt: { type: Date, default: Date.now },
    movieId: Number,
    subComments: [{
        content: String,
        createdAt: {type: Date, default: Date.now},
        postedBy: String
    }],
});

module.exports = mongoose.model('Comment', commentSchema);

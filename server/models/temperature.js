var mongoose = require('mongoose');

var Temperature = mongoose.model('Temperature', {
  timestamp: {
    type: String,
    required: true
  },
  temperature: {
    type: String,
    required: true
  }
});

// var Todo = mongoose.model('Todo',{
//   text: {
//     type: String,
//     required: true,
//     minLength: 1,
//     trin: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   }
// });

module.exports = {
  Temperature
};

// var newTodo = new Todo({
//   text: 'Cook lunch'
// });
//
// newTodo.save().then((doc)=>{
//   console.log(doc);
// }, (err)=>{
//   console.log(err);
// });

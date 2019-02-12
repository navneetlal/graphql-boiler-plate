const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const user = (creatorId) => {
  return User.findById(creatorId).then(user => {
    return { ...user._doc, _id:user.id, createdEvents: event.bind(this,user._doc.createdEvents) }
  }).catch(err => {
    throw err
  })
}

const event = events => {
  return events.map(eventId => {
    return Event.findById(eventId).then(event => {
      return { ...event._doc, _id:event.id, creator: user.bind(this,event._doc.creator) }
    }).catch(err => {
      throw err
    })
  })
}

module.exports = {
  events: () => {
    return Event.find().then(result => {
      return result.map(result => {
        return { ...result._doc, _id: result.id, creator: user.bind(this,result._doc.creator) }
      })
    }).catch(err => {
      throw err;
    })
  },
  createEvents: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5c6282903814123e4d162ab7'
    })
    let createdEvent = {};
    return event.save().then(result => {
      createdEvent = {...result._doc, _id: result.id};
      return User.findById('5c6282903814123e4d162ab7')
    }).then(user => {
      if (!user) {
        throw new Error('User Does not Exist')
      }
      user.createdEvents.push(event);
      return user.save()
    }).then(result => {
      console.log(result)
      return createdEvent;
    }).catch(err => {
      console.log(err)
      throw err;
    })
  },
  createUser: args => {
    return User.findOne({ email: args.userInput.email }).then(user => {
      if (user) {
        throw new Error('User account already exist');
      }
      return bcrypt.hash(args.userInput.password, 12)
    }).then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        })
        return user.save()
      }).then(result => {
        return { ...result._doc, password: null, _id: result.id, createdEvents: event.bind(this,result._doc.createdEvents) }
      }).catch(err => {
        throw err
      })
  }
}
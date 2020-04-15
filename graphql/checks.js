
// mongoose
const mongoose = require('mongoose');

// valid book names
const allowedNames = ['moby', 'moby-dick', 'moby_dick', 'alice', 'alice-in-wonderland', 'alice_in_wonderland'];

function checkArgs(args) {
  // book must be avail if passed
  if (args.book && args.book.length > 0 && allowedNames.indexOf(args.book) < 0) {
    throw new GraphQLError ("Book name argument must be valid and available");
  };
  // id must be right format if passed
  if (args._id && !mongoose.Types.ObjectId.isValid(args._id)) {
    throw new GraphQLError ("ID argument name must be a valid Mongoose ObjectId");
  };
  // count must be right format if passed (INT)
  if (args.count && (!Number.isInteger(args.count) || args.count < 1)) {
    throw new GraphQLError ("Count argument name must be a positive Integer");
  };
  // random must be right format if passed (BOOL)
  if (args.random && typeof args.random !== "boolean") {
    throw new GraphQLError ("Random argument name must be a Boolean");
  };

  return true;
}

module.exports = checkArgs;

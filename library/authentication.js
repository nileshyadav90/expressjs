const user = require("../models/user");
const md5 = require("md5");
const admin = require('firebase-admin');

exports.createUser = async (data) => {
  try {
    
    let a = (Math.floor(Math.random() * 90000) + 10000).toString(36).substring(0, 5);
    let d = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      salt: a,
      mobile: data.mobile.replace(/[^0-9]/g, ""),
      password: md5(a + data.password),
    };
    let r = new user(d);
    await r.save();
    return r;
  } catch (e) {
    console.log(e);
    if(e.toString().includes('duplicate') && e.toString().includes('email')) throw 'Account with your email already exists'; 
    if(e.toString().includes('duplicate') && e.toString().includes('mobile')) throw 'Account with your mobile already exists'; 
    throw e;
  }
};

exports.loginUser = async (data, skipPassword = false) => {
  return new Promise((resolve, reject) => {
    user
      .findOne({
        email: data.email,
      })
      .select("+password")
      .then((user, err) => {
        console.log("nil============>", err, user, data);
        if (err) reject(err);
        if (user === null) reject("User not found");
        if (
          skipPassword === false &&
          user.password != md5(user.salt + data.password)
        )
          reject("Incorrect login details");
        if (
          skipPassword === true ||
          user.password === md5(user.salt + data.password)
        ) {
          user.password = undefined;
          admin
            .firestore()
            .collection("tokens")
            .add({
              userInfo: { id: user._id.toString(), email: user.email },
              createdAt: new Date().valueOf(),
              lastUsedAt: new Date().valueOf(),
            })
            .then((fireData) => {
              console.log(
                "hello nl",
                fireData._path.segments[1] + "/" + user._id
              );
              resolve({
                token: fireData._path.segments[1] + "/" + user._id,
                user: user,
              });
            })
            .catch((err) => reject(err));
        }
      });
  });
}
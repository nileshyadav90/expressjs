const user = require("../models/user");
const md5 = require("md5");
const admin = require("firebase-admin");
const agoraPassword = "Ny@1990";
const fetch = require("node-fetch");
const generateUniqueAccountName = (proposedName) => {
  return user
    .findOne({ username: proposedName })
    .then(function (account) {
      if (account) {
        console.log('no can do try again: ' + proposedName);
        proposedName += Math.floor((Math.random() * 100) + 1);
        return generateUniqueAccountName(proposedName); // <== return statement here
      }
      console.log('proposed name is unique: ' + proposedName);
      return proposedName;
    })
    .catch(function (err) {
      console.error(err);
      throw err;
    });
}

exports.createUser = async (data) => {
  try {
    let a = (Math.floor(Math.random() * 90000) + 10000)
      .toString(36)
      .substring(0, 5);
    let d = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      salt: a,
      password: md5(a + data.password),
      username: await generateUniqueAccountName(data.firstname.toLowerCase().substring(0, 10))
    };
    if(data?.mobile) {
      d.mobile = data.mobile.replace(/[^0-9]/g, "");
    }
    let r = new user(d);
    await r.save();
    const tokenData = await generateToken(r.toJSON());
    try {
      
      const agoraPayload = {username: d.username, password: d.username + agoraPassword};
      const agoraResponse = await fetch("https://a61.chat.agora.io/61323458/400245/users", {
        body: JSON.stringify(agoraPayload),
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 007eJxTYNBwbfaunrn3aNhfD5PT6nfqz175ffhx3cOoTTr9zm6WtwwUGEzNkizTUiwtjVLNjE0STQwSzQ3N04zTzE3MjEySDSxMcmzmpDYEMjI0X5vNwsjAysDIwMQA4jMwAAD0aB7w"
        }
      });
      console.log('asasa------>', agoraResponse.status);
      if(agoraResponse.status == 200) {
        const agoraData = await agoraResponse.json();
        r.agoraResponse = agoraData;
        await r.save();
      } else {
        throw "Error- Agora failed";
      }
    } catch(e) {
      console.error('Agora error ======>', e.toString());
    }
    return tokenData;
  } catch (e) {
    console.log(e);
    if (e.toString().includes("duplicate") && e.toString().includes("email"))
      throw "Account with your email already exists";
    if (e.toString().includes("duplicate") && e.toString().includes("mobile"))
      throw "Account with your mobile already exists";
    throw e;
  }
};

exports.loginUser = async (data, skipPassword = false) => {
  try {
    const r = await user.findOne({email: data.email});
    if (r === null) reject("User not found");
    if(r.password === md5(r.salt + data.password)) {
      return await generateToken(r.toJSON());
    } else {
      throw "Incorrect login details";
    }
  } catch(e) {
    throw e;
  }
};

const generateToken = async (user) => {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("tokens")
      .add({
        userInfo: { id: user._id.toString(), email: user.email },
        createdAt: new Date().valueOf(),
        lastUsedAt: new Date().valueOf(),
      })
      .then((fireData) => {
        // console.log("hello nl", fireData._path.segments[1] + "/" + user._id);
        resolve({
          token: fireData._path.segments[1] + "/" + user._id,
          user: {...user, mobile: undefined, email: undefined, salt: undefined, password: undefined},
        });
      })
      .catch((err) => reject(err));
  });
};

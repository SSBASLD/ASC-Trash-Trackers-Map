
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Poggywozaz:williamisawesome1@cluster0.ok3bg7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function update(targetId, data) {
  let response = null;
  try {
    await client.connect();
    const db = client.db('asc_trash_trackers_db');
    const maps = db.collection('maps');

    let map;
    if (targetId != "undefined") map = await maps.findOne({_id: new ObjectId(targetId)});
    else map = null;

    if (map == null) {
      await maps.insertOne({
        markerData: data.markerData,
        dateLastModified: data.lastModified,
        dateCreated: data.lastModified
      }).then((dbResponse) => {
        response = dbResponse;
      });
    } else {
      await maps.updateOne({_id: new ObjectId(targetId)}, {$set: {
          markerData: data.markerData,
          dateLastModified: data.lastModified
        }
      }).then((dbResponse) => {
        response = dbResponse;
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return response;
}

async function fetch(targetId) {
  let response = null;
  try {
    await client.connect();
    const db = client.db('asc_trash_trackers_db');
    const maps = db.collection('maps');

    console.log("a");

    if (targetId == "all") {
      let cursor = maps.find();
      response = await cursor.toArray();
    } else {
      response = await maps.findOne({_id: new ObjectId(targetId)});
    }
  } catch(e) {
    console.log("error");
    console.error(e);
  } finally {
    await client.close();
  }
  return response;
}

async function deleteTarget(targetId) {
  let response = null;
  try {
    await client.connect();
    const db = client.db('asc_trash_trackers_db');
    const maps = db.collection('maps');

    await maps.deleteOne({
      _id: new ObjectId(targetId)
    }).then(dbResponse => response = dbResponse);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return response;
}

async function add(time) {
  let response = null;
  try {
    await client.connect();
    const db = client.db('asc_trash_trackers_db');
    const maps = db.collection('maps');

    await maps.insertOne({
      dateCreated: time,
      dateLastModified: time,
      markerData: []
    }).then(dbResponse => response = dbResponse);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return response;
}

exports.update = update;
exports.fetch = fetch;
exports.delete = deleteTarget;
exports.add = add;

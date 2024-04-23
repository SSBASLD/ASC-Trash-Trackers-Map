
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  try {
    await client.connect();
    const db = client.db('asc_trash_trackers_db');
    const maps = db.collection('maps');

    let map = await maps.findOne({_id: targetId});
    if (map == null) {
      await maps.insertOne({
        markerData: data.markerData,
        dateLastModified: data.lastModified,
        dateCreated: data.lastModified
      });
    } else {
      await maps.updateOne({_id: targetId}, {$set: {
          markerData: data.markerData,
          dateLastModified: data.lastModified
        }
      });
    }
  } catch (e) {
    console.error(e);
    await client.close();
  } finally {
    await client.close();
  }
}

exports.update = update;

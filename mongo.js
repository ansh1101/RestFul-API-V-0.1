const { MongoClient } = require('mongodb');


async function main() {
    const uri = 'mongodb+srv://adminadmin:adminadmin@studentsdatabase.l0wmf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await listDatabases(client);
        await createListing(client, {
            _id: 2,
            name: "Sam",
            age: 21,
            address: "127 Walker Park"
        });


    } catch (e) {
        console.log(e);

    } finally {
        await client.close();
    }
}
main().catch(console.error)


async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing) {
    const result = await client.db("studentDB").collection("students").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
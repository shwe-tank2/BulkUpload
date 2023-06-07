const csv=require('csv-parser');
const fs=require('fs');
const MongoClient=require('mongodb').MongoClient;

const mongoUrl='mongodb://localhost:27017';
const databaseName='bulkupload';
const collectionName='part1';

async function bulkUpload(filePaths)
{
    try{
        const client=await MongoClient.connect(mongoUrl);
        const db=client.db(databaseName);
        const collection=db.collection(collectionName);

        for (const filePath of filePaths)
        {
            const fileStream=fs.createReadStream(filePath);
            fileStream
            .pipe(csv()) //begins to pipe data into ReadStream which is now listening to next two events.
            .on('data',(data)=>{
                data.address=JSON.parse(data.address);
                collection.insertOne(data);

            })
            .on('end',()=>{
                console.log('finished uploading ${filePath}');
            })
        
    }
}
    catch(error)
    {
        console.log('error occured while uploading:',error)
    }
}

const filePaths=[
    'users.csv'
]

bulkUpload(filePaths);
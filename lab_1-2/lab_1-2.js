import { MongoClient } from 'mongodb';

async function run() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('lab_1-2');

    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            isEmailVerified: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    await db.createCollection('posts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'title', 'status', 'pet', 'location'],
          properties: {
            userId: { bsonType: 'objectId' },
            title: { bsonType: 'string' },
            description: { bsonType: 'string' },
            status: { bsonType: 'string', enum: ['lost', 'found'] },
            isResolved: { bsonType: 'bool' },
            address: { bsonType: 'string' },
            createdAt: { bsonType: 'date' },
            pet: {
              bsonType: 'object',
              required: ['type'],
              properties: {
                type: {
                  bsonType: 'string',
                  enum: ['dog', 'cat', 'rabbit', 'bird', 'other'],
                },
                breed: { bsonType: 'string' },
                colors: { bsonType: 'array', items: { bsonType: 'string' } },
                size: {
                  bsonType: 'string',
                  enum: ['small', 'medium', 'large'],
                },
              },
            },
            location: {
              bsonType: 'object',
              required: ['type', 'coordinates'],
              properties: {
                type: { bsonType: 'string', enum: ['Point'] },
                coordinates: {
                  bsonType: 'array',
                  items: { bsonType: 'double' },
                },
              },
            },
          },
        },
      },
    });

    const postsCollection = db.collection('posts');
    await postsCollection.createIndex({ status: 1 });
    await postsCollection.createIndex({ 'pet.type': 1 });
    await postsCollection.createIndex({ createdAt: -1 });

    await db.createCollection('verification_codes', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'code', 'expiresAt'],
          properties: {
            userId: { bsonType: 'objectId' },
            code: { bsonType: 'string' },
            expiresAt: { bsonType: 'date' },
          },
        },
      },
    });

    const insertedUsers = await usersCollection.insertMany([
      {
        fullName: 'John Doe',
        email: 'john@gmail.com',
        password: 'password1',
        isEmailVerified: true,
        createdAt: new Date(),
      },
      {
        fullName: 'Alice Smith',
        email: 'alice@gmail.com',
        password: 'password2',
        isEmailVerified: true,
        createdAt: new Date(),
      },
    ]);

    await postsCollection.insertMany([
      {
        userId: insertedUsers.insertedIds[0],
        title: 'Lost Labrador Dog',
        description: 'Lost near Central Park, very friendly',
        status: 'lost',
        isResolved: false,
        address: 'Central Park, New York, NY',
        createdAt: new Date(),
        pet: {
          type: 'dog',
          breed: 'Labrador',
          colors: ['black', 'white'],
          size: 'large',
        },
        location: {
          type: 'Point',
          coordinates: [-73.968285, 40.785091],
        },
      },
      {
        userId: insertedUsers.insertedIds[1],
        title: 'Found small cat',
        description: 'Found near 5th Avenue, looks healthy',
        status: 'found',
        isResolved: false,
        address: '5th Avenue, New York, NY',
        createdAt: new Date(),
        pet: {
          type: 'cat',
          breed: 'Siamese',
          colors: ['cream', 'brown'],
          size: 'small',
        },
        location: {
          type: 'Point',
          coordinates: [-73.973, 40.7648],
        },
      },
      {
        userId: insertedUsers.insertedIds[0],
        title: 'Lost German Shepherd',
        description: 'Lost near Shevchenko Park, very friendly and obedient',
        status: 'lost',
        isResolved: false,
        address: 'Shevchenko Park, Kyiv, Ukraine',
        createdAt: new Date(),
        pet: {
          type: 'dog',
          breed: 'German Shepherd',
          colors: ['black', 'tan'],
          size: 'large',
        },
        location: {
          type: 'Point',
          coordinates: [30.5167, 50.4501],
        },
      },
      {
        userId: insertedUsers.insertedIds[1],
        title: 'Found stray cat',
        description: 'Found near Khreshchatyk street, looks healthy and calm',
        status: 'found',
        isResolved: false,
        address: 'Khreshchatyk St, Kyiv, Ukraine',
        createdAt: new Date(),
        pet: {
          type: 'cat',
          breed: 'Mixed',
          colors: ['gray', 'white'],
          size: 'small',
        },
        location: {
          type: 'Point',
          coordinates: [30.5234, 50.45],
        },
      },
      {
        userId: insertedUsers.insertedIds[0],
        title: 'Lost rabbit',
        description: 'Lost near Lviv Opera House, white rabbit with black ears',
        status: 'lost',
        isResolved: false,
        address: 'Lviv, Ukraine',
        createdAt: new Date(),
        pet: {
          type: 'rabbit',
          breed: 'Domestic',
          colors: ['white', 'black'],
          size: 'small',
        },
        location: {
          type: 'Point',
          coordinates: [24.0315, 49.8397],
        },
      },
      {
        userId: insertedUsers.insertedIds[1],
        title: 'Found parrot',
        description: 'Found a colorful parrot near Odesa beach, seems tame',
        status: 'found',
        isResolved: false,
        address: 'Odesa, Ukraine',
        createdAt: new Date(),
        pet: {
          type: 'bird',
          breed: 'Parrot',
          colors: ['green', 'red', 'yellow'],
          size: 'medium',
        },
        location: {
          type: 'Point',
          coordinates: [30.7326, 46.4825],
        },
      },
      {
        userId: insertedUsers.insertedIds[0],
        title: 'Lost small dog',
        description:
          'Lost near Dnipro riverfront, small brown dog, very friendly',
        status: 'lost',
        isResolved: false,
        address: 'Dnipro, Ukraine',
        createdAt: new Date(),
        pet: {
          type: 'dog',
          breed: 'Terrier',
          colors: ['brown'],
          size: 'small',
        },
        location: {
          type: 'Point',
          coordinates: [35.0456, 48.4647],
        },
      },
    ]);

    const bigLostPets = await postsCollection
      .find({
        'pet.size': 'large',
        status: 'lost',
        isResolved: false,
      })
      .toArray();
    const brownFoundedCats = await postsCollection
      .find({
        'pet.type': 'cat',
        'pet.colors': { $in: ['black', 'brown'] },
        status: 'found',
      })
      .toArray();

    console.log('Find operation:');
    console.log(bigLostPets);
    console.log(brownFoundedCats);

    const resolveWithWhitePets = await postsCollection.updateMany(
      { 'pet.colors': { $in: ['white'] } },
      { $set: { isResolved: true } }
    );
    const unresolvedWhiteCats = await postsCollection.updateMany(
      {
        'pet.colors': { $in: ['white'] },
        'pet.size': 'small',
        'pet.type': 'cat',
      },
      { $set: { isResolved: false } }
    );

    console.log('Update operation:');
    console.log(resolveWithWhitePets);
    console.log(unresolvedWhiteCats);

    const usersStats = await usersCollection
      .aggregate([
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'userId',
            as: 'user_posts',
          },
        },
        { $project: { fullName: 1, posts_count: { $size: '$user_posts' } } },
      ])
      .toArray();

    const petTypeStats = await postsCollection
      .aggregate([
        { $group: { _id: '$pet.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
      ])
      .toArray();

    console.log('Aggregated data: ');
    console.log(usersStats);
    console.log(petTypeStats);

    console.log('Collections created and test data inserted!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();

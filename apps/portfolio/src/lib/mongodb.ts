import { MongoClient, Db } from 'mongodb';

function getEnvironment(): string {
  // Check for explicit APP_ENV, fall back to NODE_ENV, then default to 'local'
  const env = process.env.APP_ENV || process.env.NODE_ENV || 'local';
  // Map 'production' to 'prod' and 'development' to 'dev'
  if(env === 'production') {
    return 'prod';
  }
  if(env === 'development') {
    return 'dev';
  }
  return env;
}

function getMongoUri(): string {
  const env = getEnvironment();
  
  // Try environment-specific SKYFORGE_DB_MONGODB_URI first (e.g., SKYFORGE_DB_MONGODB_URI_LOCAL, SKYFORGE_DB_MONGODB_URI_PROD)
  const envSpecificUri = process.env[`SKYFORGE_DB_MONGODB_URI_${env.toUpperCase()}`];
  if(envSpecificUri) {
    return envSpecificUri;
  }
  
  // Fall back to generic SKYFORGE_DB_MONGODB_URI
  const uri = process.env.SKYFORGE_DB_MONGODB_URI;
  if(uri) {
    return uri;
  }
  
  // Legacy support: try MONGODB_URI_${env}
  const legacyEnvUri = process.env[`MONGODB_URI_${env.toUpperCase()}`];
  if(legacyEnvUri) {
    return legacyEnvUri;
  }
  
  // Legacy support: try generic MONGODB_URI
  const legacyUri = process.env.MONGODB_URI;
  if(legacyUri) {
    return legacyUri;
  }
  
  throw new Error(`Please add SKYFORGE_DB_MONGODB_URI or SKYFORGE_DB_MONGODB_URI_${env.toUpperCase()} to your environment variables`);
}


let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if(clientPromise) {
    return clientPromise;
  }

  const uri = getMongoUri();

  if(process.env.NODE_ENV === 'development') {
    if(!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const env = getEnvironment();
  // Both 'local' and 'dev' use 'skyforge-dev'
  const dbName = (env === 'local' || env === 'dev') ? 'skyforge-dev' : `skyforge-${env}`;
  return client.db(dbName);
}
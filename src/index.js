import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const boostrap = async () => {
    try {
      await initMongoConnection();
      setupServer();
    } catch (error) {
      console.error(error);
    }
};
boostrap();

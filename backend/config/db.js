import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB', error);
    throw error;
  }
};

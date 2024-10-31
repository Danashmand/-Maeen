import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { hostname } from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001',"*"], // Specify your frontend URL(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Enable credentials
    preflightContinue: false, // Whether to pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204, // Provide a status code for successful OPTIONS requests
  });
  
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();

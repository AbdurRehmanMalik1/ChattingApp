import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8000, ()=>{
    console.log(`Server Started at ${process.env.PORT}`);
  });
}
bootstrap();

import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from 'src/prompt/prompt.entity';
import { User } from 'src/users/user.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prompt,User,Prompt_usage]), //  le module TypeOrm pour la gestion des entités
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService,OpenAI]
})
export class OpenaiModule {}

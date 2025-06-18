import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  message: string;

  @Column({nullable: true})
  reponse: string;

  @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: string;

  @Column({default:0})
  comptage_prompt: number;

  @ManyToOne(() => User, (user) => user.prompts)
  user: User;

}

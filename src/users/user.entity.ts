import { Prompt } from 'src/prompt/prompt.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullname: string;

  @Column({ type: "varchar", length: 10, unique: true})
  pseudo: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  telNumber: string;

  @Column({default: 0})
  countPrompt: number;

  @Column({nullable: true})
  lastPromptDate: Date;


  @Column({ default: false })
  isActive: boolean;

  @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: string;

  @Column({nullable:true})
  codeOTP:string;

  @Column({default:false})
  emailVerify:boolean;

  @OneToMany(() => Prompt, (prompt) => prompt.user)
  prompts: Prompt[];

  @OneToMany(() => Prompt_usage, (prompt_usage) => prompt_usage.user)
  prompt_usage: Prompt_usage[];
}

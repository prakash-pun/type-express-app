import { PrimaryGeneratedColumn, Entity, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Notes extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false }) 
  title: string;

  @Column({ length: 100, nullable: false }) 
  subTitle: string;

  @Column({nullable: true}) 
  noteImage: string;

  @Column({nullable: true}) 
  tags: string;

  @Column({ length: 1000, nullable: false }) 
  content: string;

  @ManyToOne(() => User, user => user.notes)
  owner: User;

  @Column({ type: "timestamptz", default: "now()" }) 
  createdAt: Date;
}
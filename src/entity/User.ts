import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @Index({ unique: true })
  @Column('varchar', { length: 200, nullable: false })
  userName: string;
  
  @Index({ unique: true })
  @Column("varchar", { length: 255, nullable: false })
  email: string;

  @Column("varchar", {length: 1000, nullable: false})
  password: string;

  @Column({ type: "timestamptz", default: "now()" })
  createdAt: Date;

  @Column({ type: "timestamptz", default: "now()" })
  updatedAt: Date;
}
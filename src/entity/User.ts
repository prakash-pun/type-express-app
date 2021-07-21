import { Entity, Column, BaseEntity, Index, OneToMany, BeforeInsert, AfterInsert, ObjectIdColumn } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Notes } from './Notes';
import PasswordEncryption from 'util/passwordManager';

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: string;

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

  @Column({type: "varchar", select: false, length: 1000})
  password!: string;

  @Column({select:false, type: "timestamptz", default: "now()" })
  createdAt!: Date;

  @Column({select: false, type: "timestamptz", default: "now()" })
  updatedAt!: Date;

  @OneToMany(() => Notes, owner => owner.owner)
  notes: Notes[]

  @BeforeInsert()
  @AfterInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      console.log(this.password);
        this.password = await PasswordEncryption(this.password);
    }
  }

  checkPasswordEncrypt(onencryptedPassword: string){
    console.log(this.password);
    return bcrypt.compareSync(onencryptedPassword, this.password);
  }
}
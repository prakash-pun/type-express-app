// import { Entity, Column, BaseEntity, ManyToOne, ObjectIdColumn } from "typeorm";
// import { User } from "./User";

// @Entity()
// export class Notes extends BaseEntity{
//   @ObjectIdColumn()
//   id: string;

//   @Column({ length: 50 }) 
//   title: string;

//   @Column({ length: 100, nullable: true}) 
//   subTitle: string;

//   @Column({type: "varchar", default: "notes/defalut.png", nullable: true}) 
//   noteImage: string;

//   @Column({ length: 100, nullable: true}) 
//   tags: string;

//   @Column({ length: 1000 }) 
//   content: string;

//   @Column({type: 'boolean', default: 'false', nullable: true})
//   noteShare: boolean;

//   @ManyToOne(() => User, user => user.notes)
//   owner: User;

//   @Column({ type: "timestamptz", default: "now()" }) 
//   createdAt: Date;
// }
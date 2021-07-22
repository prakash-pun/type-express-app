// import { BaseEntity, BeforeInsert, Column, Entity, ObjectIdColumn, PrimaryColumn } from "typeorm";
// import { v4 as uuidv4 } from 'uuid';

// @Entity()
// export class Todo{
//   // @PrimaryColumn("uuid") id: string;
//   @ObjectIdColumn() id: string;

//   @Column() text: string;

//   @Column({default: false}) isCompleted: boolean;

//   @Column({ default: new Date(Date.now() - 8640000 * 14) }) createdAt: Date;

//   // @BeforeInsert()
//   // addId() {
//   //   this.id = uuidv4();
//   // }
// }
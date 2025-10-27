import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("devices")
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  deviceId: string; // Unique device identifier from mobile device

  @Column()
  deviceName: string; // e.g., "iPhone 13", "Samsung Galaxy S21"

  @Column({ nullable: true })
  deviceModel: string;

  @Column({ nullable: true })
  osVersion: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true, type: "timestamp" })
  verifiedAt?: Date;

  @Column({ nullable: true })
  verifiedBy?: string; // Admin ID who verified

  @Column({ nullable: true, type: "timestamp" })
  lastUsedAt?: Date;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

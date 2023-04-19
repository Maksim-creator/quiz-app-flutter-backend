import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface FriendsCreationAttr {
  userId: number;
  requestSent: number[];
  requestGot: number[];
  friends: number[];
}

@Table({ tableName: 'friends' })
export class Friend extends Model<Friend, FriendsCreationAttr> {
  @Column({ type: DataType.INTEGER })
  userId: number;
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  requestSent: number[];
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  requestGot: number[];
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  friends: number[];
}

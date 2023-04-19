import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AvatarCreationAttr {
  email: string;
  filename: string;
  path: string;
}

@Table({ tableName: 'avatar' })
export class Avatar extends Model<Avatar, AvatarCreationAttr> {
  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  filename: string;

  @Column({ type: DataType.STRING })
  path: string;
}

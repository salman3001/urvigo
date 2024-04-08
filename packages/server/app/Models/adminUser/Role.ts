import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import AdminUser from './AdminUser'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @hasMany(() => AdminUser)
  public AdminUser: HasMany<typeof AdminUser>

  @column({
    prepare: (v: any) => JSON.stringify(v),
  })
  public permissions: string[]
}

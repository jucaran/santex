import { Entity, Column, Unique, PrimaryColumn, ManyToMany, JoinTable, Relation } from 'typeorm'
import { Team } from './Team.js'

@Entity()
@Unique(['code'])
export class League {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  code: string

  @Column()
  areaName: string

  @ManyToMany(() => Team, team => team.leagues, { cascade: true, onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'leagues_teams',
    joinColumn: {
      name: 'league',
      referencedColumnName: 'code'
    },
    inverseJoinColumn: {
      name: 'team',
      referencedColumnName: 'id'
    }
  })
  teams?: Relation<Team[]>
}

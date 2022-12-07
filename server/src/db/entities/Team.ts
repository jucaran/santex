import { Entity, Column, PrimaryColumn, ManyToMany, OneToMany, RelationId, Relation } from 'typeorm'
import { Coach, League, Player } from '../entities.js'

@Entity()
export class Team {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  tla: string

  @Column()
  shortName: string

  @Column()
  areaName: string

  @Column()
  address: string

  @ManyToMany(() => League, (league) => league.teams, { cascade: ['insert', 'update']})
  leagues?: Relation<League[]>

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  players?: Relation<Player[]>

  @Column('int', { array: true })
  @RelationId((team: Team) => team.players)
  playersIds?: number[]

  @OneToMany(() => Coach, (coach) => coach.team)
  coach?: Relation<Coach>

  @Column()
  @RelationId((team: Team) => team.coach)
  coachId?: number
}

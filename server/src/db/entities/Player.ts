import { Entity, Column, PrimaryColumn, ManyToOne, Relation } from 'typeorm'
import { Team } from './Team.js'

@Entity()
export class Player {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  position: string

  @Column()
  dateOfBirth: string

  @Column()
  nationality: string

  @ManyToOne(() => Team, (team) => team.players)
  team?: Relation<Team>
}

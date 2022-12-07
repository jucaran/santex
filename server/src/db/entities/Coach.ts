import { Entity, Column, PrimaryColumn, OneToOne, Relation, RelationId } from 'typeorm'
import { Team } from '../entities.js'

@Entity()
export class Coach {
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

  @OneToOne(() => Team, (team) => team.coach)
  team?: Relation<Team>

  @Column()
  @RelationId((coach: Coach) => coach.team)
  teamId: number
}

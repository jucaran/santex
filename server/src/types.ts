interface ApiArea {
  id: string
  name: string
  code: string
  flag: string
}

interface ApiSeason {
  id: number
  startDate: string
  endDate: string
  currentMatchday: number
  winner?: string
}

interface ApiCompetition {
  id: number
  name: string
  code: string
  type: string
  emblem: string
}

interface ApiCoach {
  id: number
  firstName?: string
  lastName?: string
  name?: string
  dateOfBirth?: string
  nationality?: string
  contract: { start?: string; until?: string }
}

interface ApiPlayer {
  id: number
  name?: string
  position?: string
  dateOfBirth?: string
  nationality?: string
}

export interface ApiTeam {
  area: ApiArea
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  address: string
  website: string
  founded: number
  clubColors: string
  venue: string
  runningCompetitions: ApiCompetition[]
  coach: ApiCoach
  squad: ApiPlayer[]
  staff: []
  lastUpdated: string
}

export interface ApiCompetitionResponse {
  area: ApiArea
  id: number
  name: string
  code: string
  type: string
  emblem: string
  currentSeason: ApiSeason
  seasons: ApiSeason[]
  lastUpdated: string
}

export interface ApiCompetitionTeamsResponse {
  count: number
  filters: { season: string }
  competition: ApiCompetition
  season: ApiSeason
  teams: ApiTeam[]
}

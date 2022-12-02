export default `#graphql
  union PlayersResult = Player | Coach
  type Query {
    players(leagueCode: String!, teamName: String): [PlayersResult]
    team(name: String!): Team
  }
`

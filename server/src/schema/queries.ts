/**
 * All the queries of the GraphQL server
 */
export default `#graphql
  union PlayersResult = Player | Coach
  type Query {
    players(leagueCode: String!, teamName: String): [PlayersResult]
    team(name: String!): Team
    league(name: String!): League
    leagues: [League]
  }
`

/**
 * All the mutations of the GraphQL server
 */
export default `#graphql
  type Mutation {
    importLeague(leagueCode: String!): String
  }
`
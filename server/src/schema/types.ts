/**
 * All the types of the GraphQL server
 */
export default `#graphql
  type League {
    id: ID
    name: String!
    code: String!
    areaName: String!
    teams: [Team]
  }

  type Team {
    id: ID
    name: String!
    tla: String!
    shortName: String!
    areaName: String!
    address: String!
    leagues: [League]
    players: [Player]
    coach: Coach
  }

  type Player {
    id: ID
    name: String
    position: String
    dateOfBirth: String
    nationality: String
    team: Team
  }

  type Coach {
    id: ID
    name: String
    dateOfBirth: String
    nationality: String
    team: Team
  }
`;
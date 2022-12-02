export default `#graphql
  type Competition {
    id: ID
    name: String!
    code: String!
    areaName: String!
  }

  type Team {
    id: ID
    name: String!
    tla: String!
    shortName: String!
    areaName: String!
    address: String!
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
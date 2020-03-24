const { makeExecutableSchema } = require("graphql-tools");
const graphqlHTTP = require("express-graphql");
const { ArrivalModel } = require("../db/models");
const { GraphQLDateTime } = require("graphql-iso-date");

const typeDefs = /* GraphQL */ `
	scalar DateTime

	type CaptainLogEntry {
		arrivalTime: DateTime
		captainName: String
		vesselName: String
		portName: String
	}

	input CaptainLogEntryInput {
		arrivalTime: DateTime!
		captainName: String!
		vesselName: String!
		portName: String!
	}

	type Query {
		arrivalLogs(forCaptain: String): [CaptainLogEntry]
	}

	type Mutation {
		createArrivalLog(input: CaptainLogEntryInput!): CaptainLogEntry
	}
`;
const resolvers = {
	DateTime: GraphQLDateTime,
	Query: {
		arrivalLogs: (_, { forCaptain }) =>
			ArrivalModel.find(
				forCaptain ? { captainName: forCaptain } : {}
			).sort({ arrivalTime: "desc" }),
	},
	Mutation: {
		createArrivalLog: (_, { input }) => ArrivalModel.create(input),
	},
};

const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = app =>
	app.use(
		"/",
		graphqlHTTP({
			schema: executableSchema,
			graphiql: true,
		})
	);

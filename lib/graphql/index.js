const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const { ArrivalModel } = require("../db/models");
const { DateTimeResolver } = require("graphql-scalars");

const schema = buildSchema(/* GraphQL */ `
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
`);

const root = {
	DateTime: DateTimeResolver,
	arrivalLogs: ({ forCaptain }) =>
		ArrivalModel.find(forCaptain ? { captainName: forCaptain } : {}),
	createArrivalLog: ({ input }) => ArrivalModel.create(input),
};

module.exports = app =>
	app.use(
		"/",
		graphqlHTTP({
			schema,
			rootValue: root,
			graphiql: true,
		})
	);

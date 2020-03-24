## Live demo

Live demo available here: https://soda-test-willh.herokuapp.com/

## Installing & running

To install run:

```
npm install
```

To run:

```
npm start
```

By default it will run on port 3000, so go to http://localhost:3000/ and the graphql playground will appear

## Tests

To run tests

```
npm test
```

It will generate and show an in-terminal coverage report. All core functionality is covered (besides a little bit of express plumbing).

To run tests in watch mode (helpful for TDD):

```
npm run test:watch
```

This will watch the files and rerun them when changes happen.

The current test coverage is integration oriented and tests the app using supertest by firing off queries at the HTTP level with stubs for the mongoose objects. This tests the stack both at the HTTP level, the schema level (eg picks up regressions in type changes) and at the resolver level connected to the Mongoose models.

## Queries & mutations

The following queries and mutations are available:

To create an arrival log:

```
mutation createLog(
	$portName: String!
	$vesselName: String!
	$captainName: String!
	$arrivalTime: DateTime!
) {
	createArrivalLog(
		input: {
			portName: $portName
			vesselName: $vesselName
			captainName: $captainName
			arrivalTime: $arrivalTime
		}
	) {
		arrivalTime
		captainName
		vesselName
		portName
	}
}
```

To query for arrival logs:

```
query getLogs($forCaptain: String!) {
	arrivalLogs(forCaptain: $forCaptain) {
		arrivalTime
		captainName
		vesselName
		portName
	}
}
```

The `$forCaptain` filter is optional in the getLogs query allowing you to view all logs.

## Architectural diagram

![architectural diagram](soda-diagram.png "Diagram")

At the moment for the sake of portability all data is persisted into an in-memory mongodb, this can easily be swapped out for a real mongodb if data persistence is required. The mongodb-memory-server should NOT be used in a production environment and exists in this app to demonstrate functionality easily.

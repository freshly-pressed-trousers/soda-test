const app = require("..");
const { ArrivalModel } = require("../db/models");
const request = require("supertest");

jest.mock("../db");
jest.mock("../db/models");

describe("app", () => {
	beforeEach(() => {
		ArrivalModel.find.mockReset();
		ArrivalModel.create.mockReset();
	});

	it("returns an unfiltered list of CaptainLogEntry when arrivalLogs queried and db has data", async () => {
		const arrivalLogs = [
			{
				arrivalTime: "2020-03-24T12:01:56.655Z",
				vesselName: "vessel",
				portName: "port portie",
				captainName: "captain bob",
			},
		];
		ArrivalModel.find.mockResolvedValue(arrivalLogs);
		const response = await request(app)
			.post("/")
			.send({
				query: /* GraphQL */ `
					{
						arrivalLogs {
							arrivalTime
							captainName
							vesselName
							portName
						}
					}
				`,
			})
			.expect(200);

		expect(JSON.parse(response.text)).toEqual({
			data: {
				arrivalLogs,
			},
		});
	});

	it("returns an filtered list of CaptainLogEntry when arrivalLogs queried with forCaptain query parameter set", async () => {
		const arrivalLogs = [
			{
				arrivalTime: "2020-03-24T12:01:56.655Z",
				vesselName: "vessel",
				portName: "port portie",
				captainName: "captain bob",
			},
		];
		const forCaptain = "captain bob";
		ArrivalModel.find.mockResolvedValue(arrivalLogs);
		const response = await request(app)
			.post("/")
			.send({
				query: /* GraphQL */ `
					query getLogs($forCaptain: String!) {
						arrivalLogs(forCaptain: $forCaptain) {
							arrivalTime
							captainName
							vesselName
							portName
						}
					}
				`,
				variables: { forCaptain },
			})
			.expect(200);

		expect(JSON.parse(response.text)).toEqual({
			data: {
				arrivalLogs,
			},
		});
		expect(ArrivalModel.find).toBeCalledWith({ captainName: forCaptain });
	});

	it("calls ArrivalModel create on mutation.createArrivalLog call and returns result", async () => {
		const arrivalLog = {
			arrivalTime: "2020-03-24T12:01:56.655Z",
			captainName: "captain bob",
			vesselName: "vessel",
			portName: "port portie",
		};
		ArrivalModel.create.mockResolvedValue(arrivalLog);

		const response = await request(app)
			.post("/")
			.send({
				query: /* GraphQL */ `
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
				`,
				variables: arrivalLog,
			})
			.expect(200);

		expect(JSON.parse(response.text)).toEqual({
			data: {
				createArrivalLog: arrivalLog,
			},
		});
	});

	it("validates date is valid on mutation.createArrivalLog call and returns result", async () => {
		const arrivalLog = {
			arrivalTime: "not a date",
			captainName: "captain bob",
			vesselName: "vessel",
			portName: "port portie",
		};
		ArrivalModel.create.mockResolvedValue(arrivalLog);

		const response = await request(app)
			.post("/")
			.send({
				query: /* GraphQL */ `
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
				`,
				variables: arrivalLog,
			});

		const { errors } = JSON.parse(response.text);

		expect(errors).toBeDefined();
	});
});

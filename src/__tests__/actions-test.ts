// import { expect } from "chai";
// import { stub } from "sinon";
// const fetchMock =  require("fetch-mock");

// import ActionCreator from "../actions";

// class MockDataFetcher {
//   resolve: boolean = true;
//   testData: any = "test";

//   fetch(url: string, options = {}) {
//     return new Promise((resolve, reject) => {
//       if (this.resolve) {
//         resolve(this.testData);
//       } else {
//         reject({
//           message: "test error"
//         });
//       }
//     });
//   }
// };

// const fetcher = new MockDataFetcher() as any;
// const actions = new ActionCreator(fetcher);

// describe("actions", () => {
//   describe("postForm", () => {
//     const type = "TEST";
//     const url = "http://example.com/test";
//     const formData = new (window as any).FormData();
//     formData.append("test", "test");

//     afterEach(() => {
//       fetchMock.restore();
//     });

//     it("dispatches request, success, and load", async () => {
//       const dispatch = stub();
//       const responseText = stub().returns(new Promise<string>((resolve) => {
//         resolve("response");
//       }));
//       fetchMock
//         .mock(url, responseText);

//       await actions.postForm(type, url, formData)(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(3);
//       expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
//       expect(dispatch.args[2][0].type).to.equal(`${type}_${ActionCreator.LOAD}`);
//       expect(dispatch.args[2][0].data).to.equal("response");
//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal(url);
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       const expectedHeaders = new Headers();
//       expect(fetchArgs[0][1].headers).to.deep.equal(expectedHeaders);
//       expect(fetchArgs[0][1].body).to.equal(formData);
//     });

//     it("postForm with JSON response dispatches request, success, and load", async () => {
//       const dispatch = stub();
//       const textResponse = "{\"id\": \"test\", \"name\": \"test\"}";
//       const responseText = stub().returns(new Promise<any>((resolve) => {
//         resolve(textResponse);
//       }));
//       fetchMock
//         .mock(url, responseText);

//       await actions.postForm(type, url, formData, "POST", "", "JSON")(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(3);
//       expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
//       expect(dispatch.args[2][0].type).to.equal(`${type}_${ActionCreator.LOAD}`);
//       expect(dispatch.args[2][0].data).to.deep.equal(JSON.parse(textResponse));
//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal(url);
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       const expectedHeaders = new Headers();
//       expect(fetchArgs[0][1].headers).to.deep.equal(expectedHeaders);
//       expect(fetchArgs[0][1].body).to.equal(formData);
//     });

//     it("dispatches a DELETE request", async () => {
//       const dispatch = stub();
//       const responseText = stub().returns(new Promise<string>((resolve) => {
//         resolve("response");
//       }));
//       fetchMock
//         .mock(url, responseText);

//       await actions.postForm(type, url, formData, "DELETE")(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(3);
//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal(url);
//       expect(fetchArgs[0][1].method).to.equal("DELETE");
//       const expectedHeaders = new Headers();
//       expect(fetchArgs[0][1].headers).to.deep.equal(expectedHeaders);
//       expect(fetchArgs[0][1].body).to.equal(formData);
//     });

//     it("dispatches failure on bad response", async () => {
//       const dispatch = stub();
//       const jsonResponse = new Promise(resolve => resolve({ detail: "problem detail" }));
//       fetchMock
//         .mock(url, 500);

//       try {
//         await actions.postForm(type, url, formData)(dispatch);
//         // shouldn't get here
//         expect(false).to.equal(true);
//       } catch (err) {
//         let fetchArgs = fetchMock.calls();

//         expect(dispatch.callCount).to.equal(2);
//         expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//         expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
//         expect(fetchMock.called()).to.equal(true);
//         expect(err).to.deep.equal({
//           status: 500,
//           response: "problem detail",
//           url: url
//         });
//       }
//     });

//     it("dispatches failure on non-JSON response", async () => {
//       const dispatch = stub();
//       const nonJsonResponse = new Promise(() => { throw "Not JSON"; });
//       fetchMock
//         .mock(url, nonJsonResponse);

//       try {
//         await actions.postForm(type, url, formData, "POST", "Default error")(dispatch);
//         // shouldn't get here
//         expect(false).to.equal(true);
//       } catch (err) {
//         expect(dispatch.callCount).to.equal(2);
//         expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//         expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
//         expect(fetchMock.called()).to.equal(true);
//         expect(err).to.deep.equal({
//           status: 500,
//           response: "Default error",
//           url: url
//         });
//       }
//     });

//     it("dispatches failure on no response", async () => {
//       const dispatch = stub();
//       fetchMock
//         .mock(url, { status: null, body: "test error" });

//       try {
//         await actions.postForm(type, url, formData)(dispatch);
//         // shouldn't get here
//         expect(false).to.equal(true);
//       } catch (err) {
//         expect(dispatch.callCount).to.equal(2);
//         expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//         expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
//         expect(fetchMock.called()).to.equal(true);
//         expect(err).to.deep.equal({
//           status: null,
//           response: "test error",
//           url: url
//         });
//       }
//     });
//   });

//   describe("postJSON", () => {
//     const type = "TEST";
//     const url = "http://example.com/test";
//     const jsonData = { "test": 1 };

//     afterEach(() => {
//       fetchMock.restore();
//     });

//     it("dispatches request and success", async () => {
//       const dispatch = stub();
//       fetchMock
//         .mock(url, 200);

//       await actions.postJSON<{ test: number }>(type, url, jsonData)(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(2);
//       expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal(url);
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       const expectedHeaders = new Headers();
//       expectedHeaders.append("Accept", "application/json");
//       expectedHeaders.append("Content-Type", "application/json");
//       expect(fetchArgs[0][1].headers).to.deep.equal(expectedHeaders);
//       expect(fetchArgs[0][1].body).to.equal(JSON.stringify(jsonData));
//     });

//     // it("dispatches failure on bad response", async () => {
//     //   const dispatch = stub();
//     //   const jsonResponse = new Promise((resolve, reject) => resolve({ detail: "problem detail" }));
//     //   const res = new Promise<any>(reject => {
//     //     reject({ status: 500, body: jsonData, json: () => jsonResponse });
//     //   });
//     //   fetchMock
//     //     .mock(url, { status: 500, body: jsonData });

//     //   try {
//     //     await actions.postJSON<{ test: number }>(type, url, jsonData)(dispatch);
//     //     // shouldn't get here
//     //     expect(false).to.equal(true);
//     //   } catch (err) {
//     //     expect(dispatch.callCount).to.equal(2);
//     //     expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//     //     expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
//     //     expect(fetchMock.called()).to.equal(true);
//     //     expect(err).to.deep.equal({
//     //       status: 500,
//     //       response: "problem detail",
//     //       url: url
//     //     });
//     //   }
//     // });

//     it("dispatches failure on no response", async () => {
//       const dispatch = stub();
//       fetchMock
//         .mock(url, 500);

//       try {
//         await actions.postJSON<{ test: number }>(type, url, jsonData)(dispatch);
//         // shouldn't get here
//         expect(false).to.equal(true);
//       } catch (err) {
//         expect(dispatch.callCount).to.equal(2);
//         expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
//         expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
//         expect(fetchMock.called()).to.equal(true);
//         expect(err).to.deep.equal({
//           status: null,
//           response: "test error",
//           url: url
//         });
//       }
//     });
//   });

//   describe("fetchLibraries", () => {
//     it("dispatches request, load, and success", async () => {
//       const dispatch = stub();
//       const librariesData = { libraries: ["lib1", "lib2", "lib3"] };
//       fetcher.testData = {
//         ok: true,
//         status: 200,
//         json: () => new Promise<any>((resolve, reject) => {
//           resolve(librariesData);
//         })
//       };
//       fetcher.resolve = true;

//       const data = await actions.fetchLibraries()(dispatch);
//       expect(dispatch.callCount).to.equal(3);

//       expect(dispatch.args[0][0].type).to.equal(`${ActionCreator.GET_ALL_LIBRARIES}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[0][0].url).to.equal("/admin/libraries");

//       expect(dispatch.args[1][0].type).to.equal(`${ActionCreator.GET_ALL_LIBRARIES}_${ActionCreator.SUCCESS}`);

//       expect(dispatch.args[2][0].type).to.equal(`${ActionCreator.GET_ALL_LIBRARIES}_${ActionCreator.LOAD}`);
//       expect(data).to.deep.equal(librariesData);
//     });
//   });

//   describe("fetchLibrary", () => {
//     it("dispatches request, load, and success", async () => {
//       const dispatch = stub();
//       const libraryData = { library: {"name": "library!", "uuid": "12345"} };
//       fetcher.testData = {
//         ok: true,
//         status: 200,
//         json: () => new Promise<any>((resolve, reject) => {
//           resolve(libraryData);
//         })
//       };
//       fetcher.resolve = true;

//       const data = await actions.fetchLibrary("12345")(dispatch);

//       expect(dispatch.callCount).to.equal(3);

//       expect(dispatch.args[0][0].type).to.equal(`${ActionCreator.GET_ONE_LIBRARY}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[0][0].url).to.equal("/admin/libraries/12345");

//       expect(dispatch.args[1][0].type).to.equal(`${ActionCreator.GET_ONE_LIBRARY}_${ActionCreator.SUCCESS}`);

//       expect(dispatch.args[2][0].type).to.equal(`${ActionCreator.GET_ONE_LIBRARY}_${ActionCreator.LOAD}`);
//       expect(data).to.deep.equal(libraryData);
//     });
//   });

//   describe("editStages", () => {
//     it("dispatches request and success", async () => {
//       const dispatch = stub();
//       const formData = new (window as any).FormData();
//       formData.append("registration_stage", "production");

//       fetcher.testData = {
//         ok: true,
//         status: 200,
//         json: () => new Promise<any>((resolve, reject) => {
//           resolve("done!");
//         })
//       };
//       fetcher.resolve = true;

//       fetchMock
//         .mock("/admin/libraries/registration", 200);

//       const data = await actions.editStages(formData)(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(2);

//       expect(dispatch.args[0][0].type).to.equal(`${ActionCreator.EDIT_STAGES}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[1][0].type).to.equal(`${ActionCreator.EDIT_STAGES}_${ActionCreator.SUCCESS}`);

//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal("/admin/libraries/registration");
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       expect(fetchArgs[0][1].body).to.equal(formData);

//       fetchMock.restore();
//     });
//   });

//   describe("validateEmail", () => {
//     it("validates an email address", async () => {
//       const dispatch = stub();
//       const formData = new (window as any).FormData();
//       formData.append("uuid", "abc");

//       fetchMock
//         .mock("/admin/libraries/email", 200);

//       await actions.validateEmail(formData)(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(2);

//       expect(dispatch.args[0][0].type).to.equal("VALIDATE_EMAIL_REQUEST");
//       expect(dispatch.args[1][0].type).to.equal("VALIDATE_EMAIL_SUCCESS");

//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal("/admin/libraries/email");
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       expect(fetchArgs[0][1].body).to.equal(formData);

//       fetchMock.restore();
//     });
//   });

//   describe("logIn", () => {
//     it("submits credentials", async () => {
//       const dispatch = stub();
//       const formData = new (window as any).FormData();
//       formData.append("admin", "123");

//       fetchMock
//         .mock("/admin/log_in", 200);
//       await actions.logIn(formData)(dispatch);
//       let fetchArgs = fetchMock.calls();

//       expect(dispatch.callCount).to.equal(2);
//       expect(dispatch.args[0][0].type).to.equal(`${ActionCreator.LOG_IN}_${ActionCreator.REQUEST}`);
//       expect(dispatch.args[1][0].type).to.equal(`${ActionCreator.LOG_IN}_${ActionCreator.SUCCESS}`);

//       expect(fetchMock.called()).to.equal(true);
//       expect(fetchArgs[0][0]).to.equal("/admin/log_in");
//       expect(fetchArgs[0][1].method).to.equal("POST");
//       expect(fetchArgs[0][1].body).to.equal(formData);

//       fetchMock.restore();
//     });
//   });
// });

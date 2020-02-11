import { expect } from "chai";
import { getPercentage, getMonth, toggleState } from "../utils/sharedFunctions";

describe("getPercentage", () => {
  let outOf;
  beforeEach(() => {
    outOf = [30, 55, 45, 70];
  });
  it("calculates the percentage out of a number", () => {
    expect(getPercentage(50, 200)).to.equal(25);
  });
  it("calculates the percentage out of a string containing a number", () => {
    expect(getPercentage(50, "200")).to.equal(25);
  });
  it("calculates the percentage out of the sum of an array of numbers", () => {
    expect(getPercentage(50, outOf)).to.equal(25);
  });
  it("calculates the percentage out of the sum of an array of strings containing numbers", () => {
    outOf = outOf.map(x => `${x}`);
    expect(getPercentage(50, outOf)).to.equal(25);
  });
  it("optionally returns the percentage as a string", () => {
    expect(getPercentage(50, outOf, true)).to.equal("25%");
  });
  it("rounds numbers", () => {
    expect(getPercentage(55, outOf)).to.equal(28);
  });
});

describe("getMonth", () => {
  it("takes a timestamp and returns the name of a month", () => {
    expect(getMonth("Fri, 01 Nov 2019 15:05:34 GMT")).to.equal("November");
    expect(getMonth("Mon, 19 Aug 2019 15:05:34 GMT")).to.equal("August");
    expect(getMonth("Fri, 12 Apr 2019 15:05:34 GMT")).to.equal("April");
  });
});

describe("toggleState", () => {
  let state;
  beforeEach(() => {
    state = {"A": true, "B": false, "C": true};
  });
  it("takes an attribute and returns the updated state", () => {
    expect(toggleState("A", state)).to.eql({ "A": false, "B": false, "C": true });
    expect(toggleState("B", state)).to.eql({ "A": true, "B": true, "C": true });
    expect(toggleState("C", state)).to.eql({ "A": true, "B": false, "C": false });
  });
});

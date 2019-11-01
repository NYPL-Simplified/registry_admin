import { expect } from "chai";
import { getPercentage } from "../utils/sharedFunctions";

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
  it("calculates the percentage out of an array of numbers", () => {
    expect(getPercentage(50, outOf)).to.equal(25);
  });
  it("calculates the percentage out of an array of strings containing numbers", () => {
    outOf = outOf.map(x => `${x}`);
    expect(getPercentage(50, outOf)).to.equal(25);
  });
  it("calculates the percentage out of an array of arrays", () => {
    // The total is the combined lengths of the sub-arrays; 6, in this case.
    outOf = [["a"], ["a", "b"], ["a", "b", "c"]];
    expect(getPercentage(3, outOf)).to.equal(50);
  });
  it("optionally returns the percentage as a string", () => {
    expect(getPercentage(50, outOf, true)).to.equal("25%");
  });
  it("rounds numbers", () => {
    expect(getPercentage(55, outOf)).to.equal(28);
  });
});

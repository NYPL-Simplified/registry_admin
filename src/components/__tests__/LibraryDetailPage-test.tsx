import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { LibraryDetailPage } from "../LibraryDetailPage";
import { Tabs } from "library-simplified-reusable-components";
import { testLibrary1, modifyLibrary } from "./TestUtils";

describe("LibraryDetailPage", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let fetchData = Sinon.stub();
  let uuid = "123";
  let store;

  const library = testLibrary1;
  let updateColor: Sinon.SinonStub;
  let editStages: Sinon.SinonStub;
  let fetchLibrary: Sinon.SinonStub;

  beforeEach(() => {
    store = buildStore();
    updateColor = Sinon.stub();
    editStages = Sinon.stub();
    fetchLibrary = Sinon.stub();

    wrapper = Enzyme.mount(
      <LibraryDetailPage
        library={library}
        store={store}
        updateColor={updateColor}
        editStages={editStages}
        fetchLibrary={fetchLibrary}
      />
    );
  });

  it("should call renderItems for each category", () => {
    let spyRenderItems = Sinon.spy(wrapper.instance(), "renderItems");
    wrapper.instance().render();

    expect(spyRenderItems.callCount).to.equal(3);
    let [basicInfoCall, urlsContactCall, areasCall] = [spyRenderItems.firstCall, spyRenderItems.secondCall, spyRenderItems.thirdCall];

    expect(basicInfoCall.args[0]).to.equal(library.basic_info);
    expect(basicInfoCall.returnValue.type).to.equal("ul");
    expect(basicInfoCall.returnValue.props.children.length).to.equal(2);
    let [name, short_name] = basicInfoCall.returnValue.props.children;
    expect(name.props.label).to.equal("name");
    expect(name.props.value).to.equal("Test Library 1");
    expect(short_name.props.label).to.equal("short_name");
    expect(short_name.props.value).to.equal("lib1");

    expect(urlsContactCall.args[0]).to.equal(library.urls_and_contact);
    expect(urlsContactCall.returnValue.type).to.equal("ul");
    expect(urlsContactCall.returnValue.props.children.length).to.equal(4);
    let [authentication_url, contact_email, opds_url, web_url] = urlsContactCall.returnValue.props.children;
    expect(authentication_url.props.label).to.equal("authentication_url");
    expect(authentication_url.props.value).to.equal("auth1");
    expect(contact_email.props.label).to.equal("contact_email");
    expect(contact_email.props.value).to.equal("email1");
    expect(opds_url.props.label).to.equal("opds_url");
    expect(opds_url.props.value).to.equal("opds1");
    expect(web_url.props.label).to.equal("web_url");
    expect(web_url.props.value).to.equal("web1");

    expect(areasCall.args[0]).to.equal(library.areas);
    expect(areasCall.returnValue.type).to.equal("ul");
    expect(areasCall.returnValue.props.children.length).to.equal(1);
    let [focus] = areasCall.returnValue.props.children;
    expect(focus.props.label).to.equal("focus");
    expect(focus.props.value).to.equal(library.areas.focus.join("; "));

    spyRenderItems.restore();
  });

  it("should show the library information", () => {
    let list = wrapper.find(".list-group");
    expect(list.length).to.equal(3);

    let basicInfoItems = list.at(0).find("li");
    expect(basicInfoItems.length).to.equal(2);

    let contactUrlItems = list.at(1).find("li");
    expect(contactUrlItems.length).to.equal(4);

    let allItems = Object.assign(basicInfoItems, contactUrlItems);
    let libraryData = Object.assign(library.basic_info, library.urls_and_contact);
    allItems.map((item: Enzyme.CommonWrapper<any, any, {}>) => {
      let key = item.find(".control-label").text();
      let value = item.find("span").text();
      expect(libraryData[key]).to.equal(value);
    });
  });

  it("should not display blank values", () => {
    let infoLabels = wrapper.find(".list-group-item .control-label").map((label: Enzyme.CommonWrapper<any, any, {}>) => label.text());
    expect(infoLabels.indexOf("description")).to.equal(-1);
  });

  it("should pass the library's name to the Tabs component", () => {
    // The Tabs component will use this to create unique IDs for its buttons and panels.
    expect(wrapper.find(Tabs).prop("uniqueId")).to.equal("Test Library 1");
  });

  it("should not display empty tabs", () => {
    let tabs = wrapper.find(".tab-nav");
    expect(tabs.length).to.equal(3);
    expect(wrapper.find(".tab-navs").text()).to.contain("Areas");
    let libraryWithoutAreas = modifyLibrary(testLibrary1, {focus: [], service: []});
    wrapper.setProps({library: libraryWithoutAreas});
    tabs = wrapper.find(".tab-nav");
    expect(tabs.length).to.equal(2);
    expect(wrapper.find(".tab-navs").text()).not.to.contain("Areas");
  });

  it("should display the edit form", () => {
    let editForm = wrapper.find("form").at(0);
    expect(editForm.length).to.equal(1);

    let libraryStage = editForm.find("fieldset").at(0);
    let libraryLegend = libraryStage.find("legend");
    let librarySelect = libraryStage.find("select");
    expect(libraryLegend.text()).to.equal("Library Stage");
    expect(librarySelect.props().name).to.equal("Library Stage");
    expect(librarySelect.props().defaultValue).to.equal("production");

    let registryStage = editForm.find("fieldset").at(1);
    let registryLegend = registryStage.find("legend");
    let registrySelect = registryStage.find("select");
    expect(registryLegend.text()).to.equal("Registry Stage");
    expect(registrySelect.props().name).to.equal("Registry Stage");
    expect(registrySelect.props().defaultValue).to.equal("testing");

    [libraryStage, registryStage].map((stage) => {
      let options = stage.find("option");
      expect(options.length).to.equal(3);
      expect(options.at(0).props().value).to.equal("testing");
      expect(options.at(1).props().value).to.equal("production");
      expect(options.at(2).props().value).to.equal("cancelled");
    });

    let button = editForm.find("button");
    expect(button.length).to.equal(1);
  });

  it("should submit the edit form and fetch new data", async () => {
    let form = wrapper.find("form").at(0);
    let button = form.find("button");
    button.simulate("click");
    let fullLibrary = modifyLibrary(testLibrary1, { library_stage: "cancelled", registry_stage: "production" });
    wrapper.setProps({ fullLibrary });

    expect(editStages.callCount).to.equal(1);

    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();

    expect(fetchLibrary.callCount).to.equal(1);
    expect(fetchLibrary.args[0][0]).to.equal((wrapper.props() as any)["library"].uuid);

    expect(updateColor.callCount).to.equal(1);
    expect(updateColor.args[0][0][0]).to.equal("cancelled");
    expect(updateColor.args[0][0][1]).to.equal("production");
  });

  it("should display the validation form", () => {
    let validationForm = wrapper.find("form").at(1);
    expect(validationForm.find(".form-title").text()).to.equal("Validation");
  });

  it("should display the PLS ID form", () => {
    let plsIDForm = wrapper.find("form").at(2);
    expect(plsIDForm.find(".form-title").text()).to.equal("PLS ID");
  });

  it("should re-render to reflect changes", async() => {
    let editForm = wrapper.find("form").at(0);

    expect(wrapper.state()["libraryStage"]).to.equal("production");
    expect(wrapper.state()["registryStage"]).to.equal("testing");
    expect(editForm.find(".badge").at(0).props().className).to.contain("success");
    expect(editForm.find(".badge").at(1).props().className).to.contain("warning");

    let saveButton = editForm.find("button");
    saveButton.simulate("click");
    let fullLibrary = modifyLibrary(library, { library_stage: "testing", registry_stage: "cancelled" });
    wrapper.setProps({ fullLibrary });

    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();
    wrapper.update();

    editForm = wrapper.find("form").at(0);
    expect(wrapper.state()["libraryStage"]).to.equal("testing");
    expect(wrapper.state()["registryStage"]).to.equal("cancelled");
    expect(editForm.find(".badge").at(0).props().className).to.contain("warning");
    expect(editForm.find(".badge").at(1).props().className).to.contain("danger");
  });
});

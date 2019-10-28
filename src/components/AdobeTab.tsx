import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { LibraryData, LibrariesData, AdobeData } from "../interfaces";
import { Store } from "redux";
import { State } from "../reducers/index";
import { connect } from "react-redux";
import ActionCreator from "../actions";

export interface AdobeTabOwnProps {
  store: Store<State>;
}

export interface AdobeTabDispatchProps {
  fetchAdobeData: any;
}

export interface AdobeTabStateProps {
  data: AdobeData;
}

export interface AdobeTabProps extends AdobeTabOwnProps, AdobeTabDispatchProps, AdobeTabStateProps {};

export class AdobeTab extends React.Component<AdobeTabProps, {}> {
  render(): JSX.Element {
    return (
      <div className="adobe-data">
        <ul>
          { this.props.data && Object.keys(this.props.data).map((libraryName) => {
              return (
                <li key={libraryName}>
                  <span>{libraryName}</span>
                  <span>{this.props.data[libraryName]} ({this.getPercentage(this.props.data[libraryName])}%)</span>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }

  getPercentage(x: number): number {
    let total = Object.values(this.props.data).reduce((x, y) => x + y);
    let percentage = Math.round((x / total) * 100);
    return percentage;
  }

  componentWillMount() {
    this.props.fetchAdobeData();
  }
}

function mapStateToProps(state: State, ownProps: AdobeTabOwnProps) {
  return {
    data: state.adobeData.data
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: AdobeTabOwnProps) {
  let actions = new ActionCreator(null);
  return {
    fetchAdobeData: () => dispatch(actions.fetchAdobeData())
  };
}

const ConnectedAdobeTab = connect<AdobeTabStateProps, AdobeTabDispatchProps, AdobeTabOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AdobeTab);

export default ConnectedAdobeTab;

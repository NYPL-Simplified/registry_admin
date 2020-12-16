import * as React from "react";
import { LibraryData } from "../interfaces";
import { getPercentage, getMonth, findYear } from "../utils/sharedFunctions";

export interface StatsInnerListProps {
  data: any;
  styled: boolean;
  stagesToShow?: {[ key: string ]: boolean};
  showGeographicInfo?: boolean;
  showMonths?: boolean;
  hasYear?: boolean;
}

export default class StatsInnerList extends React.Component<StatsInnerListProps, {}> {
  makeCategoryBar(category: string, allLengths: number[]): JSX.Element[] {
    let catName = category.replace(category[0], category[0].toUpperCase());
    let length = this.props.data[category].length;
    return [
      <span key={catName}>{catName}: {length}</span>,
      <span key={`${catName}-${length}`}> ({getPercentage(length, allLengths, true)})</span>
    ];
  }

  makeLibraryNameList(category: string): JSX.Element[] {
    let libraries = this.props.data[category];
    return libraries.map((l) => {
      return (
        <li className="inner-stats-item" key={l.uuid}>
          <p>
            {l.basic_info.name}
            {this.props.hasYear ? this.getMonth(l) : this.guessYear(l)}
            {this.getGeographicInfo(l)}
          </p>
        </li>
      );
    });
  }

  makeLi(category: string, allLengths: number[]): JSX.Element {
    let hasStyles = this.props.styled;
    return (
      <li key={category} className={hasStyles ? "stats-category" : ""}>
        <section className={hasStyles ? "stats-category-name" : ""}>
          { this.makeCategoryBar(category, allLengths) }
        </section>
        { (!this.props.stagesToShow || this.props.stagesToShow[category]) &&
          <ul className={`${hasStyles ? "stats-category-list " : ""}`}>
            {this.makeLibraryNameList(category)}
          </ul>
        }
      </li>
    );
  }

  render() {
    let allLengths = Object.values(this.props.data).map(x => (x as any).length);
    let list = this.props.data && Object.keys(this.props.data).map(category => {
      return this.makeLi(category, allLengths);
    });
    return <ul className="stats-inner-list">{list}</ul>;
  }

  guessYear(library: LibraryData): string {
    const [year, formattedYear] = findYear(library.basic_info.timestamp, "No later than ", " No information available");
    return formattedYear;
  }

  getMonth(library: LibraryData): string {
    if (!this.props.showMonths) {
      return "";
    }
    let validated = library.urls_and_contact.contact_validated;
    let date = validated === "Not validated" ? "Month unknown" : getMonth(validated);
    return ` (${date})`;
  }

  getGeographicInfo(library: LibraryData): string {
    if (!this.props.showGeographicInfo) {
      return "";
    }
    let areaString: string = "";
    let allAreas: string[] = library.areas.focus.concat(library.areas.service);
    allAreas.forEach((a: string) => {
      // Each string is in the format "Zip code/city, (state abbreviation)".  We're just interested in the state abbreviation
      // right now, so we get it by pulling out any two-letter sequence between parentheses.
      // (If there's something longer than two letters between parentheses, it's the server-generated string "unknown",
      // which we don't need to add individually to areaString; if everything was unknown, we'll handle it later.)
      let regExp: RegExp = /\(([^)]{2})\)/;
      let match: string[] = regExp.exec(a);
      if (!match) {
        return "";
      }
      // If the library serves multiple towns/zip codes within the same state, and/or if the same state is listed in both the focus and the service areas,
       // we don't need to list the state more than once.
      // If there's already something in the areaString--i.e. if this item is not going to be the first
      // thing in it--then this should be separated by a comma and a space from whatever comes before it.
      if (!areaString.includes(match[1])) {
        areaString += `${areaString.length ? ", " : ""}${match[1]}`;
      }
    });
    // If we couldn't get any information from the areas, we see whether we know the library's PLS ID;
    // the first two characters of the PLS ID are the state abbreviation.
    if (!areaString.length && library.basic_info.pls_id) {
      areaString += library.basic_info.pls_id && library.basic_info.pls_id.slice(0, 2);
    }
    return (areaString.length && ` (${areaString})`) || " (state unknown)";
  }
}

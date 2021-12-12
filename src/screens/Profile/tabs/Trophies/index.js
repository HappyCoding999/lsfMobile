import React, { Component } from "react";
import { InteractionManager } from "react-native";
import { map, flow, filter, sortBy } from "lodash/fp";
import { getAchievements } from "../../../../DataStore";
import { LoadingComponent } from "../../../../components/common";
import Trophies from "./Trophies";

export default class extends Component {
  constructor(props) {
    super(props);
    const { achievementTable } =
      props.screenProps || props.navigation.state.params || {};

    this.state = {
      achievementTable,
    };

    InteractionManager.runAfterInteractions(() => {
      if (!achievementTable) {
        this.fetchAchievementTable();
      }
    });
  }

  fetchAchievementTable = async () => {
    const achievementTable = await getAchievements();

    this.setState({ achievementTable });
  };

  getUserTrophyData = (userAchievements, achievementTable) =>
    flow(
      filter((achievement) => achievement.trophyImageUrl),
      map((achievement) => {
        return {
          name: achievement.trophyName,
          description: achievement.trophyCopy,
          imgUrl: achievement.trophyImageUrl,
          imgUrlGrey: achievement.trophyImageUrlGry,
          active:
            userAchievements[achievement.achievementsField] != undefined
              ? userAchievements[achievement.achievementsField]
              : false,
        };
      }),
      sortBy((achievement) => !achievement.active)
    )(achievementTable);

  render() {
    const { achievements } =
      this.props.screenProps || this.props.navigation.state.params || {};
    const { achievementTable } = this.state;

    if (achievementTable && achievements) {
      const data = this.getUserTrophyData(achievements, achievementTable);

      return <Trophies data={data} />;
    }

    return <LoadingComponent />;
  }
}

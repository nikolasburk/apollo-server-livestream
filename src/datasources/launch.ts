import { RESTDataSource } from 'apollo-datasource-rest';
import { Launch } from '../types'

interface LaunchRaw {
  flight_number?: number
  launch_date_unix: number
  launch_site: { site_name: string }
  mission_name: string
  links: { mission_patch_small: string, mission_patch: string }
  rocket: { rocket_id: number, rocket_name: string, rocket_type: string}
}

export class LaunchAPI extends RESTDataSource {

  baseURL: string;

  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  async getAllLaunches(): Promise<Launch[]> {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  async getLaunchById({ launchId}: { launchId: number }): Promise<Launch> {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(response[0]);
  }
  
  getLaunchesByIds({ launchIds }: { launchIds: number[] }): Promise<Launch[]> {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId })),
    );
  }  

  launchReducer(launch: LaunchRaw): Launch {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }
  
}

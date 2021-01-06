import { DataSource } from "apollo-datasource";
import isEmail from "isemail";

export class UserAPI extends DataSource {
  prisma;
  context: any;

  constructor({ prisma }: any) {
    super();
    this.prisma = prisma;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: any) {
    this.context = config.context;
  }

  async findOrCreateUser(emailInput: { email?: string } = {}) {
    const email =
      this.context && this.context.user
        ? this.context.user.email
        : emailInput.email;
    if (!email || !isEmail.validate(email)) return null;

    return null;
  }

  async bookTrips({ launchIds }: { launchIds: number[] }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    // for (const launchId of launchIds) {
    //   const res = await this.bookTrip({ launchId });
    //   if (res) results.push(res);
    // }

    return results;
  }

  async bookTrip({ launchId }: { launchId: number }): Promise<any> {
    const userId = this.context.user.id;
  }

  async cancelTrip({ launchId }: { launchId: number }): Promise<boolean> {
    const userId = this.context.user.id;
    return false;
  }

  async getLaunchIdsByUser(): Promise<number[]> {
    const userId = this.context.user.id;
    return [];
  }

  async isBookedOnLaunch({ launchId }: { launchId: number }): Promise<Boolean> {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;

    return false;
  }
}

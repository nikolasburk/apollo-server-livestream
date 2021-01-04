import { DataSource } from "apollo-datasource";
import isEmail from "isemail";
import { PrismaClient, Trip, Pet, prismaVersion } from "@prisma/client";

export class UserAPI extends DataSource {
  prisma: PrismaClient;
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

    const user = await this.prisma.user.upsert({
      where: { email },
      create: { email },
      update: { email },
    });

    return user;
  }

  async bookTrips({ launchIds }: { launchIds: number[] }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results: Trip[] = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }: { launchId: number }): Promise<Trip | null> {
    const userId = this.context.user.id;
    const userBookedTrip = await this.prisma.trip.findUnique({
      where: {
        launchId_userId: {
          launchId: Number(launchId),
          userId
        }
      }
    })

    if (userBookedTrip) {
      return null
    }

    const trip = await this.prisma.trip.create({
      data: {
        launchId: Number(launchId),
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
    return trip;
  }

  async cancelTrip({ launchId }: { launchId: number }) {
    const userId = this.context.user.id;
    await this.prisma.trip.delete({
      where: {
        launchId_userId: {
          launchId: Number(launchId),
          userId,
        },
      },
    });
  }

  async getLaunchIdsByUser(): Promise<number[]> {
    const userId = this.context.user.id;
    const trips = await this.prisma.trip.findMany({
      where: {
        userId,
      },
    });
    return trips.map((t) => t.launchId || -1).filter((id) => id !== -1);
  }

  async isBookedOnLaunch({ launchId }: { launchId: number }): Promise<Boolean> {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const trip = await this.prisma.trip.findUnique({
      where: {
        launchId_userId: {
          launchId: Number(launchId),
          userId,
        }
      }
    })
    return Boolean(trip);
  }

  async addPetForUser(name: string): Promise<Pet> {
    const userId = this.context.user.id;
    return this.prisma.pet.create({
      data: {
        name,
        owner: {
          connect: { id: userId }
        }
      }
    })
  }

  async gePetForUser(): Promise<Pet | null> {
    const userId = this.context.user.id;
    return this.prisma.user.findUnique({
      where: { id: userId }
    }).pet()
  }
}

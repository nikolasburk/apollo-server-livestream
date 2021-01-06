# Apollo Server Tutorial

This repo contains the code from the `server` directory that was built in the first sections of the [Apollo Tutorial](https://www.apollographql.com/docs/tutorial/introduction/).

## Usage

```
git clone git@github.com:nikolasburk/apollo-server-livestream.git
cd apollo-server-livestream
yarn
yarn start
```

Send test query:

```graphql
{
  launches(pageSize: 5) {
    launches {
      id
      site
      isBooked
      mission {
        name
        missionPatch
      }
      rocket {
        id
        name
        type
      }
    }
    hasMore
  }
}
```

You can find the implementation of the remaining operations in the [`prisma`](https://github.com/nikolasburk/apollo-server-livestream/tree/prisma) and [`prisma-extended`](https://github.com/nikolasburk/apollo-server-livestream/tree/prisma-extended) branches.
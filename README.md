This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create a database in Dexie Cloud

```
npx dexie-cloud create [--hackathon]
```

Notice the DB URL on the console.

Then, whitelist the origin used to access the app
```
npx dexie-cloud whitelist http://localhost:3000
```

Then, create an .env file with the variable 

```
NEXT_PUBLIC_DEXIE_CLOUD_DB_URL=<DB URL> # (something like https://zabc123.dexie.cloud)
```

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


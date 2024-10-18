# Local Setup

To contribute to LogsTrap, you will first need to fork and clone the repository.

1. Create a `.env`
You can refer to `.env.example` to create your own `.env` file.

2. Install dependencies

```bash
pnpm install
```

3. Configure your database
LogsTrap uses postgresql as database. To setup the database, you need to run migrations. 

Move to `common/db` and run `pnpm drizzle-kit migrate` to run the migrations.

4. Start the development server

```bash
pnpm dev
```

Navigate to [http://localhost:3000](http://localhost:3000) and create an account to start using LogsTrap.
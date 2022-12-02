# Santex challenge

<ins> **To run this project you are going to need Docker installed.**</ins>

To run a dev environment you can:

- Run a postgres instance
  ```
  docker run \
  -e POSTGRES_USER=santex \
  -e POSTGRES_PASSWORD=santex \
  -e POSTGRES_DB=santex \
  -d -p 5432:5432 \
  postgres
  ```

- Install package dependencies and run dev server
  ```
  npm i && npm run dev
  ```
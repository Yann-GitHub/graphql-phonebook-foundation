# GraphQL Phonebook Foundation

This project is a simple phonebook application built using GraphQL with Apollo Server. It allows you to query and mutate a list of persons with their contact details.

## Features

- Query the total number of persons
- Retrieve all persons with or without phone numbers
- Find a person by name
- Add a new person
- Edit the phone number of an existing person

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Yann-GitHub/graphql-phonebook-foundation.git
   ```
2. Navigate to the project directory:
   ```sh
   cd graphql-phonebook-foundation
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Server

Start the Apollo Server:

```sh
npm start
```

The server will be running at `http://localhost:4000`.

### Usage

You can use GraphQL Playground or any other GraphQL client to interact with the server. The available queries and mutations are defined in the `typeDefs` in `index.js`.

### Example Queries

- Get the total number of persons:

  ```graphql
  query {
    personCount
  }
  ```

- Get all persons:

  ```graphql
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
  ```

- Find a person by name:
  ```graphql
  query {
    findPerson(name: "Arto Hellas") {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
  ```

### Example Mutations

- Add a new person:

  ```graphql
  mutation {
    addPerson(
      name: "John Doe"
      phone: "123-456789"
      street: "Main St"
      city: "New York"
    ) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
  ```

- Edit a person's phone number:
  ```graphql
  mutation {
    editNumber(name: "John Doe", phone: "987-654321") {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
  ```

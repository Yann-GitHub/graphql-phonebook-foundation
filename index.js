const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { v1: uuid } = require("uuid");

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefs = `

  type Address {
    street: String!
    city: String!
  }

  enum YesNo {
    YES
    NO
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`;

// The resolvers object defines how the server responds to requests for the fields defined in the schema
const resolvers = {
  Query: {
    personCount: () => persons.length,
    // The allPersons resolver takes an optional argument phone, which is of the enum type YesNo
    // The resolver returns all persons if the phone argument is not given
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons;
      }
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      return persons.filter(byPhone);
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
  // The resolver for the Person type is not needed, as the fields of the Person type are simple fields
  // Person: {
  //   name: (root) => root.name,
  //   phone: (root) => root.phone,
  //   street: (root) => root.street,
  //   city: (root) => root.city,
  //   id: (root) => root.id
  // },

  // Possible to hardcode the street field for the Person type or other types
  // Person: {
  //   street: (root) => "Broadway 1",
  // },

  // Possible to modify the resolver for adding a new field to the Person type
  // The field address is formed by using a self-defined resolver.
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  // Implementing the mutation addPerson resolver to add a new person to the persons array and return the added person
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        // GraphQLError constructor takes an error message as the first argument and an extensions object as the second argument
        throw new GraphQLError("Name must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const person = { ...args, id: uuid() };
      persons = persons.concat(person);
      return person;
    },
    // Implementing the mutation editNumber resolver to edit the phone number of a person
    editNumber: (root, args) => {
      const person = persons.find((p) => p.name === args.name);
      if (!person) {
        return null;
      }

      const updatedPerson = { ...person, phone: args.phone };
      persons = persons.map((p) => (p.name === args.name ? updatedPerson : p));
      return updatedPerson;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

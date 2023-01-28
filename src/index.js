const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');

const typeDefs = gql`
  type Quote {
    quote: String
    author: String
  }
  type Query {
    breakingquotes: [Quote]
    show: [Quote]
  }
  type Mutation {
    addQuote(quote: String, author: String): Quote
    deleteQuote(author: String): Quote
    updateQuote(author: String, quote: String): Quote
  }
`;

let breakingquotes = [];

const resolvers = {
  Query: {
    breakingquotes: async () => {
      const response = await fetch(
        'https://api.breakingbadquotes.xyz/v1/quotes/10'
      );
      const data = await response.json();
      breakingquotes = data;
      return data;
    },
    show: () => breakingquotes,
  },
  Mutation: {
    addQuote: (parent, args) => {
      const newQuote = {
        quote: args.quote,
        author: args.author,
      };
      breakingquotes.push(newQuote);
      return newQuote;
    },
    deleteQuote: (parent, args) => {
      const quoteIndex = breakingquotes.findIndex(
        (quote) => quote.author == args.author
      );
      const deletedQuote = breakingquotes[quoteIndex];
      breakingquotes.splice(quoteIndex, 1);
      return deletedQuote;
    },
    updateQuote: (parent, args) => {
      const quoteIndex = breakingquotes.findIndex(
        (quote) => quote.author == args.author
      );
      const oldQuote = breakingquotes[quoteIndex];
      const updatedQuote = {
        ...oldQuote,
        quote: args.quote,
      };
      breakingquotes[quoteIndex] = updatedQuote;
      return updatedQuote;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen({ port: 3000, host: 'localhost' }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

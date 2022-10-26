import {GraphQLError} from 'graphql';
import IssueRequestModel from '../../mongodb/models/IssueRequest';


// INIT RESOLVER
const issueRequestResolver = {
    // QUERIES
    Query: {
        // GET LIBRARY ISSUE REQUESTS
        getLibraryIssueRequests: async (_:null, args: {
            libraryId: string;
        }) => {
            try {
                const {
                    libraryId
                } = args;

                const result = await IssueRequestModel.find({libraryId: libraryId});

                console.log('Result: ', result)

                return result;
            } catch (error) {
                throw new GraphQLError(
                    error as string,
                );
            }
        }
    },
    // MUTATIONS
    Mutation: {
        // CREATE LIBRARY ISSUE REQUEST
        createLibraryIssueRequest: async (_:null, args: {
            libraryId: string;
            userId: string;
            bookId: string;
        }) => {
            try {

                const {
                    libraryId,
                    userId,
                    bookId,
                } = args;

                // CREATE NEW ISSUE REQUEST 
                const newIssueRequest = new IssueRequestModel({
                    libraryId: libraryId,
                    bookId: bookId,
                    requestingUserId: userId,
                    createdAt: new Date().toISOString(),
                });

                // AWAIT SAVE
                const result = await newIssueRequest.save();

                console.log("Reuslt: ", result);

                return {
                    id: result._id,
                    ...result._doc,
                };
            } catch(error) {
                throw new GraphQLError(error as string);
            }
        }
    },
};

// EXPORT
export default issueRequestResolver;
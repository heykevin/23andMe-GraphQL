import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} from "graphql";
import Auth from "./auth.js";

const auth = new Auth(true);

const ProfileNameType = new GraphQLObjectType({
    name: "ProfileName",
    description: "...",

    fields: () => ({
        firstName: {
            type: GraphQLString,
            resolve: (profile) => profile.first_name            
        },
        lastName: {
            type: GraphQLString,
            resolve: (profile) => profile.last_name            
        },
        id: {
            type: GraphQLString
        }
    })
});

const NameType = new GraphQLObjectType({
    name: "Names",
    description: "For the user and user's profile, gets first and last names.",

    fields: () => ({
        firstName: {
            type: GraphQLString,
            resolve: (names) => names.first_name
        },
        lastName: {
            type: GraphQLString,
            resolve: (names) => names.last_name
        },
        id: {
            type: GraphQLString
        },
        profileNames: {
            type: new GraphQLList(ProfileNameType),
            resolve: (names) => names.profiles
        }
    })
});

const ProfileType = new GraphQLObjectType({
    name: "Profile",
    description: "Profile inside user",

    fields: () => ({
        genotyped: {
            type: GraphQLBoolean
        },
        id: {
            type: GraphQLString
        }
    })
});

const UserType = new GraphQLObjectType({
    name: "User",
    description: "Gets the user id, and a list of profiles (an account can have multiple genotyped people) with ids, whether or not they're genotyped.",

    fields: (cows) => ({
        id: {
            type: GraphQLString
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: (user) => {
                return user.profiles
            }
        }
    })
});

const MaternalSnps = new GraphQLObjectType({
    name: "MaternalSnps",
    description: " Maternal terminal SNPs include the rsid and rCRS reference position",

    fields: () => ({
        rsid: {
            type: GraphQLString
        },
        rcrs_position: {
            type: GraphQLString
        }
    })
}); 

const PaternalSnps = new GraphQLObjectType({
    name: "PaternalSnps",
    description: "Paternal SNPs include the rsid and ISOGG SNP",

    fields: () => ({
        rsid: {
            type: GraphQLString
        },
        snp: {
            type: GraphQLString
        }
    })
}); 


const HaplogroupType = new GraphQLObjectType({
    name: "Haplogroup",
    description: "Paternal SNPs include the rsid and ISOGG SNP",

    fields: () => ({
        maternal: {
            type: GraphQLString
        },
        paternal: {
            type: GraphQLString
        },
        maternalTerminalSnps: {
            type: new GraphQLList(MaternalSnps),
            resolve: (haplogroup) => haplogroup.maternal_terminal_snps
        },
        paternalTerminalSnps: {
            type: new GraphQLList(PaternalSnps),
            resolve: (haplogroup) => haplogroup.paternal_terminal_snps
        },
        id: {
            type: GraphQLString
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: "Query",
    description: "...",

    fields: () => ({
        names: {
            type: NameType,
            resolve: () => auth.get("/names")
        },
        user: {
            type: UserType,
            resolve: () => auth.get("/user")
        },
        haplotype: {
            type: HaplogroupType,
            args: {
                profile: {type: GraphQLString}
            },
            resolve: (root, args) => auth.get(`/haplogroups/${args.profile}/`)
        }
    })
});

export default new GraphQLSchema({
    query: QueryType,
})
import { fetchUserByCredentials } from "@/util/UserAction";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const AuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                console.log("credentials++++++++++++++++++", credentials);
                const user = await fetchUserByCredentials(credentials) as any;

                // If no error and we have user data, return it
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    secret: process.env.SECRET,
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, account, profile, user }: any) {
            console.log("++++++++++++token", token);
            console.log("++++++++++++account", account);
            console.log("++++++++++++profile", profile);
            console.log("++++++++++++user", user);
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                //  token.id = profile.id
            }
            if (user) {
                token.role = user.role.name;
            }
            return token
        },
        async session({ session, token, user }: any) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken
            session.user.id = token.id;
            session.user.role = token.role;
            console.log("++++++token", token);
            return session
        }
    }
}
const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST }